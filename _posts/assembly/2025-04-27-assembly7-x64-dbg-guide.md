---
title: "초보자를 위한 x64dbg 실습 흐름 가이드 - Windows 어셈블리 디버깅 입문"
description: "x64dbg로 Hello World C++ 프로그램을 디버깅하면서 EntryPoint, main 함수 추적, 메모리 검색(Az 기능)과 모듈 호출 분석 방법을 단계별 실습합니다."
date: 2025-04-27
tags: [x64dbg, 디버깅 실습, reversing, assembly, entrypoint 분석, 메모리 검색, 함수 추적]
---

`x64dbg`를 이용해 `Windows C++` 프로그램을 디버깅하는 실습을 진행합니다. `EntryPoint`(진입점) 분석, `main` 함수 추적, `Az` 메모리 문자열 검색, `operator<<` 호출 추적까지 단계별로 상세히 따라가는 `x64dbg` 초보자 가이드입니다.


## x64에서 실행해볼 예제

`Visual Studio 2015 C++`로 작성되어있습니다.

```cpp
#include <iostream>

int main()
{
	std::cout << "Hello World!" << std::endl;
	return 0;
}
```

빌드 환경 : `x64`, `Release`

파일 다운로드 링크 : [hello_world_x64.exe](https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.exe)

## X64dbg 예제 파일 실행

저희는 `x64` 기준으로 진행할 예정이니, `x64dbg`를 실행해줍니다.

1. `Menu` → `File` → `Open` 을 통해 실행할 예제파일을 선택해줍니다. 혹은, 실행할 예제 파일을 `x64dbg` 창에 드래그하여 열어줍니다.
    
{& img "x64dbg_hello_world_open.png","x64dbg 프로그램 실행화면" &}
    
2. 열어준 직 후, 타이틀을 확인해보면 `모듈:ntdll.dll` 을 확인할 수 있습니다.
일단 `ntdll.dll` 시스템 중단점에서 멈춘걸 풀어줘야하니 설정→환경설정에 들어가 줍니다.
    
{% img "x64dbg_setting.png", "x64dbg 설정 화면" %}
    
1. 지금 시스템 중단점에 체크 되어있는 부분을 해제해줘야 합니다. 체크를 해제 하고 저장을 눌러줍니다.
그 이후, 다시 시작을 눌러 재실행을 해줍시다. 그렇게 재실행을 하게되면 시작지점에서 멈추게 됩니다.
    
{% img "xdbg_hello_world_entry_point.png", "x64dbg entry point 화면" %}
    
1.  이제 재실행을 해본 결과 `entry point` 부분에서 디버깅이 된 것을 확인해 볼 수 있습니다.
2. 프로그램의 `main` 함수를 바로 실행하는게 아닌, `main` 함수 실행을 위한 코드를 컴파일러가 `entry point`에 넣어놨기 때문이다. (현재 `EntryPoint`에서 `CRT` 초기화 루틴(`mainCRTStartup`)에 있음)

### EntryPoint

**`EntryPoint = EXE가 처음으로 실행하는 어셈블리 주소`**

- **EntryPoint**는 `OS(Windows)`가 프로그램을 실행할 때 가장 먼저 점프하는 코드 지점이다.
- **바로 main() 함수로 가지 않는다!**
- 대신 C 런타임(CRT)을 초기화하는 코드부터 실행된다.
    - 예: 메모리 초기화, 전역 변수 세팅, 표준 입출력 스트림 설정 등.
- 이 초기화가 끝난 다음에야 비로소 `main()` 함수가 호출된다.

<br/>

## x64dbg에서 main 함수를 찾아보자.

### main 함수를 찾는 전략

```cpp
EntryPoint (ex: _startCRTStartup)
    ↓
crt0Startup
    ↓
WinMainCRTStartup
    ↓
mainCRTStartup
    ↓
main() → main 코드
```

즉, **CRT 스타트업 코드**를 거쳐서 `main()` 함수로 진입!

#### mainCRTStartup 설명

> `mainCRTStartup`은 실제 사용자 코드(`main`)를 호출하기 전에, `C` 런타임 초기화 작업을 해주는 함수입니다. 예를 들어, 전역 객체 초기화, 입출력 스트림 설정 등을 담당합니다.
> 

### 이제 해야 할 것

`mainCRTStartup` → 내부를 쭉 따라가야 **네 `main()`** 함수 호출 지점을 찾을 수 있다.

### 내려가면서 찾아보기

#### 1. 현재 위치에서 **F8** 몇 번 눌러가면서 내려가보자.

- **F8**: `"Step Over"` = 한 줄 한 줄 실행하면서 흐름 보기
- 지금 코드를 보면 `sub rsp, 28h` 이런거 나오는데, 계속 F8 누르면…

#### 2. `call` 명령어 만나면

- 예를 들어 `call qword ptr ds:[주소]` 나오는 부분
- 그럼 **그 call을 "F7" (Step Into)** 로 따라 들어가!

실습 전 **Step Over (F8) / Step Into (F7)** 설명

| 기능 | 단축키 | 설명 |
| --- | --- | --- |
| `Step Over` | F8 | 함수 호출은 건너뛰고 다음 명령어로 이동 |
| `Step Into` | F7 | 함수 호출 안으로 직접 들어가기 |

{% img "xdbg64_hello_world_main_find.png", "x64dbg main함수 찾기" %}

### x64dbg Az로 문자열 검색해서 main 찾기

{% img "x64dbg_Az.png", "x64dbg Az" %}

위 빨간색 박스로 표시된 `Az` 버튼을 클릭하여 위와 같은 화면으로 이동합니다.

`"Hello World!"` 문자열이 표시된 `0x00007FF640E6111A` 주소를 클릭하면, 해당 문자열이 사용되는 코드 위치로 이동할 수 있습니다.

그 후,

`00007FF640E61126 | FF15 7C1F0000 | call qword ptr ds:[<public: __int64 __c |`

명령어를 실행해보면, 실제로 cmd 창에 `"Hello World!"` 문자열이 출력되는 것을 확인할 수 있습니다.

{% img "cmd_result.png", "cmd result" %}

이를 통해, 프로그램의 `main` 함수는 다음 범위에 걸쳐 있다는 것을 알 수 있습니다:

- 시작 주소: `00007FF640E61000 | 48:83EC 28 | sub rsp,28 | main.cpp:4`
- 종료 주소: `00007FF640E611D8 | C3 | ret`

즉, `0x00007FF640E61000`부터 `0x00007FF640E611D8`까지가 `main` 함수 코드 블록임을 확인할 수 있습니다.

### X64 모듈간 호출 찾기로 main 찾기

{% img "x64_module_find.png", "x64dbg 모듈간 호출 찾기" %}

위 빨간색 박스로 표시된 `모듈간 호출 찾기` 버튼을 클릭하여 위와 같은 화면으로 이동합니다.

`std::cout`은 보통 **operator<<** (스트림 연산자) 호출을 통해 사용.

그래서 cout 그 자체가 아니라, **`operator<<(std::ostream&, const char*)`** 같은 오버로드 함수를 호출하는 구조.

**즉**,
- `cout` 변수를 찾는 게 아니라
- `cout`이 호출하는 함수 (`operator<<`) 를 찾고 →
- **그 operator<< 을 누가 호출했는지 추적**해야 **main**을 찾을 수 있음.

- 오른쪽에서 **`std::operator<<` 관련 함수**를 찾는다.
    - (`<<` 오버로딩 함수가 보일거임)
    - 예를 들면 이름이 대충 `basic_ostream<char, char_traits<char>>::operator<<` 이런 거.
- 그 `operator<<`을 **왼쪽 창**에서 보면
    - **누가 이 함수를 call했는지** 호출자(Callers)가 보여.
- 그 호출자 중에
    - 만약 **`main` 근처 주소**(`0x7FF64...`)가 있으면
    - 그게 네가 찾는 **main 함수 내부 호출**이다.

## 구체적 흐름

1. 오른쪽(피호출자 목록)에서
    - `operator<<` 함수(스트림 출력 연산자)를 하나 클릭
2. 왼쪽(호출자 목록)을 본다
    - 호출 주소 `00007FF640E6101A` | FF15 68200000            | call qword ptr ds:[<public: class std:: | 를 확인
3. 주소가 `main` 함수 시작주소 범위(`0x7FF640E61000 ~ 0x7FF640E611D8`)에 있으면
    
    = 이 호출자는 `main` 함수 안의 코드다!
    

## 추가 내용

> 더 공부하고 싶다면: [x64dbg 공식 사이트](https://x64dbg.com/)
> 

{% cardlink https://x64dbg.com/ %}
