const button = document.getElementById("urgeBtn");
const message = document.getElementById("message");
const timer = document.getElementById("timer");

const streakEl = document.getElementById("streak");
const moneyEl = document.getElementById("money");
const totalCountEl = document.getElementById("totalCount");
const todayCountEl = document.getElementById("todayCount");

const resetBtn = document.getElementById("resetStreakBtn");

const bronzeBadge = document.getElementById("badge-bronze");
const silverBadge = document.getElementById("badge-silver");
const streakBadge = document.getElementById("badge-streak");


// ---------- CONSTANTS ----------
const COST_PER_CIG = 19;
const today = new Date().toDateString();

//-------VARIABLES----------
let totalCount = getNumber("totalUrges");
let todayCount = getNumber("todayUrges");
let streak = getNumber("streak");
let bestStreak = getNumber("bestStreak");
let money = getNumber("moneySaved");

let lastDate = localStorage.getItem("lastDate");
let todayUrgeDate = localStorage.getItem("todayUrgeDate");

// ---------- INIT ----------
resetDailyUrges();
updateUI();
attachEvents();
loadBadges();

// ---------- FUNCTIONS ----------

function getNumber(key) {
  const value = localStorage.getItem(key);
  return value ? parseInt(value) : 0;
}

function setNumber(key, value) {
  localStorage.setItem(key, value);
}

function resetDailyUrges() {
  if (todayUrgeDate !== today) {
    todayCount = 0;
    setNumber("todayUrges", todayCount);
    localStorage.setItem("todayUrgeDate", today);
  }
}

function updateUI() {
  totalCountEl.textContent = totalCount;
  todayCountEl.textContent = todayCount;
  streakEl.textContent = streak;
  moneyEl.textContent = money;
}

function attachEvents() {
  button.addEventListener("click", startUrgeTimer);
  resetBtn.addEventListener("click", resetStreak);
}

function startUrgeTimer() {
  let timeLeft = 60;
  button.disabled = true;
  message.textContent = "Breathe... Relax and hold on.";
  timer.textContent = timeLeft + "s";

  const interval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft + "s";

    if (timeLeft === 0) {
      clearInterval(interval);
      onUrgeSuccess();
    }
  }, 1000);
}

function onUrgeSuccess() {
  updateCounts();
  checkRewards();
  updateMoney();
  updateStreak();

  message.textContent = "Urge resisted.";
  timer.textContent = "";
  button.disabled = false;

  updateUI();
}

function updateCounts() {
  totalCount++;
  todayCount++;

  setNumber("totalUrges", totalCount);
  setNumber("todayUrges", todayCount);
}

function updateMoney() {
  money += COST_PER_CIG;
  setNumber("moneySaved", money);
}

function updateStreak() {
  if (lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (!lastDate) {
    streak = 1;
  } else if (lastDate === yesterdayStr) {
    streak++;
  } else {
    streak = 1;
  }

  setNumber("streak", streak);
  localStorage.setItem("lastDate", today);

  if (streak > bestStreak) {
    bestStreak = streak;
    setNumber("bestStreak", bestStreak);
  }
}

function resetStreak() {
  const confirmReset = confirm("Are you sure you want to reset?");
  if (!confirmReset) return;

  streak = 0;
  setNumber("streak", streak);
  localStorage.removeItem("lastDate");
  streakEl.textContent = streak;
}

function unlockBadge(key, element){
  localStorage.setItem(key, "true");
  element.classList.add("unlocked");
}

function loadBadges(){
  if(localStorage.getItem("bronzeBadge")){
    bronzeBadge.classList.add("unlocked");
  }
  if(localStorage.getItem("silverBadge")){
    silverBadge.classList.add("unlocked");
  }
  if(localStorage.getItem("streakBadge")){
    streakBadge.classList.add("unlocked");
  }
}

function checkRewards(){
  if(totalCount >= 5 && !localStorage.getItem("bronzeBadge")){
    unlockBadge("bronzeBadge", bronzeBadge);
  }
  if(totalCount >= 10 && !localStorage.getItem("silverBadge")){
    unlockBadge("silverBadge", silverBadge);
  }
  if(streak >= 7 && !localStorage.getItem("streakBadge")){
    unlockBadge("streakBadge", streakBadge);
  }
}
