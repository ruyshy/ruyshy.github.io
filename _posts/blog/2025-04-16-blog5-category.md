---
title: "GitHub Blog Category 설정"
date: 2025-04-16
tags: [GitHubBlog]
---

GitHub Blog #5

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
{% raw %}
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
{% endraw %}
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

