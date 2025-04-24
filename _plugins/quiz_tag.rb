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
          <<~HTML
            <div class="quiz-choice">
              <input type="radio" name="quiz-answer-#{id}" id="quiz-#{id}-#{idx}" value="#{clean_label}" data-correct="#{correct}">
              <label for="quiz-#{id}-#{idx}">#{clean_label}</label>
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
