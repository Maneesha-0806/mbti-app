let questions = [];
let answers = [];
let currentQuestionIndex = 0;

const scores = {
  E: 0, I: 0,
  S: 0, N: 0,
  T: 0, F: 0,
  J: 0, P: 0
};

window.onload = async () => {
  try {
    const res = await fetch('questions.json');
    questions = await res.json();

    if (!Array.isArray(questions)) {
      throw new Error("Questions not loaded as array.");
    }

    answers = new Array(questions.length).fill(null);
    showQuestion();
  } catch (err) {
    console.error("Failed to load quiz data:", err);
    document.getElementById('quiz-box').innerHTML = `<p class="text-danger">Failed to load quiz questions.</p>`;
  }
};

function showQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById('question-text').innerText = `Q${currentQuestionIndex + 1}. ${q.question}`;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.className = 'form-check d-flex justify-content-center align-items-center mb-3';
    div.innerHTML = `
      <input class="form-check-input me-2" type="radio" name="option" id="opt${idx}" value="${opt.value}"
        ${answers[currentQuestionIndex] === opt.value ? 'checked' : ''}
        onchange="selectAnswer('${opt.value}')">
      <label class="form-check-label" for="opt${idx}">${opt.text}</label>
    `;
    optionsDiv.appendChild(div);
  });

  document.getElementById('prevBtn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
  document.getElementById('nextBtn').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
  document.getElementById('submitBtn').classList.toggle('d-none', currentQuestionIndex !== questions.length - 1);
  updateProgress();
}

function selectAnswer(value) {
  answers[currentQuestionIndex] = value;
}

function nextQuestion() {
  if (!answers[currentQuestionIndex]) {
    alert("Please select an option before proceeding.");
    return;
  }
  currentQuestionIndex++;
  showQuestion();
}

function prevQuestion() {
  currentQuestionIndex--;
  showQuestion();
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const bar = document.getElementById('progressBar');
  bar.style.width = `${progress}%`;
  bar.innerText = `${Math.round(progress)}%`;
}

function submitQuiz() {
  if (!Array.isArray(answers) || answers.includes(null)) {
    alert("Please answer all questions before submitting.");
    return;
  }

  for (let i = 0; i < questions.length; i++) {
    const dichotomy = questions[i].dichotomy;
    const answer = answers[i];
    if (dichotomy.includes(answer)) {
      scores[answer]++;
    }
  }

  const resultType =
    (scores.E >= scores.I ? 'E' : 'I') +
    (scores.S >= scores.N ? 'S' : 'N') +
    (scores.T >= scores.F ? 'T' : 'F') +
    (scores.J >= scores.P ? 'J' : 'P');

  localStorage.setItem('mbtiResult', resultType);
  window.location.href = `result.html?type=${resultType}`; 
}
