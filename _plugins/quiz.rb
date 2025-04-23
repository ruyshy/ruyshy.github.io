require 'erb'
include ERB::Util

module Jekyll
  class QuizBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @question_code = markup.strip[1..-2]
    end

    def render(context)
      raw_nodes = self.instance_variable_get(:@body).nodelist

      explanation = ""
      choices_raw = ""

      raw_nodes.each do |node|
        if node.is_a?(String)
          choices_raw += node
        elsif node.respond_to?(:render)
          if node.class.name.include?("ExplanationBlock")
            explanation += node.render(context)
          else
            choices_raw += node.render(context)
          end
        end
      end

      id = rand(100000..999999)

      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      explanation_html = converter.convert(explanation).strip
      question_html = converter.convert(@question_code.strip)

      toggle_id = "toggle-#{id}"
      explanation_toggle_html = <<~TOGGLE
        <div class="toggle">
          <div class="toggle-label quiz-toggle" onclick="toggleTextContent('#{toggle_id}', this)" data-label="해설 보기"></div>
          <div id="#{toggle_id}" class="toggle-body" style="display: none; max-height: 0;">
            #{explanation_html}
          </div>
        </div>
      TOGGLE

      choices = choices_raw.lines.map(&:strip).select { |l| l.start_with?('-') }
      choices_html = choices.map.with_index do |line, idx|
        label = line.sub('-', '').strip
        correct = label.include?("[correct]")
        clean_label = label.sub(/\s*\[correct\]/, '')
        %Q(
          <div class="quiz-choice">
            <input type="radio" name="quiz-answer-#{id}" id="quiz-#{id}-#{idx}" value="#{clean_label}" data-correct="#{correct}">
            <label for="quiz-#{id}-#{idx}">#{clean_label}</label>
          </div>
        )
      end.join("\n")

      html = <<~HTML
        <div class="quiz-box" id="quiz-box-#{id}">
          <div class="quiz-message" id="quiz-message-#{id}" style="display: none;"></div>
          <div class="quiz-question">
            #{question_html}
          </div>
          <form id="quiz-form-#{id}" onsubmit="return false;">
            <div class="quiz-choices">
              #{choices_html}
            </div>
            <button type="button" onclick="window.checkQuizAnswer_#{id}()">제출</button>
          </form>
          <div id="quiz-result-#{id}" class="quiz-result"></div>
          <div id="quiz-explanation-toggle-#{id}" style="display:none; margin-top: 1em;">#{explanation_toggle_html}</div>
        </div>
      HTML

      script = <<~SCRIPT
        <script>
        window.checkQuizAnswer_#{id} = function () {
          const form = document.getElementById("quiz-form-#{id}");
          const selected = form.querySelector("input[name='quiz-answer-#{id}']:checked");
          const result = document.getElementById("quiz-result-#{id}");
          const box = document.getElementById("quiz-box-#{id}");
          const message = document.getElementById("quiz-message-#{id}");
          const explanationToggle = document.getElementById("quiz-explanation-toggle-#{id}");
        
          message.style.display = 'none';
          message.style.opacity = 1;
          message.innerHTML = '';
        
          if (!selected) {
            window.showMessage_#{id}(message, "정답을 선택해주세요!", "info");
            return;
          }
        
          const inputs = form.querySelectorAll("input[name='quiz-answer-#{id}']");
          if (selected.dataset.correct === "true") {
            box.classList.add("quiz-correct");
            result.innerHTML = "✅ <strong>정답입니다!</strong><br><br>";
            explanationToggle.style.display = "block";
            result.appendChild(explanationToggle);
        
            // ✅ 정답 맞추면 input 비활성화
            inputs.forEach(input => input.disabled = true);
        
            // ✅ 다시 풀기 버튼 생성
            const retryBtn = document.createElement("button");
            retryBtn.type = "button";
            retryBtn.innerText = "다시 풀기";
            retryBtn.style.marginTop = "1em";
            retryBtn.onclick = function () {
              window.retryQuiz("#{id}");
            };
            result.appendChild(retryBtn);
        
          } else {
            box.classList.remove("quiz-correct");
            result.innerHTML = '';
            explanationToggle.style.display = "none";
            window.showMessage_#{id}(message, "❌ 오답입니다", "error");
          }
        };

        window.showMessage_#{id} = function (el, text, type) {
          el.className = "quiz-message quiz-message-" + type;
          el.innerHTML = text + '<span class="quiz-message-close" onclick=\\"this.parentNode.style.display=\\'none\\'\\">×</span>';
          el.style.display = "block";
          el.style.opacity = 0.5;

          setTimeout(() => {
            el.style.opacity = "0.2";
            setTimeout(() => { el.style.display = "none"; el.style.opacity = 0.5; }, 1000);
          }, 2000);
        };

        window.retryQuiz = function (id) {
          const form = document.getElementById("quiz-form-" + id);
          const box = document.getElementById("quiz-box-" + id);
          const result = document.getElementById("quiz-result-" + id);
          const message = document.getElementById("quiz-message-" + id);
          const explanationToggle = document.getElementById("quiz-explanation-toggle-" + id);
                
          form.reset();
          result.innerHTML = '';
          message.style.display = 'none';
          box.classList.remove("quiz-correct");
                
          // ✅ 다시 원래 위치로 되돌리고 숨기기만
          explanationToggle.style.display = 'none';
          const formAfter = form.nextElementSibling; // form 다음에 넣기
          if (formAfter && formAfter.id !== explanationToggle.id) {
            form.parentNode.insertBefore(explanationToggle, formAfter);
          }
        
          // ✅ 라디오 다시 활성화
          const inputs = form.querySelectorAll("input[name='quiz-answer-" + id + "']");
          inputs.forEach(input => input.disabled = false);
        };
        </script>
      SCRIPT

      html + script
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
