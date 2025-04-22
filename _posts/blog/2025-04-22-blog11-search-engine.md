---
title: "GitHub Blog 검색엔진 설정"
date: 2025-04-22
tags: [GitHubBlog]
---

GitHub Blog #11

## 검색 엔진 개요

월드 와이드 웹 상에 존재하는 정보와 웹 사이트를 검색하기 위한 프로그램. 웹의 정보를 긁어오는 소프트웨어는 크롤러라고 부르고, 그 행위는 크롤링이라고 부른다. 참고로 일반 검색 엔진에 안 잡히는 웹을 딥 웹이라고 한다.

## 검색 엔진 종류

구글, 네이버, Bing, zum, 네이트, 다음… 여러가지가 있습니다.

## Google Search Console

**Google Search Console :** [https://search.google.com/search-console/welcome?utm_source=about-page](https://search.google.com/search-console/welcome?utm_source=about-page)

{% img "image1.png" %}

접속 후, URL 접두어에 자기 블로그 주소를 추가 후, 계숙을 눌러줍니다.

{% img "image2.png" %}

계숙 버튼을 눌러 진행을 하면 다음 화면이 나오는데, 파일을 다운로드 받고 다운 받은 파일을 깃허브 저장소 최상단 폴더에 넣어줍니다.

{% img "image3.png" %}

저장소에 push를 진행하고, 배포가 완료된 후, 확인 버튼을 눌러 진행하면 다음과 같이 창이 바뀌는데, 속성으로 이동을 눌러 설정을 해주도록 합시다.

{% img "image4.png" %}

Sitemap을 눌러 해당 설정 화면이 나오면 sitemap.xml을 추가해주는 작업을 진행해야 합니다. 저는 예전에 설정해둔 sitemap이 제출이 되어있긴하네요. 일단 진행해봅시다.

## \sitemap.xml 생성

```xml
---
layout: null
---
{% raw %}
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for post in site.posts %}
    <url>
      <loc>{{ site.url }}{{ post.url }}</loc>
      {% if post.last_modified_at == null %}
        <lastmod>{{ post.date | date_to_xmlschema }}</lastmod>
      {% else %}
        <lastmod>{{ post.last_modified_at | date_to_xmlschema }}</lastmod>
      {% endif %}

      {% if post.sitemap.changefreq == null %}
        <changefreq>weekly</changefreq>
      {% else %}
        <changefreq>{{ post.sitemap.changefreq }}</changefreq>
      {% endif %}

      {% if post.sitemap.priority == null %}
          <priority>0.5</priority>
      {% else %}
        <priority>{{ post.sitemap.priority }}</priority>
      {% endif %}

    </url>
  {% endfor %}
  {% endraw %}
</urlset>
```

작성 후, 깃허브 저장소에 push를 진행합니다.

깃허브 action으로 배포가 진행이 되었다면 새 사이트맵 제출을 해줍니다.

(sitemap.xml)

{% img "image5.png" %}

일단 성공적으로 제출이 진행 되었네요.

## \robots.txt 생성

```
User-agent: *
Allow: /
Sitemap: https://ruyshy.github.io/sitemap.xml
```

robots.txt 생성 후, 깃허브 저장소에 push, 다시 사이트 맵을 제출해줍니다.

{% img "image6.png" %}

구글에 검색해보니 잘 보이는 듯 합니다.

## 추가 소유권 인증 방법2

{% img "image7.png" %}

설정 → 소유권 인증 으로 들어가보면 HTML 태그가 있습니다.

```html
<meta name="google-site-verification" content="0kzzhmbnk0AQfutCd0jcHHfNYMmXzafnXZVCY-fMSOU" />
```

content 안에 있는 내용을 복사한 뒤, _config.yml 에서 `google-site-verification:` 해당 부분을 찾습니다.

```yaml
google_site_verification : 0kzzhmbnk0AQfutCd0jcHHfNYMmXzafnXZVCY-fMSOU
```

위와 같이 content에 있는 내용을 추가해줍니다. 추가 후, 깃허브 저장소에 push 진행 → 확인을 눌러 진행.




