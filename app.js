// Array of Objects

const quizArr = [
  {
    question: "When was javascript invented?",
    choices: ["1996", 
              "1995", 
              "1994", 
              "none of the above"],
    answer: 1,
  },
  {
    question: "What does HTML stand for?",
    choices: [
              "Hypertext Markup Language",
              "Hypertext Markdown Language",
              "HyperLoop Machine Language",
              "Helicopters Terminals Motorboats Lamborginis",
    ],
    answer: 0,
  },
  {
    question: "Which is the full form of CSS?",
    choices: [
              "Central style sheets",
              "Cascading style sheets",
              "Central simple sheets",
              "Cars SUVs Sailboats",
    ],
    answer: 1,
  },
  {
    question: "What language runs in a web browser?",
    choices: ["Java", 
              "C", 
              "Python", 
              "Javascript"],
    answer: 3,
  },
];

// Random question reload

// quizArr.sort(() => { return Math.random() - 0.5 });

// JS modify HTML elements

const containerModal = document.getElementById("container-modal");
const form = document.getElementById("form");
const username = document.getElementById("username");
let email = document.getElementById("email");
const quizHead = document.getElementById("quiz-head");
let quiz = document.getElementById("quiz");
const submit = document.getElementById("submit");
let previous = document.getElementById("previous");
let displayScore = document.getElementById("displayScore");

// This object will store the data of the currently logged-in user.

let currentUserData = {};

// Function to save user data to local storage.

function saveUserData() {
  localStorage.setItem(currentUserData.email, JSON.stringify(currentUserData));
}

// Function to store user data in a cookie.

function cookieStorage() {
  setCookie("userData", currentUserData);
}

// Functions to set & get a cookie.

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
  }
  return null;
}

// Function to load user data from various storage mechanisms (session storage, cookies, local storage).

function loadUserData() {
  const sessionStorageData = sessionStorage.getItem("userData");
  const cookieData = getCookie("userData");
  const localStorageData = localStorage.getItem("userData");

  if (sessionStorageData) {
    currentUserData = JSON.parse(sessionStorageData);
  } else if (cookieData) {
    currentUserData = cookieData;
  } else if (localStorageData) {
    currentUserData = JSON.parse(localStorageData);
  } else {
    showForm();
    return;
  }

  if (currentUserData.currentQuestion !== undefined) {

    userAnswers = currentUserData.userAnswers || [];
    if (currentUserData.currentQuestion >= quizArr.length) {
      showdisplayScore();
    } else {
      showQuiz();
      loadQuestions();
    }
    return;
  }
  showForm();
}

// Event listener to load user data when the page loads.

window.addEventListener("load", () => {
  loadUserData();
  quizHead.textContent = currentUserData.username;
});

// Event listener to save user data when the page is about to be reloaded.

window.addEventListener("loadAgain", () => {
  if (currentUserData.currentQuestion !== undefined) {
    sessionStorage.setItem("userData", JSON.stringify(currentUserData));
  }
});

// Function to show the user registration form.

function showForm() {
  containerModal.style.display = "inline-flex";
  quiz.style.display = "none";
  displayScore.style.display = "none"
}

// Function to show the quiz questions.

function showQuiz() {
  containerModal.style.display = "none";
  quiz.style.display = "block";
  displayScore.style.display = "none"
}

// Event listener to handle form submission (user registration).

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;

  email = document.getElementById("email");
  email = email.value.trim();
  const emailPattern = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email");
    email.value = "";
    return;
  }

  if (localStorage.length >= 10) {
    alert("Session is expired.");
    localStorage.clear();
    history.go(0);
  }

  const storedUserData = JSON.parse(localStorage.getItem(email));
  if (storedUserData) {
    currentUserData = storedUserData;
    showdisplayScore();
    return;
  } else {
    currentUserData = {
      username,
      email,
      score: 0,
      currentQuestion: 0
    };
    localStorage.setItem(email, JSON.stringify(currentUserData));
    saveUserData();
    cookieStorage();
  }

  quizHead.textContent = username;
  showQuiz();
  loadQuestions();
});

// Global variable to store user answers for each quiz question.

let userAnswers = currentUserData.userAnswers || [];

// Function to load and display quiz questions.

function loadQuestions() {
  if (currentUserData.currentQuestion === undefined) {
    currentUserData.currentQuestion = 0;
    currentUserData.userAnswers = [];
    saveUserData();
  }
  let question = document.getElementById("question");
  let label = document.getElementsByTagName("label");

  question.textContent =
    quizArr[currentUserData.currentQuestion].question;

  for (let i = 0; i < label.length; i++) {
    label[i].textContent =
      quizArr[currentUserData.currentQuestion].choices[i];
  }

  let previousAnswer = userAnswers[currentUserData.currentQuestion];

  if (previousAnswer !== undefined) {
    let choices = document.getElementsByName("choice");
    choices[previousAnswer].checked = true;
  }

  if (currentUserData.currentQuestion == 0) {
    previous.style.display = "none";
  } else {
    previous.style.display = "inline-flex";
  }
}

// Function to handle user's selection of an answer for a quiz question.

function getSelected() {

  let choices = document.getElementsByName("choice");
  let selectedChoice = -1;

  for (let i = 0; i < choices.length; i++) {
    if (choices[i].checked) {
      selectedChoice = parseInt(choices[i].value);
      for (let j = 0; j < choices.length; j++) {
        choices[j].checked = false;
      }
      break;
    }
  }

  userAnswers[currentUserData.currentQuestion] = selectedChoice;
  currentUserData.userAnswers = userAnswers;
  saveUserData();
  cookieStorage();

  if (selectedChoice == -1) {
    alert("Please select option");
    return;
  }

  currentUserData.currentQuestion++;

  if (currentUserData.currentQuestion === quizArr.length) {
    scoreSum();
    showdisplayScore();

  } else {
    loadQuestions();
  }
}

submit.addEventListener("click", getSelected); // Event listener for the "Next" button click to get the selected answer and proceed to the next question.

previous.addEventListener("click", PreviousQuestion); // Event listener for the "Next" button click to get the selected answer and proceed to the next question.

// Function to move back to the previous question.

function PreviousQuestion() {
  currentUserData.currentQuestion--;
  saveUserData();
  loadQuestions();
  cookieStorage();
}

// Function to calculate the user's score after completing the quiz.

function scoreSum() {
  let score = 0;
  for (let i = 0; i < quizArr.length; i++) {
    if (userAnswers[i] === quizArr[i].answer) {
      score++;
    }
  }
  currentUserData.score = score;
  saveUserData();
  cookieStorage();
}

// Function to show the overall score summary after the quiz is completed.

function showdisplayScore() {
  containerModal.style.display = "none";
  quiz.style.display = "none";
  displayScore.style.display = "block";

  const OveralData = Object.values(localStorage);

  const tableData = document.getElementById("tableData");
  tableData.innerHTML = "";
  OveralData.forEach((userDataJSON) => {
    const userData = JSON.parse(userDataJSON);
    const row = document.createElement("tr");

    const usernameCell = document.createElement("td");
    usernameCell.textContent = userData.username;
    row.appendChild(usernameCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = userData.email;
    row.appendChild(emailCell);

    const scoreCell = document.createElement("td");
    scoreCell.textContent = userData.score;
    row.appendChild(scoreCell);

    tableData.appendChild(row);
  });
}

document.getElementById("start-again").addEventListener("click", startOver); // Event listener for the "Start Again" button click to restart the quiz.

// Function to reset the quiz and start over.

function startOver() {
  if (localStorage.length >= 10) {
    alert("session is expired.");
    localStorage.clear();
    window.close();
  }

  document.getElementById("form").reset();
  currentUserData = {};
  userAnswers = [];

  showForm()
}