// --- NEW: FIREBASE SETUP ---
// *** PASTE YOUR FIREBASE CONFIG KEYS HERE ***
const firebaseConfig = {
  apiKey: "AIzaSyCOSeITzHa3Ck7bq3DlK6-Rb6J1iocYHvE",
  authDomain: "quizhub-project-4b20b.firebaseapp.com",
  projectId: "quizhub-project-4b20b",
  storageBucket: "quizhub-project-4b20b.firebasestorage.app",
  messagingSenderId: "155078169148",
  appId: "1:155078169148:web:a3dc75c8f8b4ec86556939"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = firebase.firestore();
// --- END OF FIREBASE SETUP ---


document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const mainContent = document.getElementById('main-content');
    const authContainer = document.getElementById('auth-container');
    const quizAppContainer = document.getElementById('quiz-app-container');

    // Auth Elements
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginErr = document.getElementById('login-error');
    const signupErr = document.getElementById('signup-error');
    const userDisplay = document.getElementById('user-display');
    const welcomeUser = document.getElementById('welcome-user');
    const logoutBtn = document.getElementById('logout-btn');

    // Join by ID Elements
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

    // *** NEW: Results Modal Elements ***
    const resultsContainer = document.getElementById('results-container');
    const closeResultsBtn = document.getElementById('close-results-btn');
    const resultsQuizTitle = document.getElementById('results-quiz-title');
    const quizResultsListContainer = document.getElementById('quiz-results-list-container');

    // --- App State ---
    let questions = []; // Holds the questions for the *current* quiz
    let currentQuizId = null; // Holds the ID of the *current* quiz
    let currentIndex = 0;
    let score = 0;
    let timerInterval; 
    let timeLeft = 10; 

    // --- Page/Modal Toggling ---
    // (No 'signInBtn' click, as modal shows on load)

    playQuizBtn.onclick = () => {
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        quizControls.style.display = 'flex'; 
        quizNav.style.display = 'none'; 
        quizArea.innerHTML = "Click 'Start Quiz' to begin!"; 
        showLeaderboard(); // Show global leaderboard
    };
    closeQuizBtn.onclick = () => {
        mainContent.style.display = 'block';
        quizAppContainer.style.display = 'none';
        loadSharedQuizzes(); // Refresh the main page list
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
        loadSharedQuizzes(); // Refresh the main page list
    };
    
    manageQuizzesBtn.onclick = () => {
        const currentUser = localStorage.getItem('quizUser');
        // This check is redundant due to forced login, but good practice
        if (!currentUser) {
            alert("Please sign in to manage your quizzes.");
            return;
        }
        editorContainer.style.display = 'none'; 
        manageContainer.style.display = 'flex'; 
        loadManageList(currentUser); // Load quizzes for the current user
    };
    closeManageBtn.onclick = () => {
        mainContent.style.display = 'block'; 
        manageContainer.style.display = 'none';
        loadSharedQuizzes(); // Refresh main page quiz list
    };

    // *** NEW: Results Modal Toggle ***
    closeResultsBtn.onclick = () => {
        manageContainer.style.display = 'flex'; // Go back to manage modal
        resultsContainer.style.display = 'none';
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
            authContainer.style.display = 'none'; // Hide auth modal
            mainContent.style.display = 'block'; // *** SHOW THE WEBSITE ***
            loadSharedQuizzes(); // Load quizzes now that user is logged in
        } else {
            loginErr.textContent = 'Invalid username or password.';
        }
    };

    logoutBtn.onclick = () => {
        localStorage.removeItem('quizUser');
        updateUserUI(null);
        mainContent.style.display = 'none'; // *** HIDE THE WEBSITE ***
        authContainer.style.display = 'flex'; // Show login modal
    };

    function updateUserUI(username) {
        if (username) {
            userDisplay.style.display = 'flex';
            welcomeUser.textContent = `Hello, ${username}`;
        } else {
            userDisplay.style.display = 'none';
            welcomeUser.textContent = '';
        }
    }

    // --- Quiz Logic ---

    function startApiQuiz(category, count, difficulty) { 
        currentQuizId = `api_${category}_${difficulty}`; // Create a unique-ish ID
        
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

    function startCustomQuiz(quizObject, quizId) {
        questions = quizObject.questions;
        currentQuizId = quizId; // Store the ID of the quiz being played
        
        score = 0;
        currentIndex = 0;
        
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        quizControls.style.display = 'none'; 
        quizNav.style.display = 'flex'; 
        
        showQuestion(); 
    }

    // Join by ID Function (uses Firebase)
    joinQuizBtn.onclick = () => {
        const quizId = quizIdInput.value.trim();
        if (quizId.length < 10) { 
            alert("Please enter a valid Quiz ID.");
            return;
        }

        db.collection("quizzes").doc(quizId).get().then((doc) => {
            if (doc.exists) {
                quizIdInput.value = ''; // Clear the input
                startCustomQuiz(doc.data(), doc.id); // Pass the quiz data AND its ID
            } else {
                alert("Quiz ID not found in the database.");
            }
        }).catch((error) => {
            console.error("Error getting quiz:", error);
            alert("Error finding quiz. Check the console.");
        });
    };
    
    function showQuestion() {
        clearInterval(timerInterval);
        
        if (currentIndex >= questions.length) {
            quizArea.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score is: ${score} / ${questions.length}</p>`;
            quizNav.style.display = 'none';
            quizControls.style.display = 'flex'; 
            timerDisplay.style.display = 'none'; 
            
            // *** SAVE QUIZ ATTEMPT ***
            saveQuizAttempt(localStorage.getItem('quizUser') || 'Anonymous', currentQuizId, score);
            
            showLeaderboard(); // Show the global leaderboard
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

    // --- LEADERBOARD & RESULTS LOGIC ---

    // *** NEW: Saves every single attempt to the database ***
    function saveQuizAttempt(username, quizId, score) {
        if (!username || !quizId) return; // Must have user and quiz
        
        // Create a new document in 'quiz_attempts'
        db.collection("quiz_attempts").add({
            username: username,
            quizId: quizId,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => console.log("Quiz attempt saved!"))
        .catch(err => console.error("Error saving attempt: ", err));

        // We also still save to the global leaderboard
        saveGlobalHighScore(username, score);
    }
    
    // This is the global high score leaderboard
    function saveGlobalHighScore(username, newScore) {
        if (!username) username = 'Anonymous';
        if (newScore === 0) return; // Don't save zero scores

        const userDocRef = db.collection("leaderboard").doc(username);

        userDocRef.get().then((doc) => {
            if (doc.exists) {
                const currentScore = doc.data().score || 0;
                if (newScore > currentScore) {
                    userDocRef.set({ score: newScore, name: username });
                }
            } else {
                userDocRef.set({ score: newScore, name: username });
            }
        }).catch((error) => console.error("Error saving high score: ", error));
    }

    // This shows the global leaderboard
    function showLeaderboard() {
        leaderboardDiv.innerHTML = '<h3>Global Leaderboard</h3><p>Loading scores...</p>';
        
        db.collection("leaderboard")
          .orderBy("score", "desc") 
          .limit(10) 
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
                leaderboardDiv.innerHTML = '<h3>Global Leaderboard</h3><p>No scores yet. Play a quiz!</p>';
                return;
            }
            let html = '<h3>Global Leaderboard</h3><ol>';
            querySnapshot.forEach((doc) => {
                const user = doc.data().name || doc.id;
                const score = doc.data().score;
                html += `<li>${user}: ${score}</li>`;
            });
            html += '</ol>';
            leaderboardDiv.innerHTML = html;
          }).catch((error) => {
            console.error("Error getting leaderboard: ", error);
            leaderboardDiv.innerHTML = '<h3>Global Leaderboard</h3><p>Could not load scores.</p>';
          });
    }

    // *** NEW: Show results for a *specific* quiz ***
    function showQuizResults(quizId, quizTitle) {
        resultsQuizTitle.textContent = `Results for: ${quizTitle}`;
        quizResultsListContainer.innerHTML = '<p>Loading results...</p>';
        manageContainer.style.display = 'none'; // Hide manage modal
        resultsContainer.style.display = 'flex'; // Show results modal

        db.collection("quiz_attempts")
          .where("quizId", "==", quizId) // Filter by the specific quizId
          .orderBy("score", "desc") // Show highest scores first
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
                quizResultsListContainer.innerHTML = '<p>No one has played this quiz yet.</p>';
                return;
            }
            
            let html = '';
            querySnapshot.forEach((doc) => {
                const attempt = doc.data();
                html += `
                    <div class="result-card">
                        <span class="result-card-name">${attempt.username}</span>
                        <span class="result-card-score">${attempt.score}</span>
                    </div>
                `;
            });
            quizResultsListContainer.innerHTML = html;

          }).catch(err => {
            console.error("Error getting results: ", err);
            quizResultsListContainer.innerHTML = '<p>Could not load results.</p>';
          });
    }

    // --- Quiz Editor Logic (Uses Firebase) ---
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
        const currentUser = localStorage.getItem('quizUser');
        if (!currentUser) {
            alert("Please sign in to create a quiz.");
            return;
        }

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
            title: title,
            author: currentUser, 
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

        // --- Save to Firebase ---
        db.collection("quizzes").add(newQuiz).then((docRef) => {
            alert(`Quiz "${title}" saved successfully!`);
            console.log("Quiz saved with ID: ", docRef.id);
            closeEditorBtn.click(); 
        }).catch((error) => {
            console.error("Error adding document: ", error);
            alert("Error saving quiz. Check the console.");
        });
    };

    // --- Load and Display "Shared Quizzes" (from Firebase) ---
    function loadSharedQuizzes() {
        quizList.innerHTML = '<p>Loading quizzes...</p>';

        db.collection("quizzes").get().then((querySnapshot) => {
            quizList.innerHTML = ''; 
            
            if (querySnapshot.empty) {
                quizList.innerHTML = '<p>No shared quizzes found. Be the first to create one!</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const quiz = doc.data();
                const quizId = doc.id;
                
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                quizCard.textContent = quiz.title;
                quizCard.dataset.quizId = quizId; 

                quizCard.onclick = () => {
                    startCustomQuiz(quiz, quizId); // Pass ID
                };

                quizList.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            quizList.innerHTML = '<p>Could not load quizzes. Check console.</p>';
        });
    }

    // --- Load "Manage My Quizzes" List (from Firebase) ---
    function loadManageList(currentUser) {
        myQuizListContainer.innerHTML = '<p>Loading your quizzes...</p>'; 
        
        db.collection("quizzes").where("author", "==", currentUser).get().then((querySnapshot) => {
            myQuizListContainer.innerHTML = ''; 

            if (querySnapshot.empty) {
                myQuizListContainer.innerHTML = '<p>You haven\'t created any quizzes yet!</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const quiz = doc.data();
                const quizId = doc.id; 

                const quizCard = document.createElement('div');
                quizCard.className = 'manage-quiz-card';
                
                // *** UPDATED to include Results button ***
                quizCard.innerHTML = `
                    <h4>${quiz.title}</h4>
                    <div class="buttons-wrapper">
                        <button class="results-quiz-btn" data-id="${quizId}" data-title="${quiz.title}">Results</button>
                        <button class="share-quiz-btn" data-id="${quizId}">Share</button>
                        <button class="delete-quiz-btn" data-id="${quizId}">Delete</button>
                    </div>
                `;

                // Add results functionality
                quizCard.querySelector('.results-quiz-btn').onclick = (e) => {
                    const id = e.target.dataset.id;
                    const title = e.target.dataset.title;
                    showQuizResults(id, title);
                };

                // Add share functionality
                quizCard.querySelector('.share-quiz-btn').onclick = (e) => {
                    const idToShare = e.target.dataset.id;
                    navigator.clipboard.writeText(idToShare).then(() => {
                        alert(`Quiz ID "${idToShare}" copied to clipboard!`);
                    }, () => {
                        alert("Failed to copy Quiz ID.");
                    });
                };

                // Add delete functionality
                quizCard.querySelector('.delete-quiz-btn').onclick = (e) => {
                    const idToDelete = e.target.dataset.id;
                    deleteQuiz(idToDelete);
                };

                myQuizListContainer.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            myQuizListContainer.innerHTML = '<p>Could not load your quizzes.</p>';
        });
    }

    // --- Delete Quiz Function (uses Firebase) ---
    function deleteQuiz(quizId) {
        if (!confirm("Are you sure you want to delete this quiz? This cannot be undone.")) {
            return; 
        }

        db.collection("quizzes").doc(quizId).delete().then(() => {
            console.log("Quiz deleted!");
            loadManageList(localStorage.getItem('quizUser')); // Refresh the list
        }).catch((error) => {
            console.error("Error removing quiz: ", error);
            alert("Could not delete quiz. Check console.");
        });
    }

    // --- Initialization ---
    function init() {
        const currentUser = localStorage.getItem('quizUser');
        if (currentUser) {
            updateUserUI(currentUser);
            mainContent.style.display = 'block'; // Show website
            loadSharedQuizzes(); // Load quizzes
        } else {
            authContainer.style.display = 'flex'; // Force login
            mainContent.style.display = 'none'; // Hide website
        }
        
        // Setup initial auth tab state
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
                        resultsContainer.style.display = 'none';
                        mainContent.style.display = 'block'; 
                        loadSharedQuizzes();
                    }
                } else if (category) {
                    startApiQuiz(category, 10, 'any'); 
                }
            });
        });
    }

    init(); // Run the initialization
});