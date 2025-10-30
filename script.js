// --- Main menu logic ---
const mainMenu = document.getElementById('main-menu');
const quizContainer = document.getElementById('quiz-container');
const gamesContainer = document.getElementById('games-container');
const menuQuizBtn = document.getElementById('menu-quiz-btn');
const menuGamesBtn = document.getElementById('menu-games-btn');
const gameArea = document.getElementById('game-area');

// Show correct panel on menu click
menuQuizBtn.onclick = () => {
  menuQuizBtn.classList.add('active'); menuGamesBtn.classList.remove('active');
  quizContainer.style.display = ''; gamesContainer.style.display = 'none';
};
menuGamesBtn.onclick = () => {
  menuGamesBtn.classList.add('active'); menuQuizBtn.classList.remove('active');
  gamesContainer.style.display = ''; quizContainer.style.display = 'none';
  gameArea.innerHTML = ''; // reset
};

// Launch games
document.querySelectorAll('.game-launch').forEach(btn => {
  btn.onclick = () => {
    if(btn.dataset.game==="chess") loadChess();
    if(btn.dataset.game==="puzzle") loadSliderPuzzle();
    if(btn.dataset.game==="tictactoe") loadTicTacToe();
  };
});

// Mini Game: Chess (simplified, move pieces by clicking squares)
function loadChess() {
  gameArea.innerHTML = `<iframe src="https://embed.lichess.org/tiny" width="350" height="400" frameborder="0"></iframe>`;
}

// Mini Game: Sliding Puzzle (preset 3x3 image slider)
function loadSliderPuzzle() {
  gameArea.innerHTML = `
    <iframe src="https://games.construct.net/70/slider-3x3/index.html" width="350" height="400" frameborder="0"></iframe>
  `;
}

// Mini Game: Tic-Tac-Toe (browser, simple JS)
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

