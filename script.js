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

    // --- New Admin Panel Elements ---
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
    
    // --- New Content Elements ---
    const subjectNav = document.getElementById('subject-nav');
    const topicSidebar = document.getElementById('topic-sidebar');
    const topicList = document.getElementById('topic-list');
    const topicTitle = document.getElementById('topic-title');
    const mainContent = document.getElementById('main-content');
    const contentTitle = document.getElementById('content-title');
    const questionList = document.getElementById('question-list');
    
    // --- App State ---
    let currentSubjects = []; // To cache subjects
    let currentTopics = []; // To cache topics
    let currentSubjectId = null;
    let currentTopicId = null;


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
            // User is signed in
            userDisplay.style.display = 'flex';
            loginBtn.style.display = 'none';
            welcomeUser.textContent = `Hello, ${user.displayName || 'User'}`;
            // Simple check: show admin panel if user is "rishabh"
            if (user.displayName === 'rishabh') {
                 adminPanelBtn.style.display = 'block';
            }
        } else {
            // User is signed out
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
                authContainer.style.display = 'none'; // Close modal on success
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
                authContainer.style.display = 'none'; // Close modal on success
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

    // --- *** NEW: Admin Panel Logic *** ---

    // 1. Add Subject
    addSubjectForm.onsubmit = (e) => {
        e.preventDefault();
        const subjectName = subjectNameInput.value.trim();
        if (!subjectName) return;
        
        db.collection("subjects").add({
            name: subjectName
        }).then(() => {
            showToast("Subject added!", "success");
            subjectNameInput.value = '';
            loadSubjects(); // Refresh the top nav
            populateAdminDropdowns(); // Refresh the dropdowns
        }).catch(err => showToast(err.message, "error"));
    };

    // 2. Add Topic
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
            // If the new topic belongs to the currently viewed subject, refresh the sidebar
            if(subjectId === currentSubjectId) {
                loadTopics(currentSubjectId);
            }
            populateAdminDropdowns(); // Refresh the dropdowns
        }).catch(err => showToast(err.message, "error"));
    };
    
    // 3. Add Question (This is the new "Save Quiz" logic)
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
            addQuestionForm.reset(); // Clear the form
        }).catch(err => showToast(err.message, "error"));
    };

    // --- *** NEW: Data Loading Logic *** ---
    
    // Load Subjects into the top nav
    async function loadSubjects() {
        subjectNav.innerHTML = ''; // Clear old links
        
        // Add a "Home" link manually
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

    // Load Topics into the sidebar
    async function loadTopics(subjectId) {
        topicList.innerHTML = '<li class="loader"></li>'; // Show spinner
        const snapshot = await db.collection("topics").where("subjectId", "==", subjectId).get();
        currentTopics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        topicList.innerHTML = ''; // Clear spinner
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
    
    // Function to populate all dropdowns in the admin panel
    async function populateAdminDropdowns() {
        // 1. Populate "Select Subject" dropdown
        const subjectSnapshot = await db.collection("subjects").get();
        currentSubjects = subjectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        subjectSelectForTopic.innerHTML = '<option value="">-- Select Subject --</option>';
        currentSubjects.forEach(s => {
            subjectSelectForTopic.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
        
        // 2. Populate "Select Topic" dropdown
        const topicSnapshot = await db.collection("topics").get();
        currentTopics = topicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        topicSelectForQuestion.innerHTML = '<option value="">-- Select Topic --</option>';
        currentTopics.forEach(t => {
            // Find the subject name for this topic
            const subject = currentSubjects.find(s => s.id === t.subjectId);
            const subjectName = subject ? subject.name : "Unknown";
            topicSelectForQuestion.innerHTML += `<option value="${t.id}">${t.name} (${subjectName})</option>`;
        });
    }

    // --- *** NEW: Selection & Navigation Logic *** ---
    
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
        } else {
            // Home is selected
            topicTitle.textContent = "Select a Subject";
            topicList.innerHTML = '';
            contentTitle.textContent = "Welcome!";
            questionList.innerHTML = '<p>Select a subject from the top bar to see its topics.</p>';
        }
    }
    
    function selectTopic(topicId) {
        currentTopicId = topicId;
        
        // Highlight active topic link
        document.querySelectorAll('#topic-list a').forEach(a => a.classList.remove('active'));
        document.querySelector(`#topic-list a[data-id="${topicId}"]`).classList.add('active');
        
        const topic = currentTopics.find(t => t.id === topicId);
        contentTitle.textContent = topic.name;
        
        // This is where "Step 2: Practice Mode" will go.
        // For now, we'll just say it's loading.
        questionList.innerHTML = `<p>Loading questions for ${topic.name}...</p>`;
    }


    // --- Initialization ---
    function init() {
        loadSubjects();
        
        // Set up initial auth tab state
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    }

    init(); // Run the initialization
});