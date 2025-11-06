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

    // *** NEW: Header Back Button ***
    const headerBackBtn = document.getElementById('header-back-btn');

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
    // *** UPDATED: Reference to the new tooltip ID ***
    const welcomeUserTooltip = document.getElementById('welcome-user-tooltip'); 
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
    // prevBtn removed
    const nextBtn = document.getElementById('nextBtn');
    const questionNum = document.getElementById('questionNum');
    const scoreLabel = document.getElementById('scoreLabel');
    const timerDisplay = document.getElementById('timer-display');
    
    // Main Page Elements
    const quizList = document.querySelector('.quiz-list'); 
    const searchBar = document.getElementById('search-bar'); 
    const myResultsBtn = document.getElementById('my-results-btn');

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
    let questions = []; 
    let currentQuizId = null; 
    let currentIndex = 0;
    let score = 0;
    let timerInterval; 
    let timeLeft = 10; 
    let activeGiphyQuestionCard = null; 

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

    // --- *** UPDATED: Page Navigation System *** ---
    const allPages = [mainContent, authContainer, quizAppContainer, editorContainer, manageContainer, resultsContainer, myResultsContainer, giphyContainer, forgotPasswordContainer];

    function showPage(pageToShow) {
        // Hide all pages
        allPages.forEach(page => page.style.display = 'none');
        
        // Show the one we want
        // Use 'flex' for all modal-like containers, 'block' for main content
        if (pageToShow === mainContent) {
            mainContent.style.display = 'block';
            headerBackBtn.style.display = 'none'; // Hide back button on main page
        } else {
            pageToShow.style.display = 'flex'; // All other pages are overlays/modals
            headerBackBtn.style.display = 'block'; // Show back button
        }
        
        // Special rule for auth pages (no back button)
        if (pageToShow === authContainer || pageToShow === forgotPasswordContainer) {
            headerBackBtn.style.display = 'none';
        }
    }

    function goHome() {
        showPage(mainContent);
        loadSharedQuizzes(searchBar.value);
    }
    // --- End of Page Navigation System ---


    // --- MAIN AUTHENTICATION LISTENER ---
    auth.onAuthStateChanged(user => {
        if (user) {
            userDisplay.style.display = 'flex';
            myResultsBtn.style.display = 'block'; 
            welcomeUserTooltip.textContent = user.displayName || 'User'; // *** SETS TOOLTIP ***
            goHome(); // Show the main page
        } else {
            showPage(authContainer); // Show the login modal
            userDisplay.style.display = 'none';
            myResultsBtn.style.display = 'none'; 
            welcomeUserTooltip.textContent = ''; // *** Clear tooltip ***
        }
    });

    // --- Page/Modal Toggling (Now uses showPage) ---
    playQuizBtn.onclick = () => {
        showPage(quizAppContainer);
        quizControls.style.display = 'flex'; 
        quizNav.style.display = 'none'; 
        quizArea.innerHTML = "Click 'Start Quiz' to begin!"; 
        showLeaderboard(); 
    };
    closeQuizBtn.onclick = goHome;

    createQuizBtn.onclick = () => showPage(editorContainer);
    closeEditorBtn.onclick = goHome;
    
    manageQuizzesBtn.onclick = () => {
        const user = auth.currentUser;
        if (!user) return; 
        
        showPage(manageContainer);
        loadManageList(user); 
    };
    closeManageBtn.onclick = () => {
        showPage(editorContainer); // Go back to editor
    };

    closeResultsBtn.onclick = () => {
        showPage(manageContainer); // Go back to manage modal
    };

    myResultsBtn.onclick = () => {
        showPage(myResultsContainer);
        loadMyResults();
    };
    closeMyResultsBtn.onclick = goHome;
    
    closeGiphyBtn.onclick = () => {
        showPage(editorContainer); // Go back to editor
    };

    // *** NEW: Header Back Button Click ***
    headerBackBtn.onclick = goHome;

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
    forgotPasswordLink.onclick = (e) => {
        e.preventDefault();
        showPage(forgotPasswordContainer);
    };
    backToLoginLink.onclick = (e) => {
        e.preventDefault();
        showPage(authContainer);
    };
    forgotPasswordForm.onsubmit = (e) => {
        e.preventDefault();
        const email = forgotEmail.value.trim();
        
        auth.sendPasswordResetEmail(email)
            .then(() => {
                showToast("Password reset email sent!", "success");
                showPage(authContainer); // Go back to login
            })
            .catch((error) => {
                showFriendlyError(error, forgotError); 
            });
    };

    // --- Quiz Logic ---

    function startApiQuiz(category, count, difficulty) { 
        currentQuizId = `api_${category}_${difficulty}`; 
        
        showPage(quizAppContainer); 

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
                questions = data.results;
                if (questions.length > 0) {
                    showQuestion();
                    quizNav.style.display = 'grid'; // Use grid
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
        
        score = 0;
        currentIndex = 0;
        
        showPage(quizAppContainer);
        quizControls.style.display = 'none'; 
        quizNav.style.display = 'grid'; // Use grid
        
        showQuestion(); 
    }

    joinQuizBtn.onclick = () => {
        const quizId = quizIdInput.value.trim();
        if (quizId.length < 10) { 
            showToast("Please enter a valid Quiz ID.", "error");
            return;
        }

        db.collection("quizzes").doc(quizId).get().then((doc) => {
            if (doc.exists) {
                quizIdInput.value = ''; 
                startCustomQuiz(doc.data(), doc.id); 
            } else {
                showToast("Quiz ID not found in the database.", "error");
            }
        }).catch((error) => {
            console.error("Error getting quiz:", error);
            showToast("Error finding quiz.", "error");
        });
    };
    
    function showQuestion() {
        clearInterval(timerInterval);
        
        if (currentIndex >= questions.length) {
            quizArea.innerHTML = `<h2>Quiz Complete!</h2><p>Your final score is: ${score} / ${questions.length}</p>`;
            quizNav.style.display = 'none';
            quizControls.style.display = 'flex'; 
            timerDisplay.style.display = 'none'; 
            
            const user = auth.currentUser;
            const username = user ? user.displayName : 'Anonymous';
            const uid = user ? user.uid : null;

            saveQuizAttempt(username, uid, currentQuizId, score);
            
            showLeaderboard();
            return;
        }

        const q = questions[currentIndex];
        
        let questionText, options, correctAnswer, imageUrl;
        
        if (q.incorrect_answers) { 
            questionText = q.question;
            options = [...q.incorrect_answers, q.correct_answer];
            correctAnswer = q.correct_answer;
            options.sort(() => Math.random() - 0.5); 
        } else { 
            questionText = q.question;
            options = [...q.options]; 
            correctAnswer = q.options[q.correct_answer_index];
            imageUrl = q.imageUrl; 
        }

        let imageHtml = '';
        if (imageUrl) {
            imageHtml = `<img src="${imageUrl}" alt="Quiz Image" class="quiz-question-image">`;
        }

        let html = `<div class="question-block">${imageHtml}<h4>Q${currentIndex + 1}: ${decodeHTML(questionText)}</h4>`;
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
        // prevBtn removed
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
    // prevBtn.onclick removed

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
        showPage(resultsContainer); // Show results modal
    
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

    // --- "My Results" Modal Logic ---
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
              const titleCache = {}; 
              const attempts = [];

              querySnapshot.forEach((doc) => {
                  const attempt = doc.data();
                  attempts.push(attempt);
              });

              for (const attempt of attempts) {
                  let quizTitle = "API Quiz"; 
                  
                  if (!attempt.quizId.startsWith('api_')) {
                      if (titleCache[attempt.quizId]) {
                          quizTitle = titleCache[attempt.quizId];
                      } else {
                          try {
                              const quizDoc = await db.collection('quizzes').doc(attempt.quizId).get();
                              if (quizDoc.exists) {
                                  quizTitle = quizDoc.data().title;
                                  titleCache[attempt.quizId] = quizTitle; 
                              } else {
                                  quizTitle = "Deleted Quiz";
                              }
                          } catch (err) {
                              console.error("Error fetching quiz title: ", err);
                              quizTitle = "Quiz Title Error";
                          }
                      }
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
              }
              myResultsListContainer.innerHTML = html;
              
          }).catch(err => {
              console.error("Error getting my results: ", err);
              myResultsListContainer.innerHTML = '<p>Could not load your results.</p>';
          });
    }

    // --- Quiz Editor Logic (Uses Firebase) ---
    let questionEditorId = 0; 

    function createNewQuestionEditor() {
        const questionId = questionEditorId++;
        const questionCard = document.createElement('div');
        questionCard.className = 'question-editor-card';
        questionCard.dataset.id = questionId;
        questionCard.dataset.imageUrl = ""; // Store GIF URL here
        
        questionCard.innerHTML = `
            <textarea placeholder="Enter your question here..."></textarea>
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
            <button class="delete-question-btn">Delete Question</button>
        `;
        
        questionCard.querySelector('.add-gif-btn').onclick = () => {
            activeGiphyQuestionCard = questionCard; 
            showPage(giphyContainer);
            giphyResultsGrid.innerHTML = '';
            giphySearchBar.value = '';
        };

        questionCard.querySelector('.delete-question-btn').onclick = () => {
            questionCard.remove();
        };

        questionListContainer.appendChild(questionCard);
    }
    
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
                img.dataset.fullUrl = gif.images.original.url; // Save the full URL
                img.className = 'giphy-item';
                
                img.onclick = () => {
                    if (activeGiphyQuestionCard) {
                        const preview = activeGiphyQuestionCard.querySelector('.question-gif-preview');
                        preview.src = img.src;
                        preview.style.display = 'block';
                        activeGiphyQuestionCard.dataset.imageUrl = img.dataset.fullUrl; // Store the URL
                    }
                    showPage(editorContainer); // Go back to editor
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

    addQuestionBtn.onclick = createNewQuestionEditor;

    saveQuizBtn.onclick = () => { // No longer async
        const user = auth.currentUser;
        if (!user) { 
            showToast("Your session expired. Please log in again.", "error");
            return;
        }

        const title = quizTitleInput.value.trim();
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
            questions: []
        };

        let allValid = true;
        
        questionCards.forEach(card => {
            const questionText = card.querySelector('textarea').value.trim();
            const optionInputs = card.querySelectorAll('.option-input-group input[type="text"]');
            const correctInput = card.querySelector('.option-input-group input[type="radio"]:checked');
            const imageUrl = card.dataset.imageUrl || null; 

            const options = [];
            optionInputs.forEach(input => options.push(input.value.trim()));
            
            const correctAnswerIndex = parseInt(correctInput.value, 10);
            
            if (questionText.length < 5) allValid = false;
            if (options.some(opt => opt.length === 0)) allValid = false; 
            if (!correctInput) allValid = false; 

            newQuiz.questions.push({
                question: questionText,
                options: options,
                correct_answer_index: correctAnswerIndex,
                imageUrl: imageUrl 
            });
        });

        if (!allValid) {
            showToast("Please fill in all questions and answers.", "error");
            saveQuizBtn.disabled = false;
            saveQuizBtn.textContent = "Save Quiz";
            return;
        }
        
        db.collection("quizzes").add(newQuiz).then((docRef) => {
            showToast(`Quiz "${title}" saved successfully!`, "success");
            console.log("Quiz saved with ID: ", docRef.id);
            goHome(); // Go back to home
        }).catch((error) => {
            console.error("Error adding document: ", error);
            showToast("Error saving quiz. Check the console.", "error");
        }).finally(() => {
            saveQuizBtn.disabled = false;
            saveQuizBtn.textContent = "Save Quiz";
        });
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
                if (searchTerm) {
                    quizList.innerHTML = `<p>No quizzes found matching "${searchTerm}".</p>`;
                } else {
                    quizList.innerHTML = '<p>No shared quizzes found. Be the first to create one!</p>';
                }
                return;
            }
            
            const user = auth.currentUser;
            const uid = user ? user.uid : null;

            querySnapshot.forEach((doc) => {
                const quiz = doc.data();
                const quizId = doc.id;
                
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                
                quizCard.innerHTML = `
                    <div class="quiz-card-title">${quiz.title}</div>
                    <div class="quiz-card-footer">
                        <span class="quiz-card-author">by ${quiz.author}</span>
                        <button class="like-btn" data-id="${quizId}">❤️ ${quiz.likeCount || 0}</button>
                    </div>
                `;

                if (uid && quiz.likedBy && quiz.likedBy.includes(uid)) {
                    quizCard.querySelector('.like-btn').classList.add('liked');
                }

                quizCard.querySelector('.quiz-card-title').onclick = () => {
                    startCustomQuiz(quiz, quizId); 
                };

                quizCard.querySelector('.like-btn').onclick = (e) => {
                    e.stopPropagation(); 
                    likeQuiz(quizId, e.target);
                };

                quizList.appendChild(quizCard);
            });
        }).catch(err => {
            console.error(err);
            quizList.innerHTML = '<p>Could not load quizzes. Check console.</p>';
        });
    }
    
    // *** UPDATED: Secure "Like/Unlike" Quiz Function ***
    function likeQuiz(quizId, buttonElement) {
        const user = auth.currentUser;
        if (!user) {
            showToast("You must be logged in to like a quiz.", "error");
            return;
        }
        
        const quizRef = db.collection("quizzes").doc(quizId);
        
        db.runTransaction((transaction) => {
            return transaction.get(quizRef).then((doc) => {
                if (!doc.exists) {
                    throw "Quiz not found!";
                }
                
                const data = doc.data();
                const likedBy = data.likedBy || [];
                let newLikeCount = data.likeCount || 0;
                let didLike = false; 

                const userIndex = likedBy.indexOf(user.uid);
                
                if (userIndex > -1) {
                    // *** User has already liked, so UNLIKE ***
                    newLikeCount--;
                    likedBy.splice(userIndex, 1);
                    didLike = false;
                } else {
                    // *** User has not liked, so LIKE ***
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
                console.log("Like count updated to", result.newLikeCount);
                buttonElement.textContent = `❤️ ${result.newLikeCount}`;
                
                if (result.didLike) {
                    buttonElement.classList.add('liked');
                    showToast("Quiz liked!", "success");
                } else {
                    buttonElement.classList.remove('liked');
                    showToast("Quiz unliked.", "");
                }
            }
        }).catch((error) => {
            console.error("Error updating likes: ", error);
            if (error.message !== "Quiz not found!") {
                showToast("Error liking quiz.", "error");
            }
        });
    }

    // --- Load "Manage My Quizzes" List (from Firebase) ---
    function loadManageList(user) {
        myQuizListContainer.innerHTML = '<div class="loader"></div>'; 
        
        db.collection("quizzes").where("authorUID", "==", user.uid).get().then((querySnapshot) => {
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
                
                quizCard.innerHTML = `
                    <h4>${quiz.title}</h4>
                    <div class="buttons-wrapper">
                        <button class="results-quiz-btn" data-id="${quizId}" data-title="${quiz.title}">Results</button>
                        <button class="share-quiz-btn" data-id="${quizId}">Share</button>
                        <button class="delete-quiz-btn" data-id="${quizId}">Delete</button>
                    </div>
                `;

                quizCard.querySelector('.results-quiz-btn').onclick = (e) => {
                    const id = e.target.dataset.id;
                    const title = e.target.dataset.title;
                    showQuizResults(id, title);
                };

                quizCard.querySelector('.share-quiz-btn').onclick = (e) => {
                    const idToShare = e.target.dataset.id;
                    navigator.clipboard.writeText(idToShare).then(() => {
                        showToast(`Quiz ID copied to clipboard!`, "success");
                    }, () => {
                        showToast("Failed to copy Quiz ID.", "error");
                    });
                };

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
        
        // Also delete all attempts associated with this quiz
        db.collection("quiz_attempts").where("quizId", "==", quizId).get().then((snapshot) => {
            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            return batch.commit();
        }).then(() => {
            // Now delete the quiz itself
            return db.collection("quizzes").doc(quizId).delete();
        }).then(() => {
            showToast("Quiz deleted!", "success");
            loadManageList(auth.currentUser); // Refresh the list
        }).catch((error) => {
            console.error("Error removing quiz: ", error);
            showToast("Could not delete quiz. Check console.", "error");
        });
    }

    // --- Initialization ---
    function init() {
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

        // Auth listener (onAuthStateChanged) handles all initial loading
        
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
                    goHome();
                } else if (category) {
                    startApiQuiz(category, 10, 'any'); 
                }
            });
        });
    }

    init(); // Run the initialization
});