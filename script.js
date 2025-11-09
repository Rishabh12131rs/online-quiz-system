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

// *** NEW: PASTE YOUR GIPHY API KEY HERE ***
const GIPHY_API_KEY = "gJ7xwNUraSP6midiKKewgrHIbdMJcsVx";
// --- END OF GIPHY KEY ---
// --- 2. INITIALIZE FIREBASE ---
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const rtdb = firebase.database(); // INITIALIZE REALTIME DATABASE
// --- END OF FIREBASE SETUP ---

// *** NEW: SET YOUR ADMIN UID HERE ***
// 1. Log in to your site
// 2. Open the console (F12) and type: firebase.auth().currentUser.uid
// 3. Copy the ID and paste it here
const ADMIN_UID = "REPLACE_THIS_WITH_YOUR_FIREBASE_USER_ID";


document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const pageContainer = document.getElementById('page-container');
    const mainContent = document.getElementById('main-content');
    const authContainer = document.getElementById('auth-container');
    const quizAppContainer = document.getElementById('quiz-app-container');

    // Auth Elements
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const signupUsername = document.getElementById('signup-username');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const loginErr = document.getElementById('login-error');
    const signupErr = document.getElementById('signup-error');
    const userDisplay = document.getElementById('user-display');
    const welcomeUser = document.getElementById('welcome-user');
    const logoutBtn = document.getElementById('logout-btn');
    const googleSignInBtn = document.getElementById('google-signin-btn');

    // Forgot Password Elements
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordContainer = document.getElementById('forgot-password-container');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const forgotEmail = document.getElementById('forgot-email');
    const forgotError = document.getElementById('forgot-error');
    const backToLoginLink = document.getElementById('back-to-login-link');

    // --- UPDATED: Join Elements ---
    const joinGameBtn = document.getElementById('join-game-btn');
    const gamePinInput = document.getElementById('game-pin-input'); // One input for both

    // Quiz App (SOLO) Elements
    const playQuizBtn = document.getElementById('play-quiz-btn');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizArea = document.getElementById('quiz-area');
    const quizControls = document.getElementById('quiz-controls');
    const quizNav = document.getElementById('quiz-navigation');
    const leaderboardDiv = document.getElementById('leaderboard');
    const nextBtn = document.getElementById('nextBtn');
    const questionNum = document.getElementById('questionNum');
    const scoreLabel = document.getElementById('scoreLabel');
    const timerDisplay = document.getElementById('timer-display');
    
    // Main Page Elements
    const quizList = document.querySelector('.quiz-list'); 
    const searchBar = document.getElementById('search-bar'); 

    // --- Sidebar and View Elements ---
    const sidebarHomeBtn = document.getElementById('sidebar-home-btn');
    const sidebarLibraryBtn = document.getElementById('sidebar-library-btn');
    const sidebarDashboardBtn = document.getElementById('sidebar-dashboard-btn');
    const sidebarAdminBtn = document.getElementById('sidebar-admin-btn'); // *** NEW ***
    const homeView = document.getElementById('home-view');
    const libraryView = document.getElementById('library-view');
    const dashboardView = document.getElementById('dashboard-view');
    const dashboardWelcome = document.getElementById('dashboard-welcome');
    const dashboardMyResultsList = document.getElementById('dashboard-my-results-list');
    const dashboardMyContentList = document.getElementById('dashboard-my-content-list');

    // Quiz Editor Elements
    const createQuizBtn = document.getElementById('create-quiz-btn');
    const editorContainer = document.getElementById('editor-container');
    const closeEditorBtn = document.getElementById('close-editor-btn');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const questionListContainer = document.getElementById('question-list-container');
    const saveQuizBtn = document.getElementById('save-quiz-btn');
    const quizTitleInput = document.getElementById('quiz-title-input');
    
    // --- Study Guide Editor Elements ---
    const createStudyGuideBtn = document.getElementById('create-study-guide-btn');
    const studyEditorContainer = document.getElementById('study-editor-container');
    const closeStudyEditorBtn = document.getElementById('close-study-editor-btn');
    const studyTitleInput = document.getElementById('study-title-input');
    const addFlashcardBtn = document.getElementById('add-flashcard-btn');
    const flashcardListContainer = document.getElementById('flashcard-list-container');
    const saveStudyGuideBtn = document.getElementById('save-study-guide-btn');
    
    // --- Study Player Elements ---
    const studyPlayerContainer = document.getElementById('study-player-container');
    const studyPlayerTitle = document.getElementById('study-player-title');
    const studyFlashcard = document.getElementById('study-flashcard');
    const flashcardFrontText = document.getElementById('flashcard-front-text');
    const flashcardBackText = document.getElementById('flashcard-back-text');
    const studyPrevBtn = document.getElementById('study-prev-btn');
    const studyNextBtn = document.getElementById('study-next-btn');
    const studyCardCount = document.getElementById('study-card-count');

    // Results Modal Elements
    const resultsContainer = document.getElementById('results-container');
    const closeResultsBtn = document.getElementById('close-results-btn');
    const resultsQuizTitle = document.getElementById('results-quiz-title');
    const quizResultsListContainer = document.getElementById('quiz-results-list-container');
    
    // GIPHY Modal Elements
    const giphyContainer = document.getElementById('giphy-container');
    const closeGiphyBtn = document.getElementById('close-giphy-btn');
    const giphySearchBar = document.getElementById('giphy-search-bar');
    const giphySearchBtn = document.getElementById('giphy-search-btn');
    const giphyResultsGrid = document.getElementById('giphy-results-grid');
    
    // Toast & Dark Mode
    const toast = document.getElementById('toast-notification');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // --- *** NEW: Admin Panel Elements *** ---
    const adminContainer = document.getElementById('admin-container');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const addExamForm = document.getElementById('add-exam-form');
    const addSubjectForm = document.getElementById('add-subject-form');
    const addTopicForm = document.getElementById('add-topic-form');
    const addExamQuestionForm = document.getElementById('add-exam-question-form');
    const adminExamSelect = document.getElementById('admin-exam-select');
    const adminSubjectSelect = document.getElementById('admin-subject-select');
    const adminTopicSelect = document.getElementById('admin-topic-select');

    // --- Live Game View Elements ---
    const hostLobbyView = document.getElementById('host-lobby-view');
    // ... (all other game elements) ...
    const hostLobbyTitle = document.getElementById('host-lobby-title');
    const hostLobbyPin = document.getElementById('host-lobby-pin');
    const hostStartGameBtn = document.getElementById('host-start-game-btn');
    const hostLobbyPlayers = document.getElementById('host-lobby-players');
    const playerLobbyView = document.getElementById('player-lobby-view');
    const playerLobbyPlayers = document.getElementById('player-lobby-players');
    const gameHostView = document.getElementById('game-host-view');
    const gameHostTimer = document.getElementById('game-host-timer');
    const gameHostQCount = document.getElementById('game-host-q-count');
    const gameHostNextBtn = document.getElementById('game-host-next-btn');
    const gameHostQuestion = document.getElementById('game-host-question');
    const gameHostAnswers = document.getElementById('game-host-answers');
    const gameHostLeaderboard = document.getElementById('game-host-leaderboard');
    const gameHostLeaderboardList = document.getElementById('game-host-leaderboard-list');
    const gamePlayerView = document.getElementById('game-player-view');
    const gamePlayerStatus = document.getElementById('game-player-status');
    const gamePlayerAnswers = document.getElementById('game-player-answers');

    // --- App State ---
    let questions = []; 
    let currentQuizId = null; 
    let currentQuizObject = null; 
    let currentIndex = 0;
    let score = 0;
    let timerInterval; 
    let timeLeft = 10; 
    let activeGiphyQuestionCard = null; 
    let currentFlashcards = [];
    let currentFlashcardIndex = 0;
    
    // --- Live Game State ---
    let currentGamePin = null;
    let currentGameRef = null;
    let hostQuizData = null; 
    let playerGameListener = null;

    // --- Toast Notification Function ---
    function showToast(message, type = '') {
        toast.textContent = message;
        toast.className = ''; 
        if (type) toast.classList.add(type); 
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); 
    }
    
    // --- Friendly Error Function ---
    function showFriendlyError(error, errorElement) {
        let message = "An unknown error occurred.";
        switch (error.code) {
            case "auth/wrong-password": message = "Wrong password. Please try again."; break;
            case "auth/user-not-found":
            case "auth/invalid-email": message = "No account found with this email."; break;
            case "auth/email-already-in-use": message = "An account already exists with this email."; break;
            case "auth/weak-password": message = "Password should be at least 6 characters."; break;
            case "auth/popup-closed-by-user": message = "Sign-in popup closed. Please try again."; break;
        }
        errorElement.textContent = message;
    }

    // --- View Switching Logic ---
    function showView(viewName) {
        // Hide all main views
        homeView.style.display = 'none';
        libraryView.style.display = 'none';
        quizAppContainer.style.display = 'none';
        studyPlayerContainer.style.display = 'none';
        dashboardView.style.display = 'none';
        hostLobbyView.style.display = 'none';
        playerLobbyView.style.display = 'none';
        gameHostView.style.display = 'none';
        gamePlayerView.style.display = 'none';

        // Detach any active game listeners if we're leaving a game
        if (playerGameListener) {
            playerGameListener.off(); 
            playerGameListener = null;
            if(currentGamePin && auth.currentUser) {
                rtdb.ref(`games/${currentGamePin}/players/${auth.currentUser.uid}`).remove(); 
            }
            currentGamePin = null;
        }
        if (currentGameRef) {
            currentGameRef.off(); 
            currentGameRef = null;
        }
        
        // Deactivate all sidebar links
        sidebarHomeBtn.classList.remove('active');
        sidebarLibraryBtn.classList.remove('active');
        sidebarDashboardBtn.classList.remove('active');
        sidebarAdminBtn.classList.remove('active'); // *** NEW ***

        // Show the requested view
        if (viewName === 'home') {
            homeView.style.display = 'block';
            sidebarHomeBtn.classList.add('active');
        } else if (viewName === 'library') {
            libraryView.style.display = 'block';
            sidebarLibraryBtn.classList.add('active');
            loadSharedQuizzes(searchBar.value);
        } else if (viewName === 'dashboard') {
            dashboardView.style.display = 'block';
            sidebarDashboardBtn.classList.add('active');
            loadDashboard();
        } else if (viewName === 'quiz') { 
            quizAppContainer.style.display = 'block';
        } else if (viewName === 'study') { 
            studyPlayerContainer.style.display = 'block';
        } else if (viewName === 'host-lobby') {
            hostLobbyView.style.display = 'block';
        } else if (viewName === 'player-lobby') {
            playerLobbyView.style.display = 'block';
        } else if (viewName === 'game-host') {
            gameHostView.style.display = 'block';
        } else if (viewName === 'game-player') {
            gamePlayerView.style.display = 'block';
        }
    }

    // --- MAIN AUTHENTICATION LISTENER ---
    auth.onAuthStateChanged(user => {
        if (user) {
            pageContainer.style.display = 'flex'; 
            authContainer.style.display = 'none'; 
            userDisplay.style.display = 'flex';
            welcomeUser.textContent = `Hello, ${user.displayName || 'User'}`; 
            showView('home'); 

            // *** NEW: Show Admin button if user is admin ***
            if (user.uid === ADMIN_UID) {
                sidebarAdminBtn.style.display = 'flex';
            } else {
                sidebarAdminBtn.style.display = 'none';
            }

        } else {
            pageContainer.style.display = 'none'; 
            authContainer.style.display = 'flex'; 
            userDisplay.style.display = 'none';
            welcomeUser.textContent = '';
            sidebarAdminBtn.style.display = 'none'; // Hide admin button on logout
        }
    });

    // --- Page/Modal Toggling ---
    playQuizBtn.onclick = () => {
        showView('quiz'); 
        quizControls.style.display = 'flex'; 
        quizNav.style.display = 'none'; 
        quizArea.innerHTML = "Click 'Start Quiz' to begin!"; 
        showLeaderboard(); 
    };
    createQuizBtn.onclick = () => { editorContainer.style.display = 'flex'; };
    closeEditorBtn.onclick = () => {
        editorContainer.style.display = 'none';
        questionListContainer.innerHTML = ''; 
        quizTitleInput.value = '';
    };
    createStudyGuideBtn.onclick = () => { studyEditorContainer.style.display = 'flex'; };
    closeStudyEditorBtn.onclick = () => {
        studyEditorContainer.style.display = 'none';
        flashcardListContainer.innerHTML = '';
        studyTitleInput.value = '';
    };
    studyFlashcard.onclick = () => { studyFlashcard.classList.toggle('is-flipped'); };
    
    // *** REMOVED closeManageBtn.onclick ***
    
    closeResultsBtn.onclick = () => { resultsContainer.style.display = 'none'; };
    closeGiphyBtn.onclick = () => {
        giphyContainer.style.display = 'none';
        editorContainer.style.display = 'flex';
    };

    // --- FIREBASE AUTHENTICATION LOGIC ---
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
        const username = signupUsername.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();
        if (username.length < 3) {
            signupErr.textContent = 'Username must be at least 3 characters.';
            return;
        }
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updateProfile({ displayName: username });
            })
            .then(() => { console.log("User signed up!"); })
            .catch((error) => { showFriendlyError(error, signupErr); });
    };
    loginForm.onsubmit = e => {
        e.preventDefault();
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("User logged in!");
                loginErr.textContent = '';
            })
            .catch((error) => { showFriendlyError(error, loginErr); });
    };
    googleSignInBtn.onclick = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => { console.log("User signed in with Google!"); })
            .catch((error) => { showFriendlyError(error, loginErr); });
    };
    logoutBtn.onclick = () => {
        auth.signOut().catch(err => console.error("Sign out error", err));
    };
    forgotPasswordLink.onclick = () => {
        authContainer.style.display = 'none';
        forgotPasswordContainer.style.display = 'flex';
    };
    backToLoginLink.onclick = () => {
        authContainer.style.display = 'flex';
        forgotPasswordContainer.style.display = 'none';
    };
    forgotPasswordForm.onsubmit = (e) => {
        e.preventDefault();
        const email = forgotEmail.value.trim();
        auth.sendPasswordResetEmail(email)
            .then(() => {
                showToast("Password reset email sent!", "success");
                backToLoginLink.click(); 
            })
            .catch((error) => { showFriendlyError(error, forgotError); });
    };
    // --- End Auth Logic ---
    

    // --- FIXED: New Join Logic ---
    joinGameBtn.onclick = () => {
        const input = gamePinInput.value.trim();
        if (input.length === 4 && /^\d{4}$/.test(input)) {
            // This is a 4-digit game PIN
            joinLiveGame(input);
        } else if (input.length > 10) { 
            // This is a long Firestore ID for solo play
            joinSoloContent(input); 
        } else {
            showToast("Please enter a 4-digit Game PIN or a full Content ID.", "error");
        }
    };

    function joinSoloContent(contentId) {
        gamePinInput.value = ""; // Clear input
        db.collection("quizzes").doc(contentId).get().then((doc) => {
            if (doc.exists) {
                const content = doc.data();
                if (content.type === 'study') {
                    startStudySession(content, doc.id);
                } else {
                    startCustomQuiz(content, doc.id); 
                }
            } else {
                showToast("Content ID not found.", "error");
            }
        }).catch((error) => {
            console.error("Error getting content:", error);
            showToast("Error finding content.", "error");
        });
    }

    // --- Solo Quiz Logic ---
    function startApiQuiz(category, count, difficulty) { 
        currentQuizId = `api_${category}_${difficulty}`; 
        currentQuizObject = null;
        showView('quiz'); 
        quizControls.style.display = 'flex';
        quizArea.innerHTML = '<div class="loader"></div>'; 
        quizNav.style.display = 'none';
        timerDisplay.style.display = 'none';
        score = 0;
        currentIndex = 0;
        let apiUrl = `https://opentdb.com/api.php?amount=${count}&category=${category}&type=multiple`;
        if (difficulty && difficulty !== "any") apiUrl += `&difficulty=${difficulty}`;
        fetch(apiUrl) 
            .then(res => res.json())
            .then(data => {
                questions = data.results.map(q => ({
                    question: q.question,
                    options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                    correct_answer: q.correct_answer,
                    questionType: 'mc',
                    explanation: 'Explanations are not available for API trivia questions.',
                    imageUrl: null
                }));
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
        currentQuizId = quizId; 
        currentQuizObject = quizObject; 
        score = 0;
        currentIndex = 0;
        showView('quiz'); 
        quizControls.style.display = 'none'; 
        quizNav.style.display = 'flex'; 
        showQuestion(); 
    }
    
    // --- Solo Quiz Player ---
    function showQuestion() {
        clearInterval(timerInterval);
        if (currentIndex >= questions.length) {
            // QUIZ COMPLETE LOGIC
            const finalScorePercent = (questions.length > 0) ? (score / questions.length) : 0;
            let recommendationHtml = ''; 
            if (finalScorePercent < 0.6 && currentQuizObject && currentQuizObject.recommendedStudyGuideId) {
                const guideId = currentQuizObject.recommendedStudyGuideId;
                recommendationHtml = `<div class="recommendation-box" data-guide-id="${guideId}">Loading recommendation...</div>`;
                db.collection("quizzes").doc(guideId).get()
                    .then(doc => {
                        const recBox = document.querySelector(`.recommendation-box[data-guide-id="${guideId}"]`);
                        if (recBox && doc.exists) {
                            const studyGuideData = doc.data();
                            const studyGuideTitle = studyGuideData.title;
                            recBox.innerHTML = `<h4>You scored ${score}/${questions.length}.</h4><p>We recommend reviewing this study guide before trying again:</p><button id="recommend-btn" class="card-btn">Study: ${studyGuideTitle}</button>`;
                            document.getElementById('recommend-btn').onclick = () => {
                                startStudySession(studyGuideData, guideId);
                            };
                        } else if (recBox) {
                            recBox.innerHTML = '<p>Recommended study guide not found.</p>';
                        }
                    })
                    .catch(err => {
                        console.error("Error fetching recommendation:", err);
                        const recBox = document.querySelector(`.recommendation-box[data-guide-id="${guideId}"]`);
                        if(recBox) recBox.style.display = 'none';
                    });
            }
            quizArea.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score is: ${score} / ${questions.length}</p>${recommendationHtml}`;
            quizNav.style.display = 'none';
            quizControls.style.display = 'flex'; 
            timerDisplay.style.display = 'none'; 
            const user = auth.currentUser;
            const username = user ? user.displayName : 'Anonymous';
            const uid = user ? user.uid : null;
            saveQuizAttempt(username, uid, currentQuizId, score);
            showLeaderboard();
            currentQuizObject = null; 
            return;
        }
        const q = questions[currentIndex];
        let imageHtml = '';
        if (q.imageUrl) imageHtml = `<img src="${q.imageUrl}" alt="Quiz Image" class="quiz-question-image">`;
        let questionHtml = '';
        if (q.questionType === 'fill') {
            questionHtml = `<div class="fill-in-blank-group"><input type="text" id="fill-answer-input" placeholder="Type your answer..."><button id="fill-submit-btn" class="card-btn">Submit</button></div>`;
        } else {
            let options = q.options || [];
            questionHtml = options.map(opt => {
                let isCorrect;
                if (q.correct_answer) { isCorrect = decodeHTML(opt) === decodeHTML(q.correct_answer); } 
                else { isCorrect = decodeHTML(opt) === decodeHTML(q.options[q.correct_answer_index]); }
                return `<button class="option-btn" data-correct="${isCorrect}">${decodeHTML(opt)}</button>`;
            }).join('');
        }
        let html = `<div class="question-block">${imageHtml}<h4>Q${currentIndex + 1}: ${decodeHTML(q.question)}</h4>${questionHtml}</div><br><div id="feedback"></div>`;
        quizArea.innerHTML = html;
        if (q.questionType === 'fill') {
            document.getElementById('fill-submit-btn').onclick = () => checkFillBlankAnswer();
            document.getElementById('fill-answer-input').onkeyup = (e) => {
                if (e.key === 'Enter') checkFillBlankAnswer();
            };
        } else {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.onclick = () => selectAnswer(btn);
            });
        }
        updateControls();
        startTimer();
    }
    function startTimer() {
        timeLeft = 10; 
        timerDisplay.textContent = timeLeft;
        timerDisplay.className = ''; 
        timerDisplay.style.display = 'block';
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 3) timerDisplay.className = 'low-time'; 
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleNoAnswer();
            }
        }, 1000); 
    }
    function handleNoAnswer() {
        const q = questions[currentIndex];
        let correctAnswerText;
        if (q.questionType === 'fill') {
            correctAnswerText = q.answer;
            document.getElementById('fill-submit-btn').disabled = true;
            document.getElementById('fill-answer-input').disabled = true;
        } else {
            if (q.correct_answer) { correctAnswerText = q.correct_answer; } 
            else { correctAnswerText = q.options[q.correct_answer_index]; }
            disableOptions();
            const correctButton = document.querySelector(`.option-btn[data-correct="true"]`);
            if (correctButton) correctButton.classList.add('correct');
        }
        const explanationHtml = q.explanation ? `<div class="explanation-box">${q.explanation}</div>` : '';
        document.getElementById('feedback').innerHTML = `<span style="color:red;">Time's up! Correct was: ${decodeHTML(correctAnswerText)}</span>${explanationHtml}`;
    }
    function checkFillBlankAnswer() {
        clearInterval(timerInterval);
        const input = document.getElementById('fill-answer-input');
        const submitBtn = document.getElementById('fill-submit-btn');
        input.disabled = true;
        submitBtn.disabled = true;
        const q = questions[currentIndex];
        const userAnswer = input.value.trim();
        const correctAnswer = q.answer.trim();
        const explanationHtml = q.explanation ? `<div class="explanation-box">${q.explanation}</div>` : '';
        const feedbackDiv = document.getElementById('feedback');
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            feedbackDiv.innerHTML = `<span style="color:green;">Correct!</span>${explanationHtml}`;
            score++;
        } else {
            feedbackDiv.innerHTML = `<span style="color:red;">Wrong! Correct was: ${decodeHTML(correctAnswer)}</span>${explanationHtml}`;
        }
        scoreLabel.textContent = 'Score: ' + score;
    }
    function selectAnswer(selectedButton) {
        clearInterval(timerInterval); 
        const isCorrect = selectedButton.dataset.correct === 'true';
        const feedbackDiv = document.getElementById('feedback');
        const q = questions[currentIndex];
        const explanationHtml = q.explanation ? `<div class="explanation-box">${q.explanation}</div>` : '';
        disableOptions(); 
        if (isCorrect) {
            selectedButton.classList.add('correct'); 
            feedbackDiv.innerHTML = `<span style="color:green;">Correct!</span>${explanationHtml}`;
            score++;
        } else {
            selectedButton.classList.add('incorrect'); 
            let correctAnswerText;
            if (q.correct_answer) { correctAnswerText = q.correct_answer; } 
            else { correctAnswerText = q.options[q.correct_answer_index]; }
            feedbackDiv.innerHTML = `<span style="color:red;">Wrong! Correct was: ${decodeHTML(correctAnswerText)}</span>${explanationHtml}`;
            const correctButton = document.querySelector(`.option-btn[data-correct="true"]`);
            if (correctButton) correctButton.classList.add('correct');
        }
        scoreLabel.textContent = 'Score: ' + score;
    }
    function disableOptions() {
        document.querySelectorAll('.option-btn').forEach((btn) => {
            btn.disabled = true;
        });
    }
    function updateControls() {
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
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
    // --- End Solo Quiz ---

    // --- Leaderboard & Results Logic ---
    function saveQuizAttempt(username, uid, quizId, score) {
        if (!uid || !quizId) return; 
        db.collection("quiz_attempts").add({
            username: username,
            uid: uid,
            quizId: quizId,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => console.log("Solo attempt saved!"))
        .catch(err => console.error("Error saving attempt: ", err));
        saveGlobalHighScore(username, uid, score);
    }
    function saveGlobalHighScore(username, uid, newScore) {
        if (!uid) uid = 'anonymous_' + new Date().getTime(); 
        if (newScore === 0) return; 
        const userDocRef = db.collection("leaderboard").doc(uid); 
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
    function showLeaderboard() {
        leaderboardDiv.innerHTML = '<h3>Global Leaderboard</h3><div class="loader"></div>';
        db.collection("leaderboard").orderBy("score", "desc").limit(10).get()
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
    function showQuizResults(quizId, quizTitle) {
        resultsQuizTitle.textContent = `Results for: ${quizTitle}`;
        quizResultsListContainer.innerHTML = '<div class="loader"></div>';
        resultsContainer.style.display = 'flex'; 
        db.collection("quiz_attempts").where("quizId", "==", quizId).orderBy("score", "desc").get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
                quizResultsListContainer.innerHTML = '<p>No one has played this quiz yet.</p>';
                return;
            }
            let html = '';
            querySnapshot.forEach((doc) => {
                const attempt = doc.data();
                html += `<div class="result-card"><span class="result-card-name">${attempt.username}</span><span class="result-card-score">${attempt.score}</span></div>`;
            });
            quizResultsListContainer.innerHTML = html;
          }).catch(err => {
            console.error("Error getting results: ", err);
            quizResultsListContainer.innerHTML = '<p>Could not load results.</p>';
          });
    }
    
    // --- Dashboard Logic (REUSABLE) ---
    function loadDashboard() {
        const user = auth.currentUser;
        if (!user) {
            showView('home');
            return;
        }
        dashboardWelcome.textContent = `Welcome, ${user.displayName || 'User'}!`;
        loadMyResults(dashboardMyResultsList);
        loadManageList(dashboardMyContentList);
    }
    
    function loadMyResults(container) {
        const user = auth.currentUser;
        if (!user) return; 
        container.innerHTML = '<div class="loader"></div>';
        db.collection("quiz_attempts").where("uid", "==", user.uid).orderBy("timestamp", "desc").limit(10) 
          .get()
          .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    container.innerHTML = '<p>You haven\'t played any quizzes yet.</p>';
                    return;
                }
                let html = '';
                const titlePromises = [];
                const attempts = [];
                querySnapshot.forEach((doc) => {
                    const attempt = doc.data();
                    attempts.push(attempt);
                    if (!attempt.quizId.startsWith('api_')) {
                        titlePromises.push(db.collection('quizzes').doc(attempt.quizId).get());
                    } else {
                        titlePromises.push(Promise.resolve(null));
                    }
                });
                const titleDocs = await Promise.all(titlePromises);
                attempts.forEach((attempt, index) => {
                    let quizTitle = "API Quiz"; 
                    const titleDoc = titleDocs[index];
                    if (titleDoc && titleDoc.exists) {
                        quizTitle = titleDoc.data().title;
                    }
                    html += `<div class="my-result-card"><div><div class="my-result-card-name">${quizTitle}</div><div class="my-result-card-title">${new Date(attempt.timestamp.toDate()).toLocaleDateString()}</div></div><span class="my-result-card-score">${attempt.score}</span></div>`;
                });
                container.innerHTML = html;
          }).catch(err => {
                console.error("Error getting my results: ", err);
                container.innerHTML = '<p>Could not load your results.</p>';
          });
    }
    // --- End Results Logic ---


    // --- Content Editor Logic ---
    let questionEditorId = 0; 
    function createNewQuestionEditor() {
        const questionId = questionEditorId++;
        const questionCard = document.createElement('div');
        questionCard.className = 'question-editor-card';
        questionCard.dataset.id = questionId;
        questionCard.dataset.imageUrl = ""; 
        questionCard.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;"><select class="question-type-select"><option value="mc" selected>Multiple Choice</option><option value="fill">Fill-in-the-Blank</option></select><button class="delete-question-btn">Delete Question</button></div><textarea class="question-text" placeholder="Enter your question here..."></textarea><textarea class="explanation-input" placeholder="Enter the EXPLANATION for this question..."></textarea><img class="question-gif-preview" src="" alt="GIF Preview" style="display: none;"><button class="add-gif-btn">Add GIF</button><div class="options-editor"><div class="option-input-group"><input type="radio" name="correct-answer-${questionId}" value="0" checked><input type="text" placeholder="Answer 1 (Correct)"></div><div class="option-input-group"><input type="radio" name="correct-answer-${questionId}" value="1"><input type="text" placeholder="Answer 2"></div><div class="option-input-group"><input type="radio" name="correct-answer-${questionId}" value="2"><input type="text" placeholder="Answer 3"></div><div class="option-input-group"><input type="radio" name="correct-answer-${questionId}" value="3"><input type="text" placeholder="Answer 4"></div></div><div class="fill-blank-editor" style="display: none;"><input type="text" class="fill-blank-answer" placeholder="Enter the exact correct answer"></div>`;
        const questionTypeSelect = questionCard.querySelector('.question-type-select');
        const optionsEditor = questionCard.querySelector('.options-editor');
        const fillBlankEditor = questionCard.querySelector('.fill-blank-editor');
        questionTypeSelect.onchange = () => {
            if (questionTypeSelect.value === 'mc') {
                optionsEditor.style.display = 'block';
                fillBlankEditor.style.display = 'none';
            } else {
                optionsEditor.style.display = 'none';
                fillBlankEditor.style.display = 'block';
            }
        };
        questionCard.querySelector('.add-gif-btn').onclick = () => {
            activeGiphyQuestionCard = questionCard; 
            editorContainer.style.display = 'none';
            giphyContainer.style.display = 'flex';
        };
        questionCard.querySelector('.delete-question-btn').onclick = () => {
            questionCard.remove();
        };
        questionListContainer.appendChild(questionCard);
    }
    addQuestionBtn.onclick = createNewQuestionEditor;
    
    // --- *** BUG FIX: Validation length changed from 5 to 1 *** ---
    saveQuizBtn.onclick = () => {
        const user = auth.currentUser;
        if (!user) { 
            showToast("Your session expired. Please log in again.", "error");
            return;
        }
        const title = quizTitleInput.value.trim();
        const recommendId = document.getElementById('quiz-recommend-id-input').value.trim();
        if (title.length < 3) {
            showToast("Please enter a quiz title (at least 3 characters).", "error");
            return;
        }
        const questionCards = questionListContainer.querySelectorAll('.question-editor-card');
        if (questionCards.length === 0) {
            showToast("Please add at least one question.", "error");
            return;
        }
        saveQuizBtn.disabled = true; 
        saveQuizBtn.textContent = "Saving...";
        let newQuiz = {
            title: title,
            author: user.displayName || 'Anonymous', 
            authorUID: user.uid, 
            likeCount: 0, 
            likedBy: [],
            type: 'quiz',
            recommendedStudyGuideId: recommendId || null,
            questions: []
        };
        let allValid = true;
        questionCards.forEach(card => {
            const questionText = card.querySelector('.question-text').value.trim();
            const explanation = card.querySelector('.explanation-input').value.trim();
            const imageUrl = card.dataset.imageUrl || null;
            const questionType = card.querySelector('.question-type-select').value;
            
            // *** BUG FIX: Changed from < 5 to < 1 ***
            if (questionText.length < 1 || explanation.length < 1) { 
                allValid = false;
            }
            let questionData = {
                question: questionText,
                explanation: explanation,
                imageUrl: imageUrl,
                questionType: questionType
            };
            if (questionType === 'mc') {
                const optionInputs = card.querySelectorAll('.option-input-group input[type="text"]');
                const correctInput = card.querySelector('.option-input-group input[type="radio"]:checked');
                const options = [];
                optionInputs.forEach(input => options.push(input.value.trim()));
                if (options.some(opt => opt.length === 0)) allValid = false; 
                if (!correctInput) allValid = false; 
                questionData.options = options;
                questionData.correct_answer_index = parseInt(correctInput.value, 10);
            } else if (questionType === 'fill') {
                const answer = card.querySelector('.fill-blank-answer').value.trim();
                if (answer.length === 0) allValid = false;
                questionData.answer = answer;
            }
            newQuiz.questions.push(questionData);
        });
        if (!allValid) {
            // *** BUG FIX: Updated error message ***
            showToast("Please fill in all questions, answers, and explanations.", "error"); 
            saveQuizBtn.disabled = false;
            saveQuizBtn.textContent = "Save Quiz";
            return;
        }
        db.collection("quizzes").add(newQuiz).then((docRef) => {
            showToast(`Quiz "${title}" saved successfully!`, "success");
            closeEditorBtn.click(); 
        }).catch((error) => {
            console.error("Error adding document: ", error);
            showToast("Error saving quiz. Check the console.", "error");
        }).finally(() => {
            saveQuizBtn.disabled = false;
            saveQuizBtn.textContent = "Save Quiz";
        });
    };
    // --- End Quiz Editor ---

    // --- Study Guide Editor Logic ---
    let flashcardEditorId = 0;
    function createNewFlashcardEditor() {
        const cardId = flashcardEditorId++;
        const flashcardCard = document.createElement('div');
        flashcardCard.className = 'flashcard-editor-card';
        flashcardCard.innerHTML = `<textarea class="flashcard-term" placeholder="Term (Front of card)"></textarea><textarea class="flashcard-definition" placeholder="Definition (Back of card)"></textarea><button class="delete-flashcard-btn">Delete Card</button>`;
        flashcardCard.querySelector('.delete-flashcard-btn').onclick = () => {
            flashcardCard.remove();
        };
        flashcardListContainer.appendChild(flashcardCard);
    }
    addFlashcardBtn.onclick = createNewFlashcardEditor;
    saveStudyGuideBtn.onclick = () => {
        const user = auth.currentUser;
        if (!user) {
            showToast("Your session expired. Please log in again.", "error");
            return;
        }
        const title = studyTitleInput.value.trim();
        if (title.length < 3) {
            showToast("Please enter a study guide title (at least 3 characters).", "error");
            return;
        }
        const flashcardCards = flashcardListContainer.querySelectorAll('.flashcard-editor-card');
        if (flashcardCards.length === 0) {
            showToast("Please add at least one flashcard.", "error");
            return;
        }
        saveStudyGuideBtn.disabled = true;
        saveStudyGuideBtn.textContent = "Saving...";
        let newStudyGuide = {
            title: title,
            author: user.displayName || 'Anonymous', 
            authorUID: user.uid, 
            likeCount: 0, 
            likedBy: [],
            type: 'study',
            flashcards: []
        };
        let allValid = true;
        flashcardCards.forEach(card => {
            const term = card.querySelector('.flashcard-term').value.trim();
            const definition = card.querySelector('.flashcard-definition').value.trim();
            if (term.length === 0 || definition.length === 0) allValid = false;
            newStudyGuide.flashcards.push({ term, definition });
        });
        if (!allValid) {
            showToast("Please fill in all flashcard terms and definitions.", "error");
            saveStudyGuideBtn.disabled = false;
            saveStudyGuideBtn.textContent = "Save Study Guide";
            return;
        }
        db.collection("quizzes").add(newStudyGuide).then((docRef) => {
            showToast(`Study Guide "${title}" saved successfully!`, "success");
            closeStudyEditorBtn.click();
        }).catch((error) => {
            console.error("Error adding document: ", error);
            showToast("Error saving study guide.", "error");
        }).finally(() => {
            saveStudyGuideBtn.disabled = false;
            saveStudyGuideBtn.textContent = "Save Study Guide";
        });
    };
    // --- End Study Guide Editor ---
    
    // --- Study Guide Player Logic ---
    function startStudySession(studyGuide, guideId) {
        currentFlashcards = studyGuide.flashcards;
        currentFlashcardIndex = 0;
        showView('study'); 
        studyPlayerTitle.textContent = studyGuide.title;
        displayFlashcard();
    }
    function displayFlashcard() {
        if (currentFlashcards.length === 0) return;
        studyFlashcard.classList.remove('is-flipped');
        const card = currentFlashcards[currentFlashcardIndex];
        flashcardFrontText.textContent = card.term;
        flashcardBackText.textContent = card.definition;
        studyCardCount.textContent = `${currentFlashcardIndex + 1} / ${currentFlashcards.length}`;
        studyPrevBtn.disabled = currentFlashcardIndex === 0;
        studyNextBtn.disabled = currentFlashcardIndex === currentFlashcards.length - 1;
    }
    studyPrevBtn.onclick = () => {
        if (currentFlashcardIndex > 0) {
            currentFlashcardIndex--;
            displayFlashcard();
        }
    };
    studyNextBtn.onclick = () => {
        if (currentFlashcardIndex < currentFlashcards.length - 1) {
            currentFlashcardIndex++;
            displayFlashcard();
        }
    };
    // --- End Study Player ---

    // --- GIPHY Search Functions ---
    async function searchGiphy() {
        const searchTerm = giphySearchBar.value.trim();
        if (searchTerm.length < 2) return;
        giphyResultsGrid.innerHTML = '<div class="loader"></div>';
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=12&rating=g`);
            const data = await response.json();
            giphyResultsGrid.innerHTML = '';
            data.data.forEach(gif => {
                const img = document.createElement('img');
                img.src = gif.images.fixed_height.url;
                img.dataset.fullUrl = gif.images.original.url;
                img.className = 'giphy-item';
                img.onclick = () => {
                    if (activeGiphyQuestionCard) {
                        const preview = activeGiphyQuestionCard.querySelector('.question-gif-preview');
                        preview.src = img.src;
                        preview.style.display = 'block';
                        activeGiphyQuestionCard.dataset.imageUrl = img.dataset.fullUrl;
                    }
                    closeGiphyBtn.click();
                };
                giphyResultsGrid.appendChild(img);
            });
        } catch (error) {
            console.error("GIPHY Error:", error);
            giphyResultsGrid.innerHTML = '<p>Could not load GIFs.</p>';
        }
    }
    giphySearchBtn.onclick = searchGiphy;
    giphySearchBar.onkeyup = (e) => {
        if (e.key === 'Enter') searchGiphy();
    };
    // --- End GIPHY ---

    // --- Load/Like/Manage/Delete Content ---
    function loadSharedQuizzes(searchTerm = "") {
        quizList.innerHTML = '<div class="loader"></div>';
        let query = db.collection("quizzes").orderBy("likeCount", "desc");
        if (searchTerm) {
            query = query.where("title", ">=", searchTerm)
                         .where("title", "<=", searchTerm + '\uf8ff');
        }
        query.get().then((querySnapshot) => {
            quizList.innerHTML = ''; 
            if (querySnapshot.empty) {
                quizList.innerHTML = `<p>No content found. Be the first to create one!</p>`;
                return;
            }
            const user = auth.currentUser;
            const uid = user ? user.uid : null;
            querySnapshot.forEach((doc) => {
                const content = doc.data();
                const contentId = doc.id;
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                const isStudyGuide = content.type === 'study';
                quizCard.innerHTML = `<div class="quiz-card-title ${isStudyGuide ? 'study' : 'quiz'}">${isStudyGuide ? '📚' : '❓'} ${content.title}</div><div class="quiz-card-footer"><span class="quiz-card-author">by ${content.author}</span><button class="like-btn" data-id="${contentId}">❤️ ${content.likeCount || 0}</button></div>`;
                if (uid && content.likedBy && content.likedBy.includes(uid)) {
                    quizCard.querySelector('.like-btn').classList.add('liked');
                }
                quizCard.querySelector('.quiz-card-title').onclick = () => {
                    if (isStudyGuide) {
                        startStudySession(content, contentId);
                    } else {
                        startCustomQuiz(content, contentId); 
                    }
                };
                quizCard.querySelector('.like-btn').onclick = (e) => {
                    e.stopPropagation(); 
                    likeQuiz(contentId, e.target);
                };
                quizList.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            quizList.innerHTML = '<p>Could not load content. Check console.</p>';
        });
    }
    function likeQuiz(quizId, buttonElement) {
        const user = auth.currentUser;
        if (!user) {
            showToast("You must be logged in to like content.", "error");
            return;
        }
        const quizRef = db.collection("quizzes").doc(quizId);
        db.runTransaction((transaction) => {
            return transaction.get(quizRef).then((doc) => {
                if (!doc.exists) throw "Content not found!";
                const data = doc.data();
                const likedBy = data.likedBy || [];
                let newLikeCount = data.likeCount || 0;
                let didLike = false; 
                const userIndex = likedBy.indexOf(user.uid);
                if (userIndex > -1) {
                    newLikeCount--;
                    likedBy.splice(userIndex, 1);
                    didLike = false;
                } else {
                    newLikeCount++;
                    likedBy.push(user.uid); 
                    didLike = true;
                }
                if (newLikeCount < 0) newLikeCount = 0;
                transaction.update(quizRef, { 
                    likeCount: newLikeCount,
                    likedBy: likedBy 
                });
                return { newLikeCount, didLike };
            });
        }).then((result) => {
            if (result !== undefined) {
                buttonElement.textContent = `❤️ ${result.newLikeCount}`;
                if (result.didLike) {
                    buttonElement.classList.add('liked');
                    showToast("Content liked!", "success");
                } else {
                    buttonElement.classList.remove('liked');
                    showToast("Content unliked.", "");
                }
            }
        }).catch((error) => {
            console.error("Error updating likes: ", error);
            showToast("Error liking content.", "error");
        });
    }
    
    function loadManageList(container) {
        const user = auth.currentUser;
        if (!user) return;
        container.innerHTML = '<div class="loader"></div>'; 
        db.collection("quizzes").where("authorUID", "==", user.uid).get().then((querySnapshot) => {
            container.innerHTML = ''; 
            if (querySnapshot.empty) {
                container.innerHTML = '<p>You haven\'t created any content yet!</p>';
                return;
            }
            querySnapshot.forEach((doc) => {
                const content = doc.data();
                const contentId = doc.id; 
                const isStudyGuide = content.type === 'study';
                const quizCard = document.createElement('div');
                quizCard.className = 'manage-quiz-card';
                
                let buttonsHtml = '';
                if (!isStudyGuide) {
                    buttonsHtml += `<button class="host-game-btn" data-id="${contentId}">Host Game</button>`;
                    buttonsHtml += `<button class="results-quiz-btn" data-id="${contentId}" data-title="${content.title}">Results</button>`;
                }
                buttonsHtml += `<button class="share-quiz-btn" data-id="${contentId}">Share ID</button>`;
                buttonsHtml += `<button class="delete-quiz-btn" data-id="${contentId}">Delete</button>`;
                
                quizCard.innerHTML = `<h4>${isStudyGuide ? '📚' : '❓'} ${content.title}</h4><div class="buttons-wrapper">${buttonsHtml}</div>`;

                if (!isStudyGuide) {
                    quizCard.querySelector('.results-quiz-btn').onclick = (e) => {
                        showQuizResults(e.target.dataset.id, e.target.dataset.title);
                    };
                    quizCard.querySelector('.host-game-btn').onclick = (e) => {
                        hostNewGame(e.target.dataset.id);
                    };
                }
                quizCard.querySelector('.share-quiz-btn').onclick = (e) => {
                    navigator.clipboard.writeText(e.target.dataset.id).then(() => {
                        showToast(`Content ID copied to clipboard!`, "success");
                    });
                };
                quizCard.querySelector('.delete-quiz-btn').onclick = (e) => {
                    deleteQuiz(e.target.dataset.id, isStudyGuide);
                };
                container.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            container.innerHTML = '<p>Could not load your content.</p>';
        });
    }

    function deleteQuiz(quizId, isStudyGuide) {
        if (!confirm("Are you sure you want to delete this? This cannot be undone.")) {
            return; 
        }
        const deletePromises = [];
        if (!isStudyGuide) {
            const attemptsPromise = db.collection("quiz_attempts").where("quizId", "==", quizId).get().then((snapshot) => {
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                return batch.commit();
            });
            deletePromises.push(attemptsPromise);
        }
        Promise.all(deletePromises).then(() => {
            return db.collection("quizzes").doc(quizId).delete();
        }).then(() => {
            showToast("Content deleted!", "success");
            loadDashboard(); // Refresh the dashboard list
        }).catch((error) => {
            console.error("Error removing content: ", error);
            showToast("Could not delete content.", "error");
        });
    }
    
    // --- LIVE GAME FUNCTIONS (RTDB) ---
    
    // Step 1: Host clicks "Host Game"
    async function hostNewGame(quizId) {
        const user = auth.currentUser;
        if (!user) return;
        const quizDoc = await db.collection("quizzes").doc(quizId).get();
        if (!quizDoc.exists) {
            showToast("Quiz not found.", "error");
            return;
        }
        hostQuizData = quizDoc.data(); 
        hostQuizData.questions = hostQuizData.questions.filter(q => q.questionType === 'mc');
        if (hostQuizData.questions.length === 0) {
            showToast("This quiz has no multiple-choice questions and cannot be hosted.", "error");
            return;
        }
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        currentGamePin = pin;
        currentGameRef = rtdb.ref(`games/${pin}`);
        await currentGameRef.set({
            host: { uid: user.uid, name: user.displayName },
            quizId: quizId,
            quizTitle: hostQuizData.title,
            gameState: "lobby", 
            currentQuestion: -1, 
            players: {},
            scores: {}
        });
        await currentGameRef.child(`players/${user.uid}`).set({ name: user.displayName });
        await currentGameRef.child(`scores/${user.uid}`).set({ name: user.displayName, score: 0 });
        initHostLobby(pin, hostQuizData.title);
    }

    // Step 2: Host lands in lobby
    function initHostLobby(pin, title) {
        showView('host-lobby');
        hostLobbyTitle.textContent = `Hosting Quiz: ${title}`;
        hostLobbyPin.textContent = pin;
        const playersRef = rtdb.ref(`games/${pin}/players`);
        currentGameRef = playersRef.on('value', (snapshot) => { 
            const players = snapshot.val() || {};
            hostLobbyPlayers.innerHTML = '';
            Object.values(players).forEach(player => {
                const playerEl = document.createElement('div');
                playerEl.className = 'player-list-item';
                playerEl.textContent = player.name;
                hostLobbyPlayers.appendChild(playerEl);
            });
        });
        rtdb.ref(`games/${pin}`).onDisconnect().remove(); 
    }
    
    // Step 3: Player joins with PIN
    function joinLiveGame(pin) {
        const user = auth.currentUser;
        if (!user) {
            showToast("You must be logged in to join a game.", "error");
            return;
        }
        const gameRef = rtdb.ref(`games/${pin}`);
        gameRef.once('value', (snapshot) => {
            if (!snapshot.exists()) {
                showToast("Game PIN not found.", "error");
            } else {
                const gameState = snapshot.val().gameState;
                if (gameState !== 'lobby') {
                    showToast("This game has already started.", "error");
                    return;
                }
                currentGamePin = pin;
                gameRef.child(`players/${user.uid}`).set({ name: user.displayName });
                gameRef.child(`scores/${user.uid}`).set({ name: user.displayName, score: 0 });
                initPlayerLobby(pin); 
            }
        });
    }
    
    // Step 4: Player lands in lobby
    function initPlayerLobby(pin) {
        showView('player-lobby');
        currentGamePin = pin;
        const playersRef = rtdb.ref(`games/${pin}/players`);
        playersRef.on('value', (snapshot) => {
            const players = snapshot.val() || {};
            playerLobbyPlayers.innerHTML = '';
            Object.values(players).forEach(player => {
                const playerEl = document.createElement('div');
                playerEl.className = 'player-list-item';
                playerEl.textContent = player.name;
                playerLobbyPlayers.appendChild(playerEl);
            });
        });

        playerGameListener = rtdb.ref(`games/${pin}`);
        playerGameListener.on('value', (snapshot) => {
            const gameData = snapshot.val();
            if (!gameData) {
                showToast("The host has ended the game.", "");
                showView('home');
                return;
            }
            const state = gameData.gameState;
            const qIndex = gameData.currentQuestion;
            if (state === 'question') {
                playerShowQuestion(qIndex);
            } else if (state === 'results') {
                playerShowResults(gameData);
            } else if (state === 'final') {
                playerShowFinalResults(gameData);
            }
        });

        rtdb.ref(`games/${pin}/players/${auth.currentUser.uid}`).onDisconnect().remove();
        rtdb.ref(`games/${pin}/scores/${auth.currentUser.uid}`).onDisconnect().remove();
    }

    // Step 5: Host starts the game
    hostStartGameBtn.onclick = () => {
        if (!currentGameRef) return;
        sendQuestion(0);
    };

    // Step 6: Host sends a question
    function sendQuestion(qIndex) {
        if (qIndex >= hostQuizData.questions.length) {
            hostShowFinalResults();
            return;
        }
        rtdb.ref(`games/${currentGamePin}`).update({
            gameState: 'question',
            currentQuestion: qIndex,
            answers: {} 
        });
        showView('game-host');
        gameHostLeaderboard.style.display = 'none';
        gameHostAnswers.style.display = 'grid';
        gameHostNextBtn.style.display = 'none'; 
        const q = hostQuizData.questions[qIndex];
        gameHostQCount.textContent = `Q ${qIndex + 1}/${hostQuizData.questions.length}`;
        gameHostQuestion.textContent = q.question;
        gameHostAnswers.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'host-answer-btn';
            btn.dataset.index = index;
            btn.textContent = opt;
            if (index === q.correct_answer_index) {
                btn.dataset.correct = "true";
            }
            gameHostAnswers.appendChild(btn);
        });
        let qTimeLeft = 10;
        gameHostTimer.textContent = qTimeLeft;
        timerInterval = setInterval(() => { 
            qTimeLeft--;
            gameHostTimer.textContent = qTimeLeft;
            if (qTimeLeft <= 0) {
                clearInterval(timerInterval);
                hostShowResults();
            }
        }, 1000);
    }
    
    // Step 7: Host shows results for the question
    async function hostShowResults() {
        clearInterval(timerInterval); 
        await rtdb.ref(`games/${currentGamePin}`).update({ gameState: 'results' });
        const qIndex = (await rtdb.ref(`games/${currentGamePin}/currentQuestion`).get()).val();
        const q = hostQuizData.questions[qIndex];
        const correctAnswerIndex = q.correct_answer_index;
        gameHostAnswers.querySelector(`[data-correct="true"]`).classList.add('correct');
        const answersSnapshot = await rtdb.ref(`games/${currentGamePin}/answers`).get();
        const answers = answersSnapshot.val() || {};
        const scoresRef = rtdb.ref(`games/${currentGamePin}/scores`);
        const scoresSnapshot = await scoresRef.get();
        const currentScores = scoresSnapshot.val() || {};
        for (const uid in answers) {
            if (answers[uid].answerIndex == correctAnswerIndex) {
                const timeTaken = answers[uid].time; 
                const points = Math.round(1000 - (timeTaken * 100)); 
                if(currentScores[uid]) {
                    currentScores[uid].score += points;
                }
            }
        }
        await scoresRef.set(currentScores); 
        displayHostLeaderboard(currentScores);
        gameHostLeaderboard.style.display = 'block';
        gameHostAnswers.style.display = 'none';
        gameHostNextBtn.style.display = 'block';
        if (qIndex + 1 >= hostQuizData.questions.length) {
            gameHostNextBtn.textContent = "Show Final Results";
        } else {
            gameHostNextBtn.textContent = "Next Question";
        }
    }
    
    // Host "Next" button click
    gameHostNextBtn.onclick = async () => {
        const qIndex = (await rtdb.ref(`games/${currentGamePin}/currentQuestion`).get()).val();
        sendQuestion(qIndex + 1); 
    };
    
    function displayHostLeaderboard(scores) {
        gameHostLeaderboardList.innerHTML = '';
        const sortedScores = Object.values(scores).sort((a, b) => b.score - a.score);
        sortedScores.slice(0, 5).forEach((player, index) => { // Top 5
            gameHostLeaderboardList.innerHTML += `<li>${player.name} <strong>${player.score}</strong></li>`;
        });
    }

    function hostShowFinalResults() {
        rtdb.ref(`games/${currentGamePin}`).update({ gameState: 'final' });
        gameHostQuestion.textContent = "Game Over!";
        gameHostAnswers.style.display = 'none';
        gameHostNextBtn.style.display = 'none';
        gameHostTimer.style.display = 'none';
        gameHostLeaderboard.style.display = 'block'; 
        setTimeout(() => {
            if (currentGameRef) {
                rtdb.ref(`games/${currentGamePin}`).remove();
                currentGameRef = null;
            }
        }, 30000);
    }

    // Step 8: Player game view
    function playerShowQuestion(qIndex) {
        if (qIndex < 0) return;
        showView('game-player');
        gamePlayerStatus.textContent = `Question ${qIndex + 1}`;
        gamePlayerAnswers.style.display = 'grid'; 
        gamePlayerAnswers.querySelectorAll('.player-answer-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('selected');
        });
        gamePlayerAnswers.dataset.startTime = new Date().getTime();
    }

    // Step 9: Player selects an answer
    gamePlayerAnswers.querySelectorAll('.player-answer-btn').forEach(btn => {
        btn.onclick = () => {
            const answerIndex = btn.dataset.index;
            const startTime = parseFloat(gamePlayerAnswers.dataset.startTime);
            const timeTaken = (new Date().getTime() - startTime) / 1000; 
            gamePlayerAnswers.querySelectorAll('.player-answer-btn').forEach(b => {
                b.disabled = true;
            });
            btn.classList.add('selected'); 
            gamePlayerStatus.textContent = "Answer submitted! Waiting for results...";
            rtdb.ref(`games/${currentGamePin}/answers/${auth.currentUser.uid}`).set({
                answerIndex: answerIndex,
                time: timeTaken
            });
        };
    });
    
    // Step 10: Player sees results
    function playerShowResults(gameData) {
        const myUid = auth.currentUser.uid;
        if (!myUid) return;
        const myAnswer = gameData.answers ? gameData.answers[myUid] : null;
        const myCurrentScore = gameData.scores[myUid] ? gameData.scores[myUid].score : 0;
        gamePlayerStatus.textContent = `Your score: ${myCurrentScore}`;
        if (myAnswer) {
             gamePlayerAnswers.querySelector(`[data-index="${myAnswer.answerIndex}"]`).classList.add('selected');
        } else {
             gamePlayerStatus.textContent = `Time's up! Your score: ${myCurrentScore}`;
        }
    }
    
    // Step 11: Player sees final results
    function playerShowFinalResults(gameData) {
        const myUid = auth.currentUser.uid;
        if(!myUid || !gameData.scores[myUid]) {
            showView('home'); 
            return;
        }
        const myFinalScore = gameData.scores[myUid].score;
        const sortedScores = Object.values(gameData.scores).sort((a, b) => b.score - a.score);
        const myRank = sortedScores.findIndex(p => p.name === auth.currentUser.displayName) + 1;
        gamePlayerStatus.textContent = `Game Over! You finished #${myRank} with ${myFinalScore} points!`;
        gamePlayerAnswers.style.display = 'none';
        setTimeout(() => {
            showView('home');
        }, 5000);
    }

    // --- *** NEW: ADMIN PANEL FUNCTIONS *** ---
    function loadAdminDropdowns() {
        // 1. Populate Exams
        const examSelect = document.getElementById('admin-exam-select');
        db.collection("exams").get().then(snapshot => {
            examSelect.innerHTML = '<option value="">-- Select Exam --</option>';
            snapshot.forEach(doc => {
                examSelect.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
            });
        });

        // 2. Populate Subjects based on Exam
        examSelect.onchange = () => {
            const examId = examSelect.value;
            const subjectSelect = document.getElementById('admin-subject-select');
            if (!examId) {
                subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
                return;
            }
            db.collection("exams").doc(examId).collection("subjects").get().then(snapshot => {
                subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
                snapshot.forEach(doc => {
                    subjectSelect.innerHTML += `<option value="${doc.id}" data-exam-id="${examId}">${doc.data().name}</option>`;
                });
            });
        };

        // 3. Populate Topics based on Subject
        adminSubjectSelect.onchange = () => {
            const selectedOption = adminSubjectSelect.options[adminSubjectSelect.selectedIndex];
            const subjectId = selectedOption.value;
            const examId = selectedOption.dataset.examId;
            const topicSelect = document.getElementById('admin-topic-select');
            if (!subjectId) {
                topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
                return;
            }
            db.collection("exams").doc(examId).collection("subjects").doc(subjectId).collection("topics").get().then(snapshot => {
                topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
                snapshot.forEach(doc => {
                    topicSelect.innerHTML += `<option value="${doc.id}" data-exam-id="${examId}" data-subject-id="${subjectId}">${doc.data().name}</option>`;
                });
            });
        };
    }

    addExamForm.onsubmit = (e) => {
        e.preventDefault();
        const examName = document.getElementById('admin-exam-name').value;
        if (!examName) return;
        db.collection("exams").add({ name: examName }).then(() => {
            showToast("Exam created!", "success");
            addExamForm.reset();
            loadAdminDropdowns();
        }).catch(err => showToast(err.message, "error"));
    };

    addSubjectForm.onsubmit = (e) => {
        e.preventDefault();
        const examId = document.getElementById('admin-exam-select').value;
        const subjectName = document.getElementById('admin-subject-name').value;
        if (!examId || !subjectName) return;
        db.collection("exams").doc(examId).collection("subjects").add({ name: subjectName }).then(() => {
            showToast("Subject created!", "success");
            addSubjectForm.reset();
            loadAdminDropdowns();
        }).catch(err => showToast(err.message, "error"));
    };
    
    addTopicForm.onsubmit = (e) => {
        e.preventDefault();
        const selectedOption = adminSubjectSelect.options[adminSubjectSelect.selectedIndex];
        const subjectId = selectedOption.value;
        const examId = selectedOption.dataset.examId;
        const topicName = document.getElementById('admin-topic-name').value;
        if (!examId || !subjectId || !topicName) return;
        db.collection("exams").doc(examId).collection("subjects").doc(subjectId).collection("topics").add({ name: topicName }).then(() => {
            showToast("Topic created!", "success");
            addTopicForm.reset();
            loadAdminDropdowns();
        }).catch(err => showToast(err.message, "error"));
    };
    
    addExamQuestionForm.onsubmit = (e) => {
        e.preventDefault();
        const selectedOption = adminTopicSelect.options[adminTopicSelect.selectedIndex];
        const topicId = selectedOption.value;
        const subjectId = selectedOption.dataset.subjectId;
        const examId = selectedOption.dataset.examId;
        
        const questionText = document.getElementById('admin-q-text').value;
        const explanation = document.getElementById('admin-q-explanation').value;
        const options = [
            document.getElementById('admin-q-opt-1').value,
            document.getElementById('admin-q-opt-2').value,
            document.getElementById('admin-q-opt-3').value,
            document.getElementById('admin-q-opt-4').value,
        ];

        if (!topicId || !questionText || !explanation || options.some(o => !o)) {
            showToast("Please fill all fields.", "error");
            return;
        }

        const newQuestion = {
            question: questionText,
            explanation: explanation,
            options: options,
            correct_answer_index: 0, // Defaulting to Option 1 as correct
            questionType: 'mc' // All exam questions are MC for now
        };

        db.collection("exams").doc(examId).collection("subjects").doc(subjectId).collection("topics").doc(topicId).collection("questions").add(newQuestion)
        .then(() => {
            showToast("Exam question added!", "success");
            addExamQuestionForm.reset();
        }).catch(err => showToast(err.message, "error"));
    };

    
    // --- Initialization ---
    function init() {
        // --- Sidebar Listeners ---
        sidebarHomeBtn.onclick = (e) => { e.preventDefault(); showView('home'); };
        sidebarLibraryBtn.onclick = (e) => { e.preventDefault(); showView('library'); };
        sidebarDashboardBtn.onclick = (e) => { e.preventDefault(); showView('dashboard'); };
        sidebarAdminBtn.onclick = (e) => { // *** NEW ***
            e.preventDefault();
            adminContainer.style.display = 'flex';
            loadAdminDropdowns();
        };
        closeAdminBtn.onclick = () => { // *** NEW ***
            adminContainer.style.display = 'none';
        };

        // --- Dark Mode Logic ---
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.textContent = '🌙';
        }
        darkModeToggle.onclick = () => {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                darkModeToggle.textContent = '🌙';
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                darkModeToggle.textContent = '☀️';
            }
        };

        // Auth listener handles initial view
        
        // Setup initial auth tab state
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        
        // Search Bar Event Listener
        searchBar.addEventListener('keyup', () => {
            if (libraryView.style.display === 'block') {
                loadSharedQuizzes(searchBar.value.trim());
            }
        });

        // Subject Nav Listeners
        document.querySelectorAll('.subject-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                const category = link.dataset.category;
                if (category === 'home') { showView('home'); } 
                else if (category) { startApiQuiz(category, 10, 'any'); }
            });
        });
    }

    init(); // Run the initialization
});