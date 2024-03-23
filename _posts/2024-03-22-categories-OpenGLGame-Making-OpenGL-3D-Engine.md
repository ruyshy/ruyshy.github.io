---
layout: single
title:  "OpenGLGame: Making OpenGL 3D Engine"
permalink: /OpenGLGame/Making-OpenGL-3D-Engine
categories: OpenGLGame
typora-root-url: ../
tag: [C++, OpenGL, Game, OpenGLGame, OpenGL3D, Engine, Graphics]
toc: true
toc_sticky : true
author_profile: false
sidebar:
    nav: docs
---

# Making OpenGL 3D Engine





## OWindow.h
```c++
#pragma once
class OWindow
{
public:
	OWindow();
	~OWindow();

	void makeCurrentContext();
	void present(bool vsync);

private:
	void* m_handle = nullptr;
	void* m_context = nullptr;

};
```




## OWindow.cpp
```c++
#include <OGL3D/Window/OWindow.h>
#include <OGL3D/Game/OGame.h>
#include <glad/glad_wgl.h>
#include <glad/glad.h>
#include <Windows.h>
#include <assert.h>

LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg)
	{
	case WM_DESTROY:
	{
		OWindow* window = (OWindow*)GetWindowLongPtr(hWnd, GWLP_USERDATA);
		break;
	}
	case WM_CLOSE:
	{
		PostQuitMessage(0);
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
	wc.style = CS_OWNDC;

	auto classId = RegisterClassEx(&wc);
	assert(classId);
	
	RECT rc = { 0,0,1024,768 };
	AdjustWindowRect(&rc, WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU, false);
	
	m_handle = CreateWindowEx(NULL, MAKEINTATOM(classId), L"OpenGL 3D Game", WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU, CW_USEDEFAULT, CW_USEDEFAULT,
		rc.right - rc.left, rc.bottom - rc.top, NULL, NULL, NULL, NULL);
	
	assert(m_handle);
	
	SetWindowLongPtr((HWND)m_handle, GWLP_USERDATA, (LONG_PTR)this);
	
	ShowWindow((HWND)m_handle, SW_SHOW);
	UpdateWindow((HWND)m_handle);
	
	auto hDC = GetDC(HWND(m_handle));
	
	int pixelFormatAttributes[] = {
		WGL_DRAW_TO_WINDOW_ARB, GL_TRUE,
		WGL_SUPPORT_OPENGL_ARB, GL_TRUE,
		WGL_DOUBLE_BUFFER_ARB, GL_TRUE,
		WGL_ACCELERATION_ARB, WGL_FULL_ACCELERATION_ARB,
		WGL_PIXEL_TYPE_ARB, WGL_TYPE_RGBA_ARB,
		WGL_COLOR_BITS_ARB, 32,
		WGL_DEPTH_BITS_ARB, 24,
		WGL_STENCIL_BITS_ARB, 8,
		0
	};
	
	int pixelFormat = 0;
	UINT numFormats = 0;
	wglChoosePixelFormatARB(hDC, pixelFormatAttributes, nullptr, 1, &pixelFormat, &numFormats);
	assert(numFormats);
	
	PIXELFORMATDESCRIPTOR pixelFormatDesc = {};
	DescribePixelFormat(hDC, pixelFormat, sizeof(PIXELFORMATDESCRIPTOR), &pixelFormatDesc);
	SetPixelFormat(hDC, pixelFormat, &pixelFormatDesc);
	
	int openGLAttributes[] = {
		WGL_CONTEXT_MAJOR_VERSION_ARB, 4,
		WGL_CONTEXT_MINOR_VERSION_ARB, 6,
		WGL_CONTEXT_PROFILE_MASK_ARB, WGL_CONTEXT_CORE_PROFILE_BIT_ARB,
		0
	};
	
	m_context = wglCreateContextAttribsARB(hDC, 0, openGLAttributes);
	assert(m_context);

}

OWindow::~OWindow()
{
	wglDeleteContext(HGLRC(m_context));
	DestroyWindow(HWND(m_handle));
}
void OWindow::makeCurrentContext()
{
	wglMakeCurrent(GetDC(HWND(m_handle)), HGLRC(m_context));
}

void OWindow::present(bool vsync)
{
	wglSwapIntervalEXT(vsync);
	wglSwapLayerBuffers(GetDC(HWND(m_handle)), WGL_SWAP_MAIN_PLANE);
}
```



## OGraphicsEngien.h

```c++
#pragma once
#include <OGL3D/OPrerequisites.h>
#include <OGL3D/Math/OVec4.h>

class OGraphicsEngien
{
public:
	OGraphicsEngien();
	~OGraphicsEngien();

public:
	void clear(const OVec4& color);


};
```



## OGraphicsEngien.cpp

```c++
#include <OGL3D/Graphics/OGraphicsEngien.h>
#include <glad/glad_wgl.h>
#include <glad/glad.h>
#include <assert.h>
#include <OGL3D/Window/OWindow.h>
#include <stdexcept>

OGraphicsEngien::OGraphicsEngien()
{
    WNDCLASSEX windowClass = {};
    windowClass.style = CS_OWNDC;
    windowClass.lpfnWndProc = DefWindowProcA;
    windowClass.lpszClassName = L"OGL3DDummyWindow";
    windowClass.cbSize = sizeof(WNDCLASSEX);

    auto classId = RegisterClassEx(&windowClass);
    
    HWND dummyWindow = CreateWindowEx(
        0,
        MAKEINTATOM(classId),
        L"OGL3DDummyWindow",
        0,
        CW_USEDEFAULT,
        CW_USEDEFAULT,
        CW_USEDEFAULT,
        CW_USEDEFAULT,
        0,
        0,
        windowClass.hInstance,
        0);
    
    assert(dummyWindow);
    
    HDC dummyDC = GetDC(dummyWindow);
    
    PIXELFORMATDESCRIPTOR pfd = {};
    pfd.nSize = sizeof(pfd);
    pfd.nVersion = 1;
    pfd.iPixelType = PFD_TYPE_RGBA;
    pfd.dwFlags = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER;
    pfd.cColorBits = 32;
    pfd.cAlphaBits = 8;
    pfd.iLayerType = PFD_MAIN_PLANE;
    pfd.cDepthBits = 24;
    pfd.cStencilBits = 8;
    
    int pixelFormat = ChoosePixelFormat(dummyDC, &pfd);
    SetPixelFormat(dummyDC, pixelFormat, &pfd);



    HGLRC dummyContext = wglCreateContext(dummyDC);
    assert(dummyContext);
    
    bool res = wglMakeCurrent(dummyDC, dummyContext);
    assert(res);


    if (!gladLoadWGL(dummyDC))
        throw std::runtime_error("OGraphicsEngine - gladLoadWGL failed");
    
    if (!gladLoadGL())
        throw std::runtime_error("OGraphicsEngine - gladLoadGL failed");


    wglMakeCurrent(dummyDC, 0);
    wglDeleteContext(dummyContext);
    ReleaseDC(dummyWindow, dummyDC);
    DestroyWindow(dummyWindow);

}

OGraphicsEngien::~OGraphicsEngien()
{

}

void OGraphicsEngien::clear(const OVec4& color)
{
    glClearColor(color.x, color.y, color.z, color.w);
    glClear(GL_COLOR_BUFFER_BIT);
}
```



## OGame.h

```c++
#pragma once
#include <memory>

class OGraphicsEngien;
class OWindow;

class OGame
{
public:
	OGame();
	~OGame();

	virtual void onCreate();
	virtual void onUpdate();
	virtual void onQuit();
	
	void run();
	void quit();

protected:
	bool m_isRunning = true;
	std::unique_ptr<OGraphicsEngien> m_graphicsEngine;
	std::unique_ptr<OWindow> m_display;

};
```



## OGame.cpp

```c++
#include <OGL3D/Game/OGame.h>
#include <OGL3D/Graphics/OGraphicsEngien.h>
#include <OGL3D/Window/OWindow.h>
#include <Windows.h>

OGame::OGame()
{
	m_graphicsEngine = std::make_unique<OGraphicsEngien>();
	m_display = std::make_unique<OWindow>();

	m_display->makeCurrentContext();

}

OGame::~OGame()
{

}

void OGame::onCreate()
{
}

void OGame::onUpdate()
{
	m_graphicsEngine->clear(OVec4(1, 0, 0, 1));


	m_display->present(false);

}

void OGame::onQuit()
{

}

void OGame::run()
{
	onCreate();
	while (m_isRunning)
	{
		MSG msg = {};
		if (PeekMessage(&msg, HWND(), NULL, NULL, PM_REMOVE))
		{
			if (msg.message == WM_QUIT)
			{
				m_isRunning = false;
				continue;
			}
			else
			{
				TranslateMessage(&msg);
				DispatchMessage(&msg);
			}
		}

		onUpdate();
	}
	
	onQuit();

}

void OGame::quit()
{
	m_isRunning = false;
}
```



## main.cpp

```c++
#include <iostream>
#include <OGL3D/Game/OGame.h>

int main()
{
	try
	{
		OGame game;
		game.run();
	}
	catch (const std::exception& e)
	{
		std::cout << "Error: " << e.what() << std::endl;
		return -1;
	}

	return 0;

}
```

