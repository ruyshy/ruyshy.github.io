---
title: "Assembly 실습 환경 설정"
date: 2025-04-22
tags: [nasm, assembly]
---

assembly #2

## 1. SASM

**SASM ( SimpleASM** 의 약자 )은 [NASM](https://en.wikipedia.org/wiki/Netwide_Assembler) , [MASM](https://en.wikipedia.org/wiki/MASM) , [GAS](https://en.wikipedia.org/wiki/GNU_Assembler) , [FASM](https://en.wikipedia.org/wiki/FASM) 어셈블리 언어를 위한 무료 [오픈 소스](https://en.wikipedia.org/wiki/Open_source) 크로스 플랫폼 [통합 개발 환경](https://en.wikipedia.org/wiki/Integrated_development_environment) 입니다 . 구문 강조 기능과 디버거가 포함되어 있습니다.

### 1-1. SASM 설치하기

sasm 공식 홈페이지 : [https://dman95.github.io/SASM/english.html](https://dman95.github.io/SASM/english.html)

해당 홈페이지에 접속하여 설치파일 다운로드 후, 설치를 진행합니다.

### 1-2. SASM Setting

{% img "image1.png" %}

nasm x64 기준으로 진행 합니다.

설치 후, 설치 경로인 \SASM\Projects 폴더 안에 여러 예제를 테스트 할 수 있습니다.

File→Open 메뉴를 가보면 자동으로 \SASM\Projects 경로로 기본 설정 되어 있습니다.

NASM 위주로 학습을 진행할 예정이니, `NASMHellox64.asm` 를 살펴 봅시다.

### 1-3. NASMHellox64.asm

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

단축키 F9(Build and run)를 눌러 테스트를 진행할 수 있습니다.

{% img "image2.png" %}

단축키 F5(Debug)를 눌러보면

{% img "image3.png" %}

저처럼 memory와 registers를 볼 수 있도록

Debug→Show Memory, Show Registers 설정을 on으로 설정합시다!

### 1-4. 코드 흐름 살펴보기

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

- `.data` 섹션: 데이터를 정의하는 곳.
- `msg`라는 이름으로 문자열 저장.
- 문자열 끝에 `0` (NULL) 추가. (C 스타일 문자열)

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

## 2. SASM 사용 방법

### 2-1. 디버깅 기본 단축키

| 기능 | 단축키 | 설명 |
| --- | --- | --- |
| 디버깅 시작 | F5 | 프로그램 실행하면서 디버깅 모드 진입 |
| 브레이크 포인트 설정/해제 | F8 | 해당 줄 멈추기 (줄 번호 클릭하거나 F8) |
| 계속 실행 | F5 | 다음 브레이크 포인트까지 실행 |
| 일시정지 | F5 | 현재 실행 멈춤 (무한 루프 걸렸을 때 유용) |
| Step Into | F11 | 다음 명령어로 이동 + 함수 안으로 들어감 |
| Step Over | F10 | 다음 명령어로 이동 + 함수는 건너뜀 |

### 2-2. 디버깅 창 단축키

| 창 이름 | 단축키 | 기능 |
| --- | --- | --- |
| 레지스터(Register) 창 | Ctrl+R | CPU 레지스터(`RAX`, `RBP`, `RSP` 등) 보기 |
| 메모리(Memory) 창 | Ctrl+M | 주소 또는 변수 메모리 직접 보기 |

해당 레지스터 창, 메모리 창은 디버깅할 때, 매우 중요하므로 켜두는게 좋음!

더 자세히 알고싶다면, F1을 눌러 Help를 읽거나 sasm 문서를 찾아보자!

### 2-3. 메모리/변수 보는 방법

- Memory 창에서
    - "Add Variable..."에 변수 이름 입력
    - 타입 지정:
        
        `b` = byte(1바이트)
        
        `w` = word(2바이트)
        
        `d` = double word(4바이트)
        
        `q` = quad word(8바이트)
        
- 주소 직접 보고 싶으면 "Address" 체크
- 배열로 보면 "Array Size" 설정 가능

**예시**:

- 변수 주소: `msg`
- 명령어: `msg, b`
- 배열로 보면 `"array size" = 13` 설정 (Hello, world! 길이)

### 2-4. SASM 디버깅 연습 미션&풀이


{% toggle 미션 1. %}

`msg` 문자열이 메모리에 어떻게 저장되어 있는지 확인하기.
    
목표:
   
- `msg` 데이터가 메모리에 어떤 형태로 들어가 있는지 실제로 확인
- "Hello, world!" 문자열이 1바이트 씩 저장된 걸 눈으로 확인하기
    
**체크 포인트**:
    
- 'H', 'e', 'l', 'l', 'o', ... 문자들이 차례로 들어가 있나?

{% endtoggle %}
<br/>

{% toggle 미션 1. 풀이 %}

1. F5(Debug)를 눌러 디버깅 진행
   
2. F10(Step Over)를 통해 `PRINT_STRING msg ;` 까지 디버깅 하기.
        
    {% img "image4.png" %}
        
3. Memory 창에서 Add variable…을 눌러 msg 추가하고, Type은 Smart, b, 14 설정하면 “Hello, world!” 가 표현되는 것을 확인할 수 있다. (스페이스(공백)과 마지막에 0을 합친 문자열 개수가 14개)
   
4. Type을 Hex로 변경해보면 `{0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c,0x64, 0x21, 0x0}` 해당 16진수인 값이 나오는데 아래의 아스키 코드표를 보면 H(0x48)을 확인할 수 있다. 해당값은 아스키코드 16진수 값이다!
        
    {% img "image5.png" %}
        
5. 마지막에 0(0x00)을 넣어준 이유는 문자열의 끝을 알기 위해서 넣어준 것이다!
   
6. 즉, `msg db 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21, 0x00` 이렇게 선언한 것과 `msg db 'Hello, world!', 0` 이렇게 선언한 것은 똑같다!

{% endtoggle %}
<br/>
   

{% toggle 미션 2. %}

`xor rax, rax` 명령어 수행 전후 `RAX` 값 비교하기
    
**목표**:
    
- `xor rax, rax` 명령어가 정확히 어떤 효과를 내는지 체감
- 명령어 수행 전후 레지스터 변화를 관찰
    
**체크 포인트**:
    
- `RAX` 값이 0으로 깔끔하게 초기화됐나?

{% endtoggle %} 
<br/>

{% toggle 미션 2. 풀이 %}

- **F5 (Debug)** 눌러 디버깅 모드 진입
- **F10 (Step Over)** 여러 번 눌러서 `xor rax, rax` **직전**까지 이동
- `xor rax, rax` 줄에서 **브레이크포인트 (F8)** 설정
- **Ctrl+R (Registers 창)** 열어서 레지스터 상태 확인
    - 이 시점에서는 `RAX`가 0이 아닐 수 있음
  
    - 예를 들면, `RAX = 0x000000000000000d` (13, 문자열 길이)처럼 되어 있을 수도 있다.
            
        (왜냐면 `PRINT_STRING` 매크로가 내부에서 `RAX`를 수정했을 수 있으니까)
            
- **F11 (Step Into)** 눌러 `xor rax, rax` 명령어 한 줄 실행

- 다시 **Registers 창** 확인
    - 이제 `RAX = 0x0000000000000000` 으로 초기화되어 있어야 한다.
        
    **원리 설명**
        
    - `xor rax, rax`는 **RAX를 자기 자신과 XOR** 연산하는 것

    - **어떤 값이든 자기 자신과 XOR 하면 무조건 0이 된다**

        - 수학적으로: `x xor x = 0`

    - 그래서 `xor rax, rax`는 매우 빠르고 최적화된 **레지스터 클리어 방법**이다.
   
        - `mov rax, 0` 보다 사이즈가 작고 CPU에 부담도 덜 준다.

{% endtoggle %} 
<br/>   

## 3. Assembly 변수 선언 방법

| 구문 | 의미 |
| --- | --- |
| `db` (define byte) | 1바이트 변수 |
| `dw` (define word) | 2바이트 변수 |
| `dd` (define double word) | 4바이트 변수 |
| `dq` (define quad word) | 8바이트 변수 |

**메모리에 직접 값을 "저장"하는 것**으로 변수처럼 사용(64bit 기준에서는 `dq`를 많이 사용)

### 3-1. 예시

```nasm
section .data
    a db 10       ; 1바이트짜리 변수 a = 10
    b dw 1000     ; 2바이트짜리 변수 b = 1000
    c dd 12345678h ; 4바이트짜리 변수 c = 0x12345678
    d dq 123456789ABCDEF0h ; 8바이트짜리 변수 d = 0x123456789ABCDEF0

```

### 3-2. 중요한 포인트

- `a`, `b`, `c`, `d`는 전부 **메모리에 존재하는 이름(label)**.
- 변수 자체가 아니라, **"그 메모리 위치"를 가리키는 라벨**.
- 값을 바꾸고 싶으면 메모리에 직접 접근해서 수정해야 함.

### 3-3. 참고: uninitialized 변수

```nasm
section .bss
    buffer resb 64 ; 64바이트짜리 빈 공간 (초기값 없음)
```

## 4. 빅 엔디안 vs 리틀 엔디안

**엔디안(Endian)** 은 **"메모리에 데이터를 저장할 때, 바이트 순서를 어떻게 할 것인가"** 를 정하는 규칙이다.

### 4-1. 리틀 엔디안 (Little Endian)

- **"작은 게 먼저 저장"** 된다.
- 숫자의 **가장 하위 바이트(Least Significant Byte)** 가 먼저 온다.
- **x86, x86-64 (Windows PC)** 는 리틀 엔디안 방식을 사용한다.

**예시**

32bit 숫자 0x12345678을 저장한다고 하면:

| 주소 | 값 |
| --- | --- |
| 0x00 | 0x78 |
| 0x01 | 0x56 |
| 0x02 | 0x34 |
| 0x03 | 0x12 |

**※ 가장 오른쪽(가장 작은 값)부터 거꾸로 저장!**

### 4-2. 빅 엔디안 (Big Endian)

- **"큰 게 먼저 저장"** 된다.
- 숫자의 **가장 상위 바이트(Most Significant Byte)** 가 먼저 온다.
- 네트워크 통신 규약(Internet Protocol, TCP/IP) 등에서는 빅 엔디안을 사용한다.

**예시**

32bit 숫자 0x12345678을 저장하면:

| 주소 | 값 |
| --- | --- |
| 0x00 | 0x12 |
| 0x01 | 0x34 |
| 0x02 | 0x56 |
| 0x03 | 0x78 |

**※ 자연스럽게 왼쪽에서 오른쪽으로 읽는 느낌!**

### 4-3. 리틀 vs 빅 간단 비교

| 구분 | 리틀엔디안 | 빅엔디안 |
| --- | --- | --- |
| 저장 순서 | 가장 작은 바이트 → 가장 큰 바이트 | 가장 큰 바이트 → 가장 작은 바이트 |
| 사용 예시 | x86 CPU (PC), ARM(선택가능) | 네트워크 프로토콜, 일부 ARM 장치 |
| 메모리 디버깅할 때 | 값을 거꾸로 읽어야 함 | 값을 순서대로 읽음 |

### 4-4. 한 번 더 비교

리틀엔디안:

0x12345678  →  메모리: 78 56 34 12

빅엔디안:

0x12345678  →  메모리: 12 34 56 78

### 4-5. 요약 한방

- 어셈블리어에서는 **`db`, `dw`, `dd`, `dq`** 같은 지시어로 변수를 메모리에 선언한다.
- **리틀엔디안**은 작은 바이트부터 저장하는 방식, **빅엔디안**은 큰 바이트부터 저장하는 방식이다.
- Windows PC는 기본적으로 **리틀엔디안**이다.
- 스택에 저장할 때도 리틀엔디안이 적용돼서, push한 값도 거꾸로 쌓인다.
- C언어나 어셈블리 디버깅할 때 리틀엔디안/빅엔디안 이해 못하면 메모리 값 해석을 절대 못한다.

<br/>
다음 편 :  
assembly **기본 명령어부터 익히기**