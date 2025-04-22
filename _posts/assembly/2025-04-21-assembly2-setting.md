---
title: "Assembly 실습 환경 설정"
date: 2025-04-21
tags: [nasm, assembly]
---

assembly#2

## SASM

**SASM ( SimpleASM** 의 약자 )은 [NASM](https://en.wikipedia.org/wiki/Netwide_Assembler) , [MASM](https://en.wikipedia.org/wiki/MASM) , [GAS](https://en.wikipedia.org/wiki/GNU_Assembler) , [FASM](https://en.wikipedia.org/wiki/FASM) 어셈블리 언어를 위한 무료 [오픈 소스](https://en.wikipedia.org/wiki/Open_source) 크로스 플랫폼 [통합 개발 환경](https://en.wikipedia.org/wiki/Integrated_development_environment) 입니다 . 구문 강조 기능과 디버거가 포함되어 있습니다.

## SASM 설치하기

sasm 공식 홈페이지 : [https://dman95.github.io/SASM/english.html](https://dman95.github.io/SASM/english.html)

해당 홈페이지에 접속하여 설치파일 다운로드 후, 설치를 진행합니다.

## SASM Setting

{% img "image1.png" %}

nasm x64 기준으로 진행 합니다.

설치 후, 설치 경로인 \SASM\Projects 폴더 안에 여러 예제를 테스트 할 수 있습니다.

File→Open 메뉴를 가보면 자동으로 \SASM\Projects 경로로 기본 설정 되어 있습니다.

NASM 위주로 학습을 진행할 예정이니, `NASMHellox64.asm` 를 살펴 봅시다.

```nasm
%include "io64.inc"

section .data
    msg db 'Hello, world!', 0

section .text
global main
main:
    mov rbp, rsp ; for correct debugging
    PRINT_STRING msg ; print hello world
    NEWLINE ; print newline
    xor rax, rax ; set rax to 0
    ret ; return
```

단축키 F9를 눌러 테스트를 진행할 수 있습니다.

{% img "image2.png" %}

단축키 F5를 눌러보면

{% img "image3.png" %}

저처럼 memory와 registers를 볼 수 있도록

Debug→Show Memory, Show Registers 설정을 on으로 설정합시다!

### 코드 흐름 살펴보기

```nasm
%include "io64.inc"
```

- `io64.inc` 파일을 include 한다는 뜻.
- 이 안에는 `PRINT_STRING`, `NEWLINE` 같은 매크로(편의 함수)가 정의되어 있음.
- **즉, 직접 WriteFile 같은 API 호출 안 해도** 편하게 출력 가능하게 만든 것.

```nasm
section .data
    msg db 'Hello, world!', 0
```

- `.data` 섹션: "초기화된 데이터 (변수)" 를 저장하는 곳.
- `msg`라는 변수가 선언 
- 구체적으로 보면:
- `msg` = label (라벨이란, 어떤 메모리 위치를 부르는 이름)
- `db` = define byte (1바이트씩 데이터를 정의하겠다는 뜻)
- `'Hello, world!', 0` = 13바이트 크기 문자열 ('Hello, world!' + NULL 문자 0)
- 즉, `msg`는 메모리에 H, e, l, l, o, ,, w, o, r, l, d, !, 0 이렇게 바이트 단위로 저장된 배열.

```nasm
section .text
global main
main:
    mov rbp, rsp
```

- `.text` 섹션: 실행되는 코드
- `global main`: 프로그램 진입점을 `main` 함수로 지정 (링커가 main 찾게)
- `mov rbp, rsp`: 디버깅할 때 스택 프레임 만들려고 넣는 것. (사실 없어도 돌아가긴 함)

```nasm
    PRINT_STRING msg
    NEWLINE
```

- `PRINT_STRING msg`: `msg` 내용을 콘솔에 출력 (io64.inc 매크로 덕분)
- `NEWLINE`: 줄 바꿈 출력

```nasm
    xor rax, rax
    ret
```

- `xor rax, rax`: rax 레지스터를 0으로 세팅 (종료코드 0)
- `ret`: 함수 리턴 → 프로그램 종료

다음 편 : 

assembly **기본 명령어부터 익히기**