---
title: "Assembly 호출 규약 비교: cdecl vs stdcall - 스택 정리 방식과 호출 흐름 이해"
description: "cdecl과 stdcall 호출 규약(Call Convention)의 차이점을 NASM 어셈블리 코드 예제와 함께 비교 분석합니다. 함수 호출, 스택 정리 방식, 인자 전달 구조를 정확히 이해하고 리버싱에 필요한 기초를 다질 수 있습니다."
date: 2025-04-24
tags: [assembly, call convention, cdecl, stdcall, fastcall, nasm, stack frame]
---

NASM 기반 Windows 어셈블리 실습에서 흔히 등장하는 cdecl, stdcall 호출 규약(Call Convention)에 대해 다룹니다. 함수 호출 시 스택 구조, 인자 전달 방식, 복귀 흐름 분석은 리버싱과 디버깅에 핵심입니다.

## Call Convention이란?

함수를 **어떻게 호출하고 인자를 어떻게 전달하고, 누가 스택을 정리하는지**를 정한 **약속**.

C/C++ 컴파일러가 어셈블리로 함수 호출을 만들 때 이 규칙을 따른다고 보면 됨.

## 대표적인 호출 규칙 비교

| 규칙         | 인자 전달 방식              | 스택 정리 주체    | 특징              |
| ------------ | --------------------------- | ----------------- | ----------------- |
| **cdecl**    | 스택 (오른쪽 → 왼쪽)        | 호출자 (caller)   | GCC에서 기본      |
| **stdcall**  | 스택 (오른쪽 → 왼쪽)        | 피호출자 (callee) | Windows API 기본  |
| **fastcall** | 일부 인자는 레지스터로 전달 | 피호출자          | `ecx`, `edx` 사용 |

## 1. cdecl (Caller Cleanup)

**cdecl**은 가장 널리 사용되는 호출 규약으로, 특히 **GCC**에서 기본적으로 사용.

특징:

- **인자 전달:** 스택을 통해 오른쪽에서 왼쪽으로 전달 (즉, 첫 번째 인자가 **마지막**에 푸시됨)
- **스택 정리:** **호출자** (caller)가 스택을 정리함
- **리턴 값:** `eax` 레지스터로 리턴 값을 반환

호출부 (caller):

```nasm
push 2        ; 인자 2
push 1        ; 인자 1
call my_func  ; 함수 호출
add esp, 8    ; 호출자가 스택을 정리 (2개 인자 * 4바이트)
```

- **push 2, push 1**: 함수의 인자를 스택에 푸시합니다. 여기서 중요한 점은 **오른쪽에서 왼쪽** 순서로 인자가 푸시된다는 것입니다.
- **call my_func**: `call` 명령어로 함수 호출을 합니다. 이때 **리턴 주소**도 스택에 푸시됩니다.
- **add esp, 8**: `add esp, 8`로 호출자가 스택을 정리합니다. 즉, 함수 호출 후 2개의 인자를 제거합니다. 여기서 `8`은 인자 두 개(`4바이트`씩)입니다.

함수부 (callee):

```nasm
my_func:
    push ebp            ; 이전의 프레임 포인터를 스택에 푸시
    mov ebp, esp        ; 현재 스택 포인터를 ebp에 저장 (프레임 포인터 설정)
    mov eax, [ebp+8]    ; 인자 1 (첫 번째 인자는 ebp+8 위치에)
    mov ebx, [ebp+12]   ; 인자 2 (두 번째 인자는 ebp+12 위치에)
    add eax, ebx        ; 인자들을 더함
    pop ebp             ; 원래의 ebp 값 복원
    ret                 ; 반환 (esp는 호출자에 의해 정리되었으므로 추가 정리 없이 바로 리턴)
```

- **push ebp, mov ebp, esp**: 함수가 호출될 때마다 새로운 스택 프레임을 설정합니다. 이를 통해 함수의 **로컬 변수**와 **인자**에 접근할 수 있습니다.
- **mov eax, [ebp+8], mov ebx, [ebp+12]**: `ebp`를 기준으로 인자들을 읽습니다. 첫 번째 인자는 `ebp+8`에, 두 번째 인자는 `ebp+12`에 있습니다.
- **ret**: `ret` 명령어는 호출한 함수로 돌아가지만, 호출자가 **스택을 정리**하는 규칙에 따라 추가적인 `esp` 조작이 없습니다.

요약:

- **caller가 스택 정리**하는 방식
- **인자 순서**는 오른쪽 → 왼쪽
- 함수 호출 후 스택을 직접 정리해야 함 (`add esp, 8`)

<br/>

### 예시 1: cdecl

```nasm
; 호출부
push 2        ; 인자 2
push 1        ; 인자 1
call my_func
add esp, 8    ; caller가 스택 정리

; 함수부
my_func:
    push ebp
    mov ebp, esp
    mov eax, [ebp+8] ; 인자 1
    mov ebx, [ebp+12] ; 인자 2
    add eax, ebx
    pop ebp
    ret
```

`cdecl`은 call 후 **호출한 쪽에서 `add esp, ...`로 스택 정리**해야 함!

## 2. stdcall (Callee Cleanup)

**stdcall**은 **Windows API**에서 주로 사용되는 호출 규약으로, **스택 정리**가 **피호출자**(callee) 쪽에서 이루어집니다.

특징:

- **인자 전달:** 스택을 통해 오른쪽에서 왼쪽으로 전달 (cdecl과 동일)
- **스택 정리:** **피호출자** (callee)가 스택을 정리함
- **리턴 값:** `eax` 레지스터로 리턴 값을 반환

호출부 (caller):

```nasm
push 2        ; 인자 2
push 1        ; 인자 1
call my_func  ; 함수 호출
; 호출부에서는 스택 정리 없음
```

- **push 2, push 1**: `cdecl`과 마찬가지로 인자들을 오른쪽 → 왼쪽 순서로 푸시합니다.
- **call my_func**: `call` 명령어로 함수 호출을 합니다. `ret` 명령어가 호출될 때 피호출자가 스택을 정리하기 때문에, 호출부에서는 별도의 스택 정리 명령어가 필요 없습니다.

함수부 (callee):

```nasm
my_func:
    push ebp            ; 이전의 프레임 포인터를 스택에 푸시
    mov ebp, esp        ; 현재 스택 포인터를 ebp에 저장 (프레임 포인터 설정)
    mov eax, [ebp+8]    ; 인자 1 (첫 번째 인자는 ebp+8 위치에)
    mov ebx, [ebp+12]   ; 인자 2 (두 번째 인자는 ebp+12 위치에)
    add eax, ebx        ; 인자들을 더함
    pop ebp             ; 원래의 ebp 값 복원
    ret 8               ; callee가 스택 정리 (2개 인자 * 4바이트)
```

- **push ebp, mov ebp, esp**: 함수가 호출될 때마다 스택 프레임을 설정합니다.
- **mov eax, [ebp+8], mov ebx, [ebp+12]**: 인자들은 `ebp+8`과 `ebp+12`에서 읽어옵니다.
- **ret 8**: `stdcall`의 핵심! 함수가 끝날 때 `ret 8`을 사용하여 **스택을 정리**합니다. 호출자는 더 이상 스택을 정리할 필요가 없으며, 피호출자 함수가 **인자 크기만큼 스택을 정리**합니다.

요약:

- **callee가 스택 정리**하는 방식
- **인자 순서**는 오른쪽 → 왼쪽
- 함수 호출 후 **ret 8**을 사용하여 피호출자가 스택을 정리

### 예시 2: stdcall

```nasm
; 호출부
push 2
push 1
call my_func    ; 스택 정리 없음!

; 함수부
my_func:
    push ebp
    mov ebp, esp
    mov eax, [ebp+8]
    mov ebx, [ebp+12]
    add eax, ebx
    pop ebp
    ret 8        ; callee가 2개(4+4)의 인자 정리
```

`stdcall`은 함수 끝에서 `ret 8` 같은 식으로 **callee가 스택 정리**를 한다!

## 간단한 비교

| 항목                  | **cdecl**                      | **stdcall**                        |
| --------------------- | ------------------------------ | ---------------------------------- |
| **인자 전달**         | 스택 (오른쪽 → 왼쪽)           | 스택 (오른쪽 → 왼쪽)               |
| **스택 정리**         | 호출자 (caller)                | 피호출자 (callee)                  |
| **리턴 값**           | `eax`로 반환                   | `eax`로 반환                       |
| **호출 후 스택 정리** | 호출자가 `add esp, ...`로 정리 | `ret 8`을 사용하여 피호출자가 정리 |
| **주로 사용되는 곳**  | **GCC**에서 기본, Unix 시스템  | **Windows API**                    |

<br/>

### fastcall 간단 설명 (x86 한정)

- 인자 1개는 `ecx`, 2번째는 `edx`에 저장
- 나머지는 스택
- 스택은 callee가 정리

```nasm
; 호출부
mov ecx, 1
mov edx, 2
call my_func
```

이건 직접 보기보다 **x64dbg로 디컴파일된 함수** 보면 레지스터에 인자 들어간 거 관찰해보면 느낌 잡힐 거임.

### 64비트에서는?

> x64에서는 규칙이 통일됨 (Windows 기준):

- `rcx`, `rdx`, `r8`, `r9` → 인자 전달
- 스택 정리는 호출자(caller)
- **cdecl 변형**

## 누가 스택을 정리하느냐 → 흐름 복구에 매우 중요

- `cdecl`: 호출부에서 `add esp, ...` 직접 해줌
- `stdcall`: 함수 끝에서 `ret N`으로 자동 정리
- `fastcall`: 레지스터 인자 외에 스택에 들어간 애만 `ret N`

즉, `ret` 다음에 `add esp, 8`이 있다면 `cdecl`
반대로 `ret 8`이면 `stdcall`인 거 바로 파악 가능
