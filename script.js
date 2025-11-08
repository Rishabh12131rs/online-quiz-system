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
    const nextBtn = document.getElementById('nextBtn');
    const questionNum = document.getElementById('questionNum');
    const scoreLabel = document.getElementById('scoreLabel');
    const timerDisplay = document.getElementById('timer-display');
    
    // Main Page Elements
    const quizList = document.querySelector('.quiz-list'); 
    const searchBar = document.getElementById('search-bar'); 
    const myResultsBtn = document.getElementById('my-results-btn');

    // Quiz Editor Elements
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
    
    // --- NEW: Study Guide Editor Elements ---
    const createStudyGuideBtn = document.getElementById('create-study-guide-btn');
    const studyEditorContainer = document.getElementById('study-editor-container');
    const closeStudyEditorBtn = document.getElementById('close-study-editor-btn');
    const studyTitleInput = document.getElementById('study-title-input');
    const addFlashcardBtn = document.getElementById('add-flashcard-btn');
    const flashcardListContainer = document.getElementById('flashcard-list-container');
    const saveStudyGuideBtn = document.getElementById('save-study-guide-btn');
    
    // --- NEW: Study Player Elements ---
    const studyPlayerContainer = document.getElementById('study-player-container');
    const closeStudyPlayerBtn = document.getElementById('close-study-player-btn');
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
    
    // My Results Modal Elements
    const myResultsContainer = document.getElementById('my-results-container');
    const closeMyResultsBtn = document.getElementById('close-my-results-btn');
    const myResultsListContainer = document.getElementById('my-results-list-container');
    
    // GIPHY Modal Elements
    const giphyContainer = document.getElementById('giphy-container');
    const closeGiphyBtn = document.getElementById('close-giphy-btn');
    const giphySearchBar = document.getElementById('giphy-search-bar');
    const giphySearchBtn = document.getElementById('giphy-search-btn');
    const giphyResultsGrid = document.getElementById('giphy-results-grid');
    
    // Toast & Dark Mode Elements
    const toast = document.getElementById('toast-notification');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // --- App State ---
    let questions = []; // Holds API or custom quiz questions
    let currentQuizId = null; 
    let currentQuizObject = null; // *** UPDATED ***
    let currentIndex = 0;
    let score = 0;
    let timerInterval; 
    let timeLeft = 10; 
    let activeGiphyQuestionCard = null; 
    
    // --- NEW: Study Guide State ---
    let currentFlashcards = [];
    let currentFlashcardIndex = 0;

    // --- Toast Notification Function ---
    function showToast(message, type = '') {
        toast.textContent = message;
        toast.className = ''; 
        if (type) {
            toast.classList.add(type); 
        }
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); 
    }
    
    // --- Friendly Error Function ---
    function showFriendlyError(error, errorElement) {
        let message = "An unknown error occurred.";
        switch (error.code) {
            case "auth/wrong-password":
                message = "Wrong password. Please try again.";
                break;
            case "auth/user-not-found":
            case "auth/invalid-email":
                message = "No account found with this email.";
                break;
            case "auth/email-already-in-use":
                message = "An account already exists with this email.";
                break;
            case "auth/weak-password":
                message = "Password should be at least 6 characters.";
                break;
            case "auth/popup-closed-by-user":
                message = "Sign-in popup closed. Please try again.";
                break;
        }
        errorElement.textContent = message;
    }

    // --- MAIN AUTHENTICATION LISTENER ---
    auth.onAuthStateChanged(user => {
        if (user) {
            mainContent.style.display = 'block'; 
            authContainer.style.display = 'none'; 
            userDisplay.style.display = 'flex';
            myResultsBtn.style.display = 'block'; // Show "My Results"
            welcomeUser.textContent = `Hello, ${user.displayName || 'User'}`; 
            loadSharedQuizzes(); // Load quizzes
        } else {
            mainContent.style.display = 'none'; 
            authContainer.style.display = 'flex'; 
            userDisplay.style.display = 'none';
            myResultsBtn.style.display = 'none'; // Hide "My Results"
            welcomeUser.textContent = '';
        }
    });

    // --- Page/Modal Toggling ---
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
        loadSharedQuizzes(searchBar.value); 
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
        loadSharedQuizzes(searchBar.value);
    };
    
    // --- NEW: Study Guide Editor Toggling ---
    createStudyGuideBtn.onclick = () => {
        mainContent.style.display = 'none';
        studyEditorContainer.style.display = 'flex';
    };
    closeStudyEditorBtn.onclick = () => {
        mainContent.style.display = 'block';
        studyEditorContainer.style.display = 'none';
        flashcardListContainer.innerHTML = '';
        studyTitleInput.value = '';
    };

    // --- NEW: Study Player Toggling ---
    closeStudyPlayerBtn.onclick = () => {
        mainContent.style.display = 'block';
        studyPlayerContainer.style.display = 'none';
    };
    studyFlashcard.onclick = () => {
        studyFlashcard.classList.toggle('is-flipped');
    };
    
    manageQuizzesBtn.onclick = () => {
        const user = auth.currentUser;
        if (!user) return; 
        
        editorContainer.style.display = 'none'; 
        manageContainer.style.display = 'flex'; 
        loadManageList(user); 
    };
    closeManageBtn.onclick = () => {
        mainContent.style.display = 'block'; 
        manageContainer.style.display = 'none';
        loadSharedQuizzes(searchBar.value); 
    };

    closeResultsBtn.onclick = () => {
        manageContainer.style.display = 'flex'; 
        resultsContainer.style.display = 'none';
    };

    myResultsBtn.onclick = () => {
        mainContent.style.display = 'none';
        myResultsContainer.style.display = 'flex';
        loadMyResults();
    };
    closeMyResultsBtn.onclick = () => {
        mainContent.style.display = 'block';
        myResultsContainer.style.display = 'none';
    };
    
    closeGiphyBtn.onclick = () => {
        giphyContainer.style.display = 'none';
        editorContainer.style.display = 'flex'; // Show editor again
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
                return user.updateProfile({
                    displayName: username
                });
            })
            .then(() => {
                console.log("User signed up!");
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
            .catch((error) => {
                showFriendlyError(error, loginErr); 
            });
    };
    
    googleSignInBtn.onclick = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log("User signed in with Google!");
            }).catch((error) => {
                showFriendlyError(error, loginErr);
            });
    };

    logoutBtn.onclick = () => {
        auth.signOut().catch(err => console.error("Sign out error", err));
    };

    // Forgot Password Logic
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
            .catch((error) => {
                showFriendlyError(error, forgotError); 
            });
    };

    // --- Quiz Logic ---
    function startApiQuiz(category, count, difficulty) { 
        currentQuizId = `api_${category}_${difficulty}`; 
        currentQuizObject = null; // API quizzes don't have recommendations
        
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        quizControls.style.display = 'none';
        quizArea.innerHTML = '<div class="loader"></div>'; 
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
                // Convert API questions to our new format
                questions = data.results.map(q => ({
                    question: q.question,
                    options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                    correct_answer: q.correct_answer, // Store the correct text
                    questionType: 'mc', // API is always multiple choice
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

    // *** UPDATED ***
    function startCustomQuiz(quizObject, quizId) {
        questions = quizObject.questions;
        currentQuizId = quizId; 
        currentQuizObject = quizObject; // Store the whole quiz object
        
        score = 0;
        currentIndex = 0;
        
        mainContent.style.display = 'none';
        quizAppContainer.style.display = 'block';
        quizControls.style.display = 'none'; 
        quizNav.style.display = 'flex'; 
        
        showQuestion(); 
    }

    // --- NEW: Join Logic (Handles Quizzes and Study Guides) ---
    joinQuizBtn.onclick = () => {
        const contentId = quizIdInput.value.trim();
        if (contentId.length < 10) { 
            showToast("Please enter a valid Content ID.", "error");
            return;
        }

        db.collection("quizzes").doc(contentId).get().then((doc) => {
            if (doc.exists) {
                quizIdInput.value = ''; 
                const content = doc.data();
                if (content.type === 'study') {
                    // It's a study guide
                    startStudySession(content, doc.id);
                } else {
                    // It's a quiz
                    startCustomQuiz(content, doc.id); 
                }
            } else {
                showToast("Content ID not found in the database.", "error");
            }
        }).catch((error) => {
            console.error("Error getting content:", error);
            showToast("Error finding content.", "error");
        });
    };
    
    // *** UPDATED ***
    function showQuestion() {
        clearInterval(timerInterval);
        
        if (currentIndex >= questions.length) {
            // --- QUIZ COMPLETE LOGIC ---
            const finalScorePercent = (questions.length > 0) ? (score / questions.length) : 0;
            let recommendationHtml = ''; // Placeholder for the recommendation box
    
            // Check for low score AND if this is a custom quiz that has a recommendation
            if (finalScorePercent < 0.6 && currentQuizObject && currentQuizObject.recommendedStudyGuideId) {
                
                const guideId = currentQuizObject.recommendedStudyGuideId;
                // Add a placeholder which we will fill
                recommendationHtml = `<div class="recommendation-box" data-guide-id="${guideId}">Loading recommendation...</div>`;
                
                // Asynchronously fetch the study guide info
                db.collection("quizzes").doc(guideId).get()
                    .then(doc => {
                        const recBox = document.querySelector(`.recommendation-box[data-guide-id="${guideId}"]`);
                        if (recBox && doc.exists) {
                            const studyGuideData = doc.data();
                            const studyGuideTitle = studyGuideData.title;
                            
                            recBox.innerHTML = `
                                <h4>You scored ${score}/${questions.length}.</h4>
                                <p>We recommend reviewing this study guide before trying again:</p>
                                <button id="recommend-btn" class="card-btn">Study: ${studyGuideTitle}</button>
                            `;
                            
                            document.getElementById('recommend-btn').onclick = () => {
                                // Close the quiz player and open the study player
                                quizAppContainer.style.display = 'none';
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
    
            // Display final score and recommendation
            quizArea.innerHTML = `
                <h2>Quiz Complete!</h2>
                <p>Your final score is: ${score} / ${questions.length}</p>
                ${recommendationHtml}
            `;
            
            quizNav.style.display = 'none';
            quizControls.style.display = 'flex'; 
            timerDisplay.style.display = 'none'; 
            
            const user = auth.currentUser;
            const username = user ? user.displayName : 'Anonymous';
            const uid = user ? user.uid : null;
            saveQuizAttempt(username, uid, currentQuizId, score);
            showLeaderboard();
            
            currentQuizObject = null; // Clear the quiz object
            return;
            // --- END OF QUIZ COMPLETE LOGIC ---
        }
    
        const q = questions[currentIndex];
        
        let imageHtml = '';
        if (q.imageUrl) {
            imageHtml = `<img src="${q.imageUrl}" alt="Quiz Image" class="quiz-question-image">`;
        }
    
        let questionHtml = '';
        
        // --- NEW: Check question type ---
        if (q.questionType === 'fill') {
            // Render Fill-in-the-Blank
            questionHtml = `
                <div class="fill-in-blank-group">
                    <input type="text" id="fill-answer-input" placeholder="Type your answer...">
                    <button id="fill-submit-btn" class="card-btn">Submit</button>
                </div>
            `;
        } else {
            // Render Multiple Choice (default)
            let options = q.options || [];
            questionHtml = options.map(opt => {
                // Determine correct answer
                let isCorrect;
                if (q.correct_answer) { // API format
                    isCorrect = decodeHTML(opt) === decodeHTML(q.correct_answer);
                } else { // Custom quiz format
                    isCorrect = decodeHTML(opt) === decodeHTML(q.options[q.correct_answer_index]);
                }
                return `<button class="option-btn" data-correct="${isCorrect}">${decodeHTML(opt)}</button>`;
            }).join('');
        }
    
        let html = `<div class="question-block">${imageHtml}<h4>Q${currentIndex + 1}: ${decodeHTML(q.question)}</h4>`;
        html += questionHtml;
        html += '</div><br><div id="feedback"></div>';
        quizArea.innerHTML = html;
    
        // Add event listeners based on type
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

            if (timeLeft <= 3) {
                timerDisplay.className = 'low-time'; 
            }

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
            if (q.correct_answer) { // API
                correctAnswerText = q.correct_answer;
            } else { // Custom
                correctAnswerText = q.options[q.correct_answer_index];
            }
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
        
        // Simple case-insensitive check
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
            if (q.correct_answer) {
                correctAnswerText = q.correct_answer;
            } else {
                correctAnswerText = q.options[q.correct_answer_index];
            }

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

    // --- LEADERBOARD & RESULTS LOGIC ---
    function saveQuizAttempt(username, uid, quizId, score) {
        if (!uid || !quizId) return; 
        
        db.collection("quiz_attempts").add({
            username: username,
            uid: uid,
            quizId: quizId,
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => console.log("Quiz attempt saved!"))
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

    function showQuizResults(quizId, quizTitle) {
        resultsQuizTitle.textContent = `Results for: ${quizTitle}`;
        quizResultsListContainer.innerHTML = '<div class="loader"></div>';
        manageContainer.style.display = 'none'; 
        resultsContainer.style.display = 'flex'; 

        db.collection("quiz_attempts")
          .where("quizId", "==", quizId) 
          .orderBy("score", "desc") 
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

    function loadMyResults() {
        const user = auth.currentUser;
        if (!user) return; 
        myResultsListContainer.innerHTML = '<div class="loader"></div>';
        
        db.collection("quiz_attempts")
          .where("uid", "==", user.uid)
          .orderBy("timestamp", "desc")
          .limit(20) 
          .get()
          .then(async (querySnapshot) => {
                if (querySnapshot.empty) {
                    myResultsListContainer.innerHTML = '<p>You haven\'t played any quizzes yet.</p>';
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
                        titlePromises.push(Promise.resolve(null)); // Placeholder
                    }
                });

                const titleDocs = await Promise.all(titlePromises);
                
                attempts.forEach((attempt, index) => {
                    let quizTitle = "API Quiz"; // Default for API quizzes
                    const titleDoc = titleDocs[index];
                    if (titleDoc && titleDoc.exists) {
                        quizTitle = titleDoc.data().title;
                    }

                    html += `
                        <div class="my-result-card">
                            <div>
                                <div class="my-result-card-name">${quizTitle}</div>
                                <div class="my-result-card-title">${new Date(attempt.timestamp.toDate()).toLocaleDateString()}</div>
                            </div>
                            <span class="my-result-card-score">${attempt.score}</span>
                        </div>
                    `;
                });
                myResultsListContainer.innerHTML = html;
          }).catch(err => {
                console.error("Error getting my results: ", err);
                myResultsListContainer.innerHTML = '<p>Could not load your results.</p>';
          });
    }

    // --- Quiz Editor Logic (With Question Types) ---
    let questionEditorId = 0; 
    function createNewQuestionEditor() {
        const questionId = questionEditorId++;
        const questionCard = document.createElement('div');
        questionCard.className = 'question-editor-card';
        questionCard.dataset.id = questionId;
        questionCard.dataset.imageUrl = ""; 
        
        questionCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <select class="question-type-select">
                    <option value="mc" selected>Multiple Choice</option>
                    <option value="fill">Fill-in-the-Blank</option>
                </select>
                <button class="delete-question-btn">Delete Question</button>
            </div>
            <textarea class="question-text" placeholder="Enter your question here..."></textarea>
            <textarea class="explanation-input" placeholder="Enter the EXPLANATION for this question..."></textarea>
            <img class="question-gif-preview" src="" alt="GIF Preview" style="display: none;">
            <button class="add-gif-btn">Add GIF</button>
            
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
            
            <div class="fill-blank-editor" style="display: none;">
                <input type="text" class="fill-blank-answer" placeholder="Enter the exact correct answer">
            </div>
        `;
        
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

    // *** UPDATED ***
    saveQuizBtn.onclick = () => {
        const user = auth.currentUser;
        if (!user) { 
            showToast("Your session expired. Please log in again.", "error");
            return;
        }
    
        const title = quizTitleInput.value.trim();
        // --- NEW: Get the recommended ID ---
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
            recommendedStudyGuideId: recommendId || null, // <-- ADD THIS LINE
            questions: []
        };
    
        let allValid = true;
        
        questionCards.forEach(card => {
            const questionText = card.querySelector('.question-text').value.trim();
            const explanation = card.querySelector('.explanation-input').value.trim();
            const imageUrl = card.dataset.imageUrl || null;
            const questionType = card.querySelector('.question-type-select').value;
            
            if (questionText.length < 5 || explanation.length < 5) allValid = false;
            
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

    // --- NEW: Study Guide Editor Logic ---
    let flashcardEditorId = 0;
    function createNewFlashcardEditor() {
        const cardId = flashcardEditorId++;
        const flashcardCard = document.createElement('div');
        flashcardCard.className = 'flashcard-editor-card';
        flashcardCard.innerHTML = `
            <textarea class="flashcard-term" placeholder="Term (Front of card)"></textarea>
            <textarea class="flashcard-definition" placeholder="Definition (Back of card)"></textarea>
            <button class="delete-flashcard-btn">Delete Card</button>
        `;
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
            type: 'study', // NEW: Define content type
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
        
        // Save to the *same* "quizzes" collection, but with type 'study'
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
    
    // --- NEW: Study Guide Player Logic ---
    function startStudySession(studyGuide, guideId) {
        currentFlashcards = studyGuide.flashcards;
        currentFlashcardIndex = 0;
        
        mainContent.style.display = 'none';
        studyPlayerContainer.style.display = 'flex';
        studyPlayerTitle.textContent = studyGuide.title;
        
        displayFlashcard();
    }
    
    function displayFlashcard() {
        if (currentFlashcards.length === 0) return;
        
        // Reset flip
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


    // --- Load and Display "Shared Quizzes" (from Firebase) ---
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
                
                // NEW: Check content type
                const isStudyGuide = content.type === 'study';
                
                quizCard.innerHTML = `
                    <div class="quiz-card-title ${isStudyGuide ? 'study' : 'quiz'}">
                        ${isStudyGuide ? '📚' : '❓'} ${content.title}
                    </div>
                    <div class="quiz-card-footer">
                        <span class="quiz-card-author">by ${content.author}</span>
                        <button class="like-btn" data-id="${contentId}">❤️ ${content.likeCount || 0}</button>
                    </div>
                `;

                if (uid && content.likedBy && content.likedBy.includes(uid)) {
                    quizCard.querySelector('.like-btn').classList.add('liked');
                }

                // NEW: Handle click for either quiz or study guide
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

    // --- Load "Manage My Quizzes" List (from Firebase) ---
    function loadManageList(user) {
        myQuizListContainer.innerHTML = '<div class="loader"></div>'; 
        
        db.collection("quizzes").where("authorUID", "==", user.uid).get().then((querySnapshot) => {
            myQuizListContainer.innerHTML = ''; 
            if (querySnapshot.empty) {
                myQuizListContainer.innerHTML = '<p>You haven\'t created any content yet!</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const content = doc.data();
                const contentId = doc.id; 
                const isStudyGuide = content.type === 'study';

                const quizCard = document.createElement('div');
                quizCard.className = 'manage-quiz-card';
                
                // NEW: Don't show results for study guides
                let resultsButton = '';
                if (!isStudyGuide) {
                    resultsButton = `<button class="results-quiz-btn" data-id="${contentId}" data-title="${content.title}">Results</button>`;
                }
                
                quizCard.innerHTML = `
                    <h4>${isStudyGuide ? '📚' : '❓'} ${content.title}</h4>
                    <div class="buttons-wrapper">
                        ${resultsButton}
                        <button class="share-quiz-btn" data-id="${contentId}">Share</button>
                        <button class="delete-quiz-btn" data-id="${contentId}">Delete</button>
                    </div>
                `;

                if (!isStudyGuide) {
                    quizCard.querySelector('.results-quiz-btn').onclick = (e) => {
                        showQuizResults(e.target.dataset.id, e.target.dataset.title);
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

                myQuizListContainer.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            myQuizListContainer.innerHTML = '<p>Could not load your content.</p>';
        });
    }

    // --- Delete Quiz Function (uses Firebase) ---
    function deleteQuiz(quizId, isStudyGuide) {
        if (!confirm("Are you sure you want to delete this? This cannot be undone.")) {
            return; 
        }
        
        const deletePromises = [];
        
        // If it's a quiz, delete attempts. Study guides don't have attempts.
        if (!isStudyGuide) {
            const attemptsPromise = db.collection("quiz_attempts").where("quizId", "==", quizId).get().then((snapshot) => {
                const batch = db.batch();
                snapshot.docs.forEach(doc => batch.delete(doc.ref));
                return batch.commit();
            });
            deletePromises.push(attemptsPromise);
        }
        
        // After other deletions are done (or if none), delete the main content
        Promise.all(deletePromises).then(() => {
            return db.collection("quizzes").doc(quizId).delete();
        }).then(() => {
            showToast("Content deleted!", "success");
            loadManageList(auth.currentUser); // Refresh the list
        }).catch((error) => {
            console.error("Error removing content: ", error);
            showToast("Could not delete content.", "error");
        });
    }

    // --- Initialization ---
    function init() {
        // Dark Mode Logic
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

        // Setup initial auth tab state
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        
        // Search Bar Event Listener
        searchBar.addEventListener('keyup', () => {
            loadSharedQuizzes(searchBar.value.trim());
        });

        // Add event listeners for the nav links
        document.querySelectorAll('.subject-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                const category = link.dataset.category;
                
                if (category === 'home') {
                    // Hide all modals and show main content
                    manageContainer.style.display = 'none';
                    editorContainer.style.display = 'none';
                    studyEditorContainer.style.display = 'none';
                    quizAppContainer.style.display = 'none';
                    studyPlayerContainer.style.display = 'none';
                    resultsContainer.style.display = 'none';
                    myResultsContainer.style.display = 'none';
                    mainContent.style.display = 'block'; 
                    loadSharedQuizzes(searchBar.value);
                } else if (category) {
                    startApiQuiz(category, 10, 'any'); 
                }
            });
        });
    }

    init(); // Run the initialization
});