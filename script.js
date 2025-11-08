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
// --- 2. INITIALIZE FIREBASE ---
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
// --- END OF FIREBASE SETUP ---


document.addEventListener('DOMContentLoaded', () => {

    // --- Element References ---
    const authContainer = document.getElementById('auth-container');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeAuthBtn = document.getElementById('close-auth-btn');
    const userDisplay = document.getElementById('user-display');
    const welcomeUser = document.getElementById('welcome-user');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginErr = document.getElementById('login-error');
    const signupErr = document.getElementById('signup-error');
    const toast = document.getElementById('toast-notification');

    // --- Admin Panel Elements ---
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const adminContainer = document.getElementById('admin-container');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const addSubjectForm = document.getElementById('add-subject-form');
    const subjectNameInput = document.getElementById('subject-name-input');
    const addTopicForm = document.getElementById('add-topic-form');
    const subjectSelectForTopic = document.getElementById('subject-select-for-topic');
    const topicNameInput = document.getElementById('topic-name-input');
    const addQuestionForm = document.getElementById('add-question-form');
    const topicSelectForQuestion = document.getElementById('topic-select-for-question');
    
    // --- Content Elements ---
    const subjectNav = document.getElementById('subject-nav');
    const topicSidebar = document.getElementById('topic-sidebar');
    const topicList = document.getElementById('topic-list');
    const topicTitle = document.getElementById('topic-title');
    const mainContent = document.getElementById('main-content');
    const contentTitle = document.getElementById('content-title');
    const questionList = document.getElementById('question-list');

    // --- Practice Mode Elements ---
    const practiceNav = document.getElementById('practice-nav');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    // --- Mock Test Elements ---
    const mockTestContainer = document.getElementById('mock-test-container');
    const closeMockTestBtn = document.getElementById('close-mock-test-btn');
    const mockTestTitle = document.getElementById('mock-test-title');
    const mockTimer = document.getElementById('mock-timer');
    const mockTestArea = document.getElementById('mock-test-area');
    const mockQuestionCount = document.getElementById('mock-question-count');
    const mockNextBtn = document.getElementById('mock-next-btn');
    const mockFinishBtn = document.getElementById('mock-finish-btn');

    // --- Search Elements ---
    const mainSearchBar = document.getElementById('main-search-bar');
    const mainSearchBtn = document.getElementById('main-search-btn');
    
    // --- App State ---
    let currentSubjects = []; 
    let currentTopics = []; 
    let currentSubjectId = null;
    let currentTopicId = null;
    
    // Practice Mode State
    let currentPracticeQuestions = []; 
    let currentPracticeIndex = 0; 
    
    // Mock Test State
    let mockQuestions = [];
    let mockCurrentIndex = 0;
    let mockScore = 0;
    let mockTimerInterval;
    let mockUserAnswers = []; // Store user's answers


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
        }
        errorElement.textContent = message;
    }

    // --- MAIN AUTHENTICATION LISTENER ---
    auth.onAuthStateChanged(user => {
        if (user) {
            userDisplay.style.display = 'flex';
            loginBtn.style.display = 'none';
            welcomeUser.textContent = `Hello, ${user.displayName || 'User'}`;
            if (user.displayName === 'rishabh') { // Change to your admin username
                 adminPanelBtn.style.display = 'block';
            }
        } else {
            userDisplay.style.display = 'none';
            adminPanelBtn.style.display = 'none';
            loginBtn.style.display = 'block';
            welcomeUser.textContent = '';
        }
    });

    // --- Auth Modal Toggling ---
    loginBtn.onclick = () => authContainer.style.display = 'flex';
    closeAuthBtn.onclick = () => authContainer.style.display = 'none';
    
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

    // --- Auth Form Logic ---
    signupForm.onsubmit = e => {
        e.preventDefault();
        const username = signupForm.querySelector('#signup-username').value.trim();
        const email = signupForm.querySelector('#signup-email').value.trim();
        const password = signupForm.querySelector('#signup-password').value;

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
                authContainer.style.display = 'none'; 
            })
            .catch((error) => {
                showFriendlyError(error, signupErr); 
            });
    };

    loginForm.onsubmit = e => {
        e.preventDefault();
        const email = loginForm.querySelector('#login-email').value.trim();
        const password = loginForm.querySelector('#login-password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                authContainer.style.display = 'none'; 
                loginErr.textContent = '';
            })
            .catch((error) => {
                showFriendlyError(error, loginErr); 
            });
    };

    logoutBtn.onclick = () => {
        auth.signOut().catch(err => console.error("Sign out error", err));
    };

    // --- Admin Panel Toggling ---
    adminPanelBtn.onclick = () => {
        adminContainer.style.display = 'flex';
        populateAdminDropdowns();
    };
    closeAdminBtn.onclick = () => adminContainer.style.display = 'none';

    // --- Admin Panel Logic ---
    addSubjectForm.onsubmit = (e) => {
        e.preventDefault();
        const subjectName = subjectNameInput.value.trim();
        if (!subjectName) return;
        
        db.collection("subjects").add({
            name: subjectName
        }).then(() => {
            showToast("Subject added!", "success");
            subjectNameInput.value = '';
            loadSubjects(); 
            populateAdminDropdowns(); 
        }).catch(err => showToast(err.message, "error"));
    };

    addTopicForm.onsubmit = (e) => {
        e.preventDefault();
        const subjectId = subjectSelectForTopic.value;
        const topicName = topicNameInput.value.trim();
        if (!subjectId || !topicName) {
            showToast("Please select a subject and enter a topic name.", "error");
            return;
        }
        
        db.collection("topics").add({
            name: topicName,
            subjectId: subjectId
        }).then(() => {
            showToast("Topic added!", "success");
            topicNameInput.value = '';
            if(subjectId === currentSubjectId) {
                loadTopics(currentSubjectId);
            }
            populateAdminDropdowns(); 
        }).catch(err => showToast(err.message, "error"));
    };
    
    addQuestionForm.onsubmit = (e) => {
        e.preventDefault();
        const topicId = topicSelectForQuestion.value;
        const questionText = addQuestionForm.querySelector("#question-text-input").value;
        const explanation = addQuestionForm.querySelector("#explanation-input").value;
        const options = [
            addQuestionForm.querySelector("#option-a-input").value,
            addQuestionForm.querySelector("#option-b-input").value,
            addQuestionForm.querySelector("#option-c-input").value,
            addQuestionForm.querySelector("#option-d-input").value
        ];
        const correctAnswerIndex = parseInt(addQuestionForm.querySelector("#correct-answer-select").value, 10);
        
        if (!topicId || !questionText || options.some(opt => !opt) || !explanation) {
            showToast("Please fill out all question fields.", "error");
            return;
        }

        db.collection("questions").add({
            topicId: topicId,
            questionText: questionText,
            options: options,
            correctAnswerIndex: correctAnswerIndex,
            explanation: explanation,
            authorUID: auth.currentUser ? auth.currentUser.uid : null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            showToast("Question saved!", "success");
            addQuestionForm.reset(); 
        }).catch(err => showToast(err.message, "error"));
    };

    // --- Data Loading Logic ---
    async function loadSubjects() {
        subjectNav.innerHTML = ''; 
        
        const homeLink = document.createElement('a');
        homeLink.href = "#";
        homeLink.textContent = "Home";
        homeLink.onclick = (e) => {
            e.preventDefault();
            selectSubject(null);
        };
        subjectNav.appendChild(homeLink);

        const snapshot = await db.collection("subjects").get();
        currentSubjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        currentSubjects.forEach(subject => {
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = subject.name;
            link.dataset.id = subject.id;
            link.onclick = (e) => {
                e.preventDefault();
                selectSubject(subject.id);
            };
            subjectNav.appendChild(link);
        });
    }

    async function loadTopics(subjectId) {
        topicList.innerHTML = '<li class="loader"></li>'; 
        const snapshot = await db.collection("topics").where("subjectId", "==", subjectId).get();
        currentTopics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        topicList.innerHTML = ''; 
        currentTopics.forEach(topic => {
            const item = document.createElement('li');
            // *** UPDATED: Create a wrapper for the topic and its buttons ***
            item.innerHTML = `
                <div class="topic-links-wrapper">
                    <span>${topic.name}</span>
                    <div class="topic-buttons">
                        <button class="topic-practice-btn" data-id="${topic.id}" data-name="${topic.name}">Practice</button>
                        <button class="topic-test-btn" data-id="${topic.id}" data-name="${topic.name}">Start Test</button>
                    </div>
                </div>
            `;
            
            // Add listeners for the new buttons
            item.querySelector('.topic-practice-btn').onclick = (e) => {
                e.preventDefault();
                selectTopic(topic.id);
            };
            item.querySelector('.topic-test-btn').onclick = (e) => {
                e.preventDefault();
                startMockTest(topic.id, topic.name);
            };
            
            topicList.appendChild(item);
        });
    }
    
    async function populateAdminDropdowns() {
        const subjectSnapshot = await db.collection("subjects").get();
        currentSubjects = subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        subjectSelectForTopic.innerHTML = '<option value="">-- Select Subject --</option>';
        currentSubjects.forEach(s => {
            subjectSelectForTopic.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
        
        const topicSnapshot = await db.collection("topics").get();
        currentTopics = topicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        topicSelectForQuestion.innerHTML = '<option value="">-- Select Topic --</option>';
        currentTopics.forEach(t => {
            const subject = currentSubjects.find(s => s.id === t.subjectId);
            const subjectName = subject ? subject.name : "Unknown";
            topicSelectForQuestion.innerHTML += `<option value="${t.id}">${t.name} (${subjectName})</option>`;
        });
    }

    // --- Practice Mode Functions ---
    async function selectTopic(topicId) {
        currentTopicId = topicId;
        
        document.querySelectorAll('#topic-list a').forEach(a => a.classList.remove('active'));
        // This is a simple way to highlight, might need adjustment
        // document.querySelector(`#topic-list button[data-id="${topicId}"]`).classList.add('active'); 
        
        const topic = currentTopics.find(t => t.id === topicId);
        contentTitle.textContent = topic.name;
        
        await loadPracticeQuestions(topicId);
    }

    async function loadPracticeQuestions(topicId) {
        questionList.innerHTML = '<div class="loader"></div>';
        practiceNav.style.display = 'none';

        try {
            const snapshot = await db.collection("questions").where("topicId", "==", topicId).get();
            currentPracticeQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (currentPracticeQuestions.length === 0) {
                questionList.innerHTML = '<p>No questions found for this topic. Be the first to add one in the Admin Panel!</p>';
                return;
            }

            currentPracticeIndex = 0;
            displayPracticeQuestion();
            practiceNav.style.display = 'flex';

        } catch (err) {
            console.error(err);
            questionList.innerHTML = '<p>Error loading questions.</p>';
        }
    }
    
    function displayPracticeQuestion() {
        const q = currentPracticeQuestions[currentPracticeIndex];
        
        questionList.innerHTML = `
            <div class="question-container" data-question-id="${q.id}">
                <p class="question-text">
                    <strong>Q.${currentPracticeIndex + 1}:</strong> ${q.questionText}
                </p>
                <ul class="practice-options">
                    ${q.options.map((opt, index) => `
                        <li class="practice-option" data-index="${index}">${opt}</li>
                    `).join('')}
                </ul>
                <div class="practice-controls">
                    <button class="view-answer-btn">View Answer</button>
                </div>
                <div class="explanation-box">
                    <h4>Answer & Explanation</h4>
                    <p><strong>Correct Answer:</strong> ${q.options[q.correctAnswerIndex]}</p>
                    <p><strong>Explanation:</strong> ${q.explanation}</p>
                </div>
            </div>
        `;
        
        const viewAnswerBtn = questionList.querySelector('.view-answer-btn');
        viewAnswerBtn.onclick = () => {
            const explanationBox = questionList.querySelector('.explanation-box');
            explanationBox.classList.add('visible');
            
            questionList.querySelectorAll('.practice-option').forEach(opt => {
                if (parseInt(opt.dataset.index, 10) === q.correctAnswerIndex) {
                    opt.classList.add('correct');
                } else {
                    opt.classList.add('incorrect');
                }
                opt.style.cursor = 'default'; 
            });
        };
        
        prevQuestionBtn.disabled = (currentPracticeIndex === 0);
        nextQuestionBtn.disabled = (currentPracticeIndex === currentPracticeQuestions.length - 1);
    }
    
    prevQuestionBtn.onclick = () => {
        if (currentPracticeIndex > 0) {
            currentPracticeIndex--;
            displayPracticeQuestion();
        }
    };
    
    nextQuestionBtn.onclick = () => {
        if (currentPracticeIndex < currentPracticeQuestions.length - 1) {
            currentPracticeIndex++;
            displayPracticeQuestion();
        }
    };

    // --- *** NEW: Mock Test Functions *** ---
    
    async function startMockTest(topicId, topicName) {
        mockTestTitle.textContent = `${topicName} - Mock Test`;
        mockTestArea.innerHTML = '<div class="loader"></div>';
        mockTestNav.style.display = 'none';
        mockTestContainer.style.display = 'flex';
        
        try {
            const snapshot = await db.collection("questions").where("topicId", "==", topicId).get();
            // Shuffle the questions for a real test feel
            mockQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                      .sort(() => Math.random() - 0.5);
            
            if (mockQuestions.length === 0) {
                mockTestArea.innerHTML = '<p>No questions found for this topic.</p>';
                return;
            }
            
            // Reset test state
            mockCurrentIndex = 0;
            mockScore = 0;
            mockUserAnswers = new Array(mockQuestions.length).fill(null); // Array to store answers
            
            displayMockQuestion();
            mockTestNav.style.display = 'flex';
            mockNextBtn.style.display = 'inline-block';
            mockFinishBtn.style.display = 'none';
            
            // Start Timer (e.g., 1 minute per question)
            let timeRemaining = mockQuestions.length * 60; 
            updateMockTimer(timeRemaining);
            
            mockTimerInterval = setInterval(() => {
                timeRemaining--;
                updateMockTimer(timeRemaining);
                if (timeRemaining <= 0) {
                    finishMockTest();
                }
            }, 1000);

        } catch (err) {
            console.error(err);
            mockTestArea.innerHTML = '<p>Error loading test.</p>';
        }
    }
    
    function updateMockTimer(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        mockTimer.textContent = `Time: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    function displayMockQuestion() {
        const q = mockQuestions[mockCurrentIndex];
        
        mockTestArea.innerHTML = `
            <div id="mock-question-text">${mockCurrentIndex + 1}. ${q.questionText}</div>
            <ul id="mock-options-list">
                ${q.options.map((opt, index) => `
                    <li>
                        <button class="mock-option" data-index="${index}">${opt}</button>
                    </li>
                `).join('')}
            </ul>
        `;
        
        // Add click listeners to options
        mockTestArea.querySelectorAll('.mock-option').forEach(button => {
            button.onclick = () => {
                // Remove 'selected' from all
                mockTestArea.querySelectorAll('.mock-option').forEach(btn => btn.classList.remove('selected'));
                // Add 'selected' to clicked
                button.classList.add('selected');
                // Store the answer
                mockUserAnswers[mockCurrentIndex] = parseInt(button.dataset.index, 10);
            };
        });
        
        // Re-select answer if user already answered this
        if (mockUserAnswers[mockCurrentIndex] !== null) {
            const selectedBtn = mockTestArea.querySelector(`.mock-option[data-index="${mockUserAnswers[mockCurrentIndex]}"]`);
            if(selectedBtn) selectedBtn.classList.add('selected');
        }

        // Update nav
        mockQuestionCount.textContent = `Q ${mockCurrentIndex + 1}/${mockQuestions.length}`;
        mockNextBtn.style.display = 'inline-block';
        mockFinishBtn.style.display = 'none';
        
        if (mockCurrentIndex === mockQuestions.length - 1) {
            mockNextBtn.style.display = 'none';
            mockFinishBtn.style.display = 'inline-block';
        }
    }
    
    mockNextBtn.onclick = () => {
        if (mockCurrentIndex < mockQuestions.length - 1) {
            mockCurrentIndex++;
            displayMockQuestion();
        }
    };
    
    mockFinishBtn.onclick = () => {
        finishMockTest();
    };
    
    closeMockTestBtn.onclick = () => {
        if (confirm("Are you sure you want to quit this test? Your progress will be lost.")) {
            clearInterval(mockTimerInterval);
            mockTestContainer.style.display = 'none';
        }
    };
    
    function finishMockTest() {
        clearInterval(mockTimerInterval);
        
        // Calculate score
        mockScore = 0;
        mockUserAnswers.forEach((userAnswer, index) => {
            if (userAnswer === mockQuestions[index].correctAnswerIndex) {
                mockScore++;
            }
        });
        
        mockTestArea.innerHTML = `
            <div id="mock-test-results">
                <h2>Test Complete!</h2>
                <p>Your final score is:</p>
                <h3>${mockScore} / ${mockQuestions.length}</h3>
            </div>
        `;
        
        mockTestNav.style.display = 'none'; // Hide nav
    }

    // --- *** NEW: Search Function *** ---
    async function searchQuestions() {
        const searchTerm = mainSearchBar.value.trim();
        if (searchTerm.length < 3) {
            showToast("Please enter at least 3 characters to search.", "error");
            return;
        }

        // This is a simple "starts-with" search.
        // A true "contains" search requires a 3rd party service like Algolia.
        selectSubject(null); // Go to home
        contentTitle.textContent = `Search Results for "${searchTerm}"`;
        questionList.innerHTML = '<div class="loader"></div>';
        practiceNav.style.display = 'none';
        
        try {
            const snapshot = await db.collection("questions")
                                     .where("questionText", ">=", searchTerm)
                                     .where("questionText", "<=", searchTerm + '\uf8ff')
                                     .get();
            
            currentPracticeQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (currentPracticeQuestions.length === 0) {
                questionList.innerHTML = '<p>No questions found matching your search.</p>';
                return;
            }

            // Display results in Practice Mode
            currentPracticeIndex = 0;
            displayPracticeQuestion();
            practiceNav.style.display = 'flex';
            
        } catch(err) {
            console.error(err);
            questionList.innerHTML = '<p>Error searching questions. You may need to create a Firebase Index. Check the console (F12) for a link to create it.</p>';
            showToast("Search error. Check console.", "error");
        }
    }
    mainSearchBtn.onclick = searchQuestions;
    mainSearchBar.onkeyup = (e) => {
        if (e.key === 'Enter') searchQuestions();
    };


    // --- Selection & Navigation Logic ---
    function selectSubject(subjectId) {
        currentSubjectId = subjectId;
        
        document.querySelectorAll('.subject-nav a').forEach(a => a.classList.remove('active'));
        if (subjectId) {
            document.querySelector(`.subject-nav a[data-id="${subjectId}"]`).classList.add('active');
        } else {
            subjectNav.querySelector('a').classList.add('active'); // Highlight "Home"
        }
        
        if (subjectId) {
            const subject = currentSubjects.find(s => s.id === subjectId);
            topicTitle.textContent = subject.name;
            loadTopics(subjectId);
            questionList.innerHTML = '<p>Select a topic from the left to start practicing.</p>';
            contentTitle.textContent = "Topics";
            practiceNav.style.display = 'none'; 
        } else {
            // Home is selected
            topicTitle.textContent = "Select a Subject";
            topicList.innerHTML = '';
            contentTitle.textContent = "Welcome!";
            questionList.innerHTML = '<p>Select a subject from the top bar to see its topics.</p>';
            practiceNav.style.display = 'none'; 
        }
    }


    // --- Initialization ---
    function init() {
        loadSubjects();
        
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        
        selectSubject(null); // Select "Home" by default
    }

    init(); // Run the initialization
});