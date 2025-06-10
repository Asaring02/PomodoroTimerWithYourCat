const minute = document.getElementById("minute");
const second = document.getElementById("second");
const btn = document.getElementById("toggle-btn");
const popup = document.getElementById("popup");
const closeBtn = document.querySelector(".close-btn");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const coinCount = document.getElementById("coin-count"); // コイン残高表示用

let countNumber = 1500; // 25 minutes
let countDownID = null;
let isRunning = false;
let userCoins = localStorage.getItem("userCoins") ? parseInt(localStorage.getItem("userCoins")) : 0;
let pomodoroCount = localStorage.getItem("pomodoroCount") ? parseInt(localStorage.getItem("pomodoroCount")) : 0; // ポモドーロの完了回数を記録 // 変更点

// 初期表示時にコイン残高を更新
updateCoinDisplay();

function countDown() {
    let minuteCount = Math.floor(countNumber / 60);
    let secondCount = countNumber % 60;

    minute.textContent = minuteCount + ":";
    second.textContent = secondCount < 10 ? "0" + secondCount : secondCount;

    if (countNumber > 0) {
        countNumber--;
        countDownID = setTimeout(countDown, 1000);
    } else {
        clearTimeout(countDownID);
        countDownID = null;
        isRunning = false;
        btn.textContent = "START";
        rewardUser(); // ポモドーロ完了時にコインを付与
        openPopup();
    }
}

btn.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        btn.textContent = "STOP";
        countDownID = setTimeout(countDown, 1000);
    } else {
        isRunning = false;
        clearTimeout(countDownID);
        countDownID = null;
        btn.textContent = "START";
    }
});

// コインを獲得する関数 // 変更点
function rewardUser() {
    pomodoroCount++; // ポモドーロ完了回数を増やす
    localStorage.setItem("pomodoroCount", pomodoroCount); // 記録を保存

    let reward = (pomodoroCount % 4 === 0) ? 20 : 10; // 4回目のときは20コイン // 変更点
    userCoins += reward;
    localStorage.setItem("userCoins", userCoins);

    updateCoinDisplay(); // コイン表示を更新
}

// コイン残高を表示する関数
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
    
// 🎵 タイマー終了時の音声を再生
const alarmSound = new Audio("audio/meow_alarm.mp3");
alarmSound.play().catch(err => console.error("音声再生失敗:", err));

    let reward = (pomodoroCount % 4 === 0) ? 20 : 10; // 4回目のときは20コイン // 変更点

    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn">&times;</span>
            <p>Well done!<br>You got <span class="highlight">${reward} coins</span></p>
            <img id="popup-image" src="images/coin.png" alt="Popup Image">
        </div>
    `;

    popup.style.display = "flex";

    // 閉じるボタンのイベントリスナーを追加
    document.querySelector(".close-btn").addEventListener("click", closePopup);
}

// Close the popup and redirect to breakpage.html
function closePopup() {
    popup.style.display = "none";

    // 🔁 古いBreakタイマーの残り時間をリセット
    localStorage.removeItem("breakStartTime");
    localStorage.removeItem("remainingBreakTime");

    window.location.href = "breakpage.html"; // Redirect to break page
}

