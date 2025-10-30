// --- Authentication Handlers ---
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginErr = document.getElementById('login-error');
const signupErr = document.getElementById('signup-error');
const authContainer = document.getElementById('auth-container');
const quizContainer = document.getElementById('quiz-container');
const mainMenu = document.getElementById('main-menu');
const welcomeUser = document.getElementById('welcome-user');
const logoutBtn = document.getElementById('logout-btn');
const gamesContainer = document.getElementById('games-container');
const menuQuizBtn = document.getElementById('menu-quiz-btn');
const menuGamesBtn = document.getElementById('menu-games-btn');
const gameArea = document.getElementById('game-area');

loginTab.onclick = function() {
  loginTab.classList.add('active'); signupTab.classList.remove('active');
  loginForm.style.display = '';
  signupForm.style.display = 'none';
  loginErr.textContent = '';
};
signupTab.onclick = function() {
  signupTab.classList.add('active'); loginTab.classList.remove('active');
  signupForm.style.display = '';
  loginForm.style.display = 'none';
  signupErr.textContent = '';
};

signupForm.onsubmit = function(e) {
  e.preventDefault();
  let username = document.getElementById('signup-username').value.trim();
  let password = document.getElementById('signup-password').value;
  if(username.length < 3 || password.length < 3) { signupErr.textContent = 'Minimum 3 characters.'; return;}
  let accounts = JSON.parse(localStorage.getItem('quizAccounts')||"{}");
  if(accounts[username]) { signupErr.textContent="User exists."; return;}
  accounts[username] = password;
  localStorage.setItem('quizAccounts', JSON.stringify(accounts));
  signupErr.textContent = "Registered! Please log in.";
  setTimeout(()=>{loginTab.click();}, 1300);
};

loginForm.onsubmit = function(e) {
  e.preventDefault();
  let username = document.getElementById('login-username').value.trim();
  let password = document.getElementById('login-password').value;
  let accounts = JSON.parse(localStorage.getItem('quizAccounts')||"{}");
  if(accounts[username] && accounts[username] === password) {
    loginErr.textContent='';
    localStorage.setItem('quizUser', username);
    showMainMenu(username);
  } else {
    loginErr.textContent="Invalid username or password.";
  }
};

function showMainMenu(username) {
  authContainer.style.display = 'none';
  mainMenu.style.display = '';
  quizContainer.style.display = '';
  gamesContainer.style.display = 'none';
  welcomeUser.textContent = "Hello, " + username;
  menuQuizBtn.classList.add('active');
  menuGamesBtn.classList.remove('active');
}

logoutBtn.onclick = function() {
  localStorage.removeItem('quizUser');
  mainMenu.style.display = 'none';
  quizContainer.style.display = 'none';
  gamesContainer.style.display = 'none';
  authContainer.style.display = '';
};

window.onload = function() {
  let user = localStorage.getItem('quizUser');
  if(user) showMainMenu(user);
};

// --- Main Menu (Quiz/Games Tab) ---
menuQuizBtn.onclick = () => {
  menuQuizBtn.classList.add('active'); menuGamesBtn.classList.remove('active');
  quizContainer.style.display = '';
  gamesContainer.style.display = 'none';
};
menuGamesBtn.onclick = () => {
  menuGamesBtn.classList.add('active'); menuQuizBtn.classList.remove('active');
  gamesContainer.style.display = '';
  quizContainer.style.display = 'none';
  gameArea.innerHTML = '';
};

document.querySelectorAll('.game-launch').forEach(btn => {
  btn.onclick = () => {
    if(btn.dataset.game==="chess") loadChess();
    if(btn.dataset.game==="puzzle") loadSliderPuzzle();
    if(btn.dataset.game==="tictactoe") loadTicTacToe();
  };
});

function loadChess() {
  gameArea.innerHTML = `<iframe src="https://embed.lichess.org/tiny" width="350" height="400" frameborder="0"></iframe>`;
}
function loadSliderPuzzle() {
  gameArea.innerHTML = `<iframe src="https://games.construct.net/70/slider-3x3/index.html" width="350" height="400" frameborder="0"></iframe>`;
}
function loadTicTacToe() {
  gameArea.innerHTML = `
  <style>
    .tt-row{display:flex;}
    .tt-cell{width:60px;height:60px;font-size:40px;text-align:center;border:1px solid #999;background:#f9f9f9;cursor:pointer;}
  </style>
  <div id="tt-status"></div>
  <div id="tt-board"></div>
  <button onclick="resetTT()">Restart</button>
  <script>
  var ttBoard = [['','',''],['','',''],['','','']];
  var ttPlayer = 'X', ttOver = false;
  function renderTT() {
    var html = '';
    for(let i=0;i<3;i++){ html+='<div class="tt-row">';
      for(let j=0;j<3;j++)
        html += '<div class="tt-cell" onclick="moveTT('+i+','+j+')">'+ttBoard[i][j]+'</div>';
      html+='</div>';
    }
    document.getElementById('tt-board').innerHTML = html;
    document.getElementById('tt-status').innerHTML = ttOver ?
      (winnerTT(ttPlayer)?(ttPlayer+' Wins!'):'Draw!') :
      ('Player: '+ttPlayer);
  }
  function moveTT(i,j) {
    if(ttOver || ttBoard[i][j]) return;
    ttBoard[i][j] = ttPlayer;
    if(winnerTT(ttPlayer)){ttOver=true;}
    else if (ttBoard.flat().every(Boolean)) {ttOver = true;}
    else {ttPlayer = ttPlayer==='X'?'O':'X';}
    renderTT();
  }
  function winnerTT(p){
    for(let i=0;i<3;i++) if(ttBoard[i][0]===p&&ttBoard[i][1]===p&&ttBoard[i][2]===p)return true;
    for(let i=0;i<3;i++) if(ttBoard[0][i]===p&&ttBoard[1][i]===p&&ttBoard[2][i]===p)return true;
    if(ttBoard[0][0]===p&&ttBoard[1][1]===p&&ttBoard[2][2]===p)return true;
    if(ttBoard[2][0]===p&&ttBoard[1][1]===p&&ttBoard[0][2]===p)return true;
    return false;
  }
  function resetTT(){ttBoard=[['','',''],['','',''],['','','']];ttPlayer='X';ttOver=false;renderTT();}
  resetTT();
  <\/script>
  `;
}

// --- Quiz Logic ---
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

if(startBtn) startBtn.onclick = startQuiz;
if(nextBtn) nextBtn.onclick = showNextQuestion;

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
    })
    .catch(()=>{ resultDiv.innerHTML='Unable to load quiz questions.'; });
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

  let user = localStorage.getItem('quizUser');
  let userScores = JSON.parse(localStorage.getItem('quizScores')||"{}");
  let oldScore = userScores[user]||0;
  if(score > oldScore) userScores[user] = score;
  localStorage.setItem('quizScores', JSON.stringify(userScores));

  let badge = getBadge(score);
  resultDiv.innerHTML = `<div>Your score is <b>${score}</b> out of <b>${totalQuestions}</b></div>
    <div id="score-badge">${badge}</div>
    <div>Best score as ${user}: <b>${userScores[user]}</b></div>`;
  leaderboardDiv.innerHTML = `<hr/><h4>Leaderboard</h4>` + leaderboardHTML();
  showReview();
  welcomeDiv.style.display = 'block';
  startBtn.textContent = "Restart Quiz";
}

function leaderboardHTML() {
  let userScores = JSON.parse(localStorage.getItem('quizScores')||"{}");
  let items = Object.keys(userScores).sort((a,b)=>userScores[b]-userScores[a])
      .map(u=>`<div><b>${u}:</b> ${userScores[u]}</div>`);
  return items.slice(0, 5).join('');
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
