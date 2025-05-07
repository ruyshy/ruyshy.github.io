---
title: "PE Viewer로 PE 구조 분석하기: PE-bear 활용법 정리"
description: "PE 파일 포맷(.exe, .dll 등)의 구조를 시각적으로 분석할 수 있는 PE Viewer 도구들을 소개하고, 특히 PE-bear를 활용해 진입점 분석, 섹션 구조 확인, IAT 탐색 등을 정리합니다."
date: 2025-05-08
tags: [PE, PE Viewer, PE-bear, Reverse Engineering, 리버싱, 실행파일 분석, 바이너리 분석]
---

PE Viewer는 .exe, .dll 등 PE(Portable Executable) 형식의 파일 구조를 시각적으로 확인할 수 있는 도구입니다.
이 글에서는 대표적인 PE Viewer 도구들과, 그 중 PE-bear를 활용한 구조 분석 예시를 간단히 정리합니다.

---

## PE Viewer란?

**PE 파일**은 `.exe`, `.dll`, `.sys` 같은 실행 가능한 바이너리 파일의 형식 PE Viewer는 이 파일을 열어 내부 **헤더**, **섹션**, **임포트/익스포트 함수**, **리소스**, **디버그 정보** 등을 **시각적**으로 보여주는 프로그램

---

## 다시 보는 PE 구조 요약

PE Viewer는 아래 구조를 보기 쉽게 보여줍니다:

- **DOS Header (`MZ`)**
    - 예전 DOS 실행파일과의 호환용
    - `e_lfanew` 필드에 NT Header의 오프셋 존재
- **NT Header (`PE\0\0`)**
    - Signature: PE
    - File Header: 타겟 머신, 섹션 개수, 타임스탬프
    - Optional Header: 실행 진입점, 메모리 배치 등
- **Section Table (예: `.text`, `.data`, `.rsrc`)**
    - 코드, 데이터, 리소스 등의 실제 내용을 담음
- **Import Table**
    - 이 파일이 참조하는 외부 DLL과 함수 목록
- **Export Table**
    - 다른 파일에서 참조할 수 있는 함수 목록
- **Resource Table**
    - 아이콘, 문자열, 대화상자 등 리소스 정보
- **Relocation Table**
    - 실행 주소가 바뀔 경우 고정 위치 보정 정보
- **Debug Directory**
    - 디버깅 심볼 정보 위치

---

## 대표적인 PE Viewer 도구들

| 도구 | 특징 | 참고 사이트 |
| --- | --- | --- |
| **PE-bear** | 가볍고 빠르며 구조 파싱이 잘 되어 있음 | [https://github.com/hasherezade/pe-bear](https://github.com/hasherezade/pe-bear) |
| **CFF Explorer** | 수동 수정 가능, 섹션 수정, IAT 재배치 등 | [https://github.com/bfosterjr/CFFExtensions](https://github.com/bfosterjr/CFFExtensions) |
| **Exeinfo PE** | 패킹 정보, 컴파일러 추정 기능 제공 | [https://github.com/ExeinfoASL/ASL](https://github.com/ExeinfoASL/ASL) |
| **LordPE** | 오래된 도구지만 여전히 일부 분석에 유용 | [https://github.com/DonaldTrump0/LordPE](https://github.com/DonaldTrump0/LordPE) |
| **x64dbg / x32dbg 내 PE 뷰어** | 동적 디버깅과 통합된 PE 구조 보기 | [https://x64dbg.com/](https://x64dbg.com/) |

---

## PE Viewer로 할 수 있는 일

- 프로그램 진입점 찾기 (EntryPoint)
- 특정 함수가 어디서 임포트되었는지 확인
- 패킹 여부 및 패커 종류 확인
- 섹션 구조와 오프셋 분석
- 리소스 추출 및 뷰

---

## PE-bear 간단 설명

실행 후, File→Load PEs 진행 한 모습 (예제는 Hello World.exe):

{% img "PE-bear-Hello-World-exe-Image.png" %}

### 1. **왼쪽 트리 구조**

- **DOS Header, DOS stub, NT Headers, Section Headers**:
    
    PE 구조의 계층을 보여주는 부분.
    
- **Sections**:
    - `.text`: 코드 섹션. **EP = 934** → 진입점 주소가 이곳임.
    - `.rdata`, `.data`, `.pdata`, `.gfids`, `.rsrc`, `.reloc`: 각각 상수 데이터, 초기화된 데이터, 예외 처리 정보, 전역 함수 포인터, 리소스, 재배치 정보 등.

### 2. **오른쪽 Hex + Ascii 뷰어**

- 중앙 상단에는 HEX 값들이, 오른쪽에는 그 ASCII 해석이 보임.
- 현재 `Entry Point(EP)`인 `0x934` 부근의 코드가 표시되고 있음.

### 3. **하단 Disassembly 뷰**

- 선택된 섹션(`.text`)의 디스어셈블리 코드가 나열되어 있음.

### 4. **EP = 934**

- 이 `934`는 PE 파일의 **메모리상 진입점 주소 (Entry Point)** 이며, 실행 시 가장 먼저 도착하는 위치임.
- 이건 **RVA (Relative Virtual Address)** 이고, 실제 파일 오프셋과 매핑해서 해석됨.

### PE-bear로 할 수 있는 주요 분석

| 기능 | 설명 |
| --- | --- |
| **Header 확인** | DOS → NT Header → Optional Header까지 전부 탐색 가능 |
| **Section 정보 분석** | 코드/데이터/리소스 구분 확인 |
| **Entry Point 추적** | 프로그램 시작 위치에서부터 실행 흐름 파악 가능 |
| **IAT 확인** | Import Address Table (어떤 DLL, 함수 호출하는지) |
| **리소스 탐색** | `.rsrc` 섹션에서 아이콘, 문자열 등의 정보 확인 |
| **디스어셈블리** | 기계어 → 어셈블리 변환된 흐름 추적 가능 |

### PE-bear 요약

- EP = `0x934` → 실행의 시작점.
- `SUB/CALL/ADD/JMP` 구조 → 함수 호출과 복귀의 전형적 형태.
- PE-bear는 **디버깅 전 정적 분석용으로 가볍고 시각적이어서 좋음**.