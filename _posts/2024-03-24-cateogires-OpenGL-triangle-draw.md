---
layout: single
title:  "OpenGL: Triangle Draw"
permalink: /OpenGL/Triangle-draw
categories: OpenGL
typora-root-url: ../
tag: [C++, OpenGL, Game, OpenGL, OpenGL3D, Engine, Graphics]
toc: true
toc_sticky : true
author_profile: false
sidebar:
    nav: docs
---





# main.cpp

```c++
#include "pch.h"

// Vertex Shader source code
const char* vertexShaderSource = "#version 330 core\n"
"layout (location = 0) in vec3 aPos;\n"
"void main()\n"
"{\n"
"   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
"}\0";
//Fragment Shader source code
const char* fragmentShaderSource = "#version 330 core\n"
"out vec4 FragColor;\n"
"void main()\n"
"{\n"
"   FragColor = vec4(0.8f, 0.3f, 0.02f, 1.0f);\n"
"}\n\0";



int main()
{
	// glfw 초기화
	glfwInit();

// GLFW에게 우리가 사용하고 있는 OpenGL 버전 알림.
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
// GLFW 코어 프로필 사용, 전체 기능 사용
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

// window 생성 800 * 600
GLFWwindow* window = glfwCreateWindow(800, 600, "OpenGL", NULL, NULL);
// window 생성 실패 여부 검사
if (window == NULL)
{
	cout << "Failed to create GLFW window" << endl;
	glfwTerminate();
	return -1;
}
// 윈도우 창을 Context에 알림
glfwMakeContextCurrent(window);

//GLAD 불러오기
gladLoadGL();
// OpenGL 뷰포트 설정
glViewport(0, 0, 800, 600);



// 정점 셰이더 객체 생성, 참조해서 가져오기
GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
// 정점 셰이더 코드 연결
glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
// 기계어 코드 컴파일 / GPU
glCompileShader(vertexShader);

// 프래그먼트 셰이더 생성, 참조해서 가져오기
GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
// 프래그먼트 셰이더 코드 연결
glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
// 기계어 코드 컴파일 / GPU
glCompileShader(fragmentShader);

// 셰이더 프로그램 객체 생성
GLuint shaderProgram = glCreateProgram();
// 정점 셰이더와 프로그먼트 셰이더를 프로그램에 연결
glAttachShader(shaderProgram, vertexShader);
glAttachShader(shaderProgram, fragmentShader);
// 모든 셰이더를 프로그램으로 연결
glLinkProgram(shaderProgram);

// 쓸모없는 셰이더 객체 삭제
glDeleteShader(vertexShader);
glDeleteShader(fragmentShader);



// 정점의 좌표 GLFloat가 openGL에서 사용할 때, 안정성있음.
GLfloat vertices[] =
{
	-0.5f, -0.5f * float(sqrt(3)) / 3, 0.0f, // 아래 왼쪽
	0.5f, -0.5f * float(sqrt(3)) / 3, 0.0f, // 아래 오른쪽
	0.0f, 0.5f * float(sqrt(3)) * 2 / 3, 0.0f // 위 가운데
};

// artex Array Object 및 Vertex Buffer Object에 대한 컨테이너를 생성
GLuint VAO, VBO;

// 각각 1개의 객체를 사용하여 VAO VBO 생성
glGenVertexArrays(1, &VAO);
glGenBuffers(1, &VBO);

// VAO를 바인딩
glBindVertexArray(VAO);

// VBO 바인딩
glBindBuffer(GL_ARRAY_BUFFER, VBO);
// VBO 정점 추가
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

// OpenGL이 VBO를 읽는 방법을 알 수 있도록 Vertex 속성을 구성
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
// OpenGL이 이를 사용할 수 있도록 Vertex 속성을 활성화
glEnableVertexAttribArray(0);

// VAO와 VBO를 실수로 수정하지 않도록 VBO와 VAO를 모두 0에 바인딩
glBindBuffer(GL_ARRAY_BUFFER, 0);
glBindVertexArray(0);



// 반복문
while (!glfwWindowShouldClose(window))
{
	// 배경색 지정
	glClearColor(0.8f, 0.1f, 0.1f, 1.0f);
	// 백버퍼를 정리하고 새 색상을 할당
	glClear(GL_COLOR_BUFFER_BIT);
	// OpenGL에게 어떤 셰이더 프로그램을 사용할지 알림.
	glUseProgram(shaderProgram);
	// OpenGL이 VAO를 사용할 수 있도록 VAO를 바인딩
	glBindVertexArray(VAO);
	// GL_TRIANGLES 프리미티브를 사용하여 삼각형을 그립니다.
	glDrawArrays(GL_TRIANGLES, 0, 3);
	// 백버퍼를 프론트버퍼로 교환
	glfwSwapBuffers(window);
	// 모든 GLFW 이벤트를 관리
	glfwPollEvents();
}



// 만든 모든 객체를 삭제
glDeleteVertexArrays(1, &VAO);
glDeleteBuffers(1, &VBO);
glDeleteProgram(shaderProgram);
// 프로그램을 종료하기 전에 창 삭제
glfwDestroyWindow(window);
// 프로그램을 종료하기 전에 GLFW를 종료
glfwTerminate();
return 0;

}
```

다음 결과물 :

![image-20240326010437823](/images/2024-03-24-cateogires-OpenGL-triangle.md/image-20240326010437823.png)
