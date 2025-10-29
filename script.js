let currentQuestion = {};
let currentAnswers = [];
let correctAnswer = '';
let score = 0;
function showResult(final = false) {
    if (final) {
        document.getElementById('question').innerHTML = '';
        document.getElementById('answers').innerHTML = '';
        document.getElementById('result').innerHTML = `Quiz Finished!<br>Your Score: ${score}`;
        let btn = document.createElement('button');
        btn.textContent = "Restart Quiz";
        btn.id = "restart-btn";
        btn.onclick = () => location.reload();
        document.getElementById('result').appendChild(btn);
        document.getElementById('next-btn').style.display = 'none';
    }
}

let totalQuestions = 10, currentCount = 0;

function fetchQuestion() {
    if (currentCount >= totalQuestions) {
        showResult(true);
        return;
    }
    fetch('https://opentdb.com/api.php?amount=1&type=multiple')
        .then(response => response.json())
        .then(data => {
            let question = data.results[0];
            correctAnswer = question.correct_answer;
            currentAnswers = [...question.incorrect_answers, correctAnswer]
                .sort(() => Math.random() - 0.5);
            document.getElementById('question').innerHTML = `Q${currentCount + 1}: ` + question.question;
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
    currentCount++;
}

document.getElementById('next-btn').onclick = fetchQuestion;


fetchQuestion();
