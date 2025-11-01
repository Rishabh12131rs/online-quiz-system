document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const mainContent = document.getElementById('main-content');
    const authContainer = document.getElementById('auth-container');
    const quizAppContainer = document.getElementById('quiz-app-container');

    // Auth Elements
    const signInBtn = document.getElementById('signInBtn');
    const closeAuthBtn = document.getElementById('close-auth-btn');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginErr = document.getElementById('login-error');
    const signupErr = document.getElementById('signup-error');
    const userDisplay = document.getElementById('user-display');
    const welcomeUser = document.getElementById('welcome-user');
    const logoutBtn = document.getElementById('logout-btn');

    // Quiz App Elements
    const playQuizBtn = document.getElementById('play-quiz-btn');
    const closeQuizBtn = document.getElementById('close-quiz-btn');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizArea = document.getElementById('quiz-area');
    const quizControls = document.getElementById('quiz-controls');
    const quizNav = document.getElementById('quiz-navigation');
    const leaderboardDiv = document.getElementById('leaderboard');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const questionNum = document.getElementById('questionNum');
    const scoreLabel = document.getElementById('scoreLabel');
    const timerDisplay = document.getElementById('timer-display');

    // --- App State ---
    let questions = [];
    let currentIndex = 0;
    let score = 0;
    let timerInterval; // This will hold our countdown
    let timeLeft = 10; // Time per question (in seconds)

    // --- Page/Modal Toggling ---
    signInBtn.onclick = () => authContainer.style.display = 'flex';
    closeAuthBtn.onclick = () => authContainer.style.display = 'none';

    playQuizBtn.onclick = () => {
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        showLeaderboard(); // Show leaderboard on load
    };
    closeQuizBtn.onclick = () => {
        mainContent.style.display = 'block';
        quizAppContainer.style.display = 'none';
    };

    // --- Authentication Logic ---
    loginTab.onclick = () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        loginErr.textContent = '';
    };
    signupTab.onclick = () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.style.display = 'flex';
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
        users[username] = password; // Note: In a real app, hash this password!
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
            updateUserUI(username);
            authContainer.style.display = 'none';
        } else {
            loginErr.textContent = 'Invalid username or password.';
        }
    };

    logoutBtn.onclick = () => {
        localStorage.removeItem('quizUser');
        updateUserUI(null);
    };

    function updateUserUI(username) {
        if (username) {
            userDisplay.style.display = 'flex';
            welcomeUser.textContent = `Hello, ${username}`;
            signInBtn.style.display = 'none';
        } else {
            userDisplay.style.display = 'none';
            welcomeUser.textContent = '';
            signInBtn.style.display = 'block';
        }
    }

    // --- Quiz Logic ---
    startQuizBtn.onclick = function () {
        quizControls.style.display = 'none';
        quizArea.innerHTML = 'Loading questions...';
        quizNav.style.display = 'none';
        timerDisplay.style.display = 'none';
        score = 0;
        currentIndex = 0;

        const category = document.getElementById('quiz-category').value;
        const count = document.getElementById('quiz-count').value;

        fetch(`https://opentdb.com/api.php?amount=${count}&category=${category}&type=multiple`)
            .then(res => res.json())
            .then(data => {
                questions = data.results;
                if (questions.length > 0) {
                    showQuestion();
                    quizNav.style.display = 'flex';
                } else {
                    quizArea.innerHTML = 'Could not load questions. Try a different category.';
                    quizControls.style.display = 'flex';
                }
            })
            .catch(() => {
                quizArea.innerHTML = 'Could not load questions from Internet.';
                quizControls.style.display = 'flex';
                timerDisplay.style.display = 'none'; // Hide timer on error
            });
    };

    function showQuestion() {
        // Clear any old timer
        clearInterval(timerInterval);
        
        if (currentIndex >= questions.length) {
            quizArea.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score is: ${score} / ${questions.length}</p>`;
            quizNav.style.display = 'none';
            quizControls.style.display = 'flex';
            timerDisplay.style.display = 'none'; // Hide timer at the end
            saveUserScore(localStorage.getItem('quizUser') || 'Anonymous', score);
            showLeaderboard();
            return;
        }

        const q = questions[currentIndex];
        let options = [...q.incorrect_answers, q.correct_answer];
        // Simple shuffle
        options.sort(() => Math.random() - 0.5);

        let html = `<div class="question-block"><h4>Q${currentIndex + 1}: ${decodeHTML(q.question)}</h4>`;
        options.forEach((opt) => {
            // Use data-answer attribute for checking
            const isCorrect = decodeHTML(opt) === decodeHTML(q.correct_answer);
            html += `<button class="option-btn" data-correct="${isCorrect}">${decodeHTML(opt)}</button>`;
        });
        html += '</div><br><div id="feedback"></div>';
        quizArea.innerHTML = html;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => selectAnswer(btn);
        });

        updateControls();
        
        // --- NEW TIMER LOGIC ---
        timeLeft = 10; // Reset timer to 10 seconds
        timerDisplay.textContent = timeLeft;
        timerDisplay.className = ''; // Reset low-time class
        timerDisplay.style.display = 'block';

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 3) {
                timerDisplay.className = 'low-time'; // Add warning class
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById('feedback').innerHTML = `<span style="color:red;">Time's up! Correct was: ${decodeHTML(questions[currentIndex].correct_answer)}</span>`;
                disableOptions();
            }
        }, 1000); // Run this every 1 second
    }

    function selectAnswer(selectedButton) {
        clearInterval(timerInterval); // Stop the clock

        const isCorrect = selectedButton.dataset.correct === 'true';
        const feedbackDiv = document.getElementById('feedback');
        
        if (isCorrect) {
            feedbackDiv.innerHTML = `<span style="color:green;">Correct!</span>`;
            score++;
        } else {
            feedbackDiv.innerHTML = `<span style="color:red;">Wrong! Correct was: ${decodeHTML(questions[currentIndex].correct_answer)}</span>`;
        }
        
        disableOptions();
        scoreLabel.textContent = 'Score: ' + score;
    }

    function disableOptions() {
        document.querySelectorAll('.option-btn').forEach((btn) => {
            btn.disabled = true;
            if (btn.dataset.correct === 'true') {
                btn.style.borderColor = 'green';
                btn.style.backgroundColor = '#e0ffe0';
            }
        });
    }

    function updateControls() {
        prevBtn.disabled = currentIndex === 0;
        // Allow next button until results screen
        nextBtn.disabled = currentIndex >= questions.length; 
        questionNum.textContent = `Q${currentIndex + 1}/${questions.length}`;
        scoreLabel.textContent = 'Score: ' + score;
    }

    nextBtn.onclick = function () {
        if (currentIndex < questions.length) { // Allow going to "results" screen
            currentIndex++;
            showQuestion();
        }
    };
    prevBtn.onclick = function () {
        if (currentIndex > 0) {
            currentIndex--;
            showQuestion();
            disableOptions(); // Re-disable options on previous questions
            document.getElementById('feedback').innerHTML = "You've already answered this.";
            clearInterval(timerInterval); // Stop timer when going back
            timerDisplay.style.display = 'none'; // Hide timer when going back
        }
    };

    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // --- Leaderboard Logic ---
    function saveUserScore(username, newScore) {
        if (!username) username = 'Anonymous';
        let scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        let prevScore = scores[username] || 0;
        // Only save if it's a new high score
        if (newScore > prevScore) {
            scores[username] = newScore;
            localStorage.setItem('quizScores', JSON.stringify(scores));
        }
    }

    function showLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
        let sortedUsers = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        let html = '<h3>Leaderboard</h3>';
        if (sortedUsers.length === 0) {
            html += '<p>No scores yet. Play a quiz!</p>';
        } else {
            html += '<ol>';
            for (let [user, score] of sortedUsers.slice(0, 10)) { // Show top 10
                html += `<li>${user}: ${score}</li>`;
            }
            html += '</ol>';
        }
        leaderboardDiv.innerHTML = html;
    }

    // --- Initialization ---
    function init() {
        const currentUser = localStorage.getItem('quizUser');
        updateUserUI(currentUser);
        // Setup initial tab state
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    }

    init();
});