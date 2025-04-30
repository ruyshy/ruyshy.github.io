---
title: "Disassembly란? 실행파일을 Assembly로 분석하는 방법"
description: "C++ 코드를 빌드한 실행파일(.exe)을 디스어셈블리하여 Assembly 코드로 분석하는 과정을 예제로 설명합니다. Visual Studio 설정, 스택 조작, 함수 호출 흐름을 x64 환경 기준으로 상세히 다룹니다."
date: 2025-04-29
categories: [reversing_engineering, assembly]
tags:
  [assembly, disassembly, x64dbg, VisualStudio, 어셈블리 분석, 리버스엔지니어링]
---

실행파일을 어셈블리 코드로 분석하고 싶다면 이 포스트를 참고하세요. **Disassembly 기본 개념**, **C++ → Assembly 흐름**, **Visual Studio로 디스어셈블리 실습**, **스택/레지스터 동작 구조**까지 예제를 통해 쉽게 정리합니다.

## DisAssembly 알아보기

- **Disassembly(디스어셈블리)**는

> **기계어(binary 실행 파일)**를 사람이 읽을 수 있는 **어셈블리어(assembly code)**로 다시 풀어보는 것
> 을 말함.

### 조금 더 풀어서 쉽게:

- 컴퓨터는 **0과 1**(바이너리, 기계어)만 이해함.
- 그런데 사람이 0과 1을 일일이 읽기는 불가능함.
- 그래서 사람이 "조금은 읽을 수 있게" **기계어 → 어셈블리어**로 변환해주는 과정이 **Disassembly**.

즉, **"실행파일(.exe) → Assembly 코드로 번역"** 하는 작업

## 왜 Disassembly가 필요할까?

- 우리가 작성한 **C++, Python, Java** 같은 코드는 컴파일되면 다 **기계어**로 변환됌.
- 그래서 "실제로 컴퓨터가 어떻게 동작하는지" 보려면 **Disassembly**를 통해 봐야 함.
- **리버스 엔지니어링**(Reverse Engineering, RE)에서는 소스코드 없이 프로그램을 분석해야 하잖아?
- 그때 **Disassembly**가 필수 도구가 되는 것.

## Disassembly와 관련된 예시

| 구분                      | 설명                                                   |
| ------------------------- | ------------------------------------------------------ |
| **Disassembler 프로그램** | IDA Pro, Ghidra, x64dbg, Visual Studio 등              |
| **주로 보는 것**          | 함수 구조, 조건 분기, 반복문, 메모리 접근, 시스템 호출 |
| **결국 목표**             | Assembly 코드를 읽어내서 프로그램 로직을 이해하는 것   |

## 그림으로 요약

```css
C++ 코드 (Human readable)
   ↓ 컴파일
실행파일(.exe, .dll) (Machine code)
   ↓ 디스어셈블리
Assembly 코드 (Human semi-readable)

```

## 한줄 정의

> Disassembly = 실행파일을 Assembly 코드로 변환해 읽는 것

**disassembly 첫 걸음인 만큼 최대한 간단한 구성으로 진행하겠습니다.**

## 1. C++ 아주 간단한 코드 작성

```cpp
#include <iostream>

int add(int a, int b)
{
	return a + b;
}

int main()
{
	int sum = add(10, 20);
	std::cout << "sum : " << sum << std::endl;
	return 0;
}

```

- `add` 함수는 그냥 두 숫자를 더하는 함수.
- `main`은 `add(10, 20)`을 호출하고 결과를 출력하는 코드.

## 2. Visual Studio 설정

**※ 꼭 이렇게 설정해줘야 함!**

- 빌드 모드: **Release**
- 플랫폼: **x64**
- 최적화: **끄기** (코드 최적화 안되게 하기 위해)

> (최적화가 켜져 있으면 Assembly 코드가 너무 이상해져서 초보자가 보기 힘들어짐.)

**최적화 끄는 방법:**

- 프로젝트 속성 → C/C++ → 최적화 → "최적화 안 함 (/Od)"

## 3. Breakpoint 걸고 디스어셈블리 보기

- `add` 함수 안 `return a + b;` 줄에 Breakpoint를 걸어.
- 디버깅(F5) 시작하고 Breakpoint에 걸리면,
- **오른쪽 클릭 → "Disassembly 보기"**.

### 3-1. 디스어셈블리 그림 추가 설명

{% img "visual_studio_assembly_code_release_debug_test.png","visual_studio_assembly_code_release_debug_test" %}

1. 10번째 줄 `int sum = add(10, 20);` 에 F9를 눌러 break point를 설정하거나 해당 10번째 줄 왼쪽을 클릭하여 break point 설정 후, F5로 디버깅 시작
2. 빨간색 박스 안에서 마우스 오른쪽 클릭 → Disassembly 보기 클릭

   {% img "visual_studio_assembly_code_release_disassembly.png","visual_studio_assembly_code_release_disassembly" %}

3. 위와 같이 디스어셈블리 창이 생기며, 위와 같은 과정을 거쳤을 때, 저와 비슷한 어셈블리어가 표시됩니다.

## 4. 나오는 Assembly (Disassembly) 예시

```nasm
int main()
{
00007FF6570B10D0 48 83 EC 38          sub         rsp,38h
	int sum = add(10, 20);
00007FF6570B10D4 BA 14 00 00 00       mov         edx,14h
00007FF6570B10D9 B9 0A 00 00 00       mov         ecx,0Ah
00007FF6570B10DE E8 CD FF FF FF       call        add (07FF6570B10B0h)
00007FF6570B10E3 89 44 24 20          mov         dword ptr [sum],eax
	std::cout << "sum : " << sum << std::endl;
00007FF6570B10E7 48 8D 15 A2 21 00 00 lea         rdx,[GS_ExceptionPointers+10h (07FF6570B3290h)]
00007FF6570B10EE 48 8B 0D AB 1F 00 00 mov         rcx,qword ptr [__imp_std::cout (07FF6570B30A0h)]
00007FF6570B10F5 E8 A6 02 00 00       call        std::operator<<<std::char_traits<char> > (07FF6570B13A0h)
00007FF6570B10FA 8B 54 24 20          mov         edx,dword ptr [sum]
00007FF6570B10FE 48 8B C8             mov         rcx,rax
00007FF6570B1101 FF 15 A1 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF6570B30A8h)]
00007FF6570B1107 48 8D 15 72 06 00 00 lea         rdx,[std::endl<char,std::char_traits<char> > (07FF6570B1780h)]
00007FF6570B110E 48 8B C8             mov         rcx,rax
00007FF6570B1111 FF 15 99 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF6570B30B0h)]
	return 0;
00007FF6570B1117 33 C0                xor         eax,eax
}
```

### 4-1. `main` 함수 시작

`00007FF6570B10D0 48 83 EC 38          sub         rsp,38h`

- `rsp`(스택 포인터)를 **38h(56 bytes)** 만큼 내림.
- **함수 호출 시 필요한 스택 공간 확보**하는 거야.
- (`sub rsp, xxx` 이거 무조건 함수 시작할 때 나옴.)

### 4-2. `int sum = add(10, 20);`

```nasm
00007FF6570B10D4 BA 14 00 00 00       mov         edx,14h   ; edx = 20
00007FF6570B10D9 B9 0A 00 00 00       mov         ecx,0Ah   ; ecx = 10
00007FF6570B10DE E8 CD FF FF FF       call        add (07FF6570B10B0h)
00007FF6570B10E3 89 44 24 20          mov         dword ptr [sum],eax
```

- `ecx = 10` (첫 번째 인자)
- `edx = 20` (두 번째 인자)
- `call add` : `add(int, int)` 호출 (ecx, edx를 인자로 넘김)
- `add` 함수 결과는 `eax`에 저장돼서, 스택에 저장.

> 64bit Window 에서는 인자 1, 2, 3, 4를 **rcx, rdx, r8, r9** 레지스터에 넣고 호출하는 규칙이 있어. (Microsoft x64 Calling Convention)

### 4-3. `std::cout << "sum : " << sum << std::endl;`

```nasm
00007FF6570B10E7 48 8D 15 A2 21 00 00 lea         rdx,[GS_ExceptionPointers+10h (07FF6570B3290h)]
00007FF6570B10EE 48 8B 0D AB 1F 00 00 mov         rcx,qword ptr [__imp_std::cout (07FF6570B30A0h)]
00007FF6570B10F5 E8 A6 02 00 00       call        std::operator<<<std::char_traits<char> > (07FF6570B13A0h)
```

- `rdx`에 문자열 주소를 담고
- `rcx`에 `std::cout` 객체 주소를 담고
- `call` 해서 `std::cout << "sum : "` 를 출력.

```nasm
00007FF6570B10FA 8B 54 24 20          mov         edx,dword ptr [sum]
00007FF6570B10FE 48 8B C8             mov         rcx,rax
00007FF6570B1101 FF 15 A1 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF6570B30A8h)]
```

- `sum` 값을 꺼내서(`edx`)
- 방금 출력했던 `cout` 스트림(`rcx`)에 이어서 `<< sum` 출력.

```nasm
00007FF6570B1107 48 8D 15 72 06 00 00 lea         rdx,[std::endl<char,std::char_traits<char> > (07FF6570B1780h)]
00007FF6570B110E 48 8B C8             mov         rcx,rax
00007FF6570B1111 FF 15 99 1F 00 00    call        qword ptr [__imp_std::basic_ostream<char,std::char_traits<char> >::operator<< (07FF6570B30B0h)]
```

- `std::endl`을 불러와서, `cout << std::endl` 호출 (줄바꿈)

### 4-4. `return 0;`

`00007FF6570B1117 33 C0                xor         eax,eax`

- `eax`를 0으로 만든다 (`return 0;`).

> xor eax, eax는 eax = 0을 만드는 최적화된 방법.

### 4-5. 요약

| C++ 코드                                     | Disassembly 역할                                 |
| -------------------------------------------- | ------------------------------------------------ |
| `int sum = add(10, 20);`                     | 인자 ecx/edx 설정 → add 호출 → 결과 eax 저장     |
| `std::cout << "sum : " << sum << std::endl;` | 문자열 주소, cout 스트림 준비 → 연속 call로 출력 |
| `return 0;`                                  | `eax`를 0으로 세팅                               |

### 4-6 핵심 포인트 복습

- `rcx`, `rdx` : 함수 인자 전달용
- `rax`, `eax` : 리턴값 저장
- `sub rsp, 38h` : 스택 공간 확보
- `xor eax, eax` : 빠르게 0 대입
- `lea` : 주소 계산
- `call` : 함수 호출

다음 편 : disassembly - 심화 학습편(`if`, `for`)
