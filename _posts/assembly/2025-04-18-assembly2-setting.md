---
title: "Assembly Setting"
date: 2025-04-18
tags: [nasm, assembly]
---

assembly#2

# Assembly 실습 환경 만들기

레지스터랑 메모리 구조 이해 단계에서 이론을 배웠고, 기본 명령어부터 익히기 전에 Assembly를 실습 할 수 있는 환경을 만들어보자.

## 1. 기본 툴 세팅

NASM (코드 작성+컴파일)

x64dbg (디버깅)

VS Code (편집기)

MinGW 설치 (Windows용 gcc 컴파일러)

### 1-1. NASM 설치

- 공식 사이트: [https://www.nasm.us/](https://www.nasm.us/)
- 들어가서 **Download** > **Windows binaries**(.zip) 다운로드
- 압축 풀고 `nasm.exe`를 적당한 경로에  옮기기(예: `C:\Tools\nasm\nasm.exe`)

**환경 변수 등록**

`시스템 환경 변수 편집` → `환경 변수` → `Path`에 NASM 폴더 추가
(예: `C:\Tools\nasm`)

테스트:

cmd 에서 `nasm -v`  입력 후, 버전 나오면 성공

### 1-2. x64dbg 설치

- 공식 사이트: [https://x64dbg.com/](https://x64dbg.com/)
- Download > 최신버전 다운로드
- 설치 or 포터블(zip) 풀어서 사용

설치 완료하면 `x64dbg.exe` (64비트 디버거) 바로 실행 가능

### 1-3. VS Code 설치 (코드 편집용)

- [https://code.visualstudio.com/](https://code.visualstudio.com/) 가서 설치
- 확장 프로그램(Extension)으로:
    - "MASM/TASM syntax highlighting" 설치 (색깔 입히기용)
    - "Code Runner" (컴파일 단축용, 있어도 되고 없어도 됨)

### 1-4. MinGW 설치 (Windows용 gcc 컴파일러)

- 공식 링크: https://sourceforge.net/projects/mingw/
- 초록색 버튼 "**Download**"
- 파일 이름 예시: `mingw-get-setup.exe`

**설치 진행**

1. `mingw-get-setup.exe` 실행
2. 설치 위치는 예를 들면 `C:\MinGW` 추천
3. 설치할 때 **아래 항목만 체크**:
    - `mingw32-gcc-g++`
    - `mingw32-gcc-gcc`
    - `mingw32-binutils`
    - `mingw32-make`

(IDE 같은 거 설치 안 해도 됨.)

**환경변수 설정**

설치 완료되면, **시스템 환경 변수(Path)에 추가**

- `시스템 환경 변수 편집` → `환경 변수` → `Path` 편집 → 새로 만들기 → `C:\MinGW\bin` 입력

cmd 에서 `gcc --version`  입력 후, 버전 나오면 성공

## 2. 간단한 Hello World 코드 작성

VS Code 열고 새로운 파일 생성
파일 이름: `hello.asm`

내용:

```nasm
default rel

extern ExitProcess : proc
extern GetStdHandle : proc
extern WriteFile : proc

section .data
    helloMsg db "Hello, Windows 64-bit Assembly!", 0xA
    helloLen equ $ - helloMsg

section .text
global main
main:
    ; GetStdHandle(STD_OUTPUT_HANDLE)
    mov rcx, -11           ; STD_OUTPUT_HANDLE
    call GetStdHandle
    mov rbx, rax           ; 핸들을 rbx에 저장

    ; WriteFile(handle, buffer, length, &written, NULL)
    mov rcx, rbx           ; 핸들
    lea rdx, [helloMsg]    ; 버퍼
    mov r8, helloLen       ; 길이
    sub rsp, 32            ; 스택 16바이트 정렬 + WriteFile에 공간 마련
    xor r9, r9             ; written 포인터 NULL
    call WriteFile
    add rsp, 32            ; 스택 복원

    ; ExitProcess(0)
    xor rcx, rcx
    call ExitProcess

```

NASM으로 컴파일하고 실행해보면서 흐름을 눈으로 보는 게 핵심.

### 2-1. 컴파일 & 실행

1단계: NASM으로 컴파일 (hello.obj 만들기)

```bash
nasm -f win32 hello.asm -o hello.obj
```

2단계: 링커로 exe 만들기 (MinGW)

```bash
gcc hello.obj -o hello.exe
```

3단계: 실행

```bash
hello.exe
```

정상 출력:

```bash
Hello, Assembly!
```