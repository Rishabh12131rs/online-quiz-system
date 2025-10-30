let totalQuestions, currentCount = 0, score = 0, bestScore = 0, timerInterval, timerValue, timerDuration = 15;
let questions = [], selectedAnswers = [], correctAnswers = [];
const topicSelect = document.getElementById('topic');
const numQSelect = document.getElementById('numQuestions');
const startBtn = document.getElementById('start-btn');
const welcomeDiv = document.getElementById('welcome');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const questionDiv = document.getElementById('question');
const answersDiv = document.getElementById('answers');
const resultDiv = document.getElementById('result');
const leaderboardDiv = document.getElementById('leaderboard');
const nextBtn = document.getElementById('next-btn');
const timerDiv = document.getElementById('timer');
const timerValueSpan = document.getElementById('timer-value');
const reviewDiv = document.getElementById('review');
const soundCorrect = document.getElementById('sound-correct');
const soundWrong = document.getElementById('sound-wrong');

startBtn.onclick = startQuiz;
nextBtn.onclick = showNextQuestion;

function startQuiz() {
  score = 0; currentCount = 0; questions = []; selectedAnswers = []; correctAnswers = [];
  reviewDiv.innerHTML = '';
  welcomeDiv.style.display = 'none';
  progressContainer.style.display = 'block';
  timerDiv.style.display = 'block';
  leaderboardDiv.innerHTML = '';
  totalQuestions = parseInt(numQSelect.value);
  fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&category=${topicSelect.value}&type=multiple`)
    .then(res=>res.json()).then(data=>{
      questions = data.results;
      showNextQuestion();
    });
}

function showNextQuestion() {
  if(timerInterval) clearInterval(timerInterval);
  if(currentCount >= totalQuestions) return showResults();
  updateProgressBar();
  questionDiv.innerHTML = `Q${currentCount+1}: ${decodeHTML(questions[currentCount].question)}`;
  answersDiv.innerHTML = '';
  resultDiv.innerHTML = '';
  nextBtn.style.display = 'none';
  timerValue = timerDuration;
  timerValueSpan.textContent = timerValue;
  timerDiv.style.color = '#125c83';
  timerInterval = setInterval(()=>{
    timerValue--; timerValueSpan.textContent = timerValue;
    if(timerValue < 8) timerDiv.style.color = '#f15e46';
    if(timerValue <= 0) { clearInterval(timerInterval); selectAnswer(null);}
  }, 1000);
  let opts = [...questions[currentCount].incorrect_answers, questions[currentCount].correct_answer]
      .sort(()=>Math.random()-0.5);
  for(let opt of opts) {
    let btn = document.createElement('button');
    btn.textContent = decodeHTML(opt);
    btn.onclick = ()=>selectAnswer(opt);
    answersDiv.appendChild(btn);
  }
}
function selectAnswer(selected) {
  clearInterval(timerInterval);
  const currentQ = questions[currentCount];
  const correct = currentQ.correct_answer;
  correctAnswers.push(correct);
  selectedAnswers.push(selected);
  let allBtns = answersDiv.querySelectorAll('button');
  allBtns.forEach(btn=>{
    btn.disabled = true;
    if(btn.textContent === decodeHTML(correct)) btn.classList.add('correct');
    if(selected && btn.textContent === decodeHTML(selected) && selected !== correct) btn.classList.add('wrong');
  });
  if(selected === correct) {
    score++; soundCorrect.play();
    resultDiv.innerHTML = `<span class="success">Correct! 🎉</span>`;
  } else {
    soundWrong.play();
    let toShow = selected ? `Wrong! Correct answer: ${decodeHTML(correct)}` : `Time's up! Correct answer: ${decodeHTML(correct)}`;
    resultDiv.innerHTML = `<span class="fail">${toShow}</span>`;
  }
  currentCount++;
  nextBtn.style.display = 'inline-block';
}

function showResults() {
  updateProgressBar();
  timerDiv.style.display = 'none';
  questionDiv.innerHTML = `Quiz Completed!`;
  answersDiv.innerHTML = '';
  nextBtn.style.display = 'none';
  bestScore = Math.max(score, Number(localStorage.getItem("bestQuizScore")||0));
  if(score > Number(localStorage.getItem("bestQuizScore")||0)) localStorage.setItem("bestQuizScore", score);
  let badge = getBadge(score);
  resultDiv.innerHTML = `<div>Your score is <b>${score}</b> out of <b>${totalQuestions}</b></div>
    <div id="score-badge">${badge}</div>
    <div>Best score this session: <b>${bestScore}</b></div>`;
  leaderboardDiv.innerHTML = `<hr/>`;
  showReview();
  welcomeDiv.style.display = 'block';
  startBtn.textContent = "Restart Quiz";
}

function getBadge(score) {
  if (score === totalQuestions) return "🏆 <b>Perfect Score!</b>";
  if (score > totalQuestions * 0.7) return "🎉 <b>Great Job!</b>";
  if (score > totalQuestions * 0.4) return "👍 <b>Good Effort!</b>";
  return "😐 <b>Keep Practicing!</b>";
}
function updateProgressBar() {
  progressBar.style.width = ((currentCount / totalQuestions) * 100) + "%";
}
function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
function showReview() {
  reviewDiv.innerHTML = `<h3>Review Answers</h3>`;
  for(let i=0; i<questions.length; i++) {
    let q = decodeHTML(questions[i].question);
    let correct = decodeHTML(correctAnswers[i]);
    let selected = decodeHTML(selectedAnswers[i]) || '(No Answer)';
    let state = (selected === correct) ? 'right' : 'wrong';
    reviewDiv.innerHTML += `
      <div class="review-qa">
        <b>Q${i+1}:</b> ${q}<br/>
        <span class="${state}">Your Answer: ${selected}</span><br/>
        <span class="right">Correct: ${correct}</span>
      </div>`;
  }
}
