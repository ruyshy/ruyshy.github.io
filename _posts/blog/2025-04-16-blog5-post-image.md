---
title: "GitHub Blog 이미지 경로 설정 - Jekyll 블로그 이미지 관리법"
description: "Jekyll 블로그에서 게시글 별로 이미지를 정리하는 방법과 post-image.html 인클루드를 활용한 이미지 경로 자동 설정 방식을 소개합니다."
date: 2025-04-16
tags: [GitHub Blog, 이미지 경로 설정, post-image, Jekyll 이미지 관리]
---

`Jekyll` 기반 GitHub 블로그에서 이미지를 체계적으로 관리하고 싶다면,  
**게시글 별 이미지 폴더 구조**를 사용하는 것이 좋습니다.  
이 글에서는 `post-image.html` 인클루드를 만들어,  
자동으로 포스트 경로에 맞는 이미지 경로를 지정하는 방법을 소개합니다.

## GitHub Blog Image Path 설정하기

.\_include\ 해당 경로에 `post-image.html` 생성합니다.

```html
{% raw %}
<!-- post-image.html -->
{% assign parts = page.path | split: '/' %} {% assign category = parts[1] %} {%
assign slug = parts[2] | remove: '.md' %}

<img
  src="/assets/images/{{ category }}/{{ slug }}/{{ include.name }}"
  alt="{{ include.alt | default: include.name }}"
  style="max-width: 100%;"
/>
{% endraw %}
```

예시:

1. `\_posts\blog\2025-04-10-blog-start.md` 라는 포스트가 있습니다.
2. `\assets\images\2025-04-10-blog-start` 폴더를 생성합니다.
3. 이 폴더에 게시글에 넣을 이미지를 저장합니다.
4. 예를 들어 ImageName.png라는 이미지 파일을 넣은 후, 아래 코드를 포스트에 작성하면 이미지가 표시됩니다.  
   (현재 blog라는 카테고리를 사용중, 다음 작성글에서 카테고리를 다룰 예정입니다.)

```markdown
{% raw %}{% include post-image.html name="ImageName.png" alt="image" %}{% endraw %}
```

### Image Path 설정 장점 요약

1. 폴더명만 보면 어떤 글에 쓰였는지 바로 보임.
2. `Markdown`에서도 포스트 경로 = 이미지 경로 연상하기 쉬움
3. 나중에 썸네일 자동 생성이나 포스트 삭제 시 이미지 관리도 편함

### GitHub Blog 시작하기 Post 예시 코드

```markdown
{% raw %}---
title: "GitHub Blog Start"
date: 2025-04-10
tags: [GitHubBlog]

---

# jekyll 테마 GitHub Blog 시작하기

## Jekyll 기반 GitHub Blog 생성

[https://mmistakes.github.io/minimal-mistakes/](https://mmistakes.github.io/minimal-mistakes/)

해당 `Jekyll` 테마 기준으로 작성 되어있습니다.

## 준비해야 할 준비물

개인 GitHub 계정 ([https://github.com/](https://github.com/))

Visual Studio Code ([https://code.visualstudio.com/](https://code.visualstudio.com/))

## GitHub Blog 시작하기

[https://github.com/mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)

github 홈페이지에서 로그인을 한 상태로 해당 `jekyll` 테마 github 사이트에 접속합니다.
{% include post-image.html name="mmistakes_minimal-mistakes___triangular_ruler__Jekyll_theme_for_building_a_personal_site_blog_project_documentation_or_portfolio._-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_47_30.png" alt="mmistakes" %}

해당 사이트에서 위 오른쪽에 `Fork`가 있습니다. 해당 버튼을 눌러주세요.

`Fork` 버튼을 누르면 로그인하고있는 Github계정에 **repositories(저장소)** 에 똑같은 코드를 가진 Project(코드 저장소)가 생성이 됩니다.

{% include post-image.html name="ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_53_33_-_%EB%B3%B5%EC%82%AC%EB%B3%B8.png" alt="image" %}

`Fork` 작업이 완료되면 Setting 버튼을 눌러 Setting 홈페이지로 이동합니다.

{% include post-image.html name="General_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_55_02.png" alt="image" %}

코드 저장소의 이름을 바꿔줘야 합니다.

무조건 자기 자신의 [githubID.github.io](http://githubID.github.io)

...내용{% endraw %}
```

### (다음에 설명) 이미지 플러그인 사용

위 코드는 예전 방식의 이미지를 불러오는 방식입니다. 추 후, 설명할 내용이지만
[깃허브 블로그 이미지 플러그인 사용하기](https://ruyshy.github.io/blog/blog9-Image-plugin/) 해당 게시글에서 `ruby Jekyll Liquid::Tag` 을 사용하는 방식으로 변경했습니다!
