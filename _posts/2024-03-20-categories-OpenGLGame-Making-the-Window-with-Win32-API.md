---
layout: single
title:  "OpenGLGame: Making the Window with Win32 API"
permalink: /OpenGLGame/Making-the-Window-with-Win32-API
categories: OpenGLGame
typora-root-url: ../
tag: [C++, OpenGL, Game, OpenGLGame, OpenGL3D, Engine, Graphics]
toc: true
toc_sticky : true
author_profile: false
sidebar:
    nav: docs
---

# OpenGL Game Win32 API

IDE : Visual Studio 사용합니다

sequence language : c++

{% include video id="jHcz22MDPeE?si=Yx8YeQEwIu4I70w4" provider="youtube" %}



# Visual Studio New Project

<img src="/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/New Project-0.png" alt="New Project-0"  />

새 프로젝트 만들기를 눌러 다음으로 진행합니다.





![NewProject-1](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/NewProject-1.png)

시퀀스 언어는 C++ 입니다. 빈 프로젝트를 선택하고 다음으로 진행합니다.



![NewProject-2](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/NewProject-2.png)

여기서 사용자는 프로젝트 이름과 파일 위치를 설정합니다. 저는 OpenGLGame 으로 설정했습니다.



# Visual Studio Project Setting

![Project-screen-0](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-0.png)

![Project-screen-enlarge-0](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-enlarge-0.PNG)

저는 코드를 미리 짜고 복습하는 형식으로 진행 됩니다.

솔루션 탐색기 밑에 모든 파일 표시를 활성화 해줍니다, 이 기능을 선택하면 직접 폴더를 생성하고, 구조를 구성할 수 있습니다.

![Project-screen-enlarge-1](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-enlarge-1.PNG)

해당 사진에서 보이듯이 플랫폼 설정이 x64로 되어있는지 확인합니다.

![Project-screen-1](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-1.PNG)



저는 미리 코드를 생성 했기 때문에, 처음에 폴더를 다 생성해도 좋고 main.cpp가 들어가있는 Game 폴더를 먼저 생성해서 다음으로 진행합니다.



![Project-screen-2](/images/categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-2.png)

위와 같이 OpenGLGame Project를 우 클릭해서 추가 항목에 새 항목을 눌러 생성하거나 단축키 Ctrl+Shift+A를 눌러 새 항목을 생성 해줍니다.

# Code Contents

```c++
int main()
{

	return 0;
}
```



맨처음으로 만드는 코드는, 위 처럼 int main() 함수를 만듭니다, 아직 코드를 많이 작성하지 않았지만, 정상적으로 작동하는지 확인합니다.



![Project-screen-enlarge-2](/images/2024-03-20-categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-enlarge-2.PNG)

다음으로 OGL3D(OpenGL 3D Game)약자로 OGL3D폴더와 위와같이 폴더를 생성해주고 다음으로 진행합니다.



![Project-screen-3](/images/2024-03-20-categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-3.png)

이제 클래스를 추가할 수 있습니다. 우클릭을 해서 클래스를 눌러줍니다.



![Project-screen-4](/images/2024-03-20-categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-4.png)

위와 같이 클래스를 누르면 해당 창이 생깁니다. 클래스 이름은 OWindow 로 설정합니다.

*.h 파일은 include\Window 에 넣어주고 이동해주는 확인창에서 확인을 눌러줍니다.

*.cpp 파일은 source\Window에 이동해줍니다.





![Project-screen-enlarge-3](/images/2024-03-20-categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-enlarge-3.png)

위 작업을 진행한 다음, 프로젝트에 OpenGLGame 속성 창을 클릭합니다.



![Project-screen-enlarge-4](/images/2024-03-20-categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-enlarge-4.png)

해당 스크린샷 같이 창이 뜨고 VC++ 디렉터리에 포함 디렉터리를 눌러 오른쪽에 역삼각형을 눌러 편집을 누릅니다.





![Project-screen-enlarge-5](/images/2024-03-20-categories-OpenGLGame-Making-the-Window-with-Win32-API/Project-screen-enlarge-5.png)

위 사진과 같이 다음을 목록에 추가합니다.

OGL3D\include

OGL3D\source



## OWindow Class

### OWindow.h

<details>
<summary>toggle source code</summary>
<div markdown="1">
```c++
#pragma once
class OWindow
{
public:
	OWindow();
	~OWindow();

	void onDestroy();
	bool isClosed();
private:
	void* m_handle = nullptr;

};
```
</div>
</details>


### OWindow.cpp

<details>
<summary>toggle source code</summary>
<div markdown="1">

```c++
#include <OGL3D/Window/OWindow.h>
#include <Windows.h>
#include <assert.h>

LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg)
	{
	case WM_DESTROY:
	{
		OWindow* window = (OWindow*)GetWindowLongPtr(hWnd, GWLP_USERDATA);
		window->onDestroy();
		break;
	}

	default:
		return DefWindowProc(hWnd, msg, wParam, lParam);
	}
	return NULL;
}

OWindow::OWindow()
{
	WNDCLASSEX wc = {};
	wc.cbSize = sizeof(WNDCLASSEX);
	wc.lpszClassName = L"OGL3DWindow";
	wc.lpfnWndProc = &WndProc;

	assert(RegisterClassEx(&wc));

	RECT rc = { 0,0,1024,768 };
	AdjustWindowRect(&rc, WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU, false);

	m_handle = CreateWindowEx(NULL, L"OGL3DWindow", L"OpenGL 3D Game", WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU,
		CW_USEDEFAULT, CW_USEDEFAULT, rc.right - rc.left, rc.bottom - rc.top, NULL, NULL, NULL, NULL);
	
	assert(m_handle);

	SetWindowLongPtr((HWND)m_handle, GWLP_USERDATA, (LONG_PTR)this);

	ShowWindow((HWND)m_handle, SW_SHOW);
	UpdateWindow((HWND)m_handle);
}

OWindow::~OWindow()
{
	DestroyWindow((HWND)m_handle);
}

void OWindow::onDestroy()
{
	m_handle = nullptr;
}

bool OWindow::isClosed()
{
	return !m_handle;
}

```
</div>
</details>


위와 같이 포함 디렉터리 설정을 했다면

```c++
#include <OGL3D/Window/OWindow.h>
```

해당 지시문을 통해 OWindow.h을 불러올 수 있습니다.

```c++
#include <Windows.h>
```

위 header는 win32 함수가 정의된 헤더입니다.



 ```c++
 WNDCLASSEX wc = {};
 wc.cbSize = sizeof(WNDCLASSEX);
 wc.lpszClassName = L"OGL3DWindow";
 wc.lpfnWndProc = &WndProc;
 ```

WND Class 유형의 wc 변수를 생성합니다. 위와 같이 중괄호를 사용하여 초기화 하는 방식은 Uniform Initialization, List Initialization 이라고도 부르는 방법이며, 값을 비워둘 경우 0으로 초기화 됩니다. (c++ 11부터 사용이 가능합니다.)

WNDCLASSEX 에는 구조체의 크기를 지정해주는 cbSize를 sizeof를 통해 크기를 정해줍니다.

lpszClassName 해당 변수는 윈도우 클래스의 이름을 지정해 줍니다.

lpfnWndProc 해당 변수는 윈도우 창 프로시저에 대한 포인터 입니다.



```c++
RegisterClassEx(&wc)
```

wc 변수의 주소를 전달하는 레지스터 클래스 and(&)연산자를 이용해 참조 해줍니다.

CreateWindow 또는 CreateWindowEx 함수에 대한 호출에서 후속 사용을 위해 창 클래스를 등록합니다.



```
#include <assert.h>
```

해당 해더를 이용해 assert 함수를 사용할 수 있습니다.

assert 함수에 전달된 값이 false 일 때, 프로그램을 중단할 수 있으며, 콘솔 프로그램(cmd)에도 중요한 정보를 제공하는 역활을 합니다.



```
assert(RegisterClassEx(&wc));
```

오류를 처리하는 간단한 방법입니다.



```c++
m_handle = CreateWindowEx(NULL, L"OGL3DWindow", L"OpenGL 3D Game", WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU,
	CW_USEDEFAULT, CW_USEDEFAULT, rc.right - rc.left, rc.bottom - rc.top, NULL, NULL, NULL, NULL);
```

해당 CreateWindowEx 함수를 사용해 창을 생성합니다.

첫번째 값은 확장 스타일을 전달해주지만 신경쓰지 않고 NULL 값을 지정해줍니다. 두번째값은 클래스 이름, 세번째 값은 윈도우 창의 타이틀, 네번째값은 윈도우 창 스타일을 지정해 줄 수 있으며, | 으로 여러 조합을 선택할 수 있습니다. 다섯번쨰와 여섯번째 paramater는 창의 x, y크기 설정 다음 나머지는 NULL값을 넣어줍니다.



```c++
RECT rc = { 0,0,1024,768 };
```

해당 변수로 윈도우 창의 크기를 지정해줍니다.

top, left, right, bottom

width = right - left

height = bottom - right

위와 같이 CreateWindowEx로 생성한 창의 핸들값을 m_handle에 저장합니다.



```c++
assert(m_handle);
```

해당 assert 함수에서 윈도우 창 생성을 실패하면 false를 반환합니다.



```c++
ShowWindow((HWND)m_handle, SW_SHOW);
```

ShowWindow 함수로 생성한 윈도우 창을 보여줍니다.



```c++
OWindow::~OWindow()
{
	DestroyWindow((HWND)m_handle);
}
```

OWindow 파괴자에서 해당 클래스가 메모리에서 삭제될 때, 윈도우 창도 같이 삭제하도록 DestroyWindow 함수를 사용합니다.



```c++
LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg)
	{
	case WM_DESTROY:
	{
		OWindow* window = (OWindow*)GetWindowLongPtr(hWnd, GWLP_USERDATA);
		window->onDestroy();
		break;
	}

default:
	return DefWindowProc(hWnd, msg, wParam, lParam);
}
return NULL;

}


```

WM_DESTROY 메세지를 받으면 onDestroy 함수로 윈도우 창을 종료시킨다.

default 에서는 기본 윈도우 프로시저를 반환한다.



## OGame Class

위에서 OWindow를 추가했던 것 처럼 OGame이라는 클래스를 생성하고, Game 폴더의 각각의 헤더 파일과 코드 파일을 이동해줍니다.



### OGame.h
<details>
<summary>toggle source code</summary>
<div markdown="1">
```c++
#pragma once
#include <memory>

class OWindow;
class OGame
{
public:
	OGame();
	~OGame();

void run();
void quit();

protected:
	bool m_isRunning = true;
	std::unique_ptr<OWindow> m_display;
};
```

```c++
#include <memory>
```
</div>
</details>

memory 헤더를 사용한 이유는 unique_ptr 스마트 포인터를 사용하기 위함.



### OGame.cpp
<details>
<summary>toggle source code</summary>
<div markdown="1">
```c++
#include <OGL3D/Game/OGame.h>
#include <OGL3D/Window/OWindow.h>
#include <Windows.h>

OGame::OGame()
{
	m_display = std::unique_ptr<OWindow>(new OWindow());
}

OGame::~OGame()
{

}

void OGame::run()
{
	MSG msg;
	while (m_isRunning && !m_display->isClosed())
	{
		if (PeekMessage(&msg, NULL, NULL, NULL, PM_REMOVE))
		{
			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}
		Sleep(1);
	}
}

void OGame::quit()
{
	m_isRunning = false;
}
```
</div>
</details>



```
OGame::OGame()
{
	m_display = std::unique_ptr<OWindow>(new OWindow());
}

OGame::~OGame()
{

}
```

m_dislpay를 unique_ptr 위처럼 생성하고 파괴자에는 넣지 않는다. 사용자가 delete를 입력해주지 않아도 자동으로 소멸하게 된다!



```c++
MSG msg;
while (m_isRunning && !m_display->isClosed())
{
	if (PeekMessage(&msg, NULL, NULL, NULL, PM_REMOVE))
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}
	Sleep(1);
}
```

이제 윈도우 창에서 생성된 다양한 메세지를 처리하기 위한 코드를 생성합니다.

x 버튼으로 윈도우 창을 종료하거나, 최대화 버튼을 눌러 창크기를 조절하는 메세지를 처리할 수 있습니다. 이러한 메세지를 처리하려면 PeekMessage 함수를 사용합니다.

TranslateMessage 함수는 키보드 드라버에서 ASCII 문자에 매핑되는 키에 대해서만 WM_CHAR 메세지를 생성합니다.

DispatchMessage 함수는 윈도우 창 프로시저에 메세지를 디스패치합니다. 일반적으로 GetMessage 함수에서 검색한 메세지를 디스패치하는 데 사용합니다.



Sleep는 1mc 대기하는 용도로 사용했습니다.



### main.cpp

```c++
#include <iostream>
#include <OGL3D/Game/OGame.h>

int main()
{
	OGame game;
	game.run();
	return 0;
}
```

코드를 실행하는 부분에서 game에 run 함수를 실행하고, 윈도우 창을 파괴하기 전까지 run 안에있는 while문을 실행합니다.
