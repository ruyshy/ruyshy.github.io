window.checkQuizAnswer = function (id, isText, correctTextAnswer = null) {
    const form = document.getElementById(`quiz-form-${id}`);
    const result = document.getElementById(`quiz-result-${id}`);
    const box = document.getElementById(`quiz-box-${id}`);
    const message = document.getElementById(`quiz-message-${id}`);
    const explanationToggle = document.getElementById(`quiz-explanation-toggle-${id}`);
  
    const selected = form.querySelector(`input[name='quiz-answer-${id}']:checked`);
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
      form.querySelectorAll("input").forEach(i => i.disabled = true);
  
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
    el.innerHTML = text + '<span class="quiz-message-close" onclick="this.parentNode.style.display=\'none\'">×</span>';
    el.style.display = "block";
  };
  
  window.retryQuiz = function (id) {
    const form = document.getElementById(`quiz-form-${id}`);
    const result = document.getElementById(`quiz-result-${id}`);
    const message = document.getElementById(`quiz-message-${id}`);
    const box = document.getElementById(`quiz-box-${id}`);
    const explanationToggle = document.getElementById(`quiz-explanation-toggle-${id}`);
  
    form.reset();
    result.innerHTML = "";
    message.style.display = "none";
    box.classList.remove("quiz-correct");
    explanationToggle.style.display = "none";
  
    const inputs = form.querySelectorAll("input");
    inputs.forEach(input => input.disabled = false);
  };
  