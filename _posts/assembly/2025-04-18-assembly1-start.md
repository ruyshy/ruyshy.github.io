---
title: "Assembly Start"
date: 2025-04-18
tags: [nasm, assembly]
---

assembly#1

시작하기 앞 서, 학습할 사이트 목록 입니다.

드림 해커 : https://dreamhack.io/ 

CrackMe : https://crackmy.app/

# **어셈블리(Assembly)란?**

어셈블리어는 사람이 읽을 수 있는 저수준 언어로, CPU가 실제로 이해하는 기계어(machine code)와 1:1로 대응됨. 쉽게 말하면, CPU와 직접 대화하기 직전 단계라고 볼 수 있음.

한 줄로 요약하면 "CPU가 이해할 수 있는 인간 최저 레벨 언어” (C보다 훨씬 더 하드웨어에 가깝다.)

## **Assembly에서 필수로 알아야 할 개념**

| 개념 | 설명 |
| --- | --- |
| 레지스터(Register) | CPU 안에 있는 초고속 저장소 (eax, ebx, ecx, edx 같은 것) |
| 스택(Stack) | 함수 호출할 때 사용하는 메모리 공간 (push/pop) |
| 메모리 주소(Address) | 직접 RAM의 위치를 다룬다 |
| 명령어(Instruction) | `mov`, `add`, `sub`, `jmp` 같은 한 줄짜리 CPU 명령 |
| 플래그(Flag) | 연산 결과를 저장하는 상태 비트 (Zero Flag, Carry Flag 등) |

## **공부 순서 추천**

- **레지스터랑 메모리 구조 이해**
    
    (eax, esp, ebp 같은 거 감 잡기)
    
- **기본 명령어부터 익히기**
    
    (mov, add, sub, cmp, jmp, call, ret)
    
- **함수 호출 규칙(Call Convention)**
    
    (stdcall, cdecl 이런 거)
    
- **스택과 함수 호출 분석**
    
    (push, pop으로 스택 프레임 조작하는 것 보기)
    
- **조건 분기(Conditional Jump)**
    
    (cmp, je, jne, jg, jl 등 분기 흐름 익히기)
    
- **간단한 프로그램 작성**
    
    (Hello World 출력 Assembly 버전)
    
- **디버거로 어셈블리 흐름 읽는 연습**
    
    (x64dbg로 한 줄 한 줄 따라가며 이해)
    

# **1. 레지스터랑 메모리 구조 이해**

## **레지스터(Register)란?**

- CPU 안에 있는 **작고 빠른 기억장치**.
- **변수 같은 거 저장**하는 초고속 칸이라고 생각하면 됨.

## **레지스터의 전체 분류 (x86-64 기준)**

| 분류 | 예시 | 설명 |
| --- | --- | --- |
| **일반 목적 레지스터 (GPR)** | RAX, RBX, RCX, ... | 연산, 데이터 저장, 함수 인자 전달 |
| **세그먼트 레지스터** | CS, DS, SS, ES, FS, GS | 메모리 세그먼트 구분 |
| **플래그 레지스터 (FLAGS/RFLAGS)** | EFLAGS, RFLAGS | 조건 분기, 연산 결과 상태 저장 |
| **포인터/인덱스 레지스터** | RIP, RSP, RBP, RSI, RDI | 명령어 포인터, 스택, 베이스, 인덱싱 |
| **제어 레지스터 (CRx)** | CR0, CR2, CR3, CR4 | 페이지 테이블, 보호모드 등 제어 |
| **디버그 레지스터** | DR0–DR7 | 브레이크포인트 설정 등에 사용 |

대부분 실무에서 GPR, FLAGS, 세그먼트 레지스터까지 알면 충분

## **32bit 레지스터 (x86 기준)**

| 레지스터 | 역할 |
| --- | --- |
| **EAX** | 연산 결과 저장 (주로 사용) |
| **EBX** | 데이터 베이스 역할 (서브 저장소) |
| **ECX** | 루프 카운터 (반복문 돌릴 때) |
| **EDX** | 입출력 연산 결과 저장 (EAX랑 비슷하지만 구분) |
| **ESI** | 소스 인덱스 (메모리 복사 같은 작업할 때) |
| **EDI** | 목적지 인덱스 (메모리 복사 목적지) |
| **ESP** | 스택 포인터 (현재 스택 꼭대기 가리킴) |
| **EBP** | 베이스 포인터 (함수 스택 프레임 관리) |
| **EIP** | 다음 실행할 명령어 주소 (Instruction Pointer) |

참고: 64bit는 EAX → RAX 처럼 "R" 붙는다 (RAX, RBX, ...)

## **64bit 레지스터**

| 레지스터 | 설명 |
| --- | --- |
| **RAX** | 연산 결과 저장 (64bit) |
| **RBX** | 데이터 저장용 (서브 저장소) |
| **RCX** | 루프 카운터 |
| **RDX** | 입출력 결과 저장 |
| **RSI** | 소스 인덱스 |
| **RDI** | 목적지 인덱스 |
| **RSP** | 스택 포인터 (stack pointer) |
| **RBP** | 베이스 포인터 (base pointer) |
| **RIP** | 명령어 포인터 (instruction pointer) |

## **세그먼트 레지스터 (Segment Registers)**

| 레지스터 | 설명 |
| --- | --- |
| **CS** | Code Segment: 명령어(코드)가 들어있는 영역 |
| **DS** | Data Segment: 일반 데이터가 들어있는 영역 |
| **SS** | Stack Segment: 스택 데이터가 들어있는 영역 |
| **ES/FS/GS** | 확장 세그먼트: 특수 목적 (스레드 로컬 등) |

중요한 사실:

> 64bit에서는 대부분 세그먼트 의미가 무시되거나 고정됨. 예를 들어:
> 
> - CS, DS, SS 같은 건 거의 고정값으로 유지되고
> - FS, GS만 스레드 로컬 데이터(TIB/TEB 접근)처럼 제한적으로 사용돼.

즉, 64bit에서는 세그먼트 레지스터 사용 거의 안 한다. 예외적으로 FS/GS는 구조체 접근할 때 쓰기도 함 (예: gs:[0x30] → PEB)

## **플래그 레지스터 (RFLAGS / EFLAGS)**

| 플래그 이름 | 설명 |
| --- | --- |
| **ZF (Zero Flag)** | 연산 결과가 0이면 설정됨 |
| **CF (Carry Flag)** | 자리 올림 발생 시 설정됨 |
| **SF (Sign Flag)** | 부호 비트 (음수면 1) |
| **OF (Overflow Flag)** | 부호 있는 오버플로우 발생 시 설정됨 |
| **PF (Parity Flag)** | 결과의 1 비트 개수가 짝수면 설정됨 |
| **AF (Auxiliary Carry)** | BCD 연산 시 사용됨 |

cmp, test 같은 명령어는 → 내부적으로 연산 후 플래그 레지스터를 변경하고 → je, jne, jg, jl 같은 조건 분기 명령어에서 → 플래그 값을 참조해서 분기한다.

예시:

```nasm
mov rax, 5
cmp rax, 5     ; ZF = 1
je  equal_label ; ZF가 1이면 점프함 (==)

cmp rax, 3     ; ZF = 0, SF = 0
jg  greater_label ; rax > 3 → 점프

```

플래그가 이렇게 연산 결과를 기억하고, 조건 분기를 가능하게 만들어주는 핵심 역할을 한다.

## **레지스터 요약**

| 분류 | 레지스터 | 설명 |
| --- | --- | --- |
| **일반 목적** | RAX~R15 | 데이터 저장/연산 |
| **세그먼트** | CS, DS, SS, FS, GS | 메모리 세그먼트 (64bit에선 거의 무시됨) |
| **플래그** | RFLAGS | 연산 결과 상태 저장 (분기 판단용) |

## **암기 포인트**

- **64bit에서는 세그먼트 레지스터 거의 안 씀**
- **플래그 레지스터는 조건 분기에 핵심**
- **일반 레지스터만 쓰는 게 거의 대부분** (RAX, RCX, RSI, ...)

## **RAX, EAX, AX, AH, AL 구조**

```scss
RAX  (64bit)
 └── EAX  (하위 32bit)
      └── AX   (하위 16bit)
           ├── AH (상위 8bit)
           └── AL (하위 8bit)

```

32bit에서는 EAX, EBX, 64bit는 앞에 "R" 붙고 64bit 크기로 바뀐다. 추가로: **r8 ~ r15** 라는 새로운 레지스터들도 생겼음. → 64bit에서는 레지스터가 더 많음 (덕분에 더 자유롭게 코딩 가능)

**RAX는 EAX를 포함하고, EAX는 AX를 포함하고, AX는 AH + AL로 나뉜다.**

{% include post-image.html name="image1.png" alt="image1" %}

- *EAX/RAX (Accumulator Register, 누산기 레지스터)**산술, 논리 연산을 담당하는 레지스터로, 함수의 반환 값이 이 레지스터에 저장된다.
    - **EAX 레지스터의 종류**
    - RAX: 64비트 (x86-64 아키텍처에서 확장된 EAX)
    - EAX: 32비트 누산기 레지스터
    - AX: 16비트의 EAX 레지스터 하위 부분
    - AH: AX의 상위 8비트
    - AL: AX의 하위 8비트

- *EBX/RBX (Base Register, 베이스 레지스터)**메모리 주소를 저장하기 위해 사용되는 레지스터.종종 배열이나 문자열과 같은 데이터 구조에 접근하기 위한 기준 포인터로 사용된다.
    - **EBX 레지스터의 종류**
    - RBX: 64비트 (x86-64 아키텍처에서 확장된 EBX)
    - EBX: 32비트 베이스 레지스터
    - BX: 16비트의 EBX 레지스터 하위 부분
    - BH: BX의 상위 8비트
    - BL: BX의 하위 8비트

- *ECX/RCX (Count Register, 카운트 레지스터)**반복 작업에서 카운터 역할을 수행하는 레지스터이다.loop 명령어 사용 시 레지스터의 값을 하나씩 감소 시키며, 0이 될 때 까지 반복 작업을 수행한다.
    - **ECX 레지스터의 종류**
    - RCX: 64비트 (x86-64 아키텍처에서 확장된 ECX)
    - ECX: 32비트 카운트 레지스터
    - CX: 16비트의 ECX 레지스터 하위 부분
    - CH: CX의 상위 8비트
    - CL: CX의 하위 8비트

- *EDX/RDX (Data Register, 데이터 레지스터)**EAX 레지스터와 함께 사용하여 큰 수를 연산을 하거나, 그 결과를 저장할 수 있는 레지스터이다.64bit 더블 워드 연산을 수행할 때에도 사용 가능하다. (div, mul)
    - **EDX 레지스터의 종류**
    - RDX: 64비트 (x86-64 아키텍처에서 확장된 EDX)
    - EDX: 32비트 데이터 레지스터
    - DX: 16비트의 EDX 레지스터 하위 부분
    - DH: DX의 상위 8비트
    - DL: DX의 하위 8비트

- *ESI/RSI (Source Index, 소스 인덱스 레지스터)**데이터 복사, 문자열 연산, 입력/출력 처리 등의 작업에서 소스 데이터의 주소를 가리키는 데 사용된다.
    - **ESI 레지스터의 종류**
    - RSI: 64비트 (x86-64 아키텍처에서 확장된 ESI)
    - ESI: 32비트 소스 인덱스 레지스터
    - SI: 16비트의 ESI 레지스터 하위 부분

- *EDI/RDI (Destination Index, 목적지 인덱스 레지스터)**데이터 복사, 문자열 처리, 배열 조작 등의 작업에서 목적지 데이터의 메모리 주소를 가리키는데 사용된다.
    - **EDI 레지스터의 종류**
    - RDI: 64비트 (x86-64 아키텍처에서 확장된 EDI)
    - EDI: 32비트 목적지 인덱스 레지스터
    - DI: 16비트의 EDI 레지스터 하위 부분

- *ESP/RSP (Stack Pointer, 스택 포인터 레지스터)**프로그램의 스택 메모리 내에서, 현재 스택 최상단 주소를 저장하는 레지스터이다.함수 호출, 지역 변수 관리, 함수 내 데이터 저장 및 복구 등의 작업에서 필수적으로 사용된다.
    - **ESP 레지스터의 종류**
    - RSP: 64비트 (x86-64 아키텍처에서 확장된 ESP)
    - ESP: 32비트 스택 포인터 레지스터.
    - SP: 16비트의 ESP 레지스터 하위 부분.

- *EBP/RBP (Base Pointer, 베이스 포인터 레지스터)**함수 내의 지역 변수와 인자에 일관되고, 쉽게 접근하기 위해 사용되는 포인터 역할 레지스터이다.스택 내에서 접근할 부분의 메모리 주소를 저장한다.
    - **EBP 레지스터의 종류**
    - RBP: 64비트 (x86-64 아키텍처에서 확장된 EBP).
    - EBP: 32비트 베이스 포인터 레지스터.
    - BP: 16비트의 EBP 레지스터 하위 부분.

- *EIP/RIP (Instruction Pointer, 명령 포인터)**다음에 실행될 명령의 메모리 주소를 저장한다.
    - **EIP 레지스터의 종류**
    - RIP: 64비트 (x86-64 아키텍처)
    - EIP: 32비트

## **Windows 64bit Assembly 기본 구조**

> 윈도우에서는 리눅스처럼 syscall 직접 안 씀.
> 
> 
> ➔ 대신, **Windows API**를 "함수 호출" 방식으로 사용.
> 

**예시:**

- `MessageBoxA`
- `ExitProcess`
- `WriteFile`
- 이런 윈도우 기본 함수들을 호출하는 식!

## **Windows 64bit 레지스터 호출 규약 (중요)**

Windows 64bit는 호출 규칙이 정해져 있음: (**Windows x64 Calling Convention**)

| 순서 | 레지스터 | 설명 |
| --- | --- | --- |
| 1 | RCX | 첫 번째 인자 |
| 2 | RDX | 두 번째 인자 |
| 3 | R8 | 세 번째 인자 |
| 4 | R9 | 네 번째 인자 |
| 이후 | 스택(Stack) | 다섯 번째 인자부터는 스택에 저장 |

즉, 함수 부를 때 **인자(arguments)는 레지스터에 순서대로 넣는다!**

## **함수 호출할 때 필요한 기본**

- 함수 호출 전 인자를 RCX, RDX, R8, R9에 셋팅
- 호출할 때 `call 함수이름`
- 스택은 항상 **16바이트 정렬** 되어야 함 (중요!)

> 왜 16바이트 정렬? ➔ 성능 최적화 + AVX 같은 명령어 호환성 때문
> 

## **메모리 구조 이해**

{% include post-image.html name="image2.png" alt="image2" %}

| 영역 | 설명 |
| --- | --- |
| **Text (Code) 영역** | 프로그램 코드 저장 (명령어들) |
| **Data 영역** | 전역 변수 저장 |
| **BSS 영역** | 초기화 안 된 전역 변수 저장 |
| **Heap 영역** | 동적 할당 (new/malloc) |
| **Stack 영역** | 함수 호출, 지역변수 저장, 복귀 주소 저장 |

**Stack**이 특히 중요

- 함수 부를 때마다 스택 위에 "새로운 공간"이 만들어지고
- 함수 끝나면 그 공간이 "자동으로 사라짐".

```
1. 코드(Code) 영역메모리의 코드(Code) 영역은 실행할 프로그램의 코드가 저장되는 영역으로 텍스트 영역이라고도 부른다. Hex파일이나 BIN 파일 메모리이다. CPU는 코드 영역에 저장된 명령어를 하나씩 가져가서 처리하게 되며 컴파일 타임에 결정되고 중간에 코드를 바꿀 수 없게 Read-Only로 지정되어 있다.

2. 데이터(Data) 영역메모리의 데이터(Data) 영역은 프로그램의 전역 변수(global), 정적(static) 변수, 배열(array), 구조체(structure)가 저장되는 영역이다. 초기화된 데이터는 data영역에 저장되며, 초기화되지 않는 데이터는 BSS(Block Stated Symbol) 영역에 저장된다. 이 영역은 실행 도중에 전역 변수가 변경될 수도 있으니 Read-Write로 지정되어 있다. 프로그램의 시작과 함께 할당되고, 프로그램 종료 시 소멸된다.

3. 힙(Heap) 영역메모리의 힙(Heap) 영역은 사용자가 집접 관리할 수 있는 '그기고 해야만 하는' 메모리 영역으로 사용자에 의해 메모리 공간이 동적으로 할당되고 해제된다. 힙 영역은 메모리의 낮은 주소에서 높은 주소의 방향으로 할당된다.

4. 스택(Stack) 영역메모리의 스택(Stack) 영역은 함수의 호출과 관계되는 지역 변수와 매개변수가 저장되는 영역으로  함수의 호출과 함께 할당되며, 함수의 호출이 완료되면 소멸된다. 이렇게 스택영역에 저장되는 함수의 호출 정보를 스택 프레임이라고 한다. 스택 영역은 푸시(push) 동작으로 데이터를 저장하고 , 팝(pop) 동작으로 데이터를 인출한다. 이러한 스택은 후입선출(LIFO, Last-In First-Out) 방식에 따라 동작하므로, 가장 늦게 저장된 데이터가 가장 먼저 인출된다. 스택 영역은 메모리의 높은 주소에서 낮은 주소의 방향으로 할당된다.

```

## **64bit 메모리 구조**

64bit는 메모리 주소 자체가 64bit.

(= 2의 64승 만큼 메모리 접근할 수 있음. **거의 무한대**)

나머지 구조는 비슷하지만:

- **스택(Stack)** 여전히 사용
- **힙(Heap)** 여전히 malloc/new로 동적 할당
- **데이터 영역(Data)** 여전히 전역 변수 저장

**다만!** 64bit에서는 스택 정렬(16바이트 alignment)이 필수. (뒤에 함수 호출할 때 배울 예정)

## **레지스터와 메모리 관계 요약**

- 레지스터는 **초고속 임시 저장소** (작고 빠름)
- 메모리는 **크고 느림** (하지만 양은 많음)
- 속도: 레지스터 >> 캐시 >> 메모리(RAM)

그래서 Assembly 코드는 **"레지스터를 최대한 많이 쓰고"**, **"필요할 때만 메모리 접근"** 하려 함.

## **실행 흐름 예제**

```nasm
mov eax, 5      ; eax에 5 저장
mov ebx, 10     ; ebx에 10 저장
add eax, ebx    ; eax = eax + ebx (5 + 10 = 15)

```

실행 흐름:

- `eax = 5`
- `ebx = 10`
- `eax = eax + ebx` → 결과 15가 eax에 들어감

## **Windows 64bit Hello World Assembly 예제**

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

정리 포인트:

- API 부르기 전에 RCX, RDX, R8, R9 셋팅
- `sub rsp, 32`로 스택을 정렬
- 함수 끝나면 `add rsp, 32`로 스택 복구
- ExitProcess로 종료

## **운영체제 차이 요약**

| 구분 | 리눅스 | 윈도우 |
| --- | --- | --- |
| 호출 방식 | syscall 직접 호출 | Windows API 호출 |
| 시스템콜 번호 필요 | O | X |
| 인자 전달 방식 | 레지스터 + 스택 | RCX, RDX, R8, R9 순서 |
| 스택 정렬 | 16바이트 필수 아님 | 16바이트 필수 |

## **요약**

- Windows에서는 syscall 사용 안 함.
- 무조건 Windows API (`WriteFile`, `ExitProcess`, `GetStdHandle`, 등등) 호출하는 구조.
- 인자는 RCX, RDX, R8, R9에 순서대로 넣는다.
- 스택 16바이트 정렬 **필수**.