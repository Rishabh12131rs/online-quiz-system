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
const ADMIN_UID = "NTSIsVxii9gKezQqQ3RYpQB2jTT2";


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
    
    // --- *** UPDATED: Main Page & Library Elements *** ---
    const communityQuizList = document.getElementById('community-quiz-list'); 
    const searchBar = document.getElementById('search-bar'); 
    const communityContentView = document.getElementById('community-content-view');
    const libraryHomeView = document.getElementById('library-home-view');
    const examPrepView = document.getElementById('exam-prep-view');
    const examBreadcrumbs = document.getElementById('exam-breadcrumbs');
    const examBrowserList = document.getElementById('exam-browser-list');
    const examBrowserTitle = document.getElementById('exam-browser-title');
    const navCommunityBtn = document.getElementById('nav-community-btn');
    const navExamPrepBtn = document.getElementById('nav-exam-prep-btn');

    // --- Sidebar and View Elements ---
    const sidebarHomeBtn = document.getElementById('sidebar-home-btn');
    const sidebarLibraryBtn = document.getElementById('sidebar-library-btn');
    const sidebarDashboardBtn = document.getElementById('sidebar-dashboard-btn');
    const sidebarAdminBtn = document.getElementById('sidebar-admin-btn'); 
    const homeView = document.getElementById('home-view');
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

    // --- Admin Panel Elements ---
    const adminContainer = document.getElementById('admin-container');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const addExamForm = document.getElementById('add-exam-form');
    const addSubjectForm = document.getElementById('add-subject-form');
    const addTopicForm = document.getElementById('add-topic-form');
    const addExamQuestionForm = document.getElementById('add-exam-question-form');
    const adminExamSelect = document.getElementById('admin-exam-select');
    const adminSubjectSelect = document.getElementById('admin-subject-select');
    const adminTopicSelect = document.getElementById('admin-topic-select');
    const bulkUploadForm = document.getElementById('bulk-upload-form');
    const bulkExamSelect = document.getElementById('bulk-exam-select');
    const bulkSubjectSelect = document.getElementById('bulk-subject-select');
    const bulkTopicSelect = document.getElementById('bulk-topic-select');
    const bulkUploadFile = document.getElementById('bulk-upload-file');
    const adminTabAdd = document.getElementById('admin-tab-add');
    const adminTabManage = document.getElementById('admin-tab-manage');
    const adminAddContent = document.getElementById('admin-add-content');
    const adminManageContent = document.getElementById('admin-manage-content');
    const adminManageExams = document.getElementById('admin-manage-exams');
    const adminManageSubjects = document.getElementById('admin-manage-subjects');
    const adminManageTopics = document.getElementById('admin-manage-topics');
    const adminManageQuestions = document.getElementById('admin-manage-questions');


    // --- Live Game View Elements ---
    const hostLobbyView = document.getElementById('host-lobby-view');
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
    const playerFeedbackView = document.getElementById('player-feedback-view');
    const playerFeedbackText = document.getElementById('player-feedback-text');
    const playerPointsEarned = document.getElementById('player-points-earned');
    const playerTotalScore = document.getElementById('player-total-score');
    const finalLeaderboardView = document.getElementById('final-leaderboard-view');
    const podiumName1 = document.getElementById('podium-name-1');
    const podiumScore1 = document.getElementById('podium-score-1');
    const podiumName2 = document.getElementById('podium-name-2');
    const podiumScore2 = document.getElementById('podium-score-2');
    const podiumName3 = document.getElementById('podium-name-3');
    const podiumScore3 = document.getElementById('podium-score-3');
    const finalLeaderboardList = document.getElementById('final-leaderboard-list');
    const finalLeaderboardHomeBtn = document.getElementById('final-leaderboard-home-btn');

    // --- *** NEW: Answer Review Elements *** ---
    const reviewView = document.getElementById('review-view');
    const reviewTitle = document.getElementById('review-title');
    const reviewBackBtn = document.getElementById('review-back-btn');
    const reviewQuestionsList = document.getElementById('review-questions-list');
    const practiceMistakesBtn = document.getElementById('practice-mistakes-btn');


    // --- App State ---
    let questions = []; 
    let userAnswers = []; // *** NEW: To store answers for review ***
    let practiceMistakes = []; // *** NEW: To store questions for practice ***
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
    let hostPlayerListener = null; // *** BUG FIX: New variable for host listener ***
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

    // --- *** BUG FIX: Updated View Switching Logic *** ---
    function showView(viewName) {
        // Hide all main views
        homeView.style.display = 'none';
        libraryHomeView.style.display = 'none'; 
        communityContentView.style.display = 'none'; 
        examPrepView.style.display = 'none'; 
        quizAppContainer.style.display = 'none';
        studyPlayerContainer.style.display = 'none';
        dashboardView.style.display = 'none';
        hostLobbyView.style.display = 'none';
        playerLobbyView.style.display = 'none';
        gameHostView.style.display = 'none';
        gamePlayerView.style.display = 'none';
        finalLeaderboardView.style.display = 'none'; 
        reviewView.style.display = 'none'; 

        // Detach any active game listeners if we're leaving a game
        if (playerGameListener) {
            playerGameListener.off(); // Detach the RTDB listener
            playerGameListener = null;
            if(currentGamePin && auth.currentUser) {
                rtdb.ref(`games/${currentGamePin}/players/${auth.currentUser.uid}`).remove(); 
            }
        }
        
        // *** BUG FIX: Correctly detach host listener ***
        if (hostPlayerListener) {
            // Check if currentGamePin exists before trying to access rtdb
            if(currentGamePin) {
                rtdb.ref(`games/${currentGamePin}/players`).off('value', hostPlayerListener); 
            }
            hostPlayerListener = null;
        }
        
        // Don't clear these if we are moving between game views
        if (viewName !== 'game-host' && viewName !== 'game-player' && viewName !== 'final-leaderboard') {
            currentGamePin = null;
            currentGameRef = null;
        }
        
        // Deactivate all sidebar links
        sidebarHomeBtn.classList.remove('active');
        sidebarLibraryBtn.classList.remove('active');
        sidebarDashboardBtn.classList.remove('active');
        sidebarAdminBtn.classList.remove('active'); 

        // Show the requested view
        if (viewName === 'home') {
            homeView.style.display = 'block';
            sidebarHomeBtn.classList.add('active');
        } else if (viewName === 'library-home') { 
            libraryHomeView.style.display = 'block';
            sidebarLibraryBtn.classList.add('active');
        } else if (viewName === 'community') { 
            communityContentView.style.display = 'block';
            sidebarLibraryBtn.classList.add('active'); 
            loadSharedQuizzes(searchBar.value);
        } else if (viewName === 'exam-prep') { 
            examPrepView.style.display = 'block';
            sidebarLibraryBtn.classList.add('active'); 
            loadExamBrowser(); 
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
        } else if (viewName === 'final-leaderboard') { 
            finalLeaderboardView.style.display = 'block';
        } else if (viewName === 'review') { 
            reviewView.style.display = 'block';
            sidebarDashboardBtn.classList.add('active'); // Keep dashboard active
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

            // Show Admin button if user is admin
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
            sidebarAdminBtn.style.display = 'none'; 
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
        
        let createdUser; // To store the user object
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                createdUser = user; // Save the user
                return user.updateProfile({
                    displayName: username
                });
            })
            .then(() => {
                // *** NEW: Create a user document in Firestore ***
                return db.collection('users').doc(createdUser.uid).set({
                    username: username,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    generationCount: 0 // Give them 0 generations to start
                });
            })
            .then(() => {
                console.log("User signed up and user document created!");
            })
            .catch((error) => {
                showFriendlyError(error, signupErr); 
            });
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
    

    // --- Join Logic ---
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
        userAnswers = []; // *** NEW: Clear user answers ***
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
                    correct_answer_index: -1, // We will find this
                    correct_answer_text: q.correct_answer, // Store the text
                    questionType: 'mc',
                    explanation: 'Explanations are not available for API trivia questions.',
                    imageUrl: null
                }));
                
                // Find and set the correct_answer_index
                questions.forEach(q => {
                    q.correct_answer_index = q.options.findIndex(opt => opt === q.correct_answer_text);
                });

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
        userAnswers = []; // *** NEW: Clear user answers ***
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
            // --- QUIZ COMPLETE LOGIC ---
            
            // *** NEW: Add Review Button ***
            let reviewButtonHtml = '';
            if (currentQuizId !== 'practice-mistakes') { // Don't show review for a review quiz
                reviewButtonHtml = `<button id="review-quiz-btn" class="card-btn">Review Answers</button>`;
            }

            quizArea.innerHTML = `
                <h2>Quiz Complete!</h2>
                <p>Your final score is: ${score} / ${questions.length}</p>
                ${reviewButtonHtml}
            `;
            
            // Add listener for the new button
            if (currentQuizId !== 'practice-mistakes') {
                document.getElementById('review-quiz-btn').onclick = () => {
                    populateReviewView(questions, userAnswers, 'quiz'); // Go to review screen
                };
            }

            quizNav.style.display = 'none';
            quizControls.style.display = 'flex'; 
            timerDisplay.style.display = 'none'; 
            
            const user = auth.currentUser;
            const username = user ? user.displayName : 'Anonymous';
            const uid = user ? user.uid : null;
            
            // *** NEW: Save questions and answers (but not for practice quizzes) ***
            if (currentQuizId !== 'practice-mistakes') {
                saveQuizAttempt(username, uid, currentQuizId, score, userAnswers, questions);
            }
            
            showLeaderboard();
            currentQuizObject = null; 
            return;
            // --- END OF QUIZ COMPLETE LOGIC ---
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
                // Determine correct answer
                let correctAnswerText = q.correct_answer_text || q.options[q.correct_answer_index];
                let isCorrect = decodeHTML(opt) === decodeHTML(correctAnswerText);
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
    
    // *** NEW: All 3 functions below now save to userAnswers array ***
    function handleNoAnswer() {
        const q = questions[currentIndex];
        let correctAnswerText;
        
        userAnswers.push({ qIndex: currentIndex, answer: null, isCorrect: false }); // *** NEW ***

        if (q.questionType === 'fill') {
            correctAnswerText = q.answer;
            if(document.getElementById('fill-submit-btn')) document.getElementById('fill-submit-btn').disabled = true;
            if(document.getElementById('fill-answer-input')) document.getElementById('fill-answer-input').disabled = true;
        } else {
            correctAnswerText = q.correct_answer_text || q.options[q.correct_answer_index];
            disableOptions();
            const correctButton = document.querySelector(`.option-btn[data-correct="true"]`);
            if (correctButton) correctButton.classList.add('correct');
        }
        const explanationHtml = q.explanation ? `<div class="explanation-box">${q.explanation}</div>` : '';
        if(document.getElementById('feedback')) { 
            document.getElementById('feedback').innerHTML = `<span style="color:red;">Time's up! Correct was: ${decodeHTML(correctAnswerText)}</span>${explanationHtml}`;
        }
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
        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        
        userAnswers.push({ qIndex: currentIndex, answer: userAnswer, isCorrect: isCorrect }); // *** NEW ***

        const explanationHtml = q.explanation ? `<div class="explanation-box">${q.explanation}</div>` : '';
        const feedbackDiv = document.getElementById('feedback');
        if (isCorrect) {
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
        
        userAnswers.push({ qIndex: currentIndex, answer: selectedButton.textContent, isCorrect: isCorrect }); // *** NEW ***

        disableOptions(); 
        if (isCorrect) {
            selectedButton.classList.add('correct'); 
            feedbackDiv.innerHTML = `<span style="color:green;">Correct!</span>${explanationHtml}`;
            score++;
        } else {
            selectedButton.classList.add('incorrect'); 
            let correctAnswerText = q.correct_answer_text || q.options[q.correct_answer_index];
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
        scoreLabel.textContent = 'Score: ' + score; // *** BUG FIX: Removed stray 'L' ***
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
    // *** UPDATED: Now saves questions and answers ***
    function saveQuizAttempt(username, uid, quizId, score, userAnswers, questions) {
        if (!uid || !quizId) return; 
        
        db.collection("quiz_attempts").add({
            username: username,
            uid: uid,
            quizId: quizId,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAnswers: userAnswers,     // *** NEW ***
            questions: questions  // *** NEW: Save all questions ***
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
    
    // *** UPDATED: Adds "Review" button ***
    function loadMyResults(container) {
        const user = auth.currentUser;
        if (!user) return; 
        container.innerHTML = '<div class="loader"></div>';
        
        // *** BUG FIX: Remove .orderBy() to avoid needing an index ***
        db.collection("quiz_attempts").where("uid", "==", user.uid).limit(50) // Get last 50
          .get()
          .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    container.innerHTML = '<p>You haven\'t played any quizzes yet.</p>';
                    return;
                }
                
                let attempts = [];
                querySnapshot.forEach((doc) => {
                    const attempt = doc.data();
                    attempt.id = doc.id; // Save the attempt ID
                    attempts.push(attempt);
                });

                // *** NEW: Sort in JavaScript instead of in the query ***
                attempts.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
                attempts = attempts.slice(0, 10); // Get the 10 most recent

                let html = '';
                const titlePromises = [];

                attempts.forEach((attempt) => {
                    if (attempt.quizId && !attempt.quizId.startsWith('api_')) {
                        if (attempt.quizId.includes('/')) { 
                            titlePromises.push(Promise.resolve({ exists: true, data: () => ({ title: "Exam Quiz" }) })); 
                        } else { 
                            titlePromises.push(db.collection('quizzes').doc(attempt.quizId).get());
                        }
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
                    
                    let reviewButtonHtml = '';
                    if (attempt.questions && attempt.userAnswers) { // Check if data exists to be reviewed
                         reviewButtonHtml = `<button class="review-btn card-btn" data-attempt-id="${attempt.id}">Review</button>`;
                    }

                    html += `
                        <div class="my-result-card">
                            <div>
                                <div class="my-result-card-name">${quizTitle}</div>
                                <div class="my-result-card-title">${new Date(attempt.timestamp.toDate()).toLocaleDateString()}</div>
                            </div>
                            <div class="buttons-wrapper">
                                ${reviewButtonHtml}
                                <span class="my-result-card-score">${attempt.score} / ${attempt.questions ? attempt.questions.length : '?'}</span>
                            </div>
                        </div>`;
                });
                container.innerHTML = html;
                
                // *** NEW: Add listeners for all new Review buttons ***
                container.querySelectorAll('.review-btn').forEach(btn => {
                    btn.onclick = () => {
                        const attemptId = btn.dataset.attemptId;
                        const attemptData = attempts.find(a => a.id === attemptId);
                        if (attemptData) {
                            // Set this as the "current" quiz object for the review title
                            currentQuizObject = { title: (titleDocs[attempts.indexOf(attemptData)]?.data().title || "Quiz") };
                            populateReviewView(attemptData.questions, attemptData.userAnswers, 'dashboard');
                        }
                    };
                });
                
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
        communityQuizList.innerHTML = '<div class="loader"></div>'; // Use new list
        let query = db.collection("quizzes").orderBy("likeCount", "desc");
        if (searchTerm) {
            query = query.where("title", ">=", searchTerm)
                         .where("title", "<=", searchTerm + '\uf8ff');
        }
        query.get().then((querySnapshot) => {
            communityQuizList.innerHTML = ''; 
            if (querySnapshot.empty) {
                communityQuizList.innerHTML = `<p>No content found. Be the first to create one!</p>`;
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
                communityQuizList.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            communityQuizList.innerHTML = '<p>Could not load content. Check console.</p>';
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
        try {
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
        } catch (error) {
            console.error("Error hosting game:", error);
            showToast("Error hosting game. Check console and Firebase Rules.", "error");
        }
    }

    // Step 2: Host lands in lobby
    function initHostLobby(pin, title) {
        showView('host-lobby');
        hostLobbyTitle.textContent = `Hosting Quiz: ${title}`;
        hostLobbyPin.textContent = pin;
        
        // *** BUG FIX: Set these refs correctly ***
        currentGamePin = pin;
        currentGameRef = rtdb.ref(`games/${pin}`);

        const playersRef = rtdb.ref(`games/${pin}/players`);
        
        // *** BUG FIX: Store listener in new variable ***
        hostPlayerListener = playersRef.on('value', (snapshot) => { 
            const players = snapshot.val() || {};
            hostLobbyPlayers.innerHTML = '';
            Object.values(players).forEach(player => {
                const playerEl = document.createElement('div');
                playerEl.className = 'player-list-item';
                playerEl.textContent = player.name;
                hostLobbyPlayers.appendChild(playerEl);
            });
        });
        
        currentGameRef.onDisconnect().remove(); 
    }
    
    // Step 3: Player joins with PIN
    function joinLiveGame(pin) {
        const user = auth.currentUser;
        if (!user) {
            showToast("You must be logged in to join a game.", "error");
            return;
        }
        
        gamePinInput.value = ""; // Clear input
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
                currentGameRef = gameRef; // Set the main game ref
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
        currentGameRef = rtdb.ref(`games/${pin}`); // Set the main game ref
        
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

        playerGameListener = currentGameRef.on('value', (snapshot) => {
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
        if (!currentGameRef) return; // Safety check
        if (qIndex >= hostQuizData.questions.length) {
            hostShowFinalResults();
            return;
        }
        currentGameRef.update({
            gameState: 'question',
            currentQuestion: qIndex,
            answers: {},
            correctAnswer: null // Clear previous correct answer
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
        if (!currentGameRef) return; // Safety check
        
        const qIndex = (await currentGameRef.child('currentQuestion').get()).val();
        const q = hostQuizData.questions[qIndex];
        const correctAnswerIndex = q.correct_answer_index;
        
        await currentGameRef.update({ 
            gameState: 'results',
            correctAnswer: correctAnswerIndex 
        });
        
        gameHostAnswers.querySelector(`[data-correct="true"]`).classList.add('correct');
        
        const answersSnapshot = await currentGameRef.child('answers').get();
        const answers = answersSnapshot.val() || {};
        const scoresRef = currentGameRef.child('scores');
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
        if (!currentGameRef) return;
        const qIndex = (await currentGameRef.child('currentQuestion').get()).val();
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
        if (!currentGameRef) return;
        currentGameRef.update({ gameState: 'final' });
        gameHostQuestion.textContent = "Game Over!";
        gameHostAnswers.style.display = 'none';
        gameHostNextBtn.style.display = 'none';
        gameHostTimer.style.display = 'none';
        gameHostLeaderboard.style.display = 'block'; 
        
        setTimeout(() => {
            if (currentGameRef) {
                currentGameRef.remove();
                currentGameRef = null;
            }
        }, 60000);
    }

    // Step 8: Player game view
    function playerShowQuestion(qIndex) {
        if (qIndex < 0) return;
        showView('game-player');
        gamePlayerStatus.textContent = `Question ${qIndex + 1}`;
        gamePlayerAnswers.style.display = 'grid'; 
        playerFeedbackView.style.display = 'none'; 
        
        gamePlayerAnswers.querySelectorAll('.player-answer-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('selected', 'reveal-correct', 'reveal-wrong');
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
        const correctAnswer = gameData.correctAnswer; 
        
        let points = 0;
        let isCorrect = false;

        playerFeedbackView.style.display = 'flex';
        
        if (myAnswer && myAnswer.answerIndex == correctAnswer) {
            isCorrect = true;
            const timeTaken = myAnswer.time;
            points = Math.round(1000 - (timeTaken * 100)); 
            
            playerFeedbackView.className = 'player-feedback-overlay correct';
            playerFeedbackText.textContent = "Correct!";
            playerPointsEarned.textContent = `+${points} points`;
            
        } else {
            isCorrect = false;
            playerFeedbackView.className = 'player-feedback-overlay incorrect';
            playerFeedbackText.textContent = "Incorrect!";
            playerPointsEarned.textContent = "+0 points";
        }
        
        playerTotalScore.textContent = myCurrentScore;
        gamePlayerStatus.textContent = `Your total score: ${myCurrentScore}`;
        
        gamePlayerAnswers.querySelectorAll('.player-answer-btn').forEach(btn => {
            btn.disabled = true;
            const btnIndex = btn.dataset.index;
            
            if (btnIndex == correctAnswer) {
                btn.classList.add('reveal-correct');
            } else if (btnIndex == (myAnswer ? myAnswer.answerIndex : null)) {
                btn.classList.add('selected');
            } else {
                btn.classList.add('reveal-wrong'); 
            }
        });
    }
    
    // Step 11: Player sees final results
    function playerShowFinalResults(gameData) {
        const myUid = auth.currentUser.uid;
        if(!myUid || !gameData.scores[myUid]) {
            showView('home'); 
            return;
        }
        
        const sortedScores = Object.values(gameData.scores).sort((a, b) => b.score - a.score);
        
        showView('final-leaderboard');
        
        // 1st Place
        if(sortedScores[0]) {
            podiumName1.textContent = sortedScores[0].name;
            podiumScore1.textContent = sortedScores[0].score;
        }
        // 2nd Place
        if(sortedScores[1]) {
            podiumName2.textContent = sortedScores[1].name;
            podiumScore2.textContent = sortedScores[1].score;
            document.querySelector('.podium-place.second').style.display = 'block';
        } else {
            document.querySelector('.podium-place.second').style.display = 'none';
        }
        // 3rd Place
        if(sortedScores[2]) {
            podiumName3.textContent = sortedScores[2].name;
            podiumScore3.textContent = sortedScores[2].score;
            document.querySelector('.podium-place.third').style.display = 'block';
        } else {
            document.querySelector('.podium-place.third').style.display = 'none';
        }

        // Rest of the players
        finalLeaderboardList.innerHTML = '';
        sortedScores.slice(3).forEach((player, index) => {
             finalLeaderboardList.innerHTML += `
                <div class="my-result-card">
                    <div>
                        <span class="my-result-card-name">${index + 4}. ${player.name}</span>
                    </div>
                    <span class="my-result-card-score">${player.score}</span>
                </div>
            `;
        });
        
        if (playerGameListener) {
            playerGameListener.off(); 
            playerGameListener = null;
        }
        currentGamePin = null;
    }
    
    // --- Admin Panel Functions ---
    async function loadAdminDropdowns() {
        try {
            // 1. Populate Exams
            const examSelects = [adminExamSelect, bulkExamSelect];
            const examSnapshot = await db.collection("exams").get();
            
            examSelects.forEach(select => {
                select.innerHTML = '<option value="">-- Select Exam --</option>';
                examSnapshot.forEach(doc => {
                    select.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`;
                });
            });

            // 2. Populate Subjects based on Exam
            [adminExamSelect, bulkExamSelect].forEach(select => {
                select.onchange = async () => {
                    const examId = select.value;
                    const subjectSelect = (select.id === 'admin-exam-select') ? adminSubjectSelect : bulkSubjectSelect;
                    const topicSelect = (select.id === 'admin-exam-select') ? adminTopicSelect : bulkTopicSelect;
                    
                    if (!examId) {
                        subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
                        topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
                        return;
                    }
                    const subjectSnapshot = await db.collection("exams").doc(examId).collection("subjects").get();
                    subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
                    subjectSnapshot.forEach(doc => {
                        subjectSelect.innerHTML += `<option value="${doc.id}" data-exam-id="${examId}">${doc.data().name}</option>`;
                    });
                    topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
                };
            });

            // 3. Populate Topics based on Subject
            [adminSubjectSelect, bulkSubjectSelect].forEach(select => {
                select.onchange = async () => {
                    const selectedOption = select.options[select.selectedIndex];
                    const subjectId = selectedOption.value;
                    const examId = selectedOption.dataset.examId;
                    const topicSelect = (select.id === 'admin-subject-select') ? adminTopicSelect : bulkTopicSelect;
                    
                    if (!subjectId) {
                        topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
                        return;
                    }
                    const topicSnapshot = await db.collection("exams").doc(examId).collection("subjects").doc(subjectId).collection("topics").get();
                    topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
                    topicSnapshot.forEach(doc => {
                        topicSelect.innerHTML += `<option value="${doc.id}" data-exam-id="${examId}" data-subject-id="${subjectId}">${doc.data().name}</option>`;
                    });
                };
            });
        } catch (err) {
            console.error("Error loading admin dropdowns: ", err);
            showToast("Could not load admin data.", "error");
        }
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
            correct_answer_index: 0, 
            questionType: 'mc' 
        };

        db.collection("exams").doc(examId).collection("subjects").doc(subjectId).collection("topics").doc(topicId).collection("questions").add(newQuestion)
        .then(() => {
            showToast("Exam question added!", "success");
            addExamQuestionForm.reset();
        }).catch(err => showToast(err.message, "error"));
    };

    // --- Bulk Upload Logic ---
    bulkUploadForm.onsubmit = (e) => {
        e.preventDefault();
        
        const selectedOption = bulkTopicSelect.options[bulkTopicSelect.selectedIndex];
        if (!selectedOption || !selectedOption.value) {
            showToast("Please select an exam, subject, and topic.", "error");
            return;
        }
        
        const topicId = selectedOption.value;
        const subjectId = selectedOption.dataset.subjectId;
        const examId = selectedOption.dataset.examId;
        
        const file = bulkUploadFile.files[0];
        if (!file) {
            showToast("Please select a .json file to upload.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const questionsArray = JSON.parse(event.target.result);
                if (!Array.isArray(questionsArray)) {
                    throw new Error("JSON file must be an array.");
                }

                showToast(`Uploading ${questionsArray.length} questions...`, "");

                // Use a BATCH write for performance
                const batch = db.batch();
                const collectionRef = db.collection("exams").doc(examId).collection("subjects").doc(subjectId).collection("topics").doc(topicId).collection("questions");

                let validQuestions = 0;
                questionsArray.forEach(q => {
                    // Validate each question object
                    if (!q.question || !q.options || q.correct_answer_index == null || !q.explanation) {
                        console.warn("Skipping invalid question object: ", q);
                        return; // Skip this question
                    }
                    
                    const newQuestionRef = collectionRef.doc(); // Create a new doc with auto-ID
                    batch.set(newQuestionRef, {
                        question: q.question,
                        options: q.options,
                        correct_answer_index: q.correct_answer_index,
                        explanation: q.explanation,
                        questionType: 'mc' // All bulk uploads are MC for now
                    });
                    validQuestions++;
                });

                await batch.commit();
                showToast(`Successfully uploaded ${validQuestions} questions!`, "success");
                bulkUploadForm.reset();

            } catch (err) {
                console.error("Error reading or parsing file: ", err);
                showToast(`Error: ${err.message}`, "error");
            }
        };
        reader.readAsText(file);
    };

    
    // --- Exam Browser Logic ---
    async function loadExamBrowser(path = 'exams', breadcrumbHistory = []) {
        // *** BUG FIX: DO NOT call showView here, it causes an infinite loop ***
        examBrowserList.innerHTML = '<div class="loader"></div>';
        
        // 1. Build Breadcrumbs
        let currentTitle = "Exam Prep";
        if (breadcrumbHistory.length > 0) {
            currentTitle = breadcrumbHistory[breadcrumbHistory.length - 1].name;
        }
        examBrowserTitle.textContent = currentTitle;
        
        examBreadcrumbs.innerHTML = ''; // Clear old breadcrumbs
        const homeLink = document.createElement('a');
        homeLink.href = "#";
        homeLink.textContent = "Exam Prep";
        homeLink.onclick = (e) => {
            e.preventDefault();
            loadExamBrowser(); // Go to top level
        };
        examBreadcrumbs.appendChild(homeLink);

        breadcrumbHistory.forEach((crumb, index) => {
            examBreadcrumbs.innerHTML += `<span>/</span>`;
            const crumbLink = document.createElement('a');
            crumbLink.href = "#";
            crumbLink.textContent = crumb.name;
            crumbLink.onclick = (e) => {
                e.preventDefault();
                // Load the path for the crumb they clicked
                loadExamBrowser(crumb.path.substring(0, crumb.path.lastIndexOf('/')), breadcrumbHistory.slice(0, index));
            };
            examBreadcrumbs.appendChild(crumbLink);
        });

        // 2. Fetch Data from Firestore
        let query;
        if (path.endsWith('/questions')) {
            // We are at the question level. We just show one "Quiz"
            examBrowserList.innerHTML = '';
            const card = createBrowseCard("Start Practice Quiz", "exam", "Click to start the practice test for this topic.", () => {
                startExamQuiz(path); // Start the quiz
            });
            examBrowserList.appendChild(card);
            return;
        }

        // Otherwise, we are browsing exams, subjects, or topics
        query = db.collection(path);
        
        try {
            const snapshot = await query.get();
            examBrowserList.innerHTML = '';
            if (snapshot.empty) {
                examBrowserList.innerHTML = '<p>No content found in this section. Admin needs to add it!</p>';
                return;
            }

            snapshot.forEach(doc => {
                const item = doc.data();
                const itemId = doc.id;
                
                // Determine next step
                let nextCollectionName = 'subjects'; // Default
                if (path === 'exams') nextCollectionName = 'subjects';
                else if (path.includes('/subjects/')) nextCollectionName = 'topics';
                else if (path.includes('/topics/')) nextCollectionName = 'questions';

                const newFullPath = `${path}/${itemId}/${nextCollectionName}`;
                
                const card = createBrowseCard(item.name, "exam", `Browse ${item.name}`, () => {
                    const newCrumbHistory = [...breadcrumbHistory, { name: item.name, path: newFullPath }];
                    loadExamBrowser(newFullPath, newCrumbHistory);
                });
                examBrowserList.appendChild(card);
            });

        } catch (err) {
            console.error("Error loading exam browser: ", err);
            examBrowserList.innerHTML = '<p>Error loading content.</p>';
        }
    }
    
    // Helper to create cards for the exam browser
    function createBrowseCard(title, type, text, onClick) {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `<div class="quiz-card-title ${type}">${title}</div>`;
        if(text) {
            card.innerHTML += `<div class="quiz-card-footer">${text}</div>`;
        }
        card.onclick = onClick;
        return card;
    }

    // Function to start an Exam Quiz
    async function startExamQuiz(collectionPath) {
        examBrowserList.innerHTML = '<div class="loader"></div>';
        const snapshot = await db.collection(collectionPath).get();
        const examQuestions = [];
        snapshot.forEach(doc => {
            examQuestions.push(doc.data());
        });

        if (examQuestions.length === 0) {
            showToast("No questions found for this topic.", "error");
            loadExamBrowser(); // Go back home
            return;
        }
        
        // Create a temporary "quiz object" to pass to the player
        const examQuizObject = {
            title: document.getElementById('exam-browser-title').textContent,
            questions: examQuestions,
            type: 'exam' // This isn't a user quiz
        };
        
        // Use the existing quiz player
        startCustomQuiz(examQuizObject, collectionPath); // Pass path as ID
    }
    
    // --- *** NEW: Answer Review Function *** ---
    function populateReviewView(questions, userAnswers, fromView) {
        showView('review-view');
        reviewQuestionsList.innerHTML = ''; // Clear old review
        practiceMistakes = []; // Clear mistakes
        reviewTitle.textContent = `Reviewing: ${currentQuizObject ? currentQuizObject.title : 'Quiz'}`;

        // Set up the back button
        reviewBackBtn.onclick = () => {
            if (fromView === 'dashboard') {
                showView('dashboard');
            } else {
                showView('quiz'); // Go back to the quiz results screen
                quizArea.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score is: ${score} / ${questions.length}</p><button id="review-quiz-btn" class="card-btn">Review Answers</button>`;
                document.getElementById('review-quiz-btn').onclick = () => {
                   populateReviewView(questions, userAnswers, 'quiz');
                };
            }
        };

        questions.forEach((q, index) => {
            const ua = userAnswers.find(a => a.qIndex === index);
            const userAnswer = ua ? ua.answer : null;
            const card = document.createElement('div');
            card.className = 'review-question-card';

            let optionsHtml = '';
            
            if (q.questionType === 'fill') {
                const correctAnswer = q.answer;
                const isCorrect = (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase());
                
                if (!isCorrect) practiceMistakes.push(q); // Add to mistakes list
                
                optionsHtml = `
                    <div class="review-fill-answer ${isCorrect ? 'correct' : 'incorrect'}">
                        <strong>Your Answer:</strong> ${userAnswer || "No answer"}
                    </div>
                    ${!isCorrect ? `<div class="review-fill-answer correct" style="margin-top: 10px;"><strong>Correct Answer:</strong> ${correctAnswer}</div>` : ''}
                `;
            } else {
                // Multiple Choice
                const correctAnswer = q.correct_answer_text || q.options[q.correct_answer_index];
                if (!ua || !ua.isCorrect) practiceMistakes.push(q); // Add to mistakes list

                optionsHtml = q.options.map(opt => {
                    const isCorrect = (decodeHTML(opt) === decodeHTML(correctAnswer));
                    const isSelected = (decodeHTML(opt) === decodeHTML(userAnswer));
                    
                    let className = 'review-option';
                    if (isCorrect) {
                        className += ' correct';
                    } else if (isSelected && !isCorrect) {
                        className += ' incorrect';
                    }
                    
                    if (isSelected) {
                        className += ' selected'; // Extra style for what user picked
                    }
                    
                    return `<div class="${className}">${decodeHTML(opt)}</div>`;
                }).join('');
            }
            
            card.innerHTML = `
                <h4>Q${index + 1}: ${decodeHTML(q.question)}</h4>
                ${q.imageUrl ? `<img src="${q.imageUrl}" class="quiz-question-image">` : ''}
                <div class="review-options-list">
                    ${optionsHtml}
                </div>
                <div class="explanation-box" style="display: block;">
                    <strong>Explanation:</strong>
                    <p style="margin: 5px 0 0 0;">${decodeHTML(q.explanation)}</p>
                </div>
            `;
            reviewQuestionsList.appendChild(card);
        });

        // Show or hide the practice mistakes button
        if (practiceMistakes.length > 0) {
            practiceMistakesBtn.style.display = 'block';
        } else {
            practiceMistakesBtn.style.display = 'none';
        }
    }

    
    // --- Initialization ---
    function init() {
        // --- Sidebar Listeners ---
        sidebarHomeBtn.onclick = (e) => { e.preventDefault(); showView('home'); };
        sidebarLibraryBtn.onclick = (e) => { e.preventDefault(); showView('library-home'); }; 
        sidebarDashboardBtn.onclick = (e) => { e.preventDefault(); showView('dashboard'); };
        sidebarAdminBtn.onclick = (e) => { 
            e.preventDefault();
            adminContainer.style.display = 'flex';
            loadAdminDropdowns();
        };
        closeAdminBtn.onclick = () => { 
            adminContainer.style.display = 'none';
        };

        // --- NEW: Library View Listeners ---
        navCommunityBtn.onclick = (e) => {
            e.preventDefault();
            showView('community');
        };
        navExamPrepBtn.onclick = (e) => {
            e.preventDefault();
            showView('exam-prep');
        };
        
        // *** NEW: Final Leaderboard Home Button ***
        finalLeaderboardHomeBtn.onclick = (e) => {
            e.preventDefault();
            showView('home');
        };

        // *** NEW: Admin Panel Tab Listeners ***
        adminTabAdd.onclick = () => {
            adminTabAdd.classList.add('active');
            adminTabManage.classList.remove('active');
            adminAddContent.style.display = 'block';
            adminManageContent.style.display = 'none';
        };
        adminTabManage.onclick = () => {
            adminTabManage.classList.add('active');
            adminTabAdd.classList.remove('active');
            adminManageContent.style.display = 'block';
            adminAddContent.style.display = 'none';
            // Load the manager when tab is clicked
            loadAdminManageList(); 
        };

        // *** NEW: Answer Review Back Button ***
        reviewBackBtn.onclick = () => {
            // Default action, will be overridden by populateReviewView
            showView('dashboard'); 
        };
        
        // *** NEW: Practice Mistakes Button ***
        practiceMistakesBtn.onclick = () => {
            if (practiceMistakes.length > 0) {
                const mistakesQuiz = {
                    title: "Practice Mistakes",
                    questions: practiceMistakes, // The array we built in populateReviewView
                    type: 'review'
                };
                startCustomQuiz(mistakesQuiz, 'practice-mistakes');
            } else {
                showToast("You have no mistakes to practice!", "");
            }
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
            if (communityContentView.style.display === 'block') { // Check if it's the right view
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

    // --- *** NEW: Admin Content Manager Functions *** ---
    function loadAdminManageList(path = 'exams', level = 'exam') {
        let container;
        // Reset lower levels
        if (level === 'exam') {
            adminManageSubjects.innerHTML = '';
            adminManageTopics.innerHTML = '';
            adminManageQuestions.innerHTML = '';
            container = adminManageExams;
        } else if (level === 'subject') {
            adminManageTopics.innerHTML = '';
            adminManageQuestions.innerHTML = '';
            container = adminManageSubjects;
        } else if (level === 'topic') {
            adminManageQuestions.innerHTML = '';
            container = adminManageTopics;
        } else if (level === 'question') {
            container = adminManageQuestions;
        }
        
        container.innerHTML = '<div class="loader"></div>';

        db.collection(path).get().then(snapshot => {
            container.innerHTML = '';
            if (snapshot.empty) {
                container.innerHTML = '<p>No content here.</p>';
                return;
            }
            snapshot.forEach(doc => {
                const item = doc.data();
                const docId = doc.id;
                const itemCard = document.createElement('div');
                itemCard.className = 'manage-quiz-card';
                itemCard.innerHTML = `
                    <h4>${item.name || item.question.substring(0, 50) + '...'}</h4>
                    <div class="buttons-wrapper">
                        <button class="admin-delete-btn" data-id="${docId}">Delete</button>
                    </div>
                `;
                
                // Add click listener to browse deeper (unless it's a question)
                if (level !== 'question') {
                    itemCard.querySelector('h4').style.cursor = 'pointer';
                    itemCard.querySelector('h4').onclick = () => {
                        let nextLevel = '';
                        let nextPath = '';
                        if (level === 'exam') {
                            nextLevel = 'subject';
                            nextPath = `exams/${docId}/subjects`;
                        } else if (level === 'subject') {
                            nextLevel = 'topic';
                            nextPath = `${path}/${docId}/topics`;
                        } else if (level === 'topic') {
                            nextLevel = 'question';
                            nextPath = `${path}/${docId}/questions`;
                        }
                        loadAdminManageList(nextPath, nextLevel);
                    };
                }
                
                // Add delete listener
                itemCard.querySelector('.admin-delete-btn').onclick = (e) => {
                    e.stopPropagation(); // Don't trigger the click above
                    deleteAdminContent(path, docId, level);
                };
                container.appendChild(itemCard);
            });
        }).catch(err => {
            console.error("Error loading admin manage list: ", err);
            container.innerHTML = '<p>Error loading content.</p>';
        });
    }

    async function deleteAdminContent(path, docId, level) {
        if (!confirm(`Are you SURE you want to delete this ${level}? This will delete all content inside it!`)) {
            return;
        }
        
        showToast(`Deleting...`, "");
        
        // This is a complex operation, we need to delete all sub-collections
        // For simplicity right now, we'll only delete the doc itself.
        // A full solution requires a Cloud Function for deep deletes.
        try {
            await db.collection(path).doc(docId).delete();
            showToast(`${level} deleted successfully!`, "success");
            // Refresh the current level
            loadAdminManageList(path, level);
            // After deleting, we must also refresh the add content dropdowns
            loadAdminDropdowns();
        } catch (err) {
            console.error("Error deleting content: ", err);
            showToast(`Error: ${err.message}`, "error");
        }
    }


    init(); // Run the initialization
});