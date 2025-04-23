---
title: "GitHub Blog 코드 복사 버튼 추가 - Jekyll에서 Copy 버튼 구현"
description: "Jekyll 블로그 코드블럭에 'Copy' 버튼을 추가하고 clipboard.js를 활용하여 복사 기능과 복사 후 메시지를 구현하는 방법을 정리합니다."
date: 2025-04-21
tags: [GitHub Blog, 코드 복사, clipboard.js, Jekyll Copy 버튼, Code block]
---

Jekyll 블로그에서 **코드블럭에 복사 버튼을 추가**하고 싶다면,  
`clipboard.js`를 활용해 `div.highlighter-rouge` 안에 Copy 버튼을 삽입하면 됩니다.  
이 글에서는 **복사 기능 구현 → 복사 후 텍스트 변경 → 로컬 대체까지**  
완벽하게 적용하는 법을 단계별로 설명합니다.


## code block copy button 추가

### \include\code-block_custom.html 추가

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('div.highlighter-rouge').forEach(function(block) {
    var button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.style.position = 'absolute';
    button.style.top = '0.25em';
    button.style.right = '0.25em';
    block.style.position = 'relative';
    block.appendChild(button);
  });

  var clipboard = new ClipboardJS('.copy-button', {
    target: function(trigger) {
      return trigger.parentElement.querySelector('pre');
    }
  });

  clipboard.on('success', function(e) {
    var originalText = e.trigger.textContent;
    e.trigger.textContent = 'Copied!';
    setTimeout(function() {
      e.trigger.textContent = originalText;
    }, 1500);
    e.clearSelection();
  });
});
</script>
```

- 복사 성공하면 버튼이 1.5초 동안 `"Copied!"`로 변하고
- 다시 `"Copy"`로 자동 복구됨.
- 오류나면 콘솔에 에러도 출력되게 함.
- local로 하고 싶을 때, https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js 해당 파일을 Ctrl+S로 저장 후, /assets/js/vendor/ 해당 경로에 clipboard.min.js 옮긴 후, 맨 위 줄 아래처럼 변경하면 local로 진행 가능! 
- `<script src="/assets/js/vendor/clipboard.min.js"></script>`

### \_layouts\default.html 코드에 추가

```html
---
---

<!doctype html>
{% raw %}
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
		<!-- 여기 추가 -->
    {% include code-block_custom.html %}
    

    {% include scripts.html %}
  </body>
</html>
{% endraw %}
```

### \_sass\minimal-mistakes\_buttons.scss 코드에 추가

```scss
.copy-button {
  background: #444;
  color: #fff;
  border: none;
  padding: 0.3em 0.7em;
  font-size: 0.7em;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s ease;
  z-index: 2;
}

.copy-button:hover {
  background: #666;
  opacity: 1;
}

```

버튼이 훨씬 부드럽고 모던하게 변함.