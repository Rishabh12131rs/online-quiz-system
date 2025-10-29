let currentQuestion = {};
let currentAnswers = [];
let correctAnswer = '';
let score = 0;

function fetchQuestion() {
    fetch('https://opentdb.com/api.php?amount=1&type=multiple')
        .then(response => response.json())
        .then(data => {
            let question = data.results[0];
            currentQuestion = question;
            correctAnswer = question.correct_answer;
            currentAnswers = [...question.incorrect_answers, correctAnswer]
                .sort(() => Math.random() - 0.5);
            document.getElementById('question').innerHTML = question.question;
            document.getElementById('answers').innerHTML = '';
            document.getElementById('result').innerHTML = '';
            document.getElementById('next-btn').style.display = 'none';

            currentAnswers.forEach(answer => {
                let btn = document.createElement('button');
                btn.textContent = answer;
                btn.onclick = () => checkAnswer(answer);
                document.getElementById('answers').appendChild(btn);
            });
        });
}

function checkAnswer(selected) {
    if (selected === correctAnswer) {
        document.getElementById('result').innerHTML = "Correct!";
        score++;
    } else {
        document.getElementById('result').innerHTML = "Wrong! Correct answer: " + correctAnswer;
    }
    document.getElementById('next-btn').style.display = 'inline-block';
    document.querySelectorAll('#answers button').forEach(btn => btn.disabled = true);
}

document.getElementById('next-btn').onclick = fetchQuestion;

fetchQuestion();
