// --- Authentication ---
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginErr = document.getElementById('login-error');
const signupErr = document.getElementById('signup-error');
const authContainer = document.getElementById('auth-container');
const mainMenu = document.getElementById('main-menu');
const quizContainer = document.getElementById('quiz-container');
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
  showDashboard(username);
}

function showDashboard(username) {
  let scores = JSON.parse(localStorage.getItem('quizScores')||"{}");
  let bestScore = scores[username] || 0;
  document.getElementById("dashboard").style.display = '';
  document.getElementById("dashboard").innerHTML = 
    `<div style="background:#f9fafa;border-radius:14px;padding:13px;margin-top:6px;">
      <b>User:</b> ${username}<br>
      <b>Best Score:</b> ${bestScore}<br>
      <b>Quiz Subjects:</b> ${Object.keys(scores).length}<br>
      <span style="color:#38e2b0;">Welcome back! Ready for your next quiz?</span>
    </div>`;
}

logoutBtn.onclick = function() {
  localStorage.removeItem('quizUser');
  mainMenu.style.display = 'none';
  quizContainer.style.display = 'none';
  gamesContainer.style.display = 'none';
  authContainer.style.display = '';
  document.getElementById("dashboard").style.display = 'none';
};

window.onload = function() {
  let user = localStorage.getItem('quizUser');
  if(user) showMainMenu(user);

  // Dark mode toggle
  const themeToggle = document.getElementById('toggle-theme');
  let savedTheme = localStorage.getItem('theme') || 'light';
  if(savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if(themeToggle) themeToggle.checked = true;
  }
  if(themeToggle) {
    themeToggle.addEventListener('change', () => {
      if(themeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
};

// --- Main Menu ---
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
    if(btn.dataset.game==="tictactoe") loadTicTacToe();
  };
});

// --- Tic-Tac-Toe Game ---
function loadTicTacToe() {
  gameArea.innerHTML = `
    <style>
      .ttt-row{display:flex;}
      .ttt-cell{width:60px;height:60px;font-size:2rem;text-align:center;border:1px solid #888;background:#f3f3f3;cursor:pointer;}
    </style>
    <h3>Tic-Tac-Toe</h3>
    <div id="ttt-board"></div>
    <div id="ttt-result"></div>
    <button onclick="resetTTT()">Restart</button>
  `;
  let board = [["", "", ""],["", "", ""],["", "", ""]];
  let player = "X", winner = null;
  
  function render() {
    let html = "";
    for(let i=0;i<3;i++){
      html += '<div class="ttt-row">';
      for(let j=0;j<3;j++){
        html += `<div class="ttt-cell" data-row="${i}" data-col="${j}">${board[i][j]}</div>`;
      }
      html+="</div>";
    }
    document.getElementById("ttt-board").innerHTML = html;
    document.getElementById("ttt-result").innerText = winner
      ? (winner==="D" ? "Draw!" : winner + " wins!")
      : "Player: " + player;
    document.querySelectorAll(".ttt-cell").forEach(el=>{
      el.onclick = function(){
        let r=this.dataset.row, c=this.dataset.col;
        if(board[r][c] || winner) return;
        board[r][c]=player;
        winner=checkWin();
        if(!winner) player = player==="X" ? "O" : "X";
        render();
      }
    });
  }
  function checkWin() {
    for(let i=0;i<3;i++)
      if(board[i][0] && board[i][0]==board[i][1] && board[i][1]==board[i][2]) return board[i][0];
    for(let j=0;j<3;j++)
      if(board[0][j] && board[0][j]==board[1][j] && board[1][j]==board[2][j]) return board[0][j];
    if(board[0][0] && board[0][0]==board[1][1] && board[1][1]==board[2][2]) return board[0][0];
    if(board[2][0] && board[2][0]==board[1][1] && board[1][1]==board[0][2]) return board[2][0];
    if(board.flat().every(v=>v)) return "D";
    return null;
  }
  window.resetTTT = function(){
    for(let i=0;i<3;i++)for(let j=0;j<3;j++)board[i][j]="";
    player="X";winner=null;render();
  };
  render();
}

// --- Quiz Logic ---
// (unchanged)
