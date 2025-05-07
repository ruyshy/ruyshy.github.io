---
title: "GitHub Blog 카테고리 페이지 생성하기"
description: "jekyll-paginate-v2 플러그인을 활용해 GitHub 블로그에서 카테고리 페이지를 만들고, 최신순/과거순 정렬 및 페이지네이션 기능을 구현하는 방법을 자세히 소개합니다."
date: 2025-05-07
tags:
  [
    GitHub Blog,
    Jekyll,
    GitHub Pages,
    minimal-mistakes,
    jekyll-paginate-v2,
    카테고리페이지,
    블로그정렬,
    liquid,
  ]
---

GitHub 블로그에 카테고리별 페이지를 만들고, **페이지네이션**과 **정렬 기능(최신순/과거순)** 까지 넣고 싶다면?  
이 글에서는 `jekyll-paginate-v2` 플러그인을 이용해 minimal-mistakes 테마 기반 블로그에서 **카테고리 페이지를 만드는 전 과정을 정리**했습니다.

> permalink 슬래시 문제, 페이지별 URL 구성, `taxonomy` 설정 등 함께 정리했어요.

GitHub Blog를 시작하며 페이지를 생성하는 부분에서 제일 삽질을 많이 한 것 같네요… 이전 글인 **GitHub Blog 카테고리별 게시글 정렬 기능 구현**에서 `post-sort.js`를 추가했었지만, 이번에 페이지를 생성하면서 방식이 바뀌어서 필요 없어졌습니다.

`minimal-mistakes-jekyll` 기존 해당 테마에서 `jekyll-paginate` 을 종속성으로 사용하고 있더라고요. `cmd`에서`bundle list` 를 입력해서 확인할 수 있습니다.

카테고리에서 **페이지 1 2 3…**을 사용하려면 `jekyll-paginate-v2` 가 필요합니다.

## Gem 설정

`Gemfile` 에  `gem "jekyll-paginate-v2”`  추가합니다.

`Gemfile` 을 수정했으니, `bundle install` 명령어를 통해 해당 플러그인을 추가해 줍니다.

## _config.yml 수정

`plugins:` , `whitelist:` 해당 속성들에   `- jekyll-paginate-v2` 를 추가해주고, `- jekyll-paginate` 속성이 만약 있다면 지워주시면 됩니다.

`paginate: 5` # amount of posts to show
`paginate_path: /page:num/`

해당 속성들은 주석 처리하거나 지워주세요. v2 부터는 포함하고 빌드 시, 오류가 떠요.

`pagination:` 속성:

```yaml
pagination:
  enabled: true
  collection: "posts"
  per_page: 5
  limit: 0
  permalink: "/page/:num/"
  title: ""
  sort_field: "date"
  sort_reverse: true
  trail:
    before: 2
    after: 2
  category: "posts"
  tag: ""
  locale: ""
```

저는 이렇게 설정 되어있습니다.

해당 페이지에서 관련 속성들을 더 자세하게 살펴 볼 수 있습니다:

[jekyll-paginate-v2-README-GENERATOR.md](https://github.com/sverrirs/jekyll-paginate-v2/blob/master/README-GENERATOR.md)

## _includes\posts-category.html 수정

```html
{% raw %}{% assign posts = paginator.posts | default: site.categories[include.taxonomy] %}
{% if posts %}
  <div class="entries-{{ include.type }}">
    {% for post in posts %}
      <div class="post-entry">
        {% include archive-single.html type=include.type %}
      </div>
    {% endfor %}
  </div>
{% else %}
  <p><strong>{{ include.taxonomy }}</strong> 카테고리에 해당하는 포스트가 없습니다.</p>
{% endif %}{% endraw %}
```

`post-sort.js`를 제거하고 정렬을 **jekyll-paginate-v2의 정적 페이지 방식으로 전환 예정이니,** 해당 코드로 수정을 진행합니다.

이제 `post-category.html` 이라고 네이밍 하기가 그런데 이건 추 후에 고민해봐야겠네요.

```html
{% raw %}{% if page.layout == "category" %}
  <script src="{{ '/assets/js/post-sort.js' | relative_url }}"></script>
{% endif %}{% endraw %}
```

> 이전 글인 “**GitHub Blog 카테고리별 게시글 정렬 기능 구현”** 을 진행 하셨다면 해당 코드는 더 이상 사용하지 않으니, 주석 처리 하거나 삭제 해줍니다.
저의 경로는 `_includes\custom_script.html` 입니다. 저와 다른 경로로 설정 하셨다면 `_layouts\default.html` 여기 있을 수도 있습니다.
> 

> **"정렬 선택 박스"**는 이제 `category.html`에서 **URL 전환용**으로 사용할 것입니다.
> 

## _includes\post-sort-selector.html 파일 생성&코드 추가:

```html
{% raw %}{% unless page.oldest == false %}
<div class="post-sort-bar">
  <label for="sort-select">정렬 순서:</label>
  <select id="sort-select">
    <option value="/categories/{{ page.taxonomy | downcase }}/" {% unless page.url contains '-oldest' %}selected{% endunless %}>최신순</option>
    <option value="/categories/{{ page.taxonomy | downcase }}-oldest/" {% if page.url contains '-oldest' %}selected{% endif %}>과거순</option>
  </select>
</div>

<script>
  document.getElementById("sort-select").addEventListener("change", function () {
    window.location.href = this.value;
  });
</script>
{% endunless %}{% endraw %}
```

> `-oldest` 가 붙으면 과거순, 없으면 최신순 정렬으로 진행했습니다.
`oldest:` 해당 속성을 추가했습니다. 카테고리에서 `front matter` 에서 `false` 를 해주면 해당 UI가 보이지 않게 설정 됩니다. `oldest:` 을 사용하지 않았을 때 값은 `true` 입니다.
> 
- `oldest: false` + `pagination.enabled: false` → 완전 정렬/페이징 없는 단일 페이지
- `oldest: false` + `pagination.enabled: true` →UI만 숨기고 페이지네이션은 동작

---

## _layouts\category.html 코드 수정:

```html
---
layout: archive
---
{% raw %}
{{ content }}

{% assign entries_layout = page.entries_layout | default: 'list' %}

{% include post-sort-selector.html %}

<div class="entries-{{ entries_layout }}">
  {% include posts-category.html taxonomy=page.taxonomy type=entries_layout %}
</div>

{% include paginator.html %}{% endraw %}
```

`_layouts\category.html` 을 자세히 보시면 포스트를 생성할 때, `taxonomy` 속성을 사용합니다.

---

## index.html 수정:
```html
---
title: ""
layout: home
sidebar:
  nav: "main"
pagination:
  enabled: true
---
```

기본 홈페이지도 pagination을 활성화를 진행해줬습니다.

---

저는 assembly category를 예제로 사용했습니다.

## _pages\categories\assembly.md 코드 수정:

```markdown
---
title: "Assembly"
layout: category
taxonomy: assembly
permalink: categories/assembly
pagination:
  enabled: true
  category: assembly
  per_page: 5
  sort_reverse: true
---
```

주의 사항 : `permalink: categories/assembly` 해당 코드와 `permalink: categories/assembly/` 뒤에`”/”` 를 붙여주면 작동 안합니다. 이 것 때문에 진짜 삽질 많이 했어요..

---

## _pages\categories\assembly-oldest.md 파일생성&코드 추가:

```markdown
---
title: "Assembly-Oldest"
layout: category
taxonomy: assembly
permalink: categories/assembly-oldest
pagination:
  enabled: true
  category: assembly
  per_page: 5
  sort_reverse: false
---
```

이 파일도 `permalink:` 해당 속성값에 뒤에`”/”` 를 붙여주면 작동 안하니 주의가 필요해요.

---

## 테스트 결과

`http://localhost:4000/categories/assembly/:`

{% img "assembly-category-test1.png" %}

---

`http://localhost:4000/categories/assembly-oldest/:` 

{% img "assembly-category-test2.png" %}

스크린샷을 하고 난 뒤에 알았는데.. pagination이 적용된게 안보이더라구요.

{% img "assembly-pagination.png" %}