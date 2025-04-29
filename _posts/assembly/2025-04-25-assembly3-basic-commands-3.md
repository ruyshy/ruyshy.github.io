---
title: "Assembly 함수 호출 구조와 스택프레임 이해하기 - Windows NASM 실습"
description: "Assembly NASM에서 함수 호출, 스택프레임 구성, RBP/RSP의 역할을 실습 코드와 함께 자세히 설명합니다."
date: 2025-04-25
tags:
  [assembly, nasm, x64dbg, 함수 호출, 스택프레임, 스택 구조, 리버스엔지니어링]
---

`Assembly` 실습 시 자주 등장하는 함수 호출 구조, 스택프레임 구성 방식, `RBP`와 `RSP`의 역할, 그리고 지역 변수 접근 방법까지 `NASM` 기반 `Windows` 환경에서 상세하게 실습합니다.
전 편에서 **Assembly 기본 명령어 - Windows NASM 실습 가이드** 에서 조건 분기문과 loop 에 대해 학습을 진행했습니다.
이번 편에서는 함수/스택 호출 구조, 스택 프레임에 대해 학습을 진행할 것입니다.

## 목표 요약

> `Assembly`에서 함수 호출이란?
> 우리가 C처럼 func(); 이라고 부르면,
> 실제로는 스택에 복귀 주소를 저장한 뒤 함수로 점프하고,
>
> 끝나면 **복귀 주소로 돌아오는 것(ret)**.

## 함수 호출의 흐름 핵심

**call = "복귀주소 push + jump”**

**ret = "복귀주소 pop + jump”**

| 명령어      | 의미                                                 |
| ----------- | ---------------------------------------------------- |
| `call func` | 현재 명령 다음 주소를 스택에 push 후, `func:`로 jump |
| `ret`       | 스택에서 복귀 주소를 꺼내 jump                       |

## 스택프레임 기본

함수를 호출하면, 그 함수만의 “작업 공간”이 필요, 그래서 **스택을 이용해 아래와 같은 프레임을 구성함**.

```nasm
[ 높은 주소 ]
| 인자들 (rcx, rdx ... 넘는 부분) |
| 복귀 주소 (return address)     | ← call이 자동으로 push
| 이전 RBP                        | ← push rbp
| 지역 변수들                    | ← sub rsp, xx
[ 낮은 주소 ]
```

### 함수 진입 시 하는 일

```nasm
push rbp         ; 이전 스택프레임 저장
mov rbp, rsp     ; 현재 rsp를 기준점으로 저장
sub rsp, 16      ; 지역 변수 공간 확보
```

### 함수 종료 시 하는 일

```nasm
mov rsp, rbp     ; 스택 원복
pop rbp          ; 이전 프레임 복구
ret              ; 복귀 주소로 jump
```

### 예제: 함수 1개 호출하고 돌아오기

```nasm
global main

section .text
main:
    call my_func        ; 함수 호출
    xor rax, rax
    ret                 ; 종료
my_func:
    ; [1] 스택프레임 구성
    push rbp
    mov rbp, rsp
    sub rsp, 16         ; 지역 변수 공간 확보

    ; [2] 함수 본문
    mov rax, 1234       ; rax에 값 저장

    ; [3] 스택프레임 해제 후 복귀
    mov rsp, rbp
    pop rbp
    ret
```

### 해설 정리

| 코드                           | 역할                                    |
| ------------------------------ | --------------------------------------- |
| `call my_func`                 | 복귀주소 push + 함수로 jump             |
| `push rbp / mov rbp, rsp`      | 이전 스택프레임 저장 + 현재 시작점 설정 |
| `sub rsp, 16`                  | 지역 변수 공간 16바이트 확보            |
| `mov rax, 1234`                | 함수 내용 수행                          |
| `mov rsp, rbp / pop rbp / ret` | 복귀                                    |

이 구조가 **모든 C 함수의 Assembly 번역 형태의 뼈대.**

## `rax` vs `[rax]` (값 vs 주소)

| 표현    | 의미                                             | 예시                                                                 |
| ------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `rax`   | rax라는 **레지스터에 들어있는 값**               | `mov rbx, rax` → rbx에 rax 값 복사                                   |
| `[rax]` | rax에 들어있는 **주소의 메모리에서 값을 읽는다** | `mov rbx, [rax]` → rax가 가리키는 주소에 있는 값을 읽어서 rbx에 저장 |

### 비유

c언어:

```c
int val = 123;
int* ptr = &val;
```

| C 표현 | Assembly 대응 개념             |
| ------ | ------------------------------ |
| `ptr`  | `rax`                          |
| `*ptr` | `[rax]`                        |
| `val`  | `[주소]` (상수 주소 직접 접근) |

### 예제 1: rax는 "값 그 자체"

```nasm
mov rax, 1234
mov rbx, rax      ; rbx = 1234
```

- 여기서 `rax`는 그냥 정수 `1234` 그 자체
- `rbx`는 이제 1234가 들어간다

### 예제 2: `[rax]`는 "rax가 가리키는 주소의 메모리 값"

```nasm
mov rax, some_data  ; rax = 주소값
mov rbx, [rax]      ; rbx = [주소] → 메모리에서 읽은 값
```

### 예제 시각화

```nasm
section .data
my_value dq 0xDEADBEEFCAFEBABE

section .text
main:
    mov rax, my_value   ; rax = 주소
    mov rbx, [rax]      ; rbx = 메모리[주소]에 있는 실제 값
```

| 이름    | 의미                                              |
| ------- | ------------------------------------------------- |
| `rax`   | `0x601020` (주소값)                               |
| `[rax]` | `0xDEADBEEFCAFEBABE` (그 주소에 있는 진짜 데이터) |

### 실수 포인트 정리

| 상황                       | 실수                | 올바른 사용              |
| -------------------------- | ------------------- | ------------------------ |
| 값을 저장할 때             | `mov rbx, rax` → OK | 복사                     |
| 주소를 참조할 때           | `mov rbx, [rax]`    | **rax가 주소여야 함!**   |
| 값을 저장할 주소 지정할 때 | `mov [rax], rbx`    | rbx의 값을 메모리에 저장 |

`[]` 안에 있으면 "주소를 참조해서 메모리에 접근한다"는 뜻

### rax vs [rax] 비교 요약

| 표현    | 의미                                   | 유형                            |
| ------- | -------------------------------------- | ------------------------------- |
| `rax`   | 레지스터에 저장된 값 (정수 등)         | 직접값                          |
| `[rax]` | rax가 가리키는 메모리 주소에서 읽은 값 | 간접 참조 (pointer dereference) |

### 스택프레임과 연관 깊은 레지스터 설명

| 레지스터 | 이름          | 역할                                            |
| -------- | ------------- | ----------------------------------------------- |
| `rsp`    | Stack Pointer | **현재 스택의 꼭대기 주소**를 가리킴            |
| `rbp`    | Base Pointer  | **현재 함수의 스택 기준점** (스택프레임 기준선) |

스택은 "아래로 자람" (즉, 주소가 **감소** 함)

→ 데이터를 `push`하면

**`rsp`가 작아지고**,

→ pop하면

**`rsp`가 커짐**

### 그림으로 보는 스택프레임 구조

```nasm
← stack grows downward (주소 감소)
[rbp + 16] ← 2번째 인자 (Windows x64 기준)
[rbp + 8]  ← 1번째 인자 (또는 return address)
[rbp]      ← 이전 함수의 RBP (push rbp)
[rbp - 8]  ← 지역 변수 1
[rbp - 16] ← 지역 변수 2
...
```

이렇게 `rbp` 기준으로 **양수는 인자 / 음수는 지역 변수**로 접근한다.

### `rsp` vs `rbp`의 역할 차이

| 구분      | `rsp`                         | `rbp`                   |
| --------- | ----------------------------- | ----------------------- |
| 용도      | 실제 스택 포인터 (push/pop용) | 고정된 기준점           |
| 변함 여부 | 자주 바뀜                     | 함수 내내 고정됨        |
| 용도      | 연산, push/pop 직접 사용      | 지역 변수 / 인자 접근용 |

### 실제 예제: 함수 호출 시 스택 상태 변화

C언어:

```c
void my_func() {
    int a = 123;
}
```

컴파일된 Assembly (간소화):

```nasm
my_func:
    push rbp
    mov rbp, rsp
    sub rsp, 8       ; int a 공간 확보

    mov dword [rbp - 4], 123

    mov rsp, rbp
    pop rbp
    ret
```

### 이 코드의 스택 동작

- `push rbp` → 이전 프레임 기준 저장
- `mov rbp, rsp` → 현재 기준점으로 세팅
- `sub rsp, 8` → 스택 공간 8바이트 확보 → `rsp` 내려감
- `rbp - 4` 위치에 값 저장 (지역 변수)
- 함수 끝 → `mov rsp, rbp`로 스택 정리 → `rsp` 되돌림
- `pop rbp`로 이전 프레임 복원
- `ret`으로 복귀

이 구조를 통해 함수 안에서 **지역변수/인자 접근, 복귀** 모두 깔끔하게 처리된다.

### 중요한 포인트 요약

- `rsp`는 push/pop 할 때 계속 움직인다.
- `rbp`는 함수 안에서 고정된 기준점 역할을 한다.
- `rbp - x`는 지역 변수, `rbp + x`는 인자 접근
- 함수 끝날 땐 `mov rsp, rbp`로 스택 초기화 후 `pop rbp`, `ret`

### 예시 상황 정리: 함수 하나 호출했을 때

```nasm
main:
    call my_func     ; call → [return address] push

my_func:
    push rbp         ; 이전 rbp push
    mov rbp, rsp     ; 현재 rsp 기준 잡기
    sub rsp, 8       ; 지역 변수 공간 확보

    ; 실행 중...

    mov rsp, rbp     ; 스택 복구
    pop rbp          ; 이전 프레임 복구
    ret              ; return address로 복귀
```

### 스택 시각화 예시 (함수 실행 중일 때)

| 주소    | 내용                |
| ------- | ------------------- |
| rsp →   | 지역 변수 (rbp - 8) |
| ...     | ...                 |
| rbp →   | 이전 함수의 rbp     |
| rbp + 8 | return address      |

### 핵심

> `rsp`는 실제 스택의 top이고,
>
> `rbp`는 **기준점을 잡기 위한 고정된 위치**다.

함수를 호출할 때마다 이 기준을 만들고,

함수 끝날 때마다 그 기준을 제거한다.

## 함수 A 안에서 함수 B를 호출하면 스택이 어떻게 생기는가?

상황: `main()` → `funcA()` → `funcB()` 를 순차적으로 호출할 때

→ 각 함수의 **스택프레임**, **복귀주소**, **rbp/rsp 변화** 까지 전체 흐름을 살펴보자.

### 호출 흐름 예시

```nasm
main:
    call funcA

funcA:
    push rbp
    mov rbp, rsp
    sub rsp, 16
    call funcB
    mov rsp, rbp
    pop rbp
    ret

funcB:
    push rbp
    mov rbp, rsp
    sub rsp, 16
    ; do stuff...
    mov rsp, rbp
    pop rbp
    ret
```

### 호출 전 상태 (main 진입 직후)

```nasm
메모리
↓

[ return addr for OS ]  ; ← main 복귀 주소
[ ... main 지역 변수 ... ]
↑
rsp, rbp (main)
```

### funcA 진입 직후 (call funcA 직후)

```nasm
메모리
↓

[ return addr for OS ]      ; main 복귀 주소
[ return addr to main ]     ; call funcA가 push한 주소
[ old rbp of main ]         ; push rbp
[ funcA 지역 변수 (16B) ]   ; sub rsp, 16
↑
rsp
↑
rbp (funcA)
```

### funcB 진입 후 (call funcB 직후)

```nasm
메모리
↓

[ return addr for OS ]      ; main 복귀 주소
[ return addr to main ]     ; call funcA
[ old rbp of main ]         ; main의 기준점
[ funcA 지역 변수 ]         ; 16바이트
[ return addr to funcA ]    ; call funcB
[ old rbp of funcA ]        ; funcA의 기준점
[ funcB 지역 변수 (16B) ]   ; sub rsp, 16
↑
rsp
↑
rbp (funcB)
```

이걸 보면 **스택이 함수가 호출될 때마다 아래로 “겹겹이 쌓이고”**, **함수가 끝날 때마다 거꾸로 벗겨지며(pop) `ret`을 통해 위의 복귀 주소로 이동.**

### 각 함수의 스택프레임 구조 funcB() 기준

```nasm
[rbp + 16] : 2번째 인자 (있다면)
[rbp + 8]  : 1번째 인자 / return address
[rbp]      : 이전 rbp
[rbp - 8]  : 지역 변수
[rbp - 16] : ...
```

### 실행 순서 요약

| 스택에 push되는 순서  | 왜 push됨?                   |
| --------------------- | ---------------------------- |
| `main` → `funcA`      | `call funcA` → 복귀주소 push |
| `funcA` → `funcB`     | `call funcB` → 복귀주소 push |
| 각 함수 진입 시 `rbp` | `push rbp`                   |
| 지역 변수 공간 확보   | `sub rsp, N`                 |

각 함수가 끝나면:

1. `mov rsp, rbp`
2. `pop rbp`
3. `ret` → 스택에 있는 복귀주소로 점프

### 요약

- 호출할 때마다 **스택에 복귀주소가 쌓인다**
- 함수마다 **독립된 스택프레임**이 생긴다
- `rbp`는 **기준선**, `rsp`는 **현재 스택 위치**
- 함수가 끝나면, 스택이 **이전 상태로 복구되고**, 복귀주소로 **jump(ret)** 한다

### 호출 트리 메모리 흐름

```r
main
  └── call funcA
          └── call funcB
```

스택 구조:

```
[ return to OS     ] ← main 복귀주소
[ return to main   ] ← call funcA
[ rbp (main)       ] ← 돌아갈 main 주소
[ funcA locals     ] ← funcA 주소
[ return to funcA  ] ← call funcB
[ rbp (funcA)      ] ← 돌아갈 funcA 주소
[ funcB locals     ] ← funcB 주소
```

## 지역 변수 알아보기

### 목표 요약

- 함수 내부에서 스택 공간 확보
- `mov [rbp - 8], 1234` 로 지역 변수 저장
- `mov rax, [rbp - 8]` 으로 값 읽어서 반환
- `main`에서 `rax`를 보고 확인

### 실습 흐름

```
main
 └── call my_func
      └── [rbp - 8]에 1234 저장
      └── rax에 불러와서 리턴
main으로 복귀 → rax = 1234
```

### 실습 코드 (Windows x64 기준)

```nasm
section .text
global main
main:
    mov rbp, rsp; for correct debugging
    call my_func        ; my_func 실행
    xor rax, rax
    ret                 ; 종료

my_func:
    push rbp            ; 이전 프레임 저장
    mov rbp, rsp        ; 현재 프레임 기준 설정
    sub rsp, 16         ; 지역 변수 공간 확보 (16B)

    mov qword [rbp - 8], 1234  ; 지역 변수에 값 저장
    mov rax, [rbp - 8]         ; 지역 변수에서 값 읽기

    mov rsp, rbp        ; 스택 복구
    pop rbp             ; 이전 프레임 복구
    ret                 ; 복귀
```

| 코드                  | 설명                                                  |
| --------------------- | ----------------------------------------------------- |
| `sub rsp, 16`         | 지역 변수 2개 분량 확보 (정렬 맞춤용으로 넉넉히 잡음) |
| `mov [rbp - 8], 1234` | 지역 변수 1에 1234 저장                               |
| `mov rax, [rbp - 8]`  | 지역 변수에서 값을 읽어서 rax에 저장                  |
| `ret`                 | main으로 복귀 시 rax에 1234가 들어있음                |

### 체크포인트

- 지역 변수는 항상 `[rbp - N]`
- 함수 종료 전에 **반드시 `rsp`, `rbp` 복구**
- `rax`는 리턴값으로 쓰일 수 있다

### 지역 변수끼리 연산 작업 해보기

#### 실습 코드

```nasm
section .text
global main
main:
    mov rbp, rsp; for correct debugging
    call my_func        ; my_func 실행
    xor rax, rax
    ret                 ; 종료

my_func:
    push rbp
    mov rbp, rsp
    sub rsp, 32         ; 지역변수 3개 = 24B + 정렬 여유분

    ; a = 123
    mov qword [rbp - 8], 123

    ; b = 456
    mov qword [rbp - 16], 456

    ; c = a + b
    mov rax, [rbp - 8]      ; rax = a
    add rax, [rbp - 16]     ; rax = a + b
    mov [rbp - 24], rax     ; c = rax

    ; 리턴값 = c
    mov rax, [rbp - 24]

    ; 스택 원복
    mov rsp, rbp
    pop rbp
    ret
```

#### 설명

| 주소         | 의미                |
| ------------ | ------------------- |
| `[rbp - 8]`  | 지역 변수 a = 123   |
| `[rbp - 16]` | 지역 변수 b = 456   |
| `[rbp - 24]` | 지역 변수 c = a + b |

### 핵심 포인트

- **스택은 아래로 증가**하니까, 다음 변수는 -8, -16, -24 순
- **mov [rbp - x], 값** → 지역 변수 저장
- **mov rax, [rbp - x]** → 지역 변수 불러오기
- **add rax, [rbp - y]** → 지역 변수끼리 연산 가능
- **rax는 리턴용으로 자주 사용됨**

### 함수에 인자를 받아 연산 작업 해보기

#### 실습 코드

```nasm
section .text
global main
main:
    mov rcx, 123         ; 첫 번째 인자 a
    mov rdx, 456         ; 두 번째 인자 b
    call add_func        ; rax ← a + b
    xor rax, rax
    ret

add_func:
    push rbp
    mov rbp, rsp
    sub rsp, 32          ; 지역변수 3개: a, b, result

    ; rcx → [rbp - 8] (a 저장)
    mov [rbp - 8], rcx

    ; rdx → [rbp - 16] (b 저장)
    mov [rbp - 16], rdx

    ; 계산: result = a + b
    mov rax, [rbp - 8]    ; rax = a
    add rax, [rbp - 16]   ; rax += b
    mov [rbp - 24], rax   ; result = rax

    ; 리턴값
    mov rax, [rbp - 24]

    ; 정리 후 복귀
    mov rsp, rbp
    pop rbp
    ret
```

#### 포인트 복습

- 인자 전달: `Windows 64bit` → `rcx`, `rdx`, ...
- 지역 변수 저장: `[rbp - x]`
- 계산: `mov + add`
- 결과 리턴: `rax`
