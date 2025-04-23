---
title: "GitHub Blog Toggle Pugin 설정"
date: 2025-04-23
tags: [GitHubBlog]
---

GitHub Blog #12


## Markdown 기본 Toggle 사용 방법

````markdown
<details>
<summary>toggle 펼쳐보기</summary>
<div markdown="1">

```markdown
  코드
```

-- 내용 --

- 테스트1
- 테스트2

</div>
</details>
````
<br/>

### 기본 토글:

<details>
<summary>toggle 펼쳐보기</summary>
<div markdown="1">

```markdown
  코드
```

-- 내용 --

- 테스트1
- 테스트2

</div>
</details>
<br/>

## \_plugins\toggle_tag.rb 추가

```ruby
module Jekyll
    class ToggleText < Liquid::Block
      def initialize(tag_name, markup, tokens)
        super
        if markup =~ /(.*?)\s+class=["']([^"']+)["']/
          @label = $1.strip
          @extra_class = $2.strip
        else
          @label = markup.strip
          @extra_class = ""
        end
      end
  
      def render(context)
        site = context.registers[:site]
        converter = site.find_converter_instance(Jekyll::Converters::Markdown)
        content = converter.convert(super)
      
        id = "toggle-#{rand(36**6).to_s(36)}"
        label = @label.strip
      
        <<~HTML
          <div class="toggle">
            <div class="toggle-label #{@extra_class}" onclick="toggleTextContent('#{id}', this)" data-label="#{label}">
            </div>
            <div id="#{id}" class="toggle-body" style="display: none; max-height: 0;">
              #{content}
            </div>
          </div>
        HTML
      end      
    end
  end
  
  Liquid::Template.register_tag('toggle', Jekyll::ToggleText)
```
<br/>

## \_includes\toggle-script.html 추가

```html
<script>
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll('.toggle-label').forEach(labelEl => {
            const baseText = labelEl.dataset.label;
            labelEl.textContent = '▶ ' + baseText;
          });
    });
    
    function toggleTextContent(id, labelEl) {
      const content = document.getElementById(id);
      const isExpanded = content.classList.contains('expanded');
      const baseText = labelEl.dataset.label;
    
      labelEl.textContent = (isExpanded ? '▶ ' : '▼ ') + baseText;
    
      if (isExpanded) {
        content.classList.remove('expanded');
        content.style.maxHeight = '0px';
        content.style.display = 'none';
      } else {
        content.classList.add('expanded');
        content.style.display = 'block';
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    }    
</script>
```
<br/>

## \_layouts\default.html 수정

`{% raw %}{% include toggle-script.html %}{% endraw %}`  해당 코드 추가해줘야 함.

```html
---
---
{% raw %}<!doctype html>
{% include copyright.html %}
<html lang="{{ site.locale | replace: "_", "-" | default: "en" }}" class="no-js">
  <head>
    {% include head.html %}
    {% include head/custom.html %}
  </head>

  <body class="layout--{{ page.layout | default: layout.layout }}{% if page.classes or layout.classes %}{{ page.classes | default: layout.classes | join: ' ' | prepend: ' ' }}{% endif %}" dir="{% if site.rtl %}rtl{% else %}ltr{% endif %}">
    {% include_cached skip-links.html %}
    {% include_cached masthead.html %}

    <div class="initial-content">
      {{ content }}
      {% include after-content.html %}
    </div>

    {% if site.search == true %}
      <div class="search-content">
        {% include_cached search/search_form.html %}
      </div>
    {% endif %}

    <div id="footer" class="page__footer">
      <footer>
        {% include footer/custom.html %}
        {% include_cached footer.html %}
      </footer>
    </div>

    {% include code-block_custom.html %}
    {% include toggle-script.html %}

    {% include scripts.html %}
  </body>
</html>{% endraw %}
```
<br/>

## \_sass\minimal-mistakes\_custom.scss 추가

```scss
// toggle
// toggle
.toggle-label {
  font-family: $global-font-family;
  font-size: $type-size-5;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  color: #FFF;
  margin-bottom: 0.5em;
  display: inline-block;
  transition: all 0.2s ease;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.toggle-label:hover {
  cursor: pointer;  
  background-color: #333333;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.toggle-label.h1,
.toggle-label.h2,
.toggle-label.h3,
.toggle-label.h4 {
  margin-top: 0 !important;
  margin-bottom: 0.3em !important;
}
.toggle-label.h1 { @extend h1; }
.toggle-label.h2 { @extend h2; }
.toggle-label.h3 { @extend h3; }
.toggle-label.h4 { @extend h4; }
```
<br/>

## \_sass\minimal-mistakes.scss 수정

`@import "minimal-mistakes/custom";`  해당 코드 추가해줘야 함.

```scss
/* Copyright comment */
@import "minimal-mistakes/copyright";

/* Variables */
@import "minimal-mistakes/variables";

/* Mixins and functions */
@import "minimal-mistakes/vendor/breakpoint/breakpoint";
@include breakpoint-set("to ems", true);
@import "minimal-mistakes/vendor/magnific-popup/magnific-popup"; // Magnific Popup
@import "minimal-mistakes/vendor/susy/susy";
@import "minimal-mistakes/mixins";

/* Core CSS */
@import "minimal-mistakes/reset";
@import "minimal-mistakes/base";
@import "minimal-mistakes/forms";
@import "minimal-mistakes/tables";
@import "minimal-mistakes/animations";

/* Custom CSS */
@import "minimal-mistakes/custom";

/* Components */
@import "minimal-mistakes/buttons";
@import "minimal-mistakes/notices";
@import "minimal-mistakes/masthead";
@import "minimal-mistakes/navigation";
@import "minimal-mistakes/footer";
@import "minimal-mistakes/search";
@import "minimal-mistakes/syntax";

/* Utility classes */
@import "minimal-mistakes/utilities";

/* Layout specific */
@import "minimal-mistakes/page";
@import "minimal-mistakes/archive";
@import "minimal-mistakes/sidebar";
@import "minimal-mistakes/print";
```
<br/>

### toggle tag 사용법

````markdown
{% raw %}{% toggle 클릭해서 보기1 %}

이 안에 접히는 내용이 들어갑니다.
```
  코드 내용
```
- 리스트도 가능
- 코드도 가능

{% endtoggle %}
<----------------------------------------------------------------->
{% toggle 클릭해서 보기2 class="h3" %}

이 안에 접히는 내용이 들어갑니다.
```
  코드 내용
```
- 리스트도 가능
- 코드도 가능

{% endtoggle %}{% endraw %}
````

토글 태그:

{% toggle 클릭해서 보기1 %}

이 안에 접히는 내용이 들어갑니다.
```markdown
  코드 내용
```
- 리스트도 가능
- 코드도 가능

{% endtoggle %}
<----------------------------------------------------------------->
{% toggle 클릭해서 보기2 class="h3" %}

이 안에 접히는 내용이 들어갑니다.
```markdown
  코드 내용
```
- 리스트도 가능
- 코드도 가능

{% endtoggle %}
