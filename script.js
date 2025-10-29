let currentQuestion = {};
let currentAnswers = [];
let correctAnswer = '';
let score = 0;
let totalQuestions = 10;
let currentCount = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const resultEl = document.getElementById('result');
const progressBarEl = document.getElementById('progress-bar');
const nextBtn = document.getElementById('next-btn');

function updateProgressBar() {
  progressBarEl.style.width = ((currentCount / totalQuestions) * 100) + '%';
}

function fetchQuestion() {
  if (currentCount >= totalQuestions) {
    showResults();
    return;
  }
  updateProgressBar();
  fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    .then(res => res.json())
    .then(data => {
      let questionData = data.results[0];
      currentQuestion = questionData;
      correctAnswer = questionData.correct_answer;
      currentAnswers = [...questionData.incorrect_answers, correctAnswer]
        .sort(() => Math.random() - 0.5);

      questionEl.innerHTML = `Q${currentCount + 1}: ${decodeHTML(questionData.question)}`;
      answersEl.innerHTML = '';
      resultEl.innerHTML = '';
      nextBtn.style.display = 'none';

      currentAnswers.forEach(answer => {
        let btn = document.createElement('button');
        btn.textContent = decodeHTML(answer);
        btn.onclick = () => checkAnswer(answer);
        answersEl.appendChild(btn);
      });
    }).catch(err => {
      questionEl.innerText = "Error loading question, try refresh!";
      console.error(err);
    });
}

function checkAnswer(selected) {
  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);
  nextBtn.style.display = 'inline-block';

  if (selected === correctAnswer) {
    score++;
    resultEl.textContent = "Correct! 🎉";
    resultEl.style.color = '#00b200';
  } else {
    resultEl.textContent = `Wrong! Correct answer: ${correctAnswer}`;
    resultEl.style.color = '#e63946';
  }
  currentCount++;
  updateProgressBar();
}

nextBtn.onclick = fetchQuestion;

function showResults() {
  questionEl.innerHTML = "Quiz Completed!";
  answersEl.innerHTML = '';
  nextBtn.style.display = 'none';
  resultEl.innerHTML = `<div>Your score is ${score} out of ${totalQuestions}</div><div id="score-badge">${getBadge(score)}</div>`;
}

function getBadge(score) {
  if (score === totalQuestions) return "🏆 Perfect Score!";
  if (score > totalQuestions * 0.7) return "🎉 Great Job!";
  if (score > totalQuestions * 0.4) return "👍 Good Effort!";
  return "😐 Keep Practicing!";
}

function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

fetchQuestion();
