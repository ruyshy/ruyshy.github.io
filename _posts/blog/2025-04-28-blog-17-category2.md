---
title: "GitHub Blog 카테고리 사이드바 설정 방법 - 상위/하위 카테고리 구현"
description: "GitHub 블로그에서 Liquid와 Sass를 이용해 카테고리 목록을 트리 형태(상위/하위)로 구성하고, sidebar.html, sidebar-items.html, _navigation.scss를 수정하는 방법을 단계별로 설명합니다."
date: 2025-04-28
tags:
  [
    GitHubBlog,
    Liquid,
    sidebar,
    카테고리 설정,
    Jekyll 커스터마이징,
    navigation,
    SCSS,
  ]
---

GitHub Blog에서 카테고리를 상위/하위 트리 구조로 표현하고 싶다면 이 글을 참고하세요. `Liquid` 템플릿 수정, `sidebar.html/sidebar-items.html` 추가, `_navigation.scss` 스타일 커스터마이징을 통해 **GitHub 블로그 카테고리 트리 구성**을 완성하는 방법을 자세히 정리했습니다.

이전에 다루었던 Cateory 업데이트 글입니다.

### Category 상위목록/하위목록을 만들어보자.

#### \_include/sidebar.html

```html
{% raw %}{% if page.author_profile or layout.author_profile or page.sidebar %}
<div class="sidebar sticky">
  {% if page.author_profile or layout.author_profile %} {% include
  author-profile.html %} {% endif %}

  <nav class="nav__list">
    <ul class="nav__items">
      <li class="nav__title">Category</li>
      <li><hr class="nav-divider" /></li>

      <li>
        <a
          href="{{ '/categories/' | relative_url }}"
          class="nav__item{% if page.url == '/categories/' %} active{% endif %}"
        >
          ALL <span class="count">({{ site.posts | size }})</span>
        </a>
      </li>

      {% assign category_nav = site.data.navigation.main | where: "title",
      "Category" | first %} {% if category_nav %} {% include sidebar-items.html
      items=category_nav.children %} {% endif %}
    </ul>
  </nav>
</div>
{% endif %}{% endraw %}
```

#### \_include/sidebar-items.html 추가하기

```html
{% raw %}{% for item in include.items %} {% if item.sub_title %}
<li class="nav__item-toggle">
  <input
    type="checkbox"
    id="toggle-{{ item.sub_title | slugify }}"
    class="nav__toggle"
    hidden
    checked
  />

  <label for="toggle-{{ item.sub_title | slugify }}" class="nav__subtitle">
    <span class="nav__arrow"></span> {{ item.sub_title }}
  </label>

  {% if item.children %}
  <ul class="nav__subitems">
    {% include sidebar-items.html items=item.children %}
  </ul>
  {% endif %}
</li>

{% elsif item.title %}
<li>
  {% assign category_name = item.url | split: '/' | last %} {% assign
  category_posts = site.categories[category_name] %}
  <a
    href="{{ item.url | relative_url }}"
    class="nav__item{% if page.url == item.url %} active{% endif %}"
  >
    - {{ item.title }}
    <span class="count">
      ({% if category_posts %}{{ category_posts | size }}{% else %}0{% endif %})
    </span>
  </a>
</li>

{% endif %} {% endfor %}{% endraw %}
```

#### \_sass/minimal-mistakes/\_navigation.scss

##### 추가해야 할 부분

```scss
.nav__subtitle {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 0.25em;
  font-size: $type-size-5;
  color: #ccc;

  .nav__arrow {
    margin-right: 0.4em;
    transition: transform 0.2s ease;
  }
}

.nav__item-toggle {
  .nav__toggle {
    &:checked + .nav__subtitle .nav__arrow::before {
      content: "▼"; /* 펼친 상태 */
    }
    & + .nav__subtitle .nav__arrow::before {
      content: "▶"; /* 접힌 상태 */
    }
    &:checked + .nav__subtitle + .nav__subitems {
      max-height: 1000px;
      opacity: 1;
      transition: max-height 0.4s ease, opacity 0.3s ease;
    }
  }
}

.nav__subitems {
  list-style: none;
  padding-left: 0.25em;
  margin-top: 0.5em;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease;

  li {
    a.nav__item {
      display: block;
      font-size: $type-size-4;
      transition: color 0.2s ease, padding-left 0.2s ease;
    }
  }
}
```

##### 수정해야 할 부분

기존 코드:

```scss
input[type="checkbox"],
label {
  display: none;
}
```

수정 코드:

```scss
input[type="checkbox"] {
  display: none;
}
```

##### \_navigation.scss 전체 코드

{% toggle 전체 코드 보기 %}

```scss
/* ==========================================================================
   NAVIGATION
   ========================================================================== */

/*
   Breadcrumb navigation links
   ========================================================================== */

.breadcrumbs {
  @include clearfix;
  margin: 0 auto;
  max-width: 100%;
  padding-inline: 1em;
  font-family: $sans-serif;
  -webkit-animation: $intro-transition;
  animation: $intro-transition;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;

  @include breakpoint($x-large) {
    max-width: $x-large;
  }

  ol {
    padding: 0;
    list-style: none;
    font-size: $type-size-6;

    @include breakpoint($large) {
      float: inline-end;
      width: calc(100% - #{$right-sidebar-width-narrow});
    }

    @include breakpoint($x-large) {
      width: calc(100% - #{$right-sidebar-width});
    }
  }

  li {
    display: inline;
  }

  .current {
    font-weight: bold;
  }
}

/*
     Post pagination navigation links
     ========================================================================== */

.pagination {
  @include clearfix();
  float: inline-start;
  margin-top: 1em;
  padding-top: 1em;
  width: 100%;

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-family: $sans-serif;
  }

  li {
    display: block;
    float: inline-start;
    margin-inline-start: -1px;

    a {
      display: block;
      margin-bottom: 0.25em;
      padding: 0.5em 1em;
      font-family: $sans-serif;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      color: $muted-text-color;
      border: 1px solid mix(#000, $border-color, 25%);
      border-radius: 0;

      &:hover {
        color: $link-color-hover;
      }

      &.current,
      &.current.disabled {
        color: #fff;
        background: $primary-color;
      }

      &.disabled {
        color: rgba($muted-text-color, 0.5);
        pointer-events: none;
        cursor: not-allowed;
      }
    }

    &:first-child {
      margin-inline-start: 0;

      a {
        border-start-start-radius: $border-radius;
        border-end-start-radius: $border-radius;
      }
    }

    &:last-child {
      a {
        border-start-end-radius: $border-radius;
        border-end-end-radius: $border-radius;
      }
    }
  }

  /* next/previous buttons */
  &--pager {
    display: block;
    padding: 1em 2em;
    float: inline-start;
    width: 50%;
    font-family: $sans-serif;
    font-size: $type-size-5;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: $muted-text-color;
    border: 1px solid mix(#000, $border-color, 25%);
    border-radius: $border-radius;

    &:hover {
      @include yiq-contrasted($muted-text-color);
    }

    &:first-child {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    &:last-child {
      margin-inline-start: -1px;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }

    &.disabled {
      color: rgba($muted-text-color, 0.5);
      pointer-events: none;
      cursor: not-allowed;
    }
  }
}

.page__content + .pagination,
.page__meta + .pagination,
.page__share + .pagination,
.page__comments + .pagination {
  margin-top: 2em;
  padding-top: 2em;
  border-top: 1px solid $border-color;
}

/*
     Priority plus navigation
     ========================================================================== */

.greedy-nav {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: $nav-height;
  background: $background-color;

  a {
    display: block;
    margin: 0 1rem;
    color: $masthead-link-color;
    text-decoration: none;
    -webkit-transition: none;
    transition: none;

    &:hover {
      color: $masthead-link-color-hover;
    }

    &.site-logo {
      margin-inline-start: 0;
      margin-inline-end: 0.5rem;
    }

    &.site-title {
      margin-inline-start: 0;
    }
  }

  img {
    -webkit-transition: none;
    transition: none;
  }

  &__toggle {
    -ms-flex-item-align: center;
    align-self: center;
    height: $nav-toggle-height;
    border: 0;
    outline: none;
    background-color: transparent;
    cursor: pointer;
  }

  .visible-links {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;

    li {
      -webkit-box-flex: 0;
      -ms-flex: none;
      flex: none;
    }

    a {
      position: relative;

      &:before {
        content: "";
        position: absolute;
        inset-inline-start: 0;
        bottom: 0;
        height: 4px;
        background: $primary-color;
        width: 100%;
        -webkit-transition: $global-transition;
        transition: $global-transition;
        -webkit-transform: scaleX(0) translate3d(0, 0, 0);
        transform: scaleX(0) translate3d(0, 0, 0); // hide
      }

      &:hover:before {
        -webkit-transform: scaleX(1);
        -ms-transform: scaleX(1);
        transform: scaleX(1); // reveal
      }
    }
  }

  .hidden-links {
    position: absolute;
    top: 100%;
    inset-inline-end: 0;
    margin-top: 15px;
    padding: 5px;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background: $background-color;
    -webkit-box-shadow: 0 2px 4px 0 rgba(#000, 0.16), 0 2px 10px 0 rgba(#000, 0.12);
    box-shadow: 0 2px 4px 0 rgba(#000, 0.16), 0 2px 10px 0 rgba(#000, 0.12);

    &.hidden {
      display: none;
    }

    a {
      margin: 0;
      padding: 10px 20px;
      font-size: $type-size-5;

      &:hover {
        color: $masthead-link-color-hover;
        background: $navicon-link-color-hover;
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: -11px;
      inset-inline-end: 10px;
      width: 0;
      border-style: solid;
      border-width: 0 10px 10px;
      border-color: $border-color transparent;
      display: block;
      z-index: 0;
    }

    &::after {
      content: "";
      position: absolute;
      top: -10px;
      inset-inline-end: 10px;
      width: 0;
      border-style: solid;
      border-width: 0 10px 10px;
      border-color: $background-color transparent;
      display: block;
      z-index: 1;
    }

    li {
      display: block;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.no-js {
  .greedy-nav {
    .visible-links {
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      overflow: visible;
    }
  }
}

/*
     Navigation list
     ========================================================================== */

.nav__list {
  margin-bottom: 1.5em;

  input[type="checkbox"] {
    display: none;
  }

  @include breakpoint(max-width $large - 1px) {
    label {
      position: relative;
      display: inline-block;
      padding: 0.5em 2.5em 0.5em 1em;
      color: $gray;
      font-size: $type-size-6;
      font-weight: bold;
      border: 1px solid $light-gray;
      border-radius: $border-radius;
      z-index: 20;
      -webkit-transition: 0.2s ease-out;
      transition: 0.2s ease-out;
      cursor: pointer;

      &::before,
      &::after {
        content: "";
        position: absolute;
        inset-inline-end: 1em;
        top: 1.25em;
        width: 0.75em;
        height: 0.125em;
        line-height: 1;
        background-color: $gray;
        -webkit-transition: 0.2s ease-out;
        transition: 0.2s ease-out;
      }

      &:after {
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
      }

      &:hover {
        color: #fff;
        border-color: $gray;
        background-color: mix(white, #000, 20%);

        &:before,
        &:after {
          background-color: #fff;
        }
      }
    }

    /* selected*/
    input:checked + label {
      color: white;
      background-color: mix(white, #000, 20%);

      &:before,
      &:after {
        background-color: #fff;
      }
    }

    /* on hover show expand*/
    label:hover:after {
      -webkit-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      transform: rotate(90deg);
    }

    input:checked + label:hover:after {
      -webkit-transform: rotate(0);
      -ms-transform: rotate(0);
      transform: rotate(0);
    }

    ul {
      margin-bottom: 1em;
    }

    a {
      display: block;
      padding: 0.25em 0;

      @include breakpoint($large) {
        padding-top: 0.125em;
        padding-bottom: 0.125em;
      }

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.nav__list .nav__items {
  margin: 0;
  font-size: 1rem;

  a {
    color: inherit;
  }

  .active {
    margin-inline-start: -0.5em;
    padding-inline: 0.5em;
    font-weight: bold;
  }

  @include breakpoint(max-width $large - 1px) {
    position: relative;
    max-height: 0;
    opacity: 0%;
    overflow: hidden;
    z-index: 10;
    -webkit-transition: 0.3s ease-in-out;
    transition: 0.3s ease-in-out;
    -webkit-transform: translate(0, 10%);
    -ms-transform: translate(0, 10%);
    transform: translate(0, 10%);
  }
}

@include breakpoint(max-width $large - 1px) {
  .nav__list input:checked ~ .nav__items {
    -webkit-transition: 0.5s ease-in-out;
    transition: 0.5s ease-in-out;
    max-height: 9999px; /* exaggerate max-height to accommodate tall lists*/
    overflow: visible;
    opacity: 1;
    margin-top: 1em;
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}

.nav__title {
  margin: 0;
  padding: 0.5rem 0.75rem;
  font-family: $sans-serif-narrow;
  font-size: $type-size-5;
  font-weight: bold;
}

.nav-divider {
  border: none;
  border-top: 1px solid $border-color;
  margin: 0.75rem 1rem 0.5rem;
}

/* ===============================
   Sidebar Navigation toggle
   =============================== */

.nav__subtitle {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 0.25em;
  font-size: $type-size-5;
  color: #ccc;

  .nav__arrow {
    margin-right: 0.4em;
    transition: transform 0.2s ease;
  }
}

.nav__item-toggle {
  .nav__toggle {
    &:checked + .nav__subtitle .nav__arrow::before {
      content: "▼"; /* 펼친 상태 */
    }
    & + .nav__subtitle .nav__arrow::before {
      content: "▶"; /* 접힌 상태 */
    }
    &:checked + .nav__subtitle + .nav__subitems {
      max-height: 1000px;
      opacity: 1;
      transition: max-height 0.4s ease, opacity 0.3s ease;
    }
  }
}

.nav__subitems {
  list-style: none;
  padding-left: 0.25em;
  margin-top: 0.5em;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease;

  li {
    a.nav__item {
      display: block;
      font-size: $type-size-4;
      transition: color 0.2s ease, padding-left 0.2s ease;
    }
  }
}

.count {
  font-weight: normal;
  color: #888;
  margin-left: 5px;
}

/*
     Table of contents navigation
     ========================================================================== */

.toc {
  font-family: $sans-serif-narrow;
  color: $gray;
  background-color: $background-color;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  -webkit-box-shadow: $box-shadow;
  box-shadow: $box-shadow;

  .nav__title {
    color: #fff;
    font-size: $type-size-6;
    background: $primary-color;
    border-start-start-radius: $border-radius;
    border-start-end-radius: $border-radius;
  }

  // Scrollspy marks toc items as .active when they are in focus
  .active a {
    @include yiq-contrasted($active-color);
  }
}

.toc__menu {
  margin: 0;
  padding: 0;
  width: 100%;
  list-style: none;
  font-size: $type-size-6;

  @include breakpoint($large) {
    font-size: $type-size-7;
  }

  a {
    display: block;
    padding: 0.25rem 0.75rem;
    color: $muted-text-color;
    font-weight: bold;
    line-height: 1.5;
    border-bottom: 1px solid $border-color;

    &:hover {
      color: $text-color;
    }
  }

  li ul > li a {
    padding-inline-start: 1.25rem;
    font-weight: normal;
  }

  li ul li ul > li a {
    padding-inline-start: 1.75rem;
  }

  li ul li ul li ul > li a {
    padding-inline-start: 2.25rem;
  }

  li ul li ul li ul li ul > li a {
    padding-inline-start: 2.75rem;
  }

  li ul li ul li ul li ul li ul > li a {
    padding-inline-start: 3.25rem;
  }
}
```

{% endtoggle %}

#### 적용된 예시 스크린샷

{% img "cateory-preview-image.png", "category image" %}

> 스타일을 바꾸고 싶다면, `_navigation.scss` 을 수정하도록 하자!
