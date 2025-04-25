---
title: "Assembly로 간단한 계산기 만들기: Hello World부터 사칙연산까지 실습"
description: "NASM 기반 Assembly에서 문자열 출력, 정수 입력, 사칙연산 계산기 구현까지 기초부터 실습합니다. io64.inc 매크로를 활용한 Hello World, 덧셈, 연산자 분기 방식까지 단계별로 설명합니다."
date: 2025-04-25
tags: [assembly, nasm, io64, 계산기, READ_INT, PRINT_STRING, 기초실습]
---

Assembly 언어로 Hello World 출력부터 덧셈 계산기, 사칙연산 계산기까지 NASM과 io64.inc 매크로를 활용하여 실습해봅니다. 이 예제들을 통해 `PRINT_STRING`, `READ_INT`, `cmp`, `call`, `ret` 등의 명령어 흐름과 스택 사용법까지 익힐 수 있습니다.

SASM + io64.inc 환경 기준으로 진행합니다.


## 예제: Hello World 출력 (x64, NASM, io64.inc)

```nasm
%include "io64.inc"       ; 문자열 출력 등 유틸리티 함수 포함

section .data
    msg db "Hello, World!", 0   ; null-terminated 문자열 선언

section .text
global main
main:
    mov rbp, rsp                ; 디버깅 편의상 프레임베이스 설정
    PRINT_STRING msg            ; 문자열 출력
    NEWLINE                     ; 줄바꿈 출력
    xor rax, rax                ; 정상 종료 코드 0 설정
    ret                         ; 프로그램 종료
```

### 코드 설명

| 명령어 | 설명 |
| --- | --- |
| `PRINT_STRING msg` | `msg`에 있는 문자열 출력 (`db`로 정의된 문자열) |
| `NEWLINE` | 줄바꿈 출력 (헬퍼 매크로에서 제공) |
| `mov rbp, rsp` | 현재 스택 포인터를 RBP에 저장해서 스택 프레임 설정 |
| `xor rax, rax` | RAX를 0으로 초기화 (프로그램 정상 종료 코드) |
| `ret` | 호출한 곳으로 복귀 (여기선 OS에 리턴) |

## 간단한 덧셈 계산기 (두 수 입력받아 더해서 출력)

```nasm
%include "io64.inc"

section .data
    prompt1 db "Enter first number: ", 0
    prompt2 db "Enter second number: ", 0
    resultMsg db "Result = ", 0

section .bss
    num1 resq 1     ; 64비트 정수 저장 공간
    num2 resq 1

section .text
global main
main:
    mov rbp, rsp         ; 스택프레임 설정 (디버깅용)

    ; 첫 번째 수 입력
    PRINT_STRING prompt1
    READ_INT
    mov [num1], rax      ; 입력된 정수 RAX → num1에 저장

    ; 두 번째 수 입력
    PRINT_STRING prompt2
    READ_INT
    mov [num2], rax      ; 입력된 정수 RAX → num2에 저장

    ; 두 수 더하기
    mov rax, [num1]
    add rax, [num2]

    ; 결과 출력
    PRINT_STRING resultMsg
    PRINT_DEC rax
    NEWLINE

    xor rax, rax
    ret
```

### 이 코드로 배우는 것

- `READ_INT`로 사용자 입력을 받고
- 메모리(`.bss` 영역)에 저장하고
- `mov`, `add` 명령어로 계산하고
- `PRINT_DEC`로 숫자 출력까지 함

`cmp rax, '+'` 으로 +, -, *, /를 체크해서 간단한 사칙연산 계산하는 프로그램을 직접 만들어보자!

## 간단한 사칙연산 계산기

{% toggle 코드 보기 %}
```nasm
%include "io64.inc"

section .data
    prompt1     db "Enter first number: ", 0
    prompt2     db "Enter second number: ", 0
    promptOp    db "Enter operator (+, -, *, /): ", 0
    resultMsg   db "Result = ", 0
    errorMsg    db "Unknown operator!", 0

section .bss
    num1    resq 1
    num2    resq 1
    op      resb 2     ; 한 문자 + null

section .text
global main

main:
    mov rbp, rsp

    ; 입력받기
    PRINT_STRING prompt1
    READ_INT
    mov [num1], rax

    PRINT_STRING prompt2
    READ_INT
    mov [num2], rax

    PRINT_STRING promptOp
    READ_CHAR
    mov [op], al

    ; 연산 분기
    movzx rax, byte [op]
    cmp rax, '+'
    je do_add
    cmp rax, '-'
    je do_sub
    cmp rax, '*'
    je do_mul
    cmp rax, '/'
    je do_div

    ; 에러 처리
    PRINT_STRING errorMsg
    NEWLINE
    jmp program_end

; ----------------------
do_add:
    call add_func
    jmp print_result

do_sub:
    call sub_func
    jmp print_result

do_mul:
    call mul_func
    jmp print_result

do_div:
    call div_func
    jmp print_result

; ----------------------
add_func:
    mov rax, [num1]
    add rax, [num2]
    ret

sub_func:
    mov rax, [num1]
    sub rax, [num2]
    ret

mul_func:
    mov rax, [num1]
    imul rax, [num2]
    ret

div_func:
    mov rax, [num1]
    cqo                 ; RDX:RAX로 확장
    idiv qword [num2]   ; RAX = 몫
    ret

; ----------------------
print_result:
    PRINT_STRING resultMsg
    PRINT_DEC rax
    NEWLINE

program_end:
    xor rax, rax
    ret
```

{% endtoggle %}

### 주요 포인트

| 구성 요소 | 설명 |
| --- | --- |
| `READ_CHAR` | 문자 하나만 입력받음 (`+`, `-`, `*`, `/`) |
| `movzx rax, byte [op]` | 입력된 문자를 비교하기 위해 0 확장 |
| `call` + `ret` | 각 연산 함수를 별도로 호출 |
| `div_func` | `idiv` 사용 전 반드시 `cqo` 필요 (부호 확장) |

