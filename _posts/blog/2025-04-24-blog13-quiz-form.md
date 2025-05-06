---
title: "GitHub Blog Quiz Form - Liquid 플러그인으로 퀴즈 기능 구현하기"
description: "Jekyll GitHub 블로그에 퀴즈 기능을 추가하는 Liquid 기반 커스텀 플러그인 구현법과 예시 코드 제공"
date: 2025-04-24
tags: [GitHub Blog, quiz, plugin, liquid, Jekyll, javascript]
---

`Jekyll` 블로그에서 `Liquid` 플러그인으로 퀴즈(객관식/주관식) 기능을 구현하고 인터랙티브한 문제 출제를 만드는 방법을 소개합니다.

## Quiz Form 미리보기

<br/>

### 객관식

{% quiz
”
문제 1 : 객관식 미리보기 문제입니다.

```
문제의 테스트용 코드 블럭 입니다. 정답은 2번
```

" %}

- 1번
- 2번 [correct]
- 3번
- 4번

{% explanation %}
문제의 해설 보기 입니다.
{% endexplanation %}
{% endquiz %}

<br/>

### 주관식

{% quiz "test? 정답은 test" %}

- [text: test]

{% explanation %}
test 문제 입니다.
{% endexplanation %}
{% endquiz %}

## Quiz Form Code

<br/>

### \assets\js\quiz-handler.js 추가

```jsx
window.checkQuizAnswer = function (id, isText, correctTextAnswer = null) {
  const form = document.getElementById(`quiz-form-${id}`);
  const result = document.getElementById(`quiz-result-${id}`);
  const box = document.getElementById(`quiz-box-${id}`);
  const message = document.getElementById(`quiz-message-${id}`);
  const explanationToggle = document.getElementById(
    `quiz-explanation-toggle-${id}`
  );

  const selected = form.querySelector(
    `input[name='quiz-answer-${id}']:checked`
  );
  const textInput = document.getElementById(`quiz-text-${id}`);

  if (isText && textInput) {
    const userAnswer = textInput.value.trim();
    if (userAnswer === "") {
      return window.showMessage(id, "정답을 입력해주세요!", "info");
    }

    if (userAnswer === correctTextAnswer) {
      box.classList.add("quiz-correct");
      result.innerHTML = "✅ <strong>정답입니다!</strong><br><br>";
      explanationToggle.style.display = "block";
      result.appendChild(explanationToggle);
    } else {
      return window.showMessage(id, "❌ 오답입니다", "error");
    }
    return;
  }

  if (!selected) {
    return window.showMessage(id, "정답을 선택해주세요!", "info");
  }

  if (selected.dataset.correct === "true") {
    box.classList.add("quiz-correct");
    result.innerHTML = "✅ <strong>정답입니다!</strong><br><br>";
    explanationToggle.style.display = "block";
    result.appendChild(explanationToggle);
    form.querySelectorAll("input").forEach((i) => (i.disabled = true));

    const retryBtn = document.createElement("button");
    retryBtn.type = "button";
    retryBtn.innerText = "다시 풀기";
    retryBtn.style.marginTop = "1em";
    retryBtn.onclick = () => window.retryQuiz(id);
    result.appendChild(retryBtn);
  } else {
    box.classList.remove("quiz-correct");
    return window.showMessage(id, "❌ 오답입니다", "error");
  }
};

window.showMessage = function (id, text, type) {
  const el = document.getElementById(`quiz-message-${id}`);
  el.className = `quiz-message quiz-message-${type}`;
  el.innerHTML =
    text +
    '<span class="quiz-message-close" onclick="this.parentNode.style.display=\'none\'">×</span>';
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 2000);
};

window.retryQuiz = function (id) {
  const form = document.getElementById(`quiz-form-${id}`);
  const result = document.getElementById(`quiz-result-${id}`);
  const message = document.getElementById(`quiz-message-${id}`);
  const box = document.getElementById(`quiz-box-${id}`);
  const explanationToggle = document.getElementById(
    `quiz-explanation-toggle-${id}`
  );

  form.reset();
  result.innerHTML = "";
  message.style.display = "none";
  box.classList.remove("quiz-correct");
  explanationToggle.style.display = "none";

  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => (input.disabled = false));
};
```

<br/>

### \_plugins\quiz_tag.rb

```ruby
require 'erb'
include ERB::Util

module Jekyll
  class QuizBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @question_code = markup.strip[1..-2]
    end

    def render(context)
      id = rand(100_000..999_999)
      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)

      raw_nodes = self.instance_variable_get(:@body).nodelist
      explanation, choices_raw = extract_parts(raw_nodes, context)

      explanation_html = converter.convert(explanation).strip
      question_html = converter.convert(@question_code.strip)
      choices_html, correct_text_answer = build_choices_html(choices_raw, id)

      explanation_toggle_html = build_explanation_toggle_html(explanation_html, id)
      build_quiz_html(id, question_html, choices_html, explanation_toggle_html, correct_text_answer)
    end

    private

    def extract_parts(nodes, context)
      explanation = ""
      choices_raw = ""

      nodes.each do |node|
        if node.is_a?(String)
          choices_raw += node
        elsif node.respond_to?(:render)
          rendered = node.render(context)
          if node.class.name.include?("ExplanationBlock")
            explanation += rendered
          else
            choices_raw += rendered
          end
        end
      end

      [explanation, choices_raw]
    end

    def build_choices_html(choices_raw, id)
      text_answer = nil
      site = Jekyll.sites.first
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)

      html = choices_raw.lines.map(&:strip).select { |l| l.start_with?('-') }.map.with_index do |line, idx|
        if line =~ /^\-\s*\[text:\s*(.+?)\]/
          text_answer = $1.strip
          <<~HTML
            <div class="quiz-text-input">
              <input type="text" id="quiz-text-#{id}" placeholder="정답을 입력하세요">
            </div>
          HTML
        else
          label = line.sub('-', '').strip
          correct = label.include?("[correct]")
          clean_label = label.sub(/\s*\[correct\]/, '')
          clean_label_html = converter.convert(clean_label).strip
          clean_label_html = clean_label_html.sub(/^<p>/, '').sub(/<\/p>$/, '')


          <<~HTML
            <div class="quiz-choice">
              <input type="radio" name="quiz-answer-#{id}" id="quiz-#{id}-#{idx}" value="#{clean_label}" data-correct="#{correct}">
              <label for="quiz-#{id}-#{idx}">#{clean_label_html}</label>
            </div>
          HTML
        end
      end.join("\n")

      [html, text_answer]
    end


    def build_explanation_toggle_html(explanation_html, id)
      toggle_id = "toggle-#{id}"
      <<~TOGGLE
        <div class="toggle">
          <div class="toggle-label quiz-toggle" onclick="toggleTextContent('#{toggle_id}', this)" data-label="해설 보기"></div>
          <div id="#{toggle_id}" class="toggle-body" style="display: none; max-height: 0;">
            #{explanation_html}
          </div>
        </div>
      TOGGLE
    end

    def build_quiz_html(id, question_html, choices_html, explanation_toggle_html, correct_text_answer)
      is_text_mode = correct_text_answer ? 'true' : 'false'
      correct_text_arg = correct_text_answer ? "'#{correct_text_answer}'" : 'null'

      hidden_input = correct_text_answer ? %Q(<input type="hidden" id="quiz-text-answer-#{id}" value="#{correct_text_answer}">) : ""

      <<~HTML
        <div class="quiz-box" id="quiz-box-#{id}">
          <div class="quiz-message" id="quiz-message-#{id}" style="display: none;"></div>
          <div class="quiz-question">
            #{question_html}
          </div>
          <form id="quiz-form-#{id}" onsubmit="return false;">
            <div class="quiz-choices">
              #{choices_html}
              #{hidden_input}
            </div>
            <button type="button" onclick="window.checkQuizAnswer(#{id}, #{is_text_mode}, #{correct_text_arg})">제출</button>
          </form>
          <div id="quiz-result-#{id}" class="quiz-result"></div>
          <div id="quiz-explanation-toggle-#{id}" style="display:none; margin-top: 1em;">#{explanation_toggle_html}</div>
        </div>
      HTML
    end
  end

  class ExplanationBlock < Liquid::Block
    def render(context)
      super
    end
  end

  Liquid::Template.register_tag('quiz', QuizBlock)
  Liquid::Template.register_tag('explanation', ExplanationBlock)
end
```

<br/>

### \_sass\minimal-mistakes_quiz.scss

```scss
.quiz-box {
  position: relative;
  background-color: #1e1e2f;
  border: 1px solid #444;
  border-radius: 0.5rem;
  padding: 1em;
  margin: 1.5em 0;
  color: #fff;
  font-family: $monospace;

  &.quiz-correct {
    background-color: #162f1e;
    border-color: #52c41a;
  }

  form button[type="button"] {
    margin-top: 1em;
    padding: 0.5em 1.2em;
    font-size: 0.95em;
    font-family: $monospace;
    font-weight: bold;
    color: #fff;
    background-color: #2d8cf0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;

    &:hover {
      background-color: #5aaafc;
      transform: scale(1.03);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .quiz-result button[type="button"] {
    background-color: #555;
    color: #fff;
    margin-top: 1em;
    padding: 0.4em 1em;
    border: none;
    border-radius: 6px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #777;
    }
  }
}

.quiz-choice {
  display: flex;
  align-items: center;
  gap: 0.6em;
  margin: 0.4em 0;

  input[type="radio"] {
    accent-color: #2d8cf0;
    transform: scale(1.2);
    margin: 0;
  }

  label {
    cursor: pointer;
    transition: color 0.2s ease;
    margin: 0;

    &:hover {
      color: #9ecaff;
    }
  }
}

.quiz-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0.6em 1em;
  background-color: rgba(255, 77, 79, 0.7);
  color: white;
  border-radius: 4px;
  font-weight: bold;
  z-index: 10;
  transition: opacity 0.5s ease;
  box-sizing: border-box;

  &.quiz-message-info {
    background-color: rgba(24, 144, 255, 0.7);
  }

  .quiz-message-close {
    position: absolute;
    right: 0.7em;
    top: 0.2em;
    cursor: pointer;
  }
}
```

<br/><br/>

### 아래 선택해서 사용

#### 선택지 1) quiz 자주 사용할 때

##### \_layouts\default.html 에서

`<script src="/assets/js/quiz-handler.js"></script>` 추가

예시:

```html
{% raw %}---
---

<!doctype html>
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

    <script src="/assets/js/quiz-handler.js"></script>
    {% include scripts.html %}
  </body>
</html>{% endraw %}
```

<br/>

#### 선택지 2) quiz를 특정 게시물에서 선택해서 사용할 때

##### \_includes\quiz-form.html 추가

```html
{% raw %}{% if page.use_quiz %}
<script src="/assets/js/quiz-handler.js"></script>
{% endif %}{% endraw %}
```

##### \_layouts\default.html 에서

`{% raw %}{% include quiz-form.html %}{% endraw %}` 추가

예시:

```html
---
---

<!doctype html>
{% raw %}{% include copyright.html %}
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

    <!-- LIQUID TAG -->>
    {% include code-block_custom.html %}
    {% include toggle-script.html %}
    {% include quiz-form.html %}

    {% include scripts.html %}
  </body>
</html>{% endraw %}
```

사용할 때, 작성할 포스트 최상단 `YAML`에서 `use_quiz: true` 추가해야 사용 가능

<br/>

### 퀴즈 사용 예시 코드

#### 객관식 예시:

````markdown
{% raw %}{% quiz ”
문제 1 : 객관식 미리보기 문제입니다.

```
문제의 테스트용 코드 블럭 입니다. 정답은 2번
```

" %}

- 1번
- 2번 [correct]
- 3번
- 4번

{% explanation %}
문제의 해설 보기 입니다.
{% endexplanation %}
{% endquiz %}{% endraw %}
````

<br/>

#### 주관식 예시:

```markdown
{% raw %}{% quiz "test? 정답은 test" %}

- [text: test]

{% explanation %}
test 문제 입니다.
{% endexplanation %}
{% endquiz %}{% endraw %}
```
