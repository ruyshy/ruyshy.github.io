---
title: "GitHub Blog Category, Post 설정"
date: 2025-04-14
tags: [GitHubBlog]
---

GitHub Blog #2

GitHub Blog 시작하기에 이어 다음 편입니다.

이 글은 기본적인 마크다운 문법을 알고 있다고 가정하고 진행합니다.

[https://www.markdownguide.org/](https://www.markdownguide.org/)

해당 사이트에서 마크다운 문법을 알아볼 수 있습니다.

## GitHub Blog 카테고리 설정

### .\_data\navigation.yml 부분입니다.

```yaml
main:
  - title: "Quick-Start Guide"
    url: https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/
  # - title: "About"
  #   url: https://mmistakes.github.io/minimal-mistakes/about/
  # - title: "Sample Posts"
  #   url: /year-archive/
  # - title: "Sample Collections"
  #   url: /collection-archive/
  # - title: "Sitemap"
  #   url: /sitemap/
```

Quick-Start Guide 해당 부분을 지워줍니다.

```yaml
- title: "Home"
    url: /
  - title: "category"
    url: /categories/
    children:
      - title: "Assembly"
        url: /categories/assembly/
    children:
      - title: "Blog"
        url: /categories/blog/
```

그리고 위와 같이 카테고리를 추가합니다.

### .\_includes\sidebar.html 입니다.

```html
{% if page.author_profile or layout.author_profile or page.sidebar %}
<div class="sidebar sticky">

  {% if page.author_profile or layout.author_profile %}
    {% include author-profile.html %}
  {% endif %}

  <nav class="nav__list">
    <ul class="nav__items">

      <!-- HOME -->
      <li>
        <a href="{{ '/' | relative_url }}" class="nav__item{% if page.url == '/' %} active{% endif %}">
          Home
        </a>
      </li>

      <!-- Divider -->
      <li><hr class="nav-divider"></li>

      <!-- CATEGORY TITLE -->
      <li class="nav__title">Category</li>

      <!-- All -->
      <li>
        <a href="{{ '/categories/' | relative_url }}" class="nav__item{% if page.url == '/categories/' %} active{% endif %}">
          - All <span class="count">({{ site.posts | size }})</span>
        </a>
      </li>

      <!-- Dynamic categories -->
      {% assign sorted_categories = site.categories | sort %}
      {% for category in sorted_categories %}
        {% assign cat_name = category[0] %}
        {% assign cat_posts = category[1] %}
        <li>
          <a href="{{ '/categories/' | append: cat_name | append: '/' | relative_url }}"
             class="nav__item{% if page.url == '/categories/' | append: cat_name | append: '/' %} active{% endif %}">
            - {{ cat_name | capitalize }} <span class="count">({{ cat_posts | size }})</span>
          </a>
        </li>
      {% endfor %}

    </ul>
  </nav>

</div>

{% endif %}

```

 위와 같이 카테고리를 설정해줍니다.

### .\_pages\categories.md 추가

```markdown
---
title: "category"
layout: categories
permalink: /categories/
---

```

예시) [ruyshy.github.io/categories/](http://ruyshy.github.io/categories/) 페이지

### 이어서 .\_pages\assembly.md

```markdown
---
title: "Assembly"
layout: category
permalink: /categories/assembly/
taxonomy: assembly
---

```

예) assembly 카테고리 추가) [ruyshy.github.io/categories/assembly/](ruyshy.github.io/categories/assembly/)

### .\_sass\_navigation.scss 편집을 진행합니다.

```html
.nav__list .nav__items {
...(source)

  .count {
    font-weight: normal;
    color: #888;
    margin-left: 5px;
  }
```

.count 부분을 추가해줍니다. (css 스타일 설정 카테고리 옆에 숫자)

### .\_config.yml 해당 파일을 편집을 진행합니다.

```yaml
# Defaults
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
      values:
        sidebar:
          nav: "main"

    values:
      layout: single
      author_profile: true
      read_time: true
      comments:
      provider: "utterances"
      utterances:
        theme: "github-dark"
        issue_term: "pathname"
        label: "comment"
      share: true
      related: true
      sidebar:
        nav: "main"

  # _pages
  - scope:
      path: ""
      type: pages
    values:
      layout: home
      author_profile: true

  #assembly categories
  - scope:
      path: "_posts/assembly"
      type: posts
    values:
      categories: [assembly]
      sidebar:
        nav: "main"

    #blog categories
  - scope:
      path: "_posts/blog"
      type: posts
    values:
      categories: [blog]
      sidebar:
        nav: "main"      
```

현재 저의 defaults: 코드입니다.

주목해야 할 부분

```yaml
    values:
      layout: single
      author_profile: true
      read_time: true
      comments:
      provider: "utterances"
      utterances:
        theme: "github-dark"
        issue_term: "pathname"
        label: "comment"
      share: true
      related: true
      sidebar:
        nav: "main"
```

해당 부분에 sidebar: 부분과

```yaml
  #assembly categories
  - scope:
      path: "_posts/assembly"
      type: posts
    values:
      categories: [assembly]
      sidebar:
        nav: "main"

    #blog categories
  - scope:
      path: "_posts/blog"
      type: posts
    values:
      categories: [blog]
      sidebar:
        nav: "main"  
```

해당 카테고리를 설정한 assembly, blog 부분입니다.

“_post/assembly” 경로에 설정에서 values: categories : [assembly] 이 값이 있으면 해당 경로에 Post는 자동으로 카테고리가 설정 됩니다.

## GitHub Blog Image Path 설정하기

.\_include\ 해당 경로에 post-image.html 생성합니다. 

```html
<!-- post-image.html -->
{% assign parts = page.path | split: '/' %}
{% assign category = parts[1] %}
{% assign slug = parts[2] | remove: '.md' %}

<img src="/assets/images/{{ category }}/{{ slug }}/{{ include.name }}" alt="{{ include.alt | default: include.name }}" style="max-width: 100%;">

```

예시:

1. .\_posts\blog\[2025-04-10-blog-start.md](http://2025-04-10-blog-start.md/)라는 포스트가 있습니다.
2. \assets\images\[2025-04-10-blog-start](http://2025-04-10-blog-start.md/) 폴더를 생성합니다.
3. 이 폴더에 게시글에 넣을 이미지를 저장합니다.
4. 예를 들어 ImageName.png라는 이미지 파일을 넣은 후, 아래 코드를 포스트에 작성하면 이미지가 표시됩니다.

```markdown
{% include post-image.html name="ImageName.png" alt="image" %}
```

### Image Path 설정 장점 요약

1. 폴더명만 보면 어떤 글에 쓰였는지 바로 보임.
2. Markdown에서도 포스트 경로 = 이미지 경로 연상하기 쉬움
3. 나중에 썸네일 자동 생성이나 포스트 삭제 시 이미지 관리도 편함

### GitHub Blog 시작하기 Post 예시 코드

```markdown
---
title: "GitHub Blog Start"
date: 2025-04-10
tags: [GitHubBlog]
---

# jekyll 테마 GitHub Blog 시작하기

## Jekyll 기반 GitHub Blog 생성

[https://mmistakes.github.io/minimal-mistakes/](https://mmistakes.github.io/minimal-mistakes/)

해당 Jekyll 테마 기준으로 작성 되어있습니다.

## 준비해야 할 준비물

개인 GitHub 계정 ([https://github.com/](https://github.com/))

Visual Studio Code ([https://code.visualstudio.com/](https://code.visualstudio.com/))

## GitHub Blog 시작하기

[https://github.com/mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)

github 홈페이지에서 로그인을 한 상태로 해당 jekyll 테마 github 사이트에 접속합니다.
{% include post-image.html name="mmistakes_minimal-mistakes___triangular_ruler__Jekyll_theme_for_building_a_personal_site_blog_project_documentation_or_portfolio._-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_47_30.png" alt="mmistakes" %}

해당 사이트에서 위 오른쪽에 Fork가 있습니다. 해당 버튼을 눌러주세요.

Fork 버튼을 누르면 로그인하고있는 Github계정에 **repositories(저장소)** 에 똑같은 코드를 가진 Project(코드 저장소)가 생성이 됩니다.

{% include post-image.html name="ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_53_33_-_%EB%B3%B5%EC%82%AC%EB%B3%B8.png" alt="image" %}

Fork 작업이 완료되면 Setting 버튼을 눌러 Setting 홈페이지로 이동합니다.

{% include post-image.html name="General_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_55_02.png" alt="image" %}

코드 저장소의 이름을 바꿔줘야 합니다.

무조건 자기 자신의 [githubID.github.io](http://githubID.github.io)

저의 경우, 제 닉네임은 ruyshy 이므로 [ruyshy.github.io](http://ruyshy.github.io) 로 설정해줍니다.

{% include post-image.html name="ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_1_59_32.png" alt="image" %}

다음으로 Code로 돌아가서 **_config.yml**을 클릭해서 해당 파일로 들어갑니다.

{% include post-image.html name="ruyshy.github.io__config.yml_at_main__ruyshy_ruyshy.github.io_-_Chrome_2025-04-10_%EC%98%A4%ED%9B%84_2_01_54.png" alt="image" %}

화면과 같이 펜모양 버튼을 눌러, 하단 메뉴인 Edit in place를 클릭하여 편집 화면으로 넘어갑니다.

 url                      : "[https://ruyshy.github.io](https://ruyshy.github.io/)"

제일 먼저 url을 위 형식처럼 변경해줍니다.
```
