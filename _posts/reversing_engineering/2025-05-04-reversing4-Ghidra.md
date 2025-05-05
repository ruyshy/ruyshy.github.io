---
title: "Ghidra 입문자를 위한 리버싱 가이드"
description: "Ghidra 설치부터 실전 문자열 추적, 함수 분석, 조건 분기 흐름 파악까지 입문자가 리버스 엔지니어링을 시작하는 데 필요한 모든 내용을 단계별로 정리한 튜토리얼입니다."
date: 2025-05-04
tags: [Ghidra, 리버싱, 리버스 엔지니어링, 디컴파일, 정적분석, NSA, crackme]
---

Ghidra는 NSA에서 만든 무료 리버스 엔지니어링 도구로, 실행 파일을 디컴파일하고 분석할 수 있는 강력한 기능을 제공합니다.  
이 글은 설치부터 실습까지 Ghidra 입문자가 따라 하기 쉽게 정리된 단계별 사용 가이드입니다.

# Ghidra 입문자를 위한 완전 쉬운 매뉴얼

> 이 매뉴얼은 Ghidra를 처음 접할 사람도 바로 분석을 시작할 수 있도록 구성되어있습니다. 설치부터 분석 실습까지 단계별로 설명합니다.

---

## Ghidra란?

- 미국 NSA에서 만들어온 **무료 리버스 엔지니어링 도구**
- 실행 파일(.exe, .dll 등)을 열어서 내부 구조를 분석
- 디컴파일(C 코드처럼 보기), 함수 흐름 보기, 문자열 추적 등 가능

---

## 1단계: 설치 방법

### Java 설치

- Ghidra는 Java 기반이며 Java 17 이상 필요
- 설치 링크: [https://adoptium.net](https://adoptium.net/) (Temurin 17 추천)

### Ghidra 다운로드

- 공식 홈페이지: [https://ghidra-sre.org/](https://ghidra-sre.org/)
- 압축 해제 후 `ghidraRun` 실행

---

## 2단계: 프로젝트 만들기

1. Ghidra를 실행하면 초기 시작 화면이 나옵니다.
2. 상단 메뉴에서 `File → New Project`를 클릭합니다.
3. 팝업에서 `Non-Shared Project`를 선택합니다. 협업 기능이 필요 없다면 이 옵션으로 충분합니다.
4. 프로젝트 이름을 지정하고 저장할 위치(폴더)를 선택한 후 `Finish`를 누릅니다.
5. 새 프로젝트 창이 열리면, 분석할 실행 파일(`.exe` 등)을 Ghidra 창으로 끌어오거나 상단 메뉴의 `File → Import File...`을 통해 불러옵니다.
6. 파일을 불러오면 자동으로 `Import File` 창이 뜹니다. 포맷이 잘 인식되었는지 확인하고 OK를 누릅니다.
7. 이어서 `Auto-Analysis` 창이 자동으로 뜨는데, 기본 설정을 그대로 둔 채 `Analyze` 버튼을 누르면 분석이 시작됩니다.
   - Pre Analysis: PE 구조, 섹션 구조 등 초기 정보 수집
   - Post Analysis: 코드 분석, 함수 감지, 문자열 참조 연결 등 자동 처리
8. 분석이 끝나면 `CodeBrowser` 창이 활성화되고, 이제 분석을 시작할 수 있습니다.

---

## 3단계: 인터페이스 이해

| 위치   | 창 이름     | 설명                           |
| ------ | ----------- | ------------------------------ |
| 왼쪽   | Symbol Tree | 함수, 문자열, 변수 리스트 보기 |
| 중앙   | Listing     | 어셈블리 코드 창               |
| 오른쪽 | Decompile   | C처럼 디컴파일된 코드 보기     |
| 아래   | Console     | 로그 및 메시지 출력 창         |

---

## 4단계: 문자열 분석하기

### 문자열 찾는 방법

1. Ghidra의 분석이 끝나면, 상단 메뉴에서 `Search → For Strings...` 메뉴를 클릭합니다.
2. `Search for Strings` 창이 뜨면 아래와 같이 설정합니다:
   - **Minimum Length**: 4 (짧은 쓰레기 문자열은 걸러내기 위해)
   - **Encoding**: ASCII (일반 영어 문자열 탐지)
3. `Search` 버튼을 누르면 `.rdata` 섹션 등에 포함된 모든 문자열이 리스트업 됩니다.
4. `serial`, `wrong`, `password`, `key` 등 유의미한 단어를 찾아 더블 클릭하면 해당 문자열이 위치한 메모리 주소로 이동합니다.

> 이 문자열은 보통 printf, MessageBoxA, puts 등 출력 루틴과 함께 쓰이며, 정답 검증 루틴 근처일 가능성이 높습니다.

### 참조 추적 (XREF)

1. 문자열 위치로 이동한 후, 해당 문자열 주소(또는 push된 주소)에 커서를 둡니다.
2. 마우스 우클릭 → `References → Show References to` 클릭합니다.
3. 이 문자열을 사용한 코드 주소 목록이 나타납니다. 이 중 대부분은 `push offset` 후 `call printf` 형태로 연결됩니다.
4. 목록에서 더블 클릭하면 그 참조 지점으로 이동할 수 있으며, 대부분 사용자가 입력한 값과 비교하는 함수 내부일 가능성이 높습니다.

> Ghidra는 자동 분석 시 문자열과 함수 간 연결을 자동으로 찾아주기 때문에, 이 과정을 통해 빠르게 주요 함수 진입점을 잡을 수 있습니다.

---

## 5단계: 함수 흐름 따라가기

### Decompile 창에서:

1. Listing 창(어셈블리)에서 함수 시작 위치를 클릭하면 오른쪽 `Decompile` 창에 해당 함수가 C 코드처럼 디컴파일되어 나타납니다.
2. `strcmp`, `strncmp`, `memcmp`, `xor`, `!=` 등이 있는 경우, 사용자 입력값과 비교하고 있다는 의미입니다.
3. 루프(`for`, `while`)가 포함된 경우는 보통 문자 단위로 정답과 비교하거나 암호화 루틴입니다.
4. 조건 분기(`if (...) return`) 다음에 `MessageBox`, `puts("wrong")`가 따라오면, 그 부분이 실패 루틴입니다.

> Decompile 창은 Ghidra의 핵심 분석 도구로, 어셈블리를 읽지 못해도 함수 흐름을 빠르게 파악할 수 있도록 도와줍니다.

### Graph 보기

1. 현재 보고 있는 함수의 흐름을 블록 기반 시각화로 보고 싶다면 상단 메뉴 → `Window → Function Graph`를 클릭합니다.
2. Decompile 창에서 보던 if/else 흐름이 블록 기반의 노드로 표현되며, 각 분기 조건과 흐름이 화살표로 연결되어 나타납니다.
3. 이 그래프는 특히 복잡한 조건 분기나 루프가 많은 함수의 흐름을 한눈에 파악할 때 유용합니다.

---

## 6단계: MessageBox, printf 추적

문자열이 없거나, 출력 문자열이 암호화되어 있어 문자열 탭에서 확인할 수 없는 경우에는 직접 함수 호출을 추적해야 합니다.

### Windows API 호출 추적하기 (예: MessageBoxA, printf 등)

1. Ghidra의 좌측 `Symbol Tree`에서 `Imports` 탭을 클릭합니다.
2. Windows API 함수 목록이 나오며, 이 중에서 `MessageBoxA`, `puts`, `printf`, `fprintf`, `WriteFile` 등 사용자에게 메시지를 출력하거나 로그를 기록하는 함수들을 찾습니다.
3. 예를 들어 `MessageBoxA`를 더블 클릭하면 해당 함수의 주소로 이동합니다.
4. 해당 함수에서 마우스 우클릭 → `References → Show References to`를 선택합니다.
5. 이 함수가 호출된 위치(예: push 문자열 → call MessageBoxA)를 보여주는 리스트가 뜹니다.
6. 리스트 항목을 더블 클릭하면, 이 함수가 호출된 실제 코드 지점으로 이동합니다.
7. 이 지점에서 다시 Decompile 창을 열어보면 다음과 같은 코드가 보일 수 있습니다:

```c
if (strcmp(user_input, "correct") == 0) {
    MessageBoxA(0, "Correct!", 0, 0);
} else {
    MessageBoxA(0, "Wrong!", 0, 0);
}

```

> 출력 함수는 프로그램의 흐름을 알려주는 중요한 단서입니다. 입력값을 바르게 넣었을 때 나오는 출력 메시지를 추적하면 정답 확인 루틴 근처의 흐름을 분석할 수 있습니다.

### 참고:

- `puts`, `printf`, `MessageBoxA`는 보통 문자열이 명확하게 드러납니다.
- `WriteConsoleA`, `WriteFile` 등을 사용하는 콘솔 프로그램도 있으니, 그 외 출력 API도 함께 참고하세요.

---

## 7단계: 주요 단축키 (출처: [Ghidra CheatSheet](https://ghidra-sre.org/CheatSheet.html))

| 단축키             | 기능                                        |
| ------------------ | ------------------------------------------- |
| `G`                | 주소로 이동 (Go To Address)                 |
| `Ctrl + Shift + G` | 명명된 심볼로 이동                          |
| `F`                | 함수 정의하기                               |
| `Shift + F`        | 함수 정의 해제하기                          |
| `D`                | Data로 지정하기                             |
| `C`                | 코드로 지정하기                             |
| `U`                | 언디파인 (Un-define)                        |
| `E`                | 명령어 편집 (Edit Instruction)              |
| `P`                | 프리미티브 타입 설정                        |
| `;`                | 주석 추가                                   |
| `Ctrl + ;`         | Pre-Comment 추가                            |
| `L`                | 이름 바꾸기 (Rename)                        |
| `T`                | 데이터 타입 설정                            |
| `Ctrl + Alt + I`   | 데이터 추출 및 임포트 (Extract & Import...) |
| `Ctrl + Shift + M` | Bookmarks 보기                              |

---

## 추천 학습 자료

- [Ghidra 공식 문서](https://ghidra-sre.org/Documentation.html)
- [Dreamhack 입문 강의](https://learn.dreamhack.io/389)
- [Ghidra Bookshelf 예제 기반 분석](https://github.com/PacktPublishing/Ghidra-Software-Reverse-Engineering-for-Beginners)
- [CrackMe](https://crackmy.app/)

---
