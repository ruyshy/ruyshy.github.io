---
layout: single
title:  "OpenGL: Triangle Indices2"
permalink: /OpenGL/Triangle-Indices2
categories: OpenGL
typora-root-url: ../
tag: [C++, OpenGL, Game, OpenGL, OpenGL3D, Engine, Graphics]
toc: true
toc_sticky : true
author_profile: false
published: true
sidebar:
    nav: docs
---





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
#include<cerrno>

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

//#include <ft2build.h>
//#include FT_FREETYPE_H  
//#pragma comment(lib,"freetype.lib")
//
////fmod
//#include "fmod.hpp"
//#include <conio.h>
//
//#pragma comment(lib, "fmod_vc.lib")
//
//// user utill
//#include "delete_macro.h"

#endif // !PCH_H


```



이전에 작업 하던 VAO, VBO, EBO 와 Shader를 활용했지만 모든 코드가 main.cpp에 작성한걸 클래스로 만들어 분리



## VBO.h

```c++
#pragma once

#ifndef VBO_CLASS_H
#define VBO_CLASS_H

class VBO
{
public:
	// 버텍스 버퍼 객체(Vertex Buffer Object)의 참조 ID
	GLuint ID;
	// 버텍스를 연결하여 버텍스 버퍼 객체를 생성하는 생성자
	VBO(GLfloat* vertices, GLsizeiptr size);

	// VBO를 바인드하는 함수
	void Bind();
	// VBO의 바인딩을 해제하는 함수
	void Unbind();
	// VBO를 삭제하는 함수
	void Delete();

};

#endif
```



## VBO.cpp

```c++
#include "pch.h"
#include "VBO.h"

// 생성자: 버텍스 버퍼 객체(Vertex Buffer Object)를 생성하고 버텍스 데이터와 연결
VBO::VBO(GLfloat* vertices, GLsizeiptr size)
{
	glGenBuffers(1, &ID);	// OpenGL에 버퍼 객체를 생성하라고 요청
	glBindBuffer(GL_ARRAY_BUFFER, ID);	// 생성된 버퍼를 GL_ARRAY_BUFFER로 바인딩
	glBufferData(GL_ARRAY_BUFFER, size, vertices, GL_STATIC_DRAW);	// 버텍스 데이터를 버퍼에 복사
}

// VBO를 바인드하는 메소드
void VBO::Bind()
{
	glBindBuffer(GL_ARRAY_BUFFER, ID);	// 해당 ID의 버퍼를 GL_ARRAY_BUFFER로 바인드
}

// VBO의 바인딩을 해제하는 메소드
void VBO::Unbind()
{
	glBindBuffer(GL_ARRAY_BUFFER, 0);	// 어떤 버퍼도 GL_ARRAY_BUFFER에 바인드되지 않도록 설정
}

// VBO를 삭제하는 메소드
void VBO::Delete()
{
	glDeleteBuffers(1, &ID);	// OpenGL에 해당 ID의 버퍼 객체를 삭제하라고 요청
}
```



## VAO.h

```c++
#ifndef VAO_CLASS_H
#define VAO_CLASS_H

#include"VBO.h"

class VAO
{
public:
	// 버텍스 배열 객체(Vertex Array Object)의 참조 ID
	GLuint ID;
	 // VAO ID를 생성하는 생성자
	VAO();

	// 특정 레이아웃을 사용하여 VBO를 VAO에 연결하는 함수
	void LinkVBO(VBO& VBO, GLuint layout);
	// VAO를 바인드하는 함수
	void Bind();
	// VAO의 바인딩을 해제하는 함수
	void Unbind();
	// VAO를 삭제하는 함수
	void Delete();

};
#endif
```



## VAO.cpp

```c++
#include "pch.h"
#include "VAO.h"

// VAO ID를 생성하는 생성자
VAO::VAO()
{
	glGenVertexArrays(1, &ID);	// OpenGL에 VAO ID를 생성하라고 요청
}

// 특정 레이아웃을 사용하여 VBO를 VAO에 연결하는 메서드
void VAO::LinkVBO(VBO& VBO, GLuint layout)
{
	VBO.Bind();	// VBO를 바인드
	glVertexAttribPointer(layout, 3, GL_FLOAT, GL_FALSE, 0, (void*)0);	// VBO의 데이터 구조를 정의
	glEnableVertexAttribArray(layout);	// 해당 버텍스 속성을 활성화
	VBO.Unbind();	// VBO의 바인딩을 해제
}

// VAO를 바인드하는 메서드
void VAO::Bind()
{
	glBindVertexArray(ID);	// OpenGL에 현재 VAO를 바인드하라고 요청
}

// VAO의 바인딩을 해제하는 메서드
void VAO::Unbind()
{
	glBindVertexArray(0);	// 바인드된 VAO를 해제
}

// VAO를 삭제하는 메서드
void VAO::Delete()
{
	glDeleteVertexArrays(1, &ID);	// OpenGL에 해당 ID의 VAO를 삭제하라고 요청
}


```



## EBO.h

```c++
#ifndef EBO_CLASS_H
#define EBO_CLASS_H

class EBO
{
public:
	// 엘리먼트 버퍼 객체(Elements Buffer Object)의 참조 ID
	GLuint ID;
	// 인덱스를 연결하여 엘리먼트 버퍼 객체를 생성하는 생성자
	EBO(GLuint* indices, GLsizeiptr size);

	// EBO를 바인드하는 메서드
	void Bind();
	// EBO의 바인딩을 해제하는 메서드
	void Unbind();
	// EBO를 삭제하는 메서드
	void Delete();

};

#endif
```



## EAO.cpp

```c++
#include "pch.h"
#include "EBO.h"

// 인덱스를 연결하여 엘리먼트 버퍼 객체를 생성하는 생성자
EBO::EBO(GLuint* indices, GLsizeiptr size)
{
	glGenBuffers(1, &ID);	// OpenGL에 버퍼 객체를 생성하라고 요청
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ID);	// 생성된 버퍼를 GL_ELEMENT_ARRAY_BUFFER로 바인딩
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, size, indices, GL_STATIC_DRAW);	// 인덱스 데이터를 버퍼에 복사
}

// EBO를 바인드하는 메소드
void EBO::Bind()
{
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ID);	// 해당 ID의 버퍼를 GL_ELEMENT_ARRAY_BUFFER로 바인드
}

// EBO의 바인딩을 해제하는 메소드
void EBO::Unbind()
{
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);	// 어떤 버퍼도 GL_ELEMENT_ARRAY_BUFFER에 바인드되지 않도록 설정
}

// EBO를 삭제하는 메소드
void EBO::Delete()
{
	glDeleteBuffers(1, &ID);	// OpenGL에 해당 ID의 버퍼 객체를 삭제하라고 요청
}
```



## Shader.h

```c++
#ifndef SHADER_CLASS_H
#define SHADER_CLASS_H

#include<glad/glad.h>
#include<string>
#include<fstream>
#include<sstream>
#include<iostream>
#include<cerrno>

// 파일로부터 셰이더 파일을 읽어오는 함수
std::string get_file_contents(const char* filename);

class Shader
{
public:
	// 셰이더 프로그램의 참조 ID
	GLuint ID;
	// 2개의 다른 셰이더로부터 셰이더 프로그램을 생성하는 생성자 different shaders
	Shader(const char* vertexFile, const char* fragmentFile);

	// 셰이더 프로그램을 활성화하는 메서드
	void Activate();
	// 셰이더 프로그램을 삭제하는 메서드
	void Delete();

};
#endif
```



## Shader.cpp

```c++
#include "pch.h"
#include "Shader.h"

// 텍스트 파일을 읽고 파일의 모든 내용을 문자열로 반환하는 함수
std::string get_file_contents(const char* filename)
{
	std::ifstream in(filename, std::ios::binary);
	if (in)
	{
		std::string contents;
		in.seekg(0, std::ios::end);
		contents.resize(in.tellg());
		in.seekg(0, std::ios::beg);
		in.read(&contents[0], contents.size());
		in.close();
		return(contents);
	}
	throw(errno);
}

// 2개의 다른 셰이더로부터 셰이더 프로그램을 구축하는 생성자
Shader::Shader(const char* vertexFile, const char* fragmentFile)
{
	// 버텍스 파일과 프래그먼트 파일을 읽고 문자열로 저장
	std::string vertexCode = get_file_contents(vertexFile);
	std::string fragmentCode = get_file_contents(fragmentFile);

	// 셰이더 소스 문자열을 문자 배열로 변환
	const char* vertexSource = vertexCode.c_str();
	const char* fragmentSource = fragmentCode.c_str();
	
	// 버텍스 셰이더 객체를 생성하고 참조를 얻음
	GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
	// 버텍스 셰이더 소스를 버텍스 셰이더 객체에 연결
	glShaderSource(vertexShader, 1, &vertexSource, NULL);
	// 버텍스 셰이더를 기계 코드로 컴파일
	glCompileShader(vertexShader);
	
	// 프래그먼트 셰이더 객체를 생성하고 참조를 얻음
	GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	// 프래그먼트 셰이더 소스를 프래그먼트 셰이더 객체에 연결
	glShaderSource(fragmentShader, 1, &fragmentSource, NULL);
	// 프래그먼트 셰이더를 기계 코드로 컴파일
	glCompileShader(fragmentShader);
	
	// 셰이더 프로그램 객체를 생성하고 참조를 얻음
	ID = glCreateProgram();
	// 버텍스 및 프래그먼트 셰이더를 셰이더 프로그램에 연결
	glAttachShader(ID, vertexShader);
	glAttachShader(ID, fragmentShader);
	// 모든 셰이더를 셰이더 프로그램에 묶어 연결
	glLinkProgram(ID);
	
	// 더 이상 필요 없는 버텍스 및 프래그먼트 셰이더 객체를 삭제
	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);

}

// 셰이더 프로그램을 활성화하는 메소드
void Shader::Activate()
{
	glUseProgram(ID);	// OpenGL에 현재 셰이더 프로그램을 사용하라고 요청
}

// 셰이더 프로그램을 삭제하는 메소드
void Shader::Delete()
{
	glDeleteProgram(ID);	// OpenGL에 해당 ID의 셰이더 프로그램을 삭제하라고 요청
}
```



## main.cpp

```c++
#include "pch.h"

#include"Shader.h"
#include"VAO.h"
#include"VBO.h"
#include"EBO.h"


// 버텍스 좌표
GLfloat vertices[] =
{
	-0.5f, -0.5f * float(sqrt(3)) / 3, 0.0f, // Lower left corner
	0.5f, -0.5f * float(sqrt(3)) / 3, 0.0f, // Lower right corner
	0.0f, 0.5f * float(sqrt(3)) * 2 / 3, 0.0f, // Upper corner
	-0.5f / 2, 0.5f * float(sqrt(3)) / 6, 0.0f, // Inner left
	0.5f / 2, 0.5f * float(sqrt(3)) / 6, 0.0f, // Inner right
	0.0f, -0.5f * float(sqrt(3)) / 3, 0.0f // Inner down
};

// 버텍스의 순서를 정의하는 인덱스
GLuint indices[] =
{
	0, 3, 5, // Lower left triangle
	3, 2, 4, // Lower right triangle
	5, 4, 1 // Upper triangle
};

int main()
{
	// GLFW 초기화
	glfwInit();

	// OpenGL 버전 설정 (여기서는 4.6)
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
	// GLFW에게 CORE 프로필을 사용하고 있다고 알림
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
	
	// GLFWwindow 객체 생성
	GLFWwindow* window = glfwCreateWindow(800, 600, "OpenGL", NULL, NULL);
	// 윈도우 생성 실패 확인
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	// 생성된 윈도우를 현재 컨텍스트로 설정
	glfwMakeContextCurrent(window);
	
	// GLAD를 로드하여 OpenGL 구성
	gladLoadGL();
	// OpenGL의 뷰포트 설정
	glViewport(0, 0, 800, 800);



	// 셰이더 프로그램 생성
	Shader shaderProgram("default.vert", "default.frag");


	// VAO, VBO, EBO 생성 및 바인딩
	// VAO: 버텍스 어레이 객체
	VAO VAO1;
	VAO1.Bind();
	
	// VBO: 버텍스 버퍼 객체
	VBO VBO1(vertices, sizeof(vertices));
	// EBO: 엘리먼트 버퍼 객체
	EBO EBO1(indices, sizeof(indices));
	
	// VBO를 VAO에 연결
	VAO1.LinkVBO(VBO1, 0);
	// 모든 객체의 바인딩 해제
	VAO1.Unbind();
	VBO1.Unbind();
	EBO1.Unbind();



	// 메인 루프
	while (!glfwWindowShouldClose(window))
	{
		// 배경색 지정 및 버퍼 클리어
		glClearColor(0.07f, 0.13f, 0.17f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);
		// 사용할 셰이더 프로그램 활성화
		shaderProgram.Activate();
		// VAO 바인딩
		VAO1.Bind();
		// 삼각형 그리기
		glDrawElements(GL_TRIANGLES, 9, GL_UNSIGNED_INT, 0);
		// 버퍼 스왑
		glfwSwapBuffers(window);
		// GLFW 이벤트 처리
		glfwPollEvents();
	}



	// 모든 OpenGL 객체 삭제
	VAO1.Delete();
	VBO1.Delete();
	EBO1.Delete();
	shaderProgram.Delete();
	// GLFWwindow 객체 삭제
	glfwDestroyWindow(window);
	// GLFW 종료
	glfwTerminate();
	return 0;

}
```



아래 파일은 쉐이더의 텍스트 파일

## default.vert

```c++
#version 460 core
layout (location = 0) in vec3 aPos;
void main()
{
   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
}
```

## default.frag

```c++
#version 460 core
out vec4 FragColor;
void main()
{
   FragColor = vec4(0.8f, 0.3f, 0.02f, 1.0f);
}
```

