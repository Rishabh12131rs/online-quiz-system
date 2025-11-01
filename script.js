// Authentication elements
const authContainer = document.getElementById('auth-container');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginErr = document.getElementById('login-error');
const signupErr = document.getElementById('signup-error');
const main = document.querySelector('main');
const welcomeUser = document.getElementById('welcome-user');
const logoutBtn = document.getElementById('logout-btn');

loginTab.onclick = () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.style.display = '';
  signupForm.style.display = 'none';
  loginErr.textContent = '';
};
signupTab.onclick = () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.style.display = '';
  loginForm.style.display = 'none';
  signupErr.textContent = '';
};

signupForm.onsubmit = e => {
  e.preventDefault();
  const username = signupForm.querySelector('#signup-username').value.trim();
  const password = signupForm.querySelector('#signup-password').value;
  if (username.length < 3 || password.length < 3) {
    signupErr.textContent = 'Minimum 3 characters required.';
    return;
  }
  const users = JSON.parse(localStorage.getItem('quizUsers') || '{}');
  if (users[username]) {
    signupErr.textContent = 'Username already exists.';
    return;
  }
  users[username] = password;
  localStorage.setItem('quizUsers', JSON.stringify(users));
  signupErr.textContent = 'Registered! Please login.';
  setTimeout(() => loginTab.click(), 1000);
};

loginForm.onsubmit = e => {
  e.preventDefault();
  const username = loginForm.querySelector('#login-username').value.trim();
  const password = loginForm.querySelector('#login-password').value;
  const users = JSON.parse(localStorage.getItem('quizUsers') || '{}');
  if (users[username] && users[username] === password) {
    loginErr.textContent = '';
    localStorage.setItem('quizUser', username);
    authContainer.style.display = 'none';
    main.style.display = '';
    logoutBtn.style.display = '';
    welcomeUser.textContent = `Hello, ${username}`;
  } else {
    loginErr.textContent = 'Invalid username or password.';
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem('quizUser');
  authContainer.style.display = '';
  main.style.display = 'none';
  logoutBtn.style.display = 'none';
  welcomeUser.textContent = '';
};

// Quiz Logic with API and Scores
let questions = [];
let currentIndex = 0;
let score = 0;

document.getElementById('startQuizBtn').onclick = function () {
  document.getElementById('quiz-controls').style.display = 'none';
  document.getElementById('quiz-area').innerHTML = 'Loading questions...';
  score = 0;
  currentIndex = 0;

  const category = document.getElementById('quiz-category').value;
  const count = document.getElementById('quiz-count').value;

  fetch(`https://opentdb.com/api.php?amount=${count}&category=${category}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      showQuestion();
      document.getElementById('quiz-controls').style.display = '';
      showLeaderboard();
      updateControls();
    })
    .catch(() => {
      document.getElementById('quiz-area').innerHTML = 'Could not load questions from Internet.';
    });
};

function showQuestion() {
  const q = questions[currentIndex];
  let options = [...q.incorrect_answers, q.correct_answer];
  options.sort(() => Math.random() - 0.5);

  let html = `<div class="question-block"><h4>Q${currentIndex + 1}: ${decodeHTML(q.question)}</h4>`;
  options.forEach((opt) => {
    html += `<button class="option-btn" onclick="selectAnswer('${decodeHTML(opt)}')">${decodeHTML(opt)}</button> `;
  });
  html += '</div><br><div id="feedback"></div>';
  document.getElementById('quiz-area').innerHTML = html;
  updateControls();
}

function selectAnswer(selected) {
  const q = questions[currentIndex];
  const feedbackDiv = document.getElementById('feedback');
  if (selected === decodeHTML(q.correct_answer)) {
    feedbackDiv.innerHTML = `<span style="color:green;">Correct!</span>`;
    score++;
  } else {
    feedbackDiv.innerHTML = `<span style="color:red;">Wrong! Correct: ${decodeHTML(q.correct_answer)}</span>`;
  }
  disableOptions();
  document.getElementById('scoreLabel').textContent = 'Score: ' + score;
  saveUserScore(localStorage.getItem('quizUser') || 'Anonymous', score);
  showLeaderboard();
}

function disableOptions() {
  document.querySelectorAll('.option-btn').forEach((btn) => (btn.disabled = true));
}

function updateControls() {
  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').disabled = currentIndex >= questions.length - 1;
  document.getElementById('questionNum').textContent = `Q${currentIndex + 1}`;
  document.getElementById('scoreLabel').textContent = 'Score: ' + score;
}

document.getElementById('nextBtn').onclick = function () {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  }
};
document.getElementById('prevBtn').onclick = function () {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
};

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Save score locally and update leaderboard
function saveUserScore(username, newScore) {
  let scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
  let prevScore = scores[username] || 0;
  if (newScore > prevScore) {
    scores[username] = newScore;
    localStorage.setItem('quizScores', JSON.stringify(scores));
  }
}

// Show leaderboard UI
function showLeaderboard() {
  let leaderboardDiv = document.getElementById('leaderboard');
  const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
  let sortedUsers = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  let html = '<h3>Leaderboard</h3><ol>';
  for (let [user, score] of sortedUsers) {
    html += `<li>${user}: ${score}</li>`;
  }
  html += '</ol>';
  leaderboardDiv.innerHTML = html;
}

// Initialize auth state
window.onload = () => {
  const currentUser = localStorage.getItem('quizUser');
  if (currentUser) {
    authContainer.style.display = 'none';
    main.style.display = '';
    logoutBtn.style.display = '';
    welcomeUser.textContent = `Hello, ${currentUser}`;
  } else {
    authContainer.style.display = '';
    main.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
  
  // Setup initial tab state
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.style.display = '';
  signupForm.style.display = 'none';
};
