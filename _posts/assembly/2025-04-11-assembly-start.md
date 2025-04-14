---
title: "Assembly Start"
date: 2025-04-9
tags: [nasm, reverse]
---

# Assembly 시작하기

## 어셈블리(Assembly)란?

어셈블리어는 사람이 읽을 수 있는 저수준 언어로, CPU가 실제로 이해하는 기계어(machine code)와 1:1로 대응돼.
쉽게 말하면, CPU와 직접 대화하기 직전 단계라고 볼 수 있어.

## 왜 어셈블리를 배울까?

- 시스템 내부 동작을 깊이 이해할 수 있음
- 최적화된 코드 작성 가능 (속도 극한까지 뽑기)
- 리버스 엔지니어링, 보안 분야에서 필수
- 디버깅 능력 향상

## 구조부터 알아보자

어셈블리는 일반적으로 특정 **CPU 아키텍처**에 종속돼.

가장 많이 쓰이는 건 **x86 / x86-64(Intel/AMD 계열)** 이고,

임베디드 쪽은 **ARM** 계열이 많아.

이번에는 **x86-64 기준**으로 설명할게!

## 기본 개념

### 1. **레지스터(Register)**

CPU 내부에 있는 **초고속 메모리**. 대표적인 레지스터들:

| 이름 | 설명 |
| --- | --- |
| `RAX` | 계산 결과 저장 (주요 연산용) |
| `RBX`, `RCX`, `RDX` | 범용 레지스터 |
| `RSP` | 스택 포인터 (Stack Pointer) |
| `RBP` | 베이스 포인터 (Base Pointer) |
| `RSI`, `RDI` | 문자열 처리 또는 함수 인자용 |

### 2. **기본 명령어**

| 명령어 | 설명 |
| --- | --- |
| `MOV` | 값 복사 |
| `ADD` | 덧셈 |
| `SUB` | 뺄셈 |
| `MUL`, `IMUL` | 곱셈 |
| `DIV`, `IDIV` | 나눗셈 |
| `PUSH` / `POP` | 스택에 값 넣기 / 빼기 |
| `CMP` | 비교 |
| `JMP`, `JE`, `JNE`, `JG`, `JL`, ... | 조건 분기 |
| `CALL`, `RET` | 함수 호출 / 복귀 |

## 간단 예제

```nasm
section .text
    global _start

_start:
    mov rax, 5       ; rax = 5
    add rax, 3       ; rax += 3 → rax = 8
    ; 여기서 프로그램 종료 (Linux 기준)
    mov rdi, 0       ; return code = 0
    mov rax, 60      ; syscall: exit
    syscall
```

## 컴파일 & 실행 (Linux 기준)

```nasm
nasm -f elf64 hello.asm -o hello.o
ld hello.o -o hello
./hello
echo $?
```

## 다음에 다룰 주제들

1. 메모리 구조 (스택, 힙, 데이터 섹션 등)
2. 함수 호출 규약 (calling convention)
3. 조건문, 반복문 구현
4. 리버싱을 위한 디스어셈블리 감상법
5. 디버거 사용법 (gdb, x64dbg 등)