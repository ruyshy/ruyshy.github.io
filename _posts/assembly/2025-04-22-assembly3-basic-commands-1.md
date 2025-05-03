---
title: "Assembly 기본 명령어 - Windows NASM 실습 가이드"
description: "Windows 64bit 기반 NASM 어셈블리에서 자주 사용하는 기본 명령어 mov, add, sub, cmp, jmp, push, pop, call, ret, 조건 분기(jg, je, jne, jl) 사용법과 실습 예제를 설명합니다."
date: 2025-04-22
tags: [nasm, assembly, 어셈블리 명령어, 조건 분기, Windows Assembly]
---

`NASM` 기반 어셈블리를 처음 접하는 사용자라면,  
**가장 먼저 익혀야 할 것은 기본 명령어의 역할과 사용법**입니다.  
이 글에서는 `mov`, `add`, `sub`, `cmp`, `jmp`, `push`, `pop`, `call`, `ret`  
같은 필수 명령어들을 **Windows 64bit 기준 실습 코드**와 함께 정리합니다.

또한, `cmp` 명령어와 플래그 레지스터(`Zero Flag`, `Sign Flag` 등)의 작동 원리를  
**조건 분기 명령어 (`je`, `jne`, `jg`, `jl`)**와 함께 다루며 실습 기반으로 설명합니다.

## 1. 기본 명령어 리스트 (Windows 64bit 기준)

| 명령어      | 역할          | 비고                           |
| ----------- | ------------- | ------------------------------ |
| **mov**     | 데이터 복사   | 레지스터, 메모리, 즉시값       |
| **add**     | 덧셈          | 레지스터끼리, 값 더하기        |
| **sub**     | 뺄셈          | 레지스터끼리, 값 빼기          |
| **inc**     | 1 증가        | rax 같은 레지스터 1 증가       |
| **dec**     | 1 감소        | rbx 같은 레지스터 1 감소       |
| **push**    | 스택에 저장   | rsp를 줄이고 값 저장           |
| **pop**     | 스택에서 꺼냄 | rsp를 늘리고 값 가져옴         |
| **call**    | 함수 호출     | 주소 저장 + 점프               |
| **ret**     | 복귀          | 스택에서 복귀 주소 꺼내서 점프 |
| **cmp**     | 비교          | 플래그만 세팅 (값은 안 바뀜)   |
| **jmp**     | 무조건 점프   | 그냥 이동                      |
| **je, jne** | 조건부 점프   | Zero Flag 기반 (같으면/다르면) |

## 2. 각 명령어 설명

### 2-1. **mov** (데이터 복사)

```nasm
mov rax, 10        ; rax에 10 저장
mov rbx, rax       ; rax 값을 rbx로 복사
```

**`mov`**는 그냥 값을 복붙 한다고 생각하면 됌

### 2-2. **add** (덧셈)

```nasm
mov rax, 5
add rax, 3         ; rax = rax + 3
```

**`add dst, src`** ➔ dst = dst + src

### 2-3. **sub** (뺄셈)

```nasm
mov rax, 5
sub rax, 2         ; rax = rax - 2
```

**`sub dst, src`** ➔ dst = dst - src

### 2-4. inc / dec (1 증가 / 1 감소)

```nasm
mov rcx, 10
inc rcx            ; rcx = rcx + 1
dec rcx            ; rcx = rcx - 1
```

### 2-5. push / pop (스택에 저장/꺼내기)

```nasm
mov rax, 1234
push rax           ; rax를 스택에 저장
mov rax, 0         ; rax를 0으로 초기화
pop rax            ; 스택에서 rax 복원
```

`push`하면 `rsp` 줄어들고,
`pop`하면 `rsp` 다시 올라간다.

### 2-6. call / ret (함수 호출 / 복귀)

```nasm
call my_function   ; 함수 호출 (현재 위치를 스택에 저장하고 점프)

; ...

my_function:
    ; (여기 코드 실행)
    ret            ; 스택에서 복귀주소 꺼내서 돌아감
```

함수 부르기/돌아오기 핵심. 나중에 스택 프레임이라는 중요한 것을 배울 예정.

### 2-7. cmp / jmp / je / jne (비교, 점프)

```nasm
mov rax, 5
cmp rax, 5         ; rax == 5 인지 비교 (ZF 플래그 세팅)
je  equal_label    ; 같으면 equal_label로 점프
jne not_equal_label; 다르면 not_equal_label로 점프
jmp end_label      ; 무조건 end_label로 점프

equal_label:
    ; 여기는 rax == 5일 때 옴
    jmp end_label

not_equal_label:
    ; 여기는 rax != 5일 때 옴

end_label:
    ; 프로그램 계속 진행
```

`cmp`는 값 자체를 안 바꿈! 플래그 레지스터만 조정한다. (`ZF`, `SF`, `CF` 등)

### 2-8. 기본 실습 문제1

```nasm
    rax에 10 저장
	rbx에 20 저장
    rcx에 5 저장
    rax + rbx 결과를 rax에 저장
    rax - rcx 결과를 rax에 저장
    rax를 스택에 저장
    rbx를 스택에 저장
	스택에서 rbx 복구
	스택에서 rax 복구
```

> 실습 문제1 풀기 전, 스택(Stack) 후입선출

기본 코드 골격:

```nasm
default rel
global main

section .text
main:

    ; 여기부터 코드 작성

.loop:
    jmp .loop

```

.loop:은 그냥 프로그램 끝에 멈추는 곳.

<br/>
{% toggle 실습 문제 풀이1 %}

```nasm
default rel
global main

section .text
main:
    mov rax, 10        ; rax = 10
    mov rbx, 20        ; rbx = 20
    mov rcx, 5         ; rcx = 5

    add rax, rbx       ; rax = rax + rbx (10 + 20 = 30)
    sub rax, rcx       ; rax = rax - rcx (30 - 5 = 25)

    push rax           ; 스택에 rax(25) 저장
    push rbx           ; 스택에 rbx(20) 저장

    pop rbx            ; 스택에서 rbx 복구 (20)
    pop rax            ; 스택에서 rax 복구 (25)

.loop:
    jmp .loop          ; 프로그램 종료 대기
```

동작 흐름 다시 정리
`rax` = 10

`rbx` = 20

`rcx` = 5

`add rax, rbx` → `rax` = 30

`sub rax, rcx` → `rax` = 25

`push rax` → (25 스택 저장)

`push rbx` → (20 스택 저장)

`pop rbx` → (20 복구)

`pop rax` → (25 복구)

스택 동작 순서(후입선출 LIFO 구조)

{% endtoggle %}
<br/>

### 2-9. 요약

- `mov`로 값 복사
- `add`/`sub`/`inc`/`dec`로 값 변경
- `push`/`pop`으로 스택 저장/복구
- `call`/`ret`으로 함수 호출/복귀
- `cmp` + `je`/`jne`/`jmp`로 조건 분기

## 3. 기본 실습 문제2

```nasm
; 1. rax에 10 저장
; 2. rbx에 20 저장
; 3. rax와 rbx를 더해서 rax에 저장
; 4. rax 값을 스택에 push
; 5. rax를 0으로 만든 뒤
; 6. 스택에서 rax 값을 pop해서 복구
; 7. rax == 30 이면 끝나는 루프
```

### 3-1. 기본 실습 문제 풀기 전 알아두기

1. 기본 실습 문제 풀기 기본 환경 코드:

   ```nasm
   default rel
   global main

   section .text
   main:
       ; 여기에 코드 작성
   .end:
       jmp .end   ; 무한 루프 (프로그램 강제 정지용)
   ```

2. Assembly에서 "루프(반복)" 만들기
   1. Assembly에서는 루프라는 걸 따로 지원하지 않는다.
   2. **"명령어 점프(jmp)" + "조건 비교(cmp + je/jne 등)"** ➔ 이걸 조합해서 **수동으로 루프를 만든다.**
3. 루프 기본 패턴

   1. 무한 루프 (종료 조건 없음)

      ```nasm
      .loop:
          ; (여기에 반복할 코드)
          jmp .loop
      ```

      1. `.loop:` 이라는 레이블(이름표)을 붙이고
      2. 다시 `.loop`로 `jmp`해서 영원히 돌아오는 구조
      3. C로 치면 `while (1) { }` 와 같음.

4. 카운터 기반 루프 (조건부 반복)

   ```nasm
   mov rcx, 5        ; 반복할 횟수 5회

   .loop:
       ; (여기에 반복할 코드)

       dec rcx        ; rcx = rcx - 1
       cmp rcx, 0
       jne .loop      ; rcx != 0 이면 다시 반복
   ```

   1. `rcx`에 반복 횟수를 세팅하고
   2. `dec`로 하나 줄이고
   3. `cmp`로 0이 됐는지 비교
   4. `jne`로 0이 아니면 다시 `.loop`로 점프
   5. C로 치면:

      ```nasm
      int i = 5;
      while (i--) {
          // 반복
      }
      ```

5. 루프 만들 때 필요한 명령어

   | 명령어           | 역할                 |
   | ---------------- | -------------------- |
   | **jmp label**    | 무조건 점프          |
   | **cmp dst, src** | 비교 후 플래그 설정  |
   | **je label**     | 같으면 점프 (ZF = 1) |
   | **jne label**    | 다르면 점프 (ZF = 0) |
   | **dec reg**      | 1 감소               |

### 3-2. 문제 풀이

먼저 3-1-a 에 기본 코드를 토대로 기본 실습 문제를 진행 해보자.

진행 후, 아래에 최종 답안과 풀이 과정을 확인 해보자.

{% toggle 한 줄씩 풀이 보기 %}

1. `mov rax, 10` ;mov 명렁어로 rax 에 10을 저장
2. `mov rbx, 20` ;mov 명령어로 rbx 에 20을 저장
3. `add rax, rbx` ;add 명령어로 rax 와 rbx 덧셈 연산 후, rax에 값을 저장
4. `push rax` ; rax 값을 push = stack에 rax 값을 저장
5. `mov rax 0` ; rax 값에 0을 저장
6. `pop rax` ; stack 에서 이전에 저장한 rax(30)을 rax로 복구 = stack에서 rax값을 넣기
7. `cmp rax, 30` ;rax값 과 30을 비교
8. `je .end` ;`cmp` ➔ Zero Flag(ZF) 세팅, `je` ➔ ZF가 1이면 점프 (== 같을 때 점프)
9. `.loop:` ;루프문
10. `jmp .loop` ;(틀릴 경우 무한 루프)
11. `.end:` ; `je .end` 에 선언한 곳
12. `jmp .end` ;정상 종료 무한 루프 종료

{% endtoggle %}

{% toggle 최종 답안 보기 %}

```nasm
default rel
global main

section .text
main:
    mov rax, 10        ; 1. rax = 10
    mov rbx, 20        ; 2. rbx = 20
    add rax, rbx       ; 3. rax = rax + rbx
    push rax           ; 4. 스택에 저장
    mov rax, 0         ; 5. rax 초기화
    pop rax            ; 6. 스택에서 복구
    cmp rax, 30        ; 7. 30과 비교
    je .end            ; 같으면 끝
.loop:
    jmp .loop          ; (틀릴 경우 무한루프)

.end:
    jmp .end           ; 정상 종료 무한루프

```

{% endtoggle %}

### 3-2. 체크포인트

- `mov`, `add`, `push`, `pop`, `cmp`, `je`, `jmp` 명령어 사용
- 스택 쓰고 복구하는 흐름 익힘
- `cmp`/`je` 조건 분기 맛보기

## 4. 조건 분기 명령어

**조건 분기 명령어란?**

- `cmp` 명령어로 **두 값을 비교**한 다음
- 플래그 레지스터(`ZF`, `SF`, `CF`, `OF` 등)에 결과가 저장.
- 이 플래그를 보고 **조건에 맞으면 점프(jmp)** 하는 구조.

**조건 분기 명령어 핵심 3단계**

- **cmp dst, src**
  - `dst - src`를 "계산만" 하고
  - **값은 버리고 플래그만 세팅**한다.
- **플래그 레지스터 값 설정**
  - `Zero Flag(ZF)`, `Sign Flag(SF)`, `Carry Flag(CF)`, `Overflow Flag(OF)` 설정
- **je, jne, jg, jl 등 분기 명령어로 점프**

자주 쓰는 조건 분기 명령어

| 명령어    | 의미                     | 조건                           |
| --------- | ------------------------ | ------------------------------ |
| **`je`**  | Jump if Equal            | ZF == 1 (같으면)               |
| **`jne`** | Jump if Not Equal        | ZF == 0 (다르면)               |
| **`jg`**  | Jump if Greater          | (SF == OF) && (ZF == 0) (크면) |
| **`jge`** | Jump if Greater or Equal | SF == OF (크거나 같으면)       |
| **`jl`**  | Jump if Less             | SF != OF (작으면)              |
| **`jle`** | Jump if Less or Equal    | (SF != OF)                     |

Assembly에서는 거의 **`je`, `jne`, `jg`, `jl`**만 쓴다고 보면 됌.

### 4-1. 예제 1: je (같으면 점프)

```nasm
mov rax, 10
mov rbx, 10
cmp rax, rbx    ; rax == rbx 비교
je  equal_label ; 같으면 equal_label로 점프
jmp end_label

equal_label:
    ; 여기 도착
    ; rax == rbx 일 때만

end_label:
    ; 프로그램 종료
```

rax == rbx이면 `equal_label`로 점프!

### 4-2. 예제 2: jne (다르면 점프)

```nasm
mov rax, 10
mov rbx, 5
cmp rax, rbx
jne not_equal_label
jmp end_label

not_equal_label:
    ; rax != rbx일 때 오는 곳

end_label:
    ; 프로그램 종료
```

`rax` != `rbx`이면 `not_equal_label`로 점프!

### 4-3. 예제 3: jg / jl (크거나 작을 때 점프)

```nasm
mov rax, 20
mov rbx, 10
cmp rax, rbx
jg greater_label
jl less_label
jmp end_label

greater_label:
    ; rax > rbx
    jmp end_label

less_label:
    ; rax < rbx
    jmp end_label

end_label:
    ; 프로그램 종료
```

`rax` > `rbx`이면 `greater_label`,

`rax` < `rbx`이면 `less_label` 로 간다.

### 4-4. cmp가 뭘 하는지 한 번 더 강조

```nasm
cmp rax, rbx
```

→ 실제로는 `rax - rbx`를 계산

→ 그 결과에 따라 **Zero/Sign/Carry/Overflow** 플래그를 조정

→ 그리고 분기 명령어(`je`, `jg`, `jl` 등)가 이 플래그를 보는 거야.

> 즉, `cmp`는 "비교만 하고 아무것도 저장하지 않는다."
>
> **플래그 세팅만 한다.**

### 4-5. 요약

| 플래그                 | 의미                     | 영향 받는 분기         |
| ---------------------- | ------------------------ | ---------------------- |
| **ZF (Zero Flag)**     | 두 값이 같으면 세팅      | je, jne                |
| **SF (Sign Flag)**     | 결과가 음수면 세팅       | jg, jl                 |
| **OF (Overflow Flag)** | 오버플로우 발생 여부     | jg, jl                 |
| **CF (Carry Flag)**    | 자리 올림/내림 발생 여부 | (unsigned 비교에 사용) |

`signed/unsigned` 구분이 있는데, 일단 지금은 **정수 부호 있는(signed) 비교**만 다룬다.

### 4-6. 미션

```nasm
; 1. rax에 7 저장
; 2. rbx에 5 저장
; 3. cmp로 비교
; 4. 크면 "greater", 작으면 "less" 레이블로 점프
; 5. 둘 다 아니면 "equal" 레이블로 점프
```

기본 코드:

```nasm
default rel
global main

section .text
main:
    ; 여기부터 네 코드

.loop:
    jmp .loop          ; 프로그램 끝 (무한 대기)

greater:
    ; 여기는 rax > rbx 일 때 오는 곳
    jmp .loop

less:
    ; 여기는 rax < rbx 일 때 오는 곳
    jmp .loop

equal:
    ; 여기는 rax == rbx 일 때 오는 곳
    jmp .loop
```

{% toggle 미션 풀이: %}

```nasm
default rel
global main

section .text
main:
    mov rax, 7         ; rax = 7
    mov rbx, 5         ; rbx = 5
    cmp rax, rbx       ; rax - rbx 비교 (7 - 5)
    jg greater         ; rax > rbx 이면 greater로 점프
    jl less            ; rax < rbx 이면 less로 점프
    je equal           ; rax == rbx 이면 equal로 점프

.loop:
    jmp .loop          ; 프로그램 끝 (무한 대기)

greater:
    ; rax > rbx일 때
    jmp .loop

less:
    ; rax < rbx일 때
    jmp .loop

equal:
    ; rax == rbx일 때
    jmp .loop
```

**흐름 해석**

- `7`과 `5` 비교 → 결과는 "7 > 5"니까 `jg greater` 실행
- 프로그램은 `greater:`로 점프
- 거기서 `.loop`로 넘어가서 무한 대기

{% endtoggle %}
<br/>
