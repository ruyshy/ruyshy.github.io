---
title: "Disassembly 함수 호출 및 재귀 분석: C++ → 어셈블리 흐름 정복"
description: "C++ 함수 호출 및 재귀 함수의 어셈블리 구조를 디스어셈블리로 분석합니다. ecx 인자 전달, eax 리턴값, call-ret 흐름과 스택 프레임 변화를 실습 코드와 함께 배워봅니다."
date: 2025-04-30
categories: [reversing_engineering, assembly]
tags:
  [
    assembly,
    disassembly,
    함수호출,
    재귀분석,
    ecx,
    eax,
    call,
    ret,
    스택프레임,
    리버스엔지니어링,
  ]
---

C++에서 함수 호출과 재귀 함수는 어셈블리에서 어떻게 나타날까요?  
이 포스트에서는 `call`, `ret`, `ecx`, `eax`, `rsp`를 통해 함수 호출과 재귀 구조가 어떻게 구현되는지를 디스어셈블리로 명확히 분석합니다.  
스택 프레임의 변화를 이해하면 리버싱 실력이 한층 더 올라갑니다.

## 1. C++ 코드 작성 (함수 호출의 내부 구조 분석)

```cpp
#include <iostream>

int square(int x) {
    return x * x;
}

int main() {
    int value = 3;
    int result = square(value);
    std::cout << "result = " << result << std::endl;
    return 0;
}

```

### 1-1. `square(int x)` 함수 내부

```nasm
00007FF69D0410B0 89 4C 24 08    mov dword ptr [x], ecx
00007FF69D0410B4 8B 44 24 08    mov eax, dword ptr [x]
00007FF69D0410B8 0F AF 44 24 08 imul eax, dword ptr [x]
```

**해석:**

| 명령어          | 설명                   |
| --------------- | ---------------------- |
| `mov [x], ecx`  | x 값 저장 (ecx = 인자) |
| `mov eax, [x]`  | x 값을 eax에 로드      |
| `imul eax, [x]` | eax _= x (`x _ x`)     |

Microsoft x64 Calling Convention 정수 인자는 ecx, 결과는 eax로 오고감.

리턴값은 `eax`에 있음

### 1-2. `main()` 함수 내

```nasm
sub rsp,38h                   ; 스택 공간 확보
mov [value], 3                ; value = 3
```

```nasm
mov ecx, [value]              ; 인자 전달 (ecx = value)
call square                   ; square 함수 호출
mov [result], eax             ; 리턴값 저장
```

해석:

| C++ 코드           | Assembly                           |
| ------------------ | ---------------------------------- |
| `square(value)`    | `mov ecx, [value]` → `call square` |
| `int result = ...` | `mov [result], eax`                |

→ 즉,

- 인자는 **ecx로 전달**
- 결과는 **eax에 담겨 리턴**

이게 C++ 함수 호출의 기본 원리

### 1-3. 핵심 요약표

| 구성 요소    | 사용 레지스터 / 명령       | 설명                         |
| ------------ | -------------------------- | ---------------------------- |
| 1. 인자 전달 | `ecx`                      | 첫 번째 인자                 |
| 2. 함수 호출 | `call`                     | 스택에 리턴주소 push 후 분기 |
| 3. 리턴값    | `eax`                      | 함수 결과는 eax에 담김       |
| 4. 스택 복귀 | `ret` (보이지 않지만 존재) | 이전 주소로 복귀             |

---

## 2. 코드 작성 (재귀 함수)

```cpp
#include <iostream>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(4);
    std::cout << "result = " << result << std::endl;
    return 0;
}
```

### 2-1. 기대하는 어셈블리 흐름 (재귀의 핵심은 “**자기 자신을 call**”한다는 것!)

흐름 예상:

```cpp
factorial:
    cmp     ecx, 1            ; if (n <= 1)
    jle     base_case
    sub     ecx, 1            ; n-1
    call    factorial         ; 재귀 호출!
    imul    eax, ecx          ; return n * factorial(n-1)
    ret
base_case:
    mov     eax, 1
    ret
```

관찰 해야할 포인트:

| 포인트               | 설명                       |
| -------------------- | -------------------------- |
| `call factorial`     | 재귀 호출 핵심             |
| `cmp ecx, 1` + `jle` | 종료 조건 분기             |
| `imul eax, ecx`      | n \* sub결과               |
| 레지스터             | `ecx`: 인자, `eax`: 리턴값 |

또한, 재귀 호출마다 **스택에 리턴주소와 지역변수, 인자 값이 쌓이는 것**도 체크할 수 있음.

### 2-2. 함수 분석 대상: `int factorial(int n)`

```cpp
if (n <= 1) return 1;
return n * factorial(n - 1);
```

### 2-3. 한 줄씩 Disassembly 분석 (재귀 구조 중심)

**인자 저장 및 스택 프롤로그**

```nasm
00007FF6AC1810B0 89 4C 24 08          mov         dword ptr [rsp+8],ecx
00007FF6AC1810B4 48 83 EC 28          sub         rsp,28h
```

- `ecx` = 첫 번째 인자 `n`
- 이 값을 스택에 `rsp+8` 위치에 저장 (`[n]`)
- 스택 공간 확보: 로컬 변수 및 함수 호출용

### 2-4. 종료 조건 분기

```nasm
00007FF6AC1810B8 83 7C 24 30 01       cmp         dword ptr [n],1
00007FF6AC1810BD 7F 07                jg          0x...10C6  ; n > 1 이면 재귀
```

- `cmp n, 1` → `n <= 1`이면 다음 줄로 진행
- `jg` = jump if greater → 즉 `n > 1`이면 재귀로 분기

### 2-5. base case: return 1;

```nasm
00007FF6AC1810BF B8 01 00 00 00       mov         eax,1
00007FF6AC1810C4 EB 16                jmp         0x...10DC  ; 함수 탈출
```

- `eax = 1` 설정 (리턴값)
- `jmp`로 아래 리턴 처리로 이동

### 2-6. 재귀 호출 준비 및 호출

```nasm
00007FF6AC1810C6 8B 44 24 30          mov         eax,dword ptr [n]
00007FF6AC1810CA FF C8                dec         eax        ; eax = n-1
00007FF6AC1810CC 8B C8                mov         ecx,eax     ; ecx = n-1
00007FF6AC1810CE E8 ...               call        factorial
```

- `n-1` 계산 → `ecx`에 다시 설정 (함수 인자 규칙)
- `call factorial`: 자기 자신을 재귀 호출

**중요한 점:**

`call`은 다음 명령 주소를 스택에 `push` 후, 해당 함수로 `jmp`
→ 따라서 재귀마다 스택 프레임이 계속 쌓인다!

### 2-7. 재귀 호출 이후 곱셈 및 리턴

```nasm
00007FF6AC1810D3 8B 4C 24 30          mov         ecx,dword ptr [n]
00007FF6AC1810D7 0F AF C8             imul        ecx,eax    ; ecx = n * factorial(n-1)
00007FF6AC1810DA 8B C1                mov         eax,ecx
```

- `eax`는 방금 호출된 `factorial(n-1)`의 리턴값
- 현재 `n` 값과 곱함 → 다시 `eax`로 설정 → 리턴 준비 완료

### 2-8. 스택 복원 + 리턴

```nasm
00007FF6AC1810DC 48 83 C4 28          add         rsp,28h
00007FF6AC1810E0 C3                   ret
```

- 함수 호출 전 확보한 스택 해제
- `ret`: `call` 전에 push된 주소로 복귀 (이게 바로 재귀 스택 복귀!)

### 2-9. 재귀 함수 호출 흐름 요약

| C++ 구조     | Assembly 흐름                          |
| ------------ | -------------------------------------- |
| 인자 전달    | `mov ecx, n`                           |
| 종료 조건    | `cmp`, `jg`, `mov eax, 1`              |
| 재귀 호출    | `dec`, `mov ecx`, `call`               |
| 복귀 후 계산 | `imul eax, n`                          |
| 리턴         | `eax`, `ret`                           |
| 스택 관리    | `sub/add rsp`, 호출마다 새 프레임 생성 |

### 2-10. 왜 이게 중요한가?

- 이 구조를 이해하면 **스택 기반 함수 흐름 분석**,
  **스택 프레임 추적**, **리턴값 추적**,
  **함수 추적 트리 작성**까지 가능하다.
- `ret` 이후 **스택을 어떻게 밀고 당기는지** 보면,
  리버싱으로 `호출 흐름 복원`할 수 있다.
