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

    // --- *** NEW: Practice Mode Elements *** ---
    const practiceNav = document.getElementById('practice-nav');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    // --- App State ---
    let currentSubjects = []; // To cache subjects
    let currentTopics = []; // To cache topics
    let currentSubjectId = null;
    let currentTopicId = null;
    let currentPracticeQuestions = []; // To store questions for practice mode
    let currentPracticeIndex = 0; // To track current question in practice mode


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
            // Simple check: show admin panel if user is "rishabh"
            if (user.displayName === 'rishabh') {
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
            authorUID: auth.currentUser.uid,
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
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = topic.name;
            link.dataset.id = topic.id;
            link.onclick = (e) => {
                e.preventDefault();
                selectTopic(topic.id);
            };
            item.appendChild(link);
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

    // --- *** NEW: Practice Mode Functions *** ---

    // 1. Called when a user clicks a topic in the sidebar
    async function selectTopic(topicId) {
        currentTopicId = topicId;
        
        // Highlight active topic link
        document.querySelectorAll('#topic-list a').forEach(a => a.classList.remove('active'));
        document.querySelector(`#topic-list a[data-id="${topicId}"]`).classList.add('active');
        
        const topic = currentTopics.find(t => t.id === topicId);
        contentTitle.textContent = topic.name;
        
        // Load the questions for this topic
        await loadPracticeQuestions(topicId);
    }

    // 2. Fetches questions from Firebase for the selected topic
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
    
    // 3. Renders a single question for Practice Mode
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
        
        // Add event listener for the "View Answer" button
        const viewAnswerBtn = questionList.querySelector('.view-answer-btn');
        viewAnswerBtn.onclick = () => {
            const explanationBox = questionList.querySelector('.explanation-box');
            explanationBox.classList.add('visible');
            
            // Highlight correct/incorrect options
            questionList.querySelectorAll('.practice-option').forEach(opt => {
                if (parseInt(opt.dataset.index, 10) === q.correctAnswerIndex) {
                    opt.classList.add('correct');
                } else {
                    opt.classList.add('incorrect');
                }
                opt.style.cursor = 'default'; // Disable click
            });
        };
        
        // Update Nav Buttons
        prevQuestionBtn.disabled = (currentPracticeIndex === 0);
        nextQuestionBtn.disabled = (currentPracticeIndex === currentPracticeQuestions.length - 1);
    }
    
    // 4. Navigation button listeners
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

    // --- Selection & Navigation Logic ---
    function selectSubject(subjectId) {
        currentSubjectId = subjectId;
        
        // Highlight active subject link
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
            practiceNav.style.display = 'none'; // Hide nav
        } else {
            // Home is selected
            topicTitle.textContent = "Select a Subject";
            topicList.innerHTML = '';
            contentTitle.textContent = "Welcome!";
            questionList.innerHTML = '<p>Select a subject from the top bar to see its topics.</p>';
            practiceNav.style.display = 'none'; // Hide nav
        }
    }


    // --- Initialization ---
    function init() {
        loadSubjects();
        
        // Set up initial auth tab state
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        
        // Set initial content
        selectSubject(null); // Select "Home" by default
    }

    init(); // Run the initialization
});