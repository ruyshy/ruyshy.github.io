---
title: "Disassembly 실전 분석편: if문과 for문 C++ → Assembly 흐름 이해"
description: "조건문과 반복문이 C++에서 어셈블리로 어떻게 번역되는지 Visual Studio와 x64 디스어셈블리 창에서 직접 분석하며 흐름을 파악합니다. cmp, jmp, jge, add 등 핵심 명령어를 예제로 익혀보세요."
date: 2025-04-30
tags:
  [
    assembly,
    disassembly,
    VisualStudio,
    조건문 어셈블리,
    루프 구조,
    cmp,
    jmp,
    x64 디버깅,
  ]
---

C++의 조건문과 반복문이 디스어셈블리에서 어떻게 구현되는지 궁금하신가요?  
이 포스트에서는 Visual Studio 디버거를 활용해 `if문`, `for문`을 실제 실행파일 수준에서 분석하고, `cmp`, `jmp`, `jge`, `add` 등의 핵심 명령어 패턴을 정확히 짚어드립니다.

## 1. Visual Studio 설정 (이전이랑 동일)

- 빌드 모드: **Release**
- 플랫폼: **x64**
- 최적화: **끄기 (/Od)**

그리고 C++ 코드 작성 후, 디버깅 시작해서 `compare` 함수 안에 Breakpoint 걸고, **“Disassembly 보기"**로

## 2. C++ 코드 작성 (if문)

```cpp
#include <iostream>

int compare(int a, int b) {
    if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

int main() {
    int result = compare(10, 20);
    std::cout << "Result: " << result << std::endl;
    return 0;
}
```

`compare(a, b)` 함수는

- a가 b보다 크면 `1`
- 그렇지 않으면 `0`
- 을 리턴하는 함수.

### 2-1. Breakpoint 걸고 디스어셈블리 보기

```nasm
int main() {
00007FF7C70D10D0 48 83 EC 38          sub         rsp,38h
	int result = compare(10, 20);
00007FF7C70D10D4 BA 14 00 00 00       mov         edx,14h
00007FF7C70D10D9 B9 0A 00 00 00       mov         ecx,0Ah
00007FF7C70D10DE E8 CD FF FF FF       call        compare (07FF7C70D10B0h)
00007FF7C70D10E3 89 44 24 20          mov         dword ptr [result],eax
	std::cout << "Result: " << result << std::endl;
00007FF7C70D10E7 48 8D 15 A2 21 00 00 lea         rdx,[GS_ExceptionPointers+10h (07FF7C70D3290h)]
00007FF7C70D10EE 48 8B 0D AB 1F 00 00 mov         rcx,qword ptr [__imp_std::cout (07FF7C70D30A0h)]
	std::cout << "Result: " << result << std::endl;
00007FF7C70D10F5 E8 A6 02 00 00       call        std::operator<<<std::char_traits<char> > (07FF7C70D13A0h)
00007FF7C70D10FA 8B 54 24 20          mov         edx,dword ptr [result]
00007FF7C70D10FE 48 8B C8             mov         rcx,rax
00007FF7C70D1101 FF 15 A1 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF7C70D30A8h)]
00007FF7C70D1107 48 8D 15 72 06 00 00 lea         rdx,[std::endl<char,std::char_traits<char> > (07FF7C70D1780h)]
00007FF7C70D110E 48 8B C8             mov         rcx,rax
00007FF7C70D1111 FF 15 99 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF7C70D30B0h)]
	return 0;
00007FF7C70D1117 33 C0                xor         eax,eax
}
```

### 2-1. call compare (`07FF7C70D10B0h`) 내부로 들어가기 (핵심)

```nasm
int compare(int a, int b) {
00007FF7C70D10B0 89 54 24 10          mov         dword ptr [b],edx
00007FF7C70D10B4 89 4C 24 08          mov         dword ptr [a],ecx
	if (a > b) {
00007FF7C70D10B8 8B 44 24 10          mov         eax,dword ptr [b]
00007FF7C70D10BC 39 44 24 08          cmp         dword ptr [a],eax
00007FF7C70D10C0 7E 09                jle         compare+1Bh (07FF7C70D10CBh)
		return 1;
00007FF7C70D10C2 B8 01 00 00 00       mov         eax,1
00007FF7C70D10C7 EB 04                jmp         compare+1Dh (07FF7C70D10CDh)
	}
	else {
00007FF7C70D10C9 EB 02                jmp         compare+1Dh (07FF7C70D10CDh)
		return 0;
00007FF7C70D10CB 33 C0                xor         eax,eax
	}
}
```

디스어셈블리 `00007FF7C70D10DE E8 CD FF FF FF       call        compare (07FF7C70D10B0h)` 해당 줄에서 `F10`(프로시저 단위 실행)이 아닌 `F11`(한 단계씩 코드 실행)을 눌러보면 `int compare(int a, int b)` 주소로 이동.

### 2-2. 함수 시작: 인자 복사

```nasm
00007FF7C70D10B0 89 54 24 10    mov dword ptr [b],edx
00007FF7C70D10B4 89 4C 24 08    mov dword ptr [a],ecx
```

- 함수 인자 `a`, `b`는 `ecx`, `edx` 레지스터로 들어옴 (Microsoft x64 규칙)
- 이걸 스택 위치에 저장 (변수 접근 위해)

### 2-3. 조건문 분기: `if (a > b)`

```nasm
00007FF7C70D10B8 8B 44 24 10    mov eax,dword ptr [b]     ; eax = b
00007FF7C70D10BC 39 44 24 08    cmp dword ptr [a],eax     ; a - b 비교
00007FF7C70D10C0 7E 09          jle 0x...10CB              ; if a <= b → 점프
```

- `cmp a, b` → a - b 비교
- `jle` (jump if less or equal):
  → 즉 **a가 b보다 작거나 같으면 else로 점프**

핵심 조건문:

```nasm
cmp a, b
jle else
```

### 2-4. if문 실행: `return 1;`

```nasm
00007FF7C70D10C2 B8 01 00 00 00    mov eax,1
00007FF7C70D10C7 EB 04             jmp 0x...10CD            ; return 후 탈출
```

- 조건 참(a > b)이면 `eax = 1`
- 그리고 `jmp`로 else 쪽 넘겨버려 (return 0; 실행 안 되게)

### 2-5. else문: `return 0;`

```nasm
00007FF7C70D10CB 33 C0             xor eax, eax
```

- `eax = 0`을 만드는 최적화된 명령어
- `xor eax, eax` → 아주 흔한 패턴

### 2-6. 함수 종료

함수 끝에 `ret`는 생략되어 있지만, 실제 실행 시 return.

### 2-7. C++ 코드 vs Assembly 요약표

| C++                          | Assembly                       |
| ---------------------------- | ------------------------------ |
| `int a = ecx`, `int b = edx` | `mov [a], ecx`, `mov [b], edx` |
| `if (a > b)`                 | `cmp a, b` + `jle else`        |
| `return 1;`                  | `mov eax, 1`                   |
| `return 0;`                  | `xor eax, eax`                 |
| `return`                     | `jmp` 또는 그냥 다음 줄 실행   |

### 2-7. 핵심 포인트 정리

- **조건문은 항상 `cmp + jump` 조합**
- **`a > b` → `cmp a, b` + `jle` (less or equal 이면 else로 jump)**
- **`return 1`은 `mov eax, 1`**
- **`return 0`은 `xor eax, eax` (빠른 0 세팅 방식)**

## 3. C++ 코드 작성 (for문)

```cpp
#include <iostream>

int main() {
    int sum = 0;

    for (int i = 0; i < 5; ++i) {
        sum += i;
    }

    std::cout << "sum = " << sum << std::endl;
    return 0;
}
```

### 3-1. 분석 퀴즈 (Disassembly 보기 전에 예상해보자!)

{% quiz "`1.` 다음 중 C++의 `for (int i = 0; i < 10; ++i)` 루프가 어셈블리 코드로 번역될 때 **반드시 포함되는 흐름**이 아닌 것은?" %}

- 조건 검사 후 점프 명령 (`jl`, `jg` 등)
- 증가 연산자 (`inc`, `add`)
- 함수 호출 명령 (`call`) [correct]
- 무조건 점프 명령 (`jmp`)

{% explanation %}
**해설**: 함수 호출이 없는 경우 `call` 명령은 포함되지 않는다. 루프에서는 비교(`cmp`), 조건 분기(`jl`), 루프 변수 증가(`add`, `inc`), 루프 반복을 위한 `jmp`는 일반적으로 포함된다.
{% endexplanation %}
{% endquiz %}

{% quiz "`2.` C++의 `sum += i;` 같은 연산이 어셈블리어에서 **보통 어떤 명령어**로 나타나는가?" %}

- `mov`
- `cmp`
- `add` [correct]
- `jmp`

{% explanation %}
**해설**: `sum += i`는 덧셈 연산이므로 `add` 명령어로 나타난다.

- `mov`는 값을 복사할 때,
- `cmp`는 비교할 때,
- `jmp`는 분기할 때 사용된다.

{% endexplanation %}
{% endquiz %}

{% quiz "`3.` C++의 조건문 `i < 5`는 어셈블리어에서 보통 어떤 두 개의 명령어 조합으로 표현되는가?" %}

- `cmp` + `call`
- `mov` + `jmp`
- `cmp` + `jl` [correct]
- `test` + `jne`

{% explanation %}
**해설**: `i < 5`는 `cmp i, 5`로 비교하고, 조건이 참일 경우 `jl target`으로 분기한다.

`jl`은 "Jump if Less" (signed 비교 기준).
{% endexplanation %}
{% endquiz %}

---

### 3-2. Breakpoint 걸고 디스어셈블리 보기

```nasm
int main() {
00007FF6679D10B0 48 83 EC 38          sub         rsp,38h
	int sum = 0;
00007FF6679D10B4 C7 44 24 24 00 00 00 00 mov         dword ptr [sum],0

	for (int i = 0; i < 5; ++i) {
00007FF6679D10BC C7 44 24 20 00 00 00 00 mov         dword ptr [rsp+20h],0
00007FF6679D10C4 EB 0A                jmp         main+20h (07FF6679D10D0h)
00007FF6679D10C6 8B 44 24 20          mov         eax,dword ptr [rsp+20h]
00007FF6679D10CA FF C0                inc         eax
00007FF6679D10CC 89 44 24 20          mov         dword ptr [rsp+20h],eax
00007FF6679D10D0 83 7C 24 20 05       cmp         dword ptr [rsp+20h],5
00007FF6679D10D5 7D 12                jge         main+39h (07FF6679D10E9h)
		sum += i;
00007FF6679D10D7 8B 44 24 20          mov         eax,dword ptr [rsp+20h]
00007FF6679D10DB 8B 4C 24 24          mov         ecx,dword ptr [sum]
00007FF6679D10DF 03 C8                add         ecx,eax
00007FF6679D10E1 8B C1                mov         eax,ecx
00007FF6679D10E3 89 44 24 24          mov         dword ptr [sum],eax
	}
00007FF6679D10E7 EB DD                jmp         main+16h (07FF6679D10C6h)

	std::cout << "sum = " << sum << std::endl;
00007FF6679D10E9 48 8D 15 A0 21 00 00 lea         rdx,[GS_ExceptionPointers+10h (07FF6679D3290h)]
00007FF6679D10F0 48 8B 0D A9 1F 00 00 mov         rcx,qword ptr [__imp_std::cout (07FF6679D30A0h)]
00007FF6679D10F7 E8 A4 02 00 00       call        std::operator<<<std::char_traits<char> > (07FF6679D13A0h)
00007FF6679D10FC 8B 54 24 24          mov         edx,dword ptr [sum]
00007FF6679D1100 48 8B C8             mov         rcx,rax
00007FF6679D1103 FF 15 9F 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF6679D30A8h)]
00007FF6679D1109 48 8D 15 70 06 00 00 lea         rdx,[std::endl<char,std::char_traits<char> > (07FF6679D1780h)]
00007FF6679D1110 48 8B C8             mov         rcx,rax
00007FF6679D1113 FF 15 97 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF6679D30B0h)]
	return 0;
00007FF6679D1119 33 C0                xor         eax,eax
}
```

### 3-3. 함수 시작 / 변수 초기화

```nasm
sub         rsp,38h
mov         dword ptr [sum],0           ; sum = 0
mov         dword ptr [rsp+20h],0       ; i = 0
```

### 3-4. 루프 조건 검사 진입 (`jmp`→ `cmp`→`jge`)

```nasm
jmp         main+20h (07FF6679D10D0h)   ; 조건 검사 위치로 이동

; 증감 부분
main+16h:
mov         eax,dword ptr [rsp+20h]     ; eax = i
inc         eax                         ; ++i
mov         dword ptr [rsp+20h],eax     ; i = eax

; 조건 검사
main+20h:
cmp         dword ptr [rsp+20h],5       ; i < 5 ?
jge         main+39h                    ; i >= 5 이면 루프 탈출
```

이 부분이 핵심:

- `i++`는 `inc eax`로
- 조건검사 `i < 5`는 `cmp` + `jge` (5보다 크거나 같으면 탈출)

### 3-5. 루프 본문: `sum += i`

```nasm
mov         eax,dword ptr [rsp+20h]     ; eax = i
mov         ecx,dword ptr [sum]         ; ecx = sum
add         ecx,eax                     ; ecx += i
mov         eax,ecx
mov         dword ptr [sum],eax         ; sum = ecx
```

`sum += i` = `sum = sum + i`
→ 그래서 `mov`, `add`, `store` 조합으로 정확히 구현

### 3-6. 루프 다시 반복

```nasm
jmp         main+16h                    ; 루프 증감 위치로 점프 (i++)
```

### 3-7. 루프 탈출 후 출력

```nasm
std::cout << "sum = " << sum << std::endl;
...
xor         eax,eax    ; return 0
```

### 3-8. 요약표

| C++ 코드       | Assembly                  |
| -------------- | ------------------------- |
| `int sum = 0;` | `mov [sum], 0`            |
| `int i = 0;`   | `mov [rsp+20h], 0`        |
| `i++`          | `inc eax`, `mov [i], eax` |
| `i < 5`        | `cmp i, 5` + `jge`        |
| `sum += i`     | `mov`, `add`, `store`     |
| 루프 반복      | `jmp loop_begin`          |
| `return 0`     | `xor eax, eax`            |

### 3-9. 핵심 학습 포인트

- `for`문은 실제로는:
  - **초기화 → 조건 → 본문 → 증감 → 조건 ...** 을 수동 점프(`jmp`)로 연결
- **루프 탈출 조건은 `cmp` + 조건 점프 (`jge`, `jl`, `je` 등)**
- `sum += i` 는 항상 `add` 명령어로 나타남
