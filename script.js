
const minute = document.getElementById("minute");
const second = document.getElementById("second");
const btn = document.getElementById("toggle-btn");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close-btn");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const coinCount = document.getElementById("coin-count"); // コイン残高表示用

const COUNTDOWN_DURATION = 1500; // 25 minutes
let countDownID = null;
let isRunning = false;
let startTime = null;
let pausedTime = 0;
let userCoins = localStorage.getItem("userCoins") ? parseInt(localStorage.getItem("userCoins")) : 0;
let pomodoroCount = localStorage.getItem("pomodoroCount") ? parseInt(localStorage.getItem("pomodoroCount")) : 0;

updateCoinDisplay();

function countDown() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000) + pausedTime;
    const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);

    let minuteCount = Math.floor(remaining / 60);
    let secondCount = remaining % 60;

    minute.textContent = minuteCount + ":";
    second.textContent = secondCount < 10 ? "0" + secondCount : secondCount;

    if (remaining > 0) {
        countDownID = setTimeout(countDown, 1000);
    } else {
        clearTimeout(countDownID);
        countDownID = null;
        isRunning = false;
        pausedTime = 0;
        btn.textContent = "START";
        rewardUser();
        openPopup();
    }
}

btn.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        btn.textContent = "STOP";
        startTime = Date.now();
        countDown();
    } else {
        isRunning = false;
        pausedTime += Math.floor((Date.now() - startTime) / 1000);
        clearTimeout(countDownID);
        countDownID = null;
        btn.textContent = "START";
    }
});

function rewardUser() {
    pomodoroCount++;
    localStorage.setItem("pomodoroCount", pomodoroCount);

    let reward = (pomodoroCount % 4 === 0) ? 20 : 10;
    userCoins += reward;
    localStorage.setItem("userCoins", userCoins);

    updateCoinDisplay();
}

function updateCoinDisplay() {
    coinCount.textContent = userCoins;
}

// To-Do List Functionality
function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    } else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

// Popup Functions
function openPopup() {
    const alarmSound = new Audio("audio/meow_alarm.mp3");
    alarmSound.play().catch(err => console.error("音声再生失敗:", err));

    let reward = (pomodoroCount % 4 === 0) ? 20 : 10;

    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn">&times;</span>
            <p>Well done!<br>You got <span class="highlight">${reward} coins</span></p>
            <img id="popup-image" src="images/coin.png" alt="Popup Image">
        </div>
    `;

    popup.style.display = "flex";

    document.querySelector(".close-btn").addEventListener("click", closePopup);
}

function closePopup() {
    popup.style.display = "none";
    localStorage.removeItem("breakStartTime");
    localStorage.removeItem("remainingBreakTime");

    window.location.href = "breakpage.html";
}
