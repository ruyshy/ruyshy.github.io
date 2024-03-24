---
layout: single
title:  "OpenGL: Making OpenGL Window"
permalink: /OpenGL/Making-OpenGL-Window
categories: OpenGL
typora-root-url: ../
tag: [C++, OpenGL, Game, OpenGL, OpenGL3D, Engine, Graphics]
toc: true
toc_sticky : true
author_profile: false
sidebar:
    nav: docs
---

# OpenGL Study



## OpenGL Making Window



## GLFW

<https://www.glfw.org/>

## GLAD

<https://glad.dav1d.de/>



## pch.h

```c++
#pragma once

#ifndef PCH_H
#define PCH_H

#include <iostream>
#include <fstream>
#include <sstream>
#include <functional>
#include <tchar.h>
#include <memory>
#include <string>
#include <vector>
#include <queue>
#include <array>
#include <list>
#include <set>
#include <map>
#include <algorithm>

#include <Windows.h>
#include <cstring>
#include <mmsystem.h>

#pragma comment(lib,"winmm.lib")

using namespace std;

#define WIN32_LEAN_AND_MEAN


// opengl
#pragma comment(lib, "OpenGL32.lib")
#pragma comment(lib, "glew32.lib")
#pragma comment(lib, "glfw3.lib")

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>

using namespace glm;

#endif // !PCH_H
```



## main.cpp

```c++
#include "pch.h"

int main()
{
	int majorVersion = 4;
	int minorVersion = 6;
	

// glfw 초기화
glfwInit();

// glfw 버전 4.6 
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
// 전체 기능 사용
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

// 윈도우 생성
GLFWwindow* window = glfwCreateWindow(800, 600, "openGL", NULL, NULL);
// 윈도우 생성 실패 시
if (window == NULL)
{
	std::cout << "Window Create Faied" << std::endl;
	glfwTerminate();
	return -1;
}
// 윈도우 Context 생성
glfwMakeContextCurrent(window);
// glad 로드
gladLoadGL();

// View port 설정
glViewport(0, 0, 800, 600);
// 색상 : r g b alpha
glClearColor(1, 0, 0, 1);
glClear(GL_COLOR_BUFFER_BIT);
// 백 버퍼
glfwSwapBuffers(window);
// 창 종료 되기 전까지 실행
while (!glfwWindowShouldClose(window))
{
	// 이벤트 처리 후 반환하는 함수 / 창, 입력 관련 이벤트 처리.
	glfwPollEvents();
}
// 윈도우창 파괴
glfwDestroyWindow(window);
glfwTerminate();
return 0;

}
```

