---
title: "GitHub Blog에서 .exe 파일 안전하게 업로드 및 다운로드하기"
description: "GitHub 블로그에서 .exe 실행 파일을 업로드할 때 보안 경고 없이 안전하게 배포하는 방법을 소개합니다. ZIP 압축, 확장자 우회, 다운로드 안내문 등 실용적인 우회 방법도 함께 설명합니다."
date: 2025-04-30
tags: [GitHub Pages, 파일 업로드, 다운로드, exe 보안경고, zip, 코드서명, 블로그 팁]
---

GitHub 블로그에 `.exe` 파일을 올리면 크롬이나 윈도우에서 보안 경고가 뜨곤 합니다.  
이 포스트에서는 그러한 경고를 완화하거나 피할 수 있는 여러 가지 방법을 정리했습니다.  
실제 `.zip` 방식 테스트도 함께 제공하니 참고해보세요!

assets\files\example\assembly\hello_world_x64.exe 상대경로에 업로드가 되어있습니다.

GitHub에서도 업로드가 되어있어야 다운로드가 가능합니다!

로컬에서도 테스트 할 수 있습니다. 예시:

http://localhost:4000/assets/files/example/assembly/hello_world_x64.exe

업로드 경로 링크 :

[https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.exe](https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.exe)

{% img "image.png" %}

해당 이미지 처럼 .exe 파일을 다운로드 할 때, 크롬에서 뜨는 메세지 스크린샷

Windows에서 `.exe` 파일을 다운로드할 때 **"의심스러운 파일"**이라는 경고가 뜨는 이유는 브라우저(특히 Chrome, Edge 등)나 OS가 **디지털 서명(Signing Certificate)** 없는 실행 파일을 보안 위험 요소로 간주하기 때문입니다. 이건 블로그 설정만으로는 **완전히 막을 수 없습니다**, 하지만 아래와 같은 우회적/간접적 방법들이 있습니다:

## 해결 또는 완화 방법

### 1. **압축 파일로 배포 (추천)**

- `hello_world_x64.exe` → `hello_world_x64.zip` 으로 압축
- `.exe` 파일이 직접 노출되지 않으므로 브라우저 보안 경고가 거의 사라짐
- GitHub Pages에서도 MIME-type 문제 없이 다운로드됨

### 2. **파일 이름 변경 (부가 효과)**

- 예: `hello_world_x64.safe` 또는 `hello_world_x64.dat`로 이름 변경 → 다운로드 후 사용자에게 `.exe`로 바꾸라고 안내
- 일부 브라우저 필터는 `.exe` 확장자만으로 차단함

### 3. **HTTPS 사용 확인**

- GitHub Pages는 기본 HTTPS라서 괜찮지만, custom domain 사용 시 `https://`가 아니면 경고 메시지가 더 강해질 수 있음

### 4. **브라우저 다운로드 설명 추가**

- 포스트에 다운로드 전에 이런 문구를 넣을 수 있음:

> ⚠️ Windows에서는 .exe 파일 다운로드 시 보안 경고가 표시될 수 있습니다. 안전한 파일이며, 소스코드도 함께 제공됩니다.

### 5. **디지털 서명(코드 사인) 사용 (고급)**

- 진짜 근본적인 해결책
- `.exe` 파일에 **코드 서명 인증서**를 붙이면 대부분의 브라우저/OS가 신뢰
- 하지만 개인 개발자 입장에서 비용(1년에 최소 $100 이상) 및 번거로움이 커서 비현실적일 수 있음

## 요약

| 방법                        | 효과          | 추천도            |
| --------------------------- | ------------- | ----------------- |
| `.zip`으로 압축해서 제공    | 경고 방지     | ⭐⭐⭐⭐          |
| 확장자 숨기기 (예: `.safe`) | 브라우저 회피 | ⭐⭐              |
| 디지털 서명 인증서 적용     | 완전한 해결   | ⭐ (비용 부담 큼) |
| 다운로드 안내문 추가        | 사용자 신뢰   | ⭐⭐⭐            |

## 테스트

기존의 exe 파일 링크 :

[https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.exe](https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.exe)

exe 파일을 압축한 파일(.zip) 링크:

[https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.zip](https://ruyshy.github.io/assets/files/example/assembly/hello_world_x64.zip)
