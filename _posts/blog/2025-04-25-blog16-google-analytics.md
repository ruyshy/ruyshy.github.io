---
title: "GitHub Blog Google Analytics GA4 연동 가이드"
description: "Jekyll 블로그에서 Google Analytics GA4 측정 ID를 연동하여 방문자 분석 데이터를 수집하는 방법을 설명합니다. minimal-mistakes 테마 설정부터 Search Console 연동까지 단계별 가이드 포함."
date: 2025-04-25
tags: [GitHubBlog, GoogleAnalytics, GA4, minimal-mistakes, Jekyll, SearchConsole]
---

GitHub Pages 기반 Jekyll 블로그에서 방문자 추적을 하고 싶다면, Google Analytics GA4를 연동하는 것이 필수입니다. 이 글에서는 **GA4 측정 ID 삽입**, **minimal-mistakes 테마 설정**, **실시간 유입 확인**, 그리고 **Google Search Console 연동 방법**까지 전체 과정을 상세히 다룹니다.


## 1. **GA4 속성 만들기**

1. [Google Analytics](https://analytics.google.com/) 접속
2. ‘만들기’ → ‘계정 생성’ → ‘속성 만들기’ 진행
3. 웹 스트림 URL에 `https://yourname.github.io` 입력
4. 완료 후 "측정 ID (G-XXXXXXX)" 확인

## **2. Jekyll 블로그에 코드 삽입**

(1) `_config.yml`에 `analytics:` 설정 추가

```yaml
provider : google
google_analytics: G-XXXXXXXXXX  # GA4의 측정 ID
```

> **주의:** minimal-mistakes 테마 같은 경우 이 설정을 자동으로 `<head>`에 삽입해줌
> 

### 2-1. 코드 수정

#### /_includes/google.html

```html
<script async src="https://www.googletagmanager.com/gtag/js?id={{ site.analytics.google.tracking_id }}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ site.analytics.google.tracking_id }}'
  {% if site.analytics.google.anonymize_ip == true %}, { 'anonymize_ip': true }{% endif %}
  );
</script>

```

해당 코드를 추가해줍니다.

기존 코드:

```html
<script>
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', '{{ site.analytics.google.tracking_id }}']);
  {% if site.analytics.google.anonymize_ip == true %}
    _gaq.push(['_gat._anonymizeIp']);
  {% endif %}
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
```

**구글 애널리틱스 “구버전 (Universal Analytics, UA)”** 추적 코드
이런 형태는 **UA-XXXXXXX** 형식의 ID에서 쓰이던 것입니다.
2023년 7월 이후로 **완전히 종료된 API** 라서 데이터도 수집이 안된다고 합니다.

`_config.yml` 에서 `anonymize_ip:` 저는 이 옵션을 사용하지 않기 때문에 위에 코드로 대체 했습니다.

## 3. 잘 동작하는지 확인

- GA 대시보드의 실시간 탭에서 확인 가능
- `?utm_source=github_test` 같은 커스텀 링크로 유입 추적도 가능

### 3-1. 직접 테스트 진행하는 방법

1. 속성 설정 탭에 `데이터 수집 및 수정` → `데이터 스트림` → `등록한 스트림 클릭` 
2. 해당 속성의 웹 스트림 세부정부가 표시됩니다. 아래로 내려 `Google 태그` 탭에서 `태그 설정 구성` → `설치 안내` → `웹사이트 테스트(선택사항):` → 테스트 버튼을 눌러 확인해 주세요!

## 4. Google Search Console 연동

1. 속성 설정 탭에 `제품 링크` → `Serach Console 링크` → `연결` 
2. Search Console과 연결하기 창이 표시됩니다.
3. 1단계인, `Search Console 속성 선택` 에서 계정 선택 클릭
4. 등록한 깃허브 블로그 홈페이지와 속성 유형은 URL 프리픽스로 되어있습니다. 해당되는 것을 선택 후, 확인을 클릭 → 다음
5. `웹 스트림 선택` → `데이터 스트림 선택` → `다음` 
6. `보내기` 를 눌러 작업을 완료합니다.

{% img "image.png", "구글 애널리틱스 실시간 보고서" %}
보고서를 설정 후, 실시간 개요 테스트를 진행한 스크린샷입니다.