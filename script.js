const quiz = document.getElementById("quiz");
const submitButton = document.getElementById("submit");
const quitButton = document.getElementById("quit");
const resultDisplay = document.getElementById("result");

let currentQuestionIndex = 0;
let score = 0;
let quizData = [];
let userAnswers = [];

// Load quiz data from JSON file
fetch('quizData.json')
    .then(response => response.json())
    .then(data => {
        quizData = data.questions;
        loadQuiz();
    })
    .catch(error => console.error('Error loading quiz data:', error));

function loadQuiz() {
    const currentQuizData = quizData[currentQuestionIndex];
    quiz.innerHTML = `
        <div class="question">${currentQuizData.question}</div>
        <label>
            <input type="radio" name="answer" value="a">${currentQuizData.a}
        </label>
        <label>
            <input type="radio" name="answer" value="b">${currentQuizData.b}
        </label>
        <label>
            <input type="radio" name="answer" value="c">${currentQuizData.c}
        </label>
        <label>
            <input type="radio" name="answer" value="d">${currentQuizData.d}
        </label>
    `;
}

function getSelected() {
    const answers = document.querySelectorAll('input[name="answer"]');
    let answer;
    answers.forEach((ans) => {
        if (ans.checked) {
            answer = ans.value;
        }
    });
    return answer;
}

submitButton.addEventListener("click", () => {
    const answer = getSelected();
    if (answer) {
        userAnswers[currentQuestionIndex] = answer; // Store user's answer
        if (answer === quizData[currentQuestionIndex].correct) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuiz();
        } else {
            displayResults();
        }
    } else {
        alert("Please select an answer!");
    }
});

// Quit button event listener
quitButton.addEventListener("click", () => {
    displayResults();
});

function displayResults() {
    quiz.innerHTML = ''; // Clear the quiz area
    resultDisplay.innerHTML = ''; // Clear previous results

    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct;

        const questionElement = document.createElement('div');
        questionElement.innerHTML = `<strong>${question.question}</strong><br>`;

        // Display user's answer and correct answer with appropriate colors
        if (userAnswer !== correctAnswer) {
            questionElement.innerHTML += `
                <p>Your answer: <span style="color: red;">${userAnswer}</span></p>
                <p>Correct answer: <span style="color: green;">${correctAnswer}</span></p>
            `;
        } else {
            questionElement.innerHTML += `<p>Your answer: <span style="color: green;">${userAnswer}</span> (Correct)</p>`;
        }

        resultDisplay.appendChild(questionElement);
    });

    resultDisplay.innerHTML += `<h2>You scored ${score} out of ${quizData.length}!</h2>`;
    submitButton.style.display = 'none'; // Hide the submit button
    quitButton.style.display = 'none'; // Hide the quit button
}
