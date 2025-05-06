---
title: "GitHub Blog 카테고리별 게시글 정렬 기능 구현"
description: "minimal-mistakes 테마 기반 GitHub 블로그에서 카테고리 페이지에 최신순/과거순 정렬 기능을 JavaScript와 Liquid로 구현하는 방법을 소개합니다."
date: 2025-05-06
tags:
  [
    GitHub Blog,
    Jekyll,
    GitHub Pages,
    minimal-mistakes,
    블로그정렬,
    liquid,
    javascript,
  ]
---

GitHub 블로그를 최신순 또는 과거순으로 정렬하고 싶다면?  
이 글에서는 minimal-mistakes 테마에서 카테고리별 게시글 정렬 기능을 구현하는 전체 과정을 코드 중심으로 정리했습니다.

---

{% img "image.png" %}

카테고리 별로 최신순/과거순 으로 정렬 기능을 추가한 스크린샷입니다.

## \_includes\posts-taxonomy-sort.html 파일 생성 및 코드 작성

```html
{% raw %}{% assign sorted_blog_posts = site.categories.blog | sort: 'date' |
reverse %}

<section id="blog" class="taxonomy__section">
  <h2 class="archive__subtitle">blog</h2>

  <label for="sort-select">정렬 순서:</label>
  <select id="sort-select">
    <option value="desc" selected>최신순</option>
    <option value="asc">과거순</option>
  </select>

  <div id="post-list" class="entries-list">
    {% for post in sorted_blog_posts %}
    <div class="post-entry" data-date="{{ post.date | date: '%Y-%m-%d' }}">
      {% include archive-single.html type='list' %}
    </div>
    {% endfor %}
  </div>

  <a href="#page-title" class="back-to-top">
    {{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }}
    &uarr;
  </a>
</section>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("sort-select");
    const list = document.getElementById("post-list");

    if (!select || !list) return;

    select.addEventListener("change", () => {
      const posts = Array.from(list.querySelectorAll(".post-entry"));
      const sortOrder = select.value;

      posts.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      list.innerHTML = "";
      posts.forEach((post) => list.appendChild(post));
    });
  });
</script>
{% endraw %}
```

## \assets\js\post-sort.js 파일 생성 및 코드 작성

```jsx
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("sort-select");
  const list = document.getElementById("post-list");

  if (!select || !list) return;

  select.addEventListener("change", () => {
    const posts = Array.from(list.querySelectorAll(".post-entry"));
    const sortOrder = select.value;

    posts.sort((a, b) => {
      const dateA = new Date(a.dataset.date);
      const dateB = new Date(b.dataset.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    list.innerHTML = "";
    posts.forEach((post) => list.appendChild(post));
  });
});
```

## \_includes\posts-category.html 수정

```html
{% raw %}{% assign raw_posts = site.categories[include.taxonomy] %} {% if
raw_posts %} {% assign posts = raw_posts | sort: 'date' | reverse %}

<div class="post-sort-bar">
  <label for="sort-select">정렬 순서:</label>
  <select id="sort-select">
    <option value="desc" selected>최신순</option>
    <option value="asc">과거순</option>
  </select>
</div>

<div id="post-list" class="entries-{{ include.type }}">
  {% for post in posts %}
  <div class="post-entry" data-date="{{ post.date | date: '%Y-%m-%d' }}">
    {% include archive-single.html type=include.type %}
  </div>
  {% endfor %}
</div>
{% else %}
<p>
  <strong>{{ include.taxonomy }}</strong> 카테고리에 해당하는 포스트가 없습니다.
</p>
{% endif %}{% endraw %}
```

기존 코드:

```html
{% raw %}{% assign posts = site.categories[include.taxonomy] | where_exp:
"post", "post.hidden != true" %} {%- for post in posts -%} {% include
archive-single.html %} {%- endfor -%}{% endraw %}
```

저는 `posts-category.html` 기존 코드는 주석 처리하고 진행했습니다.

## \_sass\minimal-mistakes_category.scss 파일 생성 및 코드 작성

```scss
.post-sort-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #444;
  padding-top: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;

  label {
    cursor: default;
    margin-right: 0.25rem;
    font-weight: 500;
    font-size: $type-size-5;
    color: $base07;
  }

  select {
    padding: 0.3rem 0.6rem;
    font-size: $type-size-6;
    color: $base00;
  }
}
```

## \_sass\minimal-mistakes_custom.scss에 코드 추가

```scss
@import "category";
```

`_custom.scss`를 만들지 않으셨다면, `\_sass\minimal-mistakes.scss` 해당 코드에 `@import "minimal-mistakes/category";` 를 추가하셔도 됩니다.

## \_includes\custom_script.html에 코드 추가

```scss
{% raw %}{% if page.layout == "category" %}
  <script src="{{ '/assets/js/post-sort.js' | relative_url }}"></script>
{% endif %}{% endraw %}
```

마찬가지로 `custom_script.html` 를 만들지 않으셨다면, `_layouts\default.html` 의 하단 `</body>` 위에 추가하셔도 됩니다.
