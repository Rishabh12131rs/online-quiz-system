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

    // *** NEW: Join by ID Elements ***
    const joinQuizBtn = document.getElementById('join-quiz-btn');
    const quizIdInput = document.getElementById('quiz-id-input');

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
    const quizList = document.querySelector('.quiz-list'); 

    // Editor Elements
    const createQuizBtn = document.getElementById('create-quiz-btn');
    const editorContainer = document.getElementById('editor-container');
    const closeEditorBtn = document.getElementById('close-editor-btn');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const questionListContainer = document.getElementById('question-list-container');
    const saveQuizBtn = document.getElementById('save-quiz-btn');
    const quizTitleInput = document.getElementById('quiz-title-input');
    const manageQuizzesBtn = document.getElementById('manage-quizzes-btn');
    const manageContainer = document.getElementById('manage-container');
    const closeManageBtn = document.getElementById('close-manage-btn');
    const myQuizListContainer = document.getElementById('my-quiz-list-container');

    // --- App State ---
    let questions = [];
    let currentIndex = 0;
    let score = 0;
    let timerInterval; 
    let timeLeft = 10; 

    // --- Page/Modal Toggling ---
    signInBtn.onclick = () => authContainer.style.display = 'flex';
    closeAuthBtn.onclick = () => authContainer.style.display = 'none';

    playQuizBtn.onclick = () => {
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        quizControls.style.display = 'flex'; 
        quizNav.style.display = 'none'; 
        quizArea.innerHTML = "Click 'Start Quiz' to begin!"; 
        showLeaderboard(); 
    };
    closeQuizBtn.onclick = () => {
        mainContent.style.display = 'block';
        quizAppContainer.style.display = 'none';
        loadMyQuizzes(); 
    };

    createQuizBtn.onclick = () => {
        mainContent.style.display = 'none';
        editorContainer.style.display = 'flex';
    };
    closeEditorBtn.onclick = () => {
        mainContent.style.display = 'block';
        editorContainer.style.display = 'none';
        questionListContainer.innerHTML = ''; 
        quizTitleInput.value = '';
        loadMyQuizzes(); 
    };
    
    manageQuizzesBtn.onclick = () => {
        editorContainer.style.display = 'none'; 
        manageContainer.style.display = 'flex'; 
        loadManageList(); 
    };
    closeManageBtn.onclick = () => {
        mainContent.style.display = 'block'; 
        manageContainer.style.display = 'none';
        loadMyQuizzes(); 
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

    // REUSABLE FUNCTION for starting OpenTDB quizzes
    function startApiQuiz(category, count, difficulty) { 
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';

        quizControls.style.display = 'none';
        quizArea.innerHTML = 'Loading questions...';
        quizNav.style.display = 'none';
        timerDisplay.style.display = 'none';
        
        score = 0;
        currentIndex = 0;

        let apiUrl = `https://opentdb.com/api.php?amount=${count}&category=${category}&type=multiple`;
        if (difficulty && difficulty !== "any") {
            apiUrl += `&difficulty=${difficulty}`;
        }

        fetch(apiUrl) 
            .then(res => res.json())
            .then(data => {
                questions = data.results;
                if (questions.length > 0) {
                    showQuestion();
                    quizNav.style.display = 'flex';
                } else {
                    quizArea.innerHTML = 'Could not load questions. Try a different category/difficulty.';
                    quizControls.style.display = 'flex';
                }
            })
            .catch(() => {
                quizArea.innerHTML = 'Could not load questions from Internet.';
                quizControls.style.display = 'flex';
                timerDisplay.style.display = 'none'; 
            });
    }
    
    startQuizBtn.onclick = function () { 
        const category = document.getElementById('quiz-category').value;
        const count = document.getElementById('quiz-count').value;
        const difficulty = document.getElementById('quiz-difficulty').value; 
        startApiQuiz(category, count, difficulty); 
    };

    function startCustomQuiz(quizObject) {
        questions = quizObject.questions; 
        score = 0;
        currentIndex = 0;
        
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        quizControls.style.display = 'none'; 
        quizNav.style.display = 'flex'; 
        
        showQuestion(); 
    }

    // *** NEW: Join by ID Function ***
    joinQuizBtn.onclick = () => {
        const quizId = quizIdInput.value.trim();
        if (quizId.length === 0) {
            alert("Please enter a Quiz ID.");
            return;
        }

        const myQuizzes = JSON.parse(localStorage.getItem('myQuizzes') || '[]');
        const quizToJoin = myQuizzes.find(quiz => quiz.id === quizId);

        if (quizToJoin) {
            quizIdInput.value = ''; // Clear the input
            startCustomQuiz(quizToJoin);
        } else {
            alert("Quiz ID not found. Make sure you have created and saved this quiz on this device.");
        }
    };
    
    function showQuestion() {
        clearInterval(timerInterval);
        
        if (currentIndex >= questions.length) {
            quizArea.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score is: ${score} / ${questions.length}</p>`;
            quizNav.style.display = 'none';
            quizControls.style.display = 'flex'; 
            timerDisplay.style.display = 'none'; 
            saveUserScore(localStorage.getItem('quizUser') || 'Anonymous', score);
            showLeaderboard();
            return;
        }

        const q = questions[currentIndex];
        
        let questionText, options, correctAnswer;
        
        if (q.incorrect_answers) { 
            questionText = q.question;
            options = [...q.incorrect_answers, q.correct_answer];
            correctAnswer = q.correct_answer;
            options.sort(() => Math.random() - 0.5); 
        } else { 
            questionText = q.question;
            options = [...q.options]; 
            correctAnswer = q.options[q.correct_answer_index];
        }

        let html = `<div class="question-block"><h4>Q${currentIndex + 1}: ${decodeHTML(questionText)}</h4>`;
        options.forEach((opt) => {
            const isCorrect = decodeHTML(opt) === decodeHTML(correctAnswer);
            html += `<button class="option-btn" data-correct="${isCorrect}">${decodeHTML(opt)}</button>`;
        });
        html += '</div><br><div id="feedback"></div>';
        quizArea.innerHTML = html;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => selectAnswer(btn);
        });

        updateControls();
        
        timeLeft = 10; 
        timerDisplay.textContent = timeLeft;
        timerDisplay.className = ''; 
        timerDisplay.style.display = 'block';

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 3) {
                timerDisplay.className = 'low-time'; 
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                
                const q = questions[currentIndex];
                let correctAnswerText;
                if (q.correct_answer) {
                    correctAnswerText = q.correct_answer;
                } else {
                    correctAnswerText = q.options[q.correct_answer_index];
                }

                document.getElementById('feedback').innerHTML = `<span style="color:red;">Time's up! Correct was: ${decodeHTML(correctAnswerText)}</span>`;
                disableOptions();
                
                const correctButton = document.querySelector(`.option-btn[data-correct="true"]`);
                if (correctButton) {
                    correctButton.classList.add('correct');
                }
            }
        }, 1000); 
    }

    function selectAnswer(selectedButton) {
        clearInterval(timerInterval); 

        const isCorrect = selectedButton.dataset.correct === 'true';
        const feedbackDiv = document.getElementById('feedback');
        
        disableOptions(); 

        if (isCorrect) {
            selectedButton.classList.add('correct'); 
            feedbackDiv.innerHTML = `<span style="color:green;">Correct!</span>`;
            score++;
        } else {
            selectedButton.classList.add('incorrect'); 
            
            const q = questions[currentIndex];
            let correctAnswerText;
            if (q.correct_answer) {
                correctAnswerText = q.correct_answer;
            } else {
                correctAnswerText = q.options[q.correct_answer_index];
            }

            feedbackDiv.innerHTML = `<span style="color:red;">Wrong! Correct was: ${decodeHTML(correctAnswerText)}</span>`;
            
            const correctButton = document.querySelector(`.option-btn[data-correct="true"]`);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
        }
        
        scoreLabel.textContent = 'Score: ' + score;
    }

    function disableOptions() {
        document.querySelectorAll('.option-btn').forEach((btn) => {
            btn.disabled = true;
        });
    }

    function updateControls() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= questions.length; 
        questionNum.textContent = `Q${currentIndex + 1}/${questions.length}`;
        scoreLabel.textContent = 'Score: ' + score;
    }

    nextBtn.onclick = function () {
        if (currentIndex < questions.length) { 
            currentIndex++;
            showQuestion();
        }
    };
    prevBtn.onclick = function () {
        if (currentIndex > 0) {
            currentIndex--;
            showQuestion();
            disableOptions(); 
            document.getElementById('feedback').innerHTML = "You've already answered this.";
            clearInterval(timerInterval); 
            timerDisplay.style.display = 'none'; 
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
            for (let [user, score] of sortedUsers.slice(0, 10)) { 
                html += `<li>${user}: ${score}</li>`;
            }
            html += '</ol>';
        }
        leaderboardDiv.innerHTML = html;
    }

    // --- Quiz Editor Logic ---
    let questionEditorId = 0; 

    function createNewQuestionEditor() {
        const questionId = questionEditorId++;
        const questionCard = document.createElement('div');
        questionCard.className = 'question-editor-card';
        questionCard.dataset.id = questionId;
        
        questionCard.innerHTML = `
            <textarea placeholder="Enter your question here..."></textarea>
            <div class="options-editor">
                <div class="option-input-group">
                    <input type="radio" name="correct-answer-${questionId}" value="0" checked>
                    <input type="text" placeholder="Answer 1 (Correct)">
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct-answer-${questionId}" value="1">
                    <input type="text" placeholder="Answer 2">
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct-answer-${questionId}" value="2">
                    <input type="text" placeholder="Answer 3">
                </div>
                <div class="option-input-group">
                    <input type="radio" name="correct-answer-${questionId}" value="3">
                    <input type="text" placeholder="Answer 4">
                </div>
            </div>
            <button class="delete-question-btn">Delete Question</button>
        `;

        questionCard.querySelector('.delete-question-btn').onclick = () => {
            questionCard.remove();
        };

        questionListContainer.appendChild(questionCard);
    }

    addQuestionBtn.onclick = createNewQuestionEditor;

    saveQuizBtn.onclick = () => {
        const title = quizTitleInput.value.trim();
        if (title.length < 3) {
            alert("Please enter a quiz title (at least 3 characters).");
            return;
        }

        const questionCards = questionListContainer.querySelectorAll('.question-editor-card');
        if (questionCards.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        let newQuiz = {
            id: 'custom_' + new Date().getTime(), 
            title: title,
            author: localStorage.getItem('quizUser') || 'Anonymous',
            questions: []
        };

        let allValid = true;
        
        questionCards.forEach(card => {
            const questionText = card.querySelector('textarea').value.trim();
            const optionInputs = card.querySelectorAll('.option-input-group input[type="text"]');
            const correctInput = card.querySelector('.option-input-group input[type="radio"]:checked');

            const options = [];
            optionInputs.forEach(input => options.push(input.value.trim()));
            
            const correctAnswerIndex = parseInt(correctInput.value, 10);
            
            if (questionText.length < 5) allValid = false;
            if (options.some(opt => opt.length === 0)) allValid = false; 
            if (!correctInput) allValid = false; 

            newQuiz.questions.push({
                question: questionText,
                options: options,
                correct_answer_index: correctAnswerIndex 
            });
        });

        if (!allValid) {
            alert("Please make sure all questions and answers are filled in and a correct answer is selected.");
            return;
        }

        let myQuizzes = JSON.parse(localStorage.getItem('myQuizzes') || '[]');
        myQuizzes.push(newQuiz);
        localStorage.setItem('myQuizzes', JSON.stringify(myQuizzes));

        alert(`Quiz "${title}" saved successfully!`);
        
        closeEditorBtn.click(); 
    };

    // --- Load and Display "My Quizzes" ---
    function loadMyQuizzes() {
        let myQuizzes = JSON.parse(localStorage.getItem('myQuizzes') || '[]');
        
        quizList.innerHTML = ''; 

        if (myQuizzes.length === 0) {
            quizList.innerHTML = '<p>You haven\'t created any quizzes yet! Try making one.</p>';
            return;
        }

        myQuizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';
            quizCard.textContent = quiz.title;
            quizCard.dataset.quizId = quiz.id; 

            quizCard.onclick = () => {
                startCustomQuiz(quiz); 
            };

            quizList.appendChild(quizCard);
        });
    }

    // --- Load and Display "Manage My Quizzes" List ---
    function loadManageList() {
        let myQuizzes = JSON.parse(localStorage.getItem('myQuizzes') || '[]');
        myQuizListContainer.innerHTML = ''; 

        if (myQuizzes.length === 0) {
            myQuizListContainer.innerHTML = '<p>You haven\'t created any quizzes yet!</p>';
            return;
        }

        myQuizzes.forEach((quiz, index) => {
            const quizCard = document.createElement('div');
            quizCard.className = 'manage-quiz-card';
            
            // *** UPDATED to include Share button and wrapper ***
            quizCard.innerHTML = `
                <h4>${quiz.title}</h4>
                <div class="buttons-wrapper">
                    <button class="share-quiz-btn" data-id="${quiz.id}">Share</button>
                    <button class="delete-quiz-btn" data-id="${quiz.id}">Delete</button>
                </div>
            `;

            // Add share functionality
            quizCard.querySelector('.share-quiz-btn').onclick = (e) => {
                const quizId = e.target.dataset.id;
                navigator.clipboard.writeText(quizId).then(() => {
                    alert(`Quiz ID "${quizId}" copied to clipboard!`);
                }, () => {
                    alert("Failed to copy Quiz ID.");
                });
            };

            // Add delete functionality
            quizCard.querySelector('.delete-quiz-btn').onclick = (e) => {
                const quizId = e.target.dataset.id;
                deleteQuiz(quizId);
            };

            myQuizListContainer.appendChild(quizCard);
        });
    }

    // --- Delete Quiz Function ---
    function deleteQuiz(quizId) {
        if (!confirm("Are you sure you want to delete this quiz? This cannot be undone.")) {
            return; 
        }

        let myQuizzes = JSON.parse(localStorage.getItem('myQuizzes') || '[]');
        const updatedQuizzes = myQuizzes.filter(quiz => quiz.id !== quizId);
        localStorage.setItem('myQuizzes', JSON.stringify(updatedQuizzes));
        loadManageList(); 
    }

    // --- Initialization ---
    function init() {
        const currentUser = localStorage.getItem('quizUser');
        updateUserUI(currentUser);
        loadMyQuizzes(); 
        
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';

        // Add event listeners for the nav links
        document.querySelectorAll('.subject-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                const category = link.dataset.category;
                
                if (category === 'home') {
                    // If we're in a modal, close it.
                    if (mainContent.style.display === 'none') {
                        // Use a way to close all modals safely
                        manageContainer.style.display = 'none';
                        editorContainer.style.display = 'none';
                        quizAppContainer.style.display = 'none';
                        mainContent.style.display = 'block'; 
                        loadMyQuizzes();
                    }
                } else if (category) {
                    startApiQuiz(category, 10, 'any'); // Default to 10 questions, any difficulty
                }
            });
        });
    }

    init();
});