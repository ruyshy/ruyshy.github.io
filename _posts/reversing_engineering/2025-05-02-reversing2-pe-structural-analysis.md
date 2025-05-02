---
title: "PE 구조 분석 완전 정복"
description: "Windows 실행파일(EXE, DLL)의 핵심 구조인 PE(Portable Executable) 포맷을 DOS Header부터 Section, RVA 변환까지 전체 흐름으로 정리한 리버싱 초보자 필수 가이드입니다."
date: 2025-05-02
tags: [pe파일, executable format, windows 구조, 리버싱, 바이너리 분석]
---

Windows 실행파일이 어떻게 구성되어 있고, 어떤 순서로 메모리에 로딩되는지 궁금하셨나요?  
이 글에서는 PE 구조의 전반적인 구성과 주요 필드들의 역할, RVA 변환 방식까지 하나씩 정리해봅니다.


## PE 파일이란?

**PE 파일**은 쉽게 말해 **Windows에서 실행되는 모든 실행파일(EXE), 라이브러리(DLL)**의 **설계도**.

마치 레고 블록을 조립하려면 블록의 종류와 순서를 알려주는 설명서가 필요하듯,

**Windows 운영체제도 PE 구조를 보고 프로그램을 메모리에 어떻게 배치할지 결정.**

리버싱에서 **PE 구조(Portable Executable Format)** 는 가장 기본이자 핵심.

Windows에서 실행되는 .exe, .dll파일은 전부 이 포맷을 따르기 때문에, 구조를 이해해야 분석이 가능.

## PE 파일을 실행할 때 무슨 일이 벌어지냐면…

- 어떤 `.exe` 파일을 더블 클릭.
- Windows는 그 파일의 **MZ** 라는 마법 같은 시작 문자를 보고 “오! 이건 실행파일이네?” 라고 판단.
- 그 다음에는 “진짜 실행정보는 어디 있지?” 하고 **e_lfanew** 필드를 보고, 본격적인 PE 구조로 점프.
- 거기서부터 운영체제가 코드를 메모리에 어떻게 배치하고, 어느 DLL을 불러오고, 어디서 실행을 시작해야 하는지를 쫙 읽음.

## PE 파일은 어떤 정보들로 되어 있을까?

우리가 책을 볼 때도 표지 → 목차 → 본문 → 부록 이런 순서가 있듯이, PE 파일도 순서가 있음.

## PE 구조 전체 개요 (전체 흐름)

```mathematica
┌────────────────────────────┐
│ MS-DOS Header              │ ← MZ Signature (0x4D 0x5A)
├────────────────────────────┤
│ DOS Stub Program           │
├────────────────────────────┤
│ PE Signature               │ ← "PE\0\0" (0x50 0x45 0x00 0x00)
├────────────────────────────┤
│ COFF File Header           │
├────────────────────────────┤
│ Optional Header            │
│  ├─ Standard Fields        │
│  ├─ Windows-Specific Fields│
│  └─ Data Directories       │
├────────────────────────────┤
│ Section Headers (.text 등) │
├────────────────────────────┤
│ Section Bodies (.text 등)  │
└────────────────────────────┘
```

---

### 1. DOS Header (IMAGE_DOS_HEADER)

- Signature: `MZ` (0x5A4D)
- 주요 필드:
    - `e_lfanew`: PE 헤더의 오프셋 (PE Signature 위치)

**용도:** 오래된 MS-DOS 호환을 위한 Stub 실행 코드 포함

**디버깅 팁:** PE 파싱 시 `e_lfanew`를 통해 PE Signature로 점프

**추가 설명: 표지 같은 느낌**

- 맨 앞 2바이트는 `MZ` → DOS 시절부터 내려온 "이건 실행파일이다"의 표시
- 그 안에는 `e_lfanew`라는 중요한 주소가 있음 → “PE 구조는 여기부터 시작해!”라고 알려주는 지표

---

### 2. DOS Stub Program

- 짧은 x86 코드로 "This program cannot be run in DOS mode" 출력
- 용량: 일반적으로 수십 바이트

**추가 설명: 옛날 코드 조각**

- DOS에서는 실행이 안 되니까 이런 메시지가 나와:
    
    👉 `"This program cannot be run in DOS mode"`
    

이건 사실 지금은 의미 없고 그냥 관습적으로 들어있음.

---

### 3. PE Signature

- 값: `"PE\0\0"` (4바이트)
- 위치: `e_lfanew`에서 지정됨

**추가 설명:**

딱 `"PE\0\0”`(50 45 00 00)이라는 서명이 있음

→ 이거 보면 “이건 진짜 Windows용 실행 파일이다!” 라고 확신함

---

### 4. COFF File Header (IMAGE_FILE_HEADER)

주요 필드:

- `Machine`: CPU 아키텍처 (예: x86: 0x014c, x64: 0x8664)
- `NumberOfSections`: 섹션 수
- `TimeDateStamp`: 빌드 타임스탬프
- `PointerToSymbolTable`: 디버깅용 심볼 테이블 (보통 0)
- `SizeOfOptionalHeader`: Optional Header의 크기
- `Characteristics`: 실행파일 속성 (DLL인지, 실행파일인지 등)

**추가 설명: 요약 정보**

- CPU 종류 (32비트? 64비트?)
- 섹션이 몇 개?
- 언제 빌드된 파일이야?
- 실행파일이야? DLL이야? 드라이버야?

한마디로 “이 파일은 어떤 환경에서 실행되는 어떤 프로그램이다”라는 기본 정보.

---

### 5. Optional Header (IMAGE_OPTIONAL_HEADER)

#### 5.1. Standard Fields

- `Magic`: PE32 (0x10b), PE32+ (0x20b)
- `AddressOfEntryPoint`: 시작 함수 주소 (RVA)
- `BaseOfCode`, `BaseOfData`: 코드/데이터 시작 위치

#### 5.2. Windows-Specific Fields

- `ImageBase`: 가상 메모리에서 매핑될 기본 주소
- `SectionAlignment`: 메모리에서 섹션 정렬 기준
- `FileAlignment`: 디스크에서 섹션 정렬 기준
- `SizeOfImage`: 전체 이미지의 크기 (메모리 기준)
- `Subsystem`: GUI, CUI 여부

#### 5.3. Data Directories (IMAGE_DATA_DIRECTORY[])

총 16개 엔트리:

| 인덱스 | 이름 | 설명 |
| --- | --- | --- |
| 0 | Export Table | DLL 내보내기 함수 테이블 |
| 1 | Import Table | 외부 DLL 로딩 함수 테이블 |
| 2 | Resource Table | 아이콘, 다이얼로그, 문자열 등 |
| 3 | Exception Table | SEH 정보 (x64) |
| 4 | Certificate Table | 디지털 서명 |
| 5 | Base Relocation | 재배치 정보 |
| 6 | Debug Directory | 디버그 심볼 정보 |
| 7~15 | TLS, Load Config 등 | Thread Local Storage 등 |

**추가 설명: 필수**

이건 정말 중요한 부분! Windows가 이걸 보고 “이 프로그램은 이렇게 실행하면 되겠다”고 결정함.

여기엔 이런 것들이 있다:

| 항목 | 설명 |
| --- | --- |
| EntryPoint | 실행 시작 주소 (`main()` 같은 곳) |
| ImageBase | 이 파일이 메모리에 올라갈 기본 주소 (예: 0x400000) |
| SizeOfImage | 전체 프로그램이 차지할 메모리 크기 |
| Subsystem | GUI인지, 콘솔인지 등 |
| DLL 필요 여부 | Import Table 참고해서 DLL 호출 |

**추가 설명: Data Directories (길잡이)**

- 여긴 "중요한 테이블이 어디에 있는지" 알려주는 지도.

예:

- Import Table → "이 프로그램이 불러오는 DLL 리스트"
- Export Table → "이 DLL이 외부에 제공하는 함수들"
- Resource Table → 아이콘, 문자열, 메뉴 같은 GUI 요소
- Relocation Table → 메모리 위치가 바뀔 경우 주소 보정용

---

### 6. Section Header Table (IMAGE_SECTION_HEADER)

각 섹션에 대한 메타데이터 배열

- `.text`: 코드
- `.data`: 초기화된 전역변수
- `.rdata`: 읽기 전용 데이터 (예: 상수 문자열)
- `.bss` (표시되지 않음): 초기화되지 않은 전역변수
- `.rsrc`: 리소스 정보
- `.reloc`: 재배치 테이블

각 헤더에는:

- `Name`: 섹션 이름
- `VirtualAddress`: 메모리 상 RVA
- `SizeOfRawData`: 디스크에 저장된 크기
- `PointerToRawData`: 실제 파일 오프셋
- `Characteristics`: 코드/데이터/읽기쓰기 속성

**추가 설명:** 
이제부터는 **진짜 컨텐츠**를 설명함.

- `.text` : 코드가 담긴 부분 (컴파일된 함수들)
- `.data` : 전역 변수
- `.rdata` : 읽기 전용 데이터
- `.rsrc` : 리소스(아이콘, UI 등)

이 표에 “이 섹션은 어디서부터 시작되고, 크기가 얼마며, 메모리상 주소는 어디야”라는 내용이 나옴.

---

### 7. Section Data

- 실제 코드, 데이터, 리소스 등이 이 영역에 위치
- 파일상에서는 `PointerToRawData` 오프셋부터
- 메모리에서는 `VirtualAddress` 기준으로 매핑됨

**추가 설명:**
파일의 마지막에는 **실제 코드, 데이터, 리소스**들이 쭉 들어있어. 이 부분은 메모리에 로딩돼서 실행되는 내용.

---

### PE 로딩 시 주요 흐름

- OS Loader가 `ImageBase`에 PE 파일 로딩
- SectionAlignment 기준으로 섹션 재배치
- `AddressOfEntryPoint`로 제어 이동
- Import Table 파싱 → DLL 로딩 & IAT 구성
- Relocation Table 적용 (필요 시)
- TLS 실행, `mainCRTStartup` 등 실행

---

### 실행 과정 요약 (Memory 상 시나리오)

1. OS가 PE 구조를 읽고 `.text`, `.data`, `.rsrc` 등의 섹션을 메모리에 올림.
2. DLL이 필요하면 Import Table 참고해서 미리 로딩.
3. 만약 메모리 기본 주소(`ImageBase`)에 이미 다른 앱이 있으면 Relocation Table로 주소 보정.
4. 모든 준비가 끝나면 `EntryPoint`에 점프해서 코드 실행 시작!

---

### PE 파일은 왜 이렇게 복잡하게 나뉘어 있을까?

- **모듈화**: OS가 필요한 것만 빠르게 읽고 실행
- **이식성**: EXE, DLL, SYS 같은 다양한 용도에 공통 포맷 사용
- **확장성**: 리소스, 서명, 디버깅 정보 등 추가해도 구조 유지
- **보안**: 코드와 데이터, 리소스를 명확히 분리 가능

---

### 쉽게 기억하는 요령

```css
MZ → DOS 헤더
e_lfanew → PE 위치
PE → 진짜 헤더 시작
COFF → 기본 요약
Optional → 실행 정보
Section → 실제 코드들
```

---

### 참고 자료 / 구조체 이름

- `IMAGE_DOS_HEADER`
- `IMAGE_NT_HEADERS` (Signature + FileHeader + OptionalHeader)
- `IMAGE_FILE_HEADER`
- `IMAGE_OPTIONAL_HEADER`
- `IMAGE_SECTION_HEADER`
- `IMAGE_DATA_DIRECTORY`
- `IMAGE_IMPORT_DESCRIPTOR`, `IMAGE_EXPORT_DIRECTORY` 등은 개별 테이블에 해당

---

### PE 구조 분석 시 유용한 도구

- **CFF Explorer**
- **PE-bear**
- **x64dbg + Scylla**
- **IDA / Ghidra**
- **dumpbin /headers /imports /exports**
- **WinDbg + !lmi / !dh 등**

---

## PE 파일 분석에서 핵심이 되는 **두 가지 중요한 개념**

### 1. 각 구조체의 메모리 정렬 방식 (Alignment)

PE 파일은 **파일에서는 FileAlignment 단위로 정렬**되고, **메모리에서는 SectionAlignment 단위로 정렬**.

#### FileAlignment (디스크 상 정렬)

- `Optional Header`에 있음 (`FileAlignment`)
- 보통 **0x200 (512바이트)** 또는 0x1000 (4096바이트)
- 각 섹션의 `SizeOfRawData`는 이 단위로 정렬됨

#### SectionAlignment (메모리 정렬)

- `Optional Header`에 있음 (`SectionAlignment`)
- 보통 **0x1000 (4KB)**
- 메모리상에서 섹션들의 `VirtualAddress`는 이 단위로 정렬됨

#### 예시

| 항목 | 값 |
| --- | --- |
| FileAlignment | 0x200 |
| SectionAlignment | 0x1000 |
| `.text` Size | 0x123 |
| `.data` Size | 0x430 |

→ 디스크에서는 0x200 단위로 반올림 → `.text`는 0x200, `.data`는 0x600

→ 메모리에서는 0x1000 단위로 반올림 → `.text`는 0x1000, `.data`는 0x1000

### 2. RVA ↔ File Offset 변환법

PE에서는 주소가 두 가지로 표현:

| 종류 | 설명 |
| --- | --- |
| **RVA** (Relative Virtual Address) | 베이스 주소 기준 상대 가상주소 (예: EntryPoint 등 대부분 이걸로 표시됨) |
| **File Offset** | 실제 파일 내 위치 (디스크 오프셋) |

#### 변환 공식

**FileOffset = RVA - VirtualAddress + PointerToRawData**

단, 이 변환은 "어느 섹션에 속하는 RVA냐?"에 따라 다름.

#### 변환 순서 정리

- 모든 섹션 헤더를 순회하며:
    - 해당 섹션의 `VirtualAddress ≤ RVA < VirtualAddress + VirtualSize`인지 검사
- 맞는 섹션이 있다면:
    
    ```cpp
    FileOffset = RVA - VirtualAddress + PointerToRawData
    ```
    
- 못 찾으면 → 잘못된 RVA일 가능성

#### 예제

```
섹션: .text
  VirtualAddress     = 0x1000
  PointerToRawData   = 0x400
  VirtualSize        = 0x600
  SizeOfRawData      = 0x600

EntryPoint = 0x1100 (RVA)
```

→`.text`안에 있음 (0x1000 ≤ 0x1100 < 0x1600)

→ FileOffset = 0x1100 - 0x1000 + 0x400 = 0x500

#### 코드로 구현 (C++ 스타일)

```cpp
DWORD RvaToOffset(DWORD rva, PIMAGE_NT_HEADERS nt, PIMAGE_SECTION_HEADER sections, int num_sections) {
    for (int i = 0; i < num_sections; ++i) {
        DWORD va      = sections[i].VirtualAddress;
        DWORD vsize   = sections[i].Misc.VirtualSize;
        DWORD rawptr  = sections[i].PointerToRawData;

        if (rva >= va && rva < va + vsize) {
            return rva - va + rawptr;
        }
    }
    return 0; // 실패
}
```

#### 참고 구조체 Alignment

| 구조체 | Alignment 정보 |
| --- | --- |
| IMAGE_DOS_HEADER | 고정 위치 (0x0) |
| IMAGE_NT_HEADERS | `e_lfanew`부터 |
| IMAGE_FILE_HEADER | 20 bytes |
| IMAGE_OPTIONAL_HEADER | 224 bytes (PE32), 240 bytes (PE32+) |
| IMAGE_SECTION_HEADER | 40 bytes/섹션 |
| IMAGE_IMPORT_DESCRIPTOR | 20 bytes |
| IMAGE_EXPORT_DIRECTORY | 40 bytes |
| IMAGE_DATA_DIRECTORY | 8 bytes × 16개 |