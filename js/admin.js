import { db } from './firebase.js';
import {
  collection, addDoc, getDocs, deleteDoc, updateDoc, doc, Timestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const logList = document.getElementById("logList");
const colRef = collection(db, "dailyLogs");
let logs = [];

const getInputValues = () => ({
  date: document.getElementById("dateInput").value,
  weight: parseFloat(document.getElementById("weightInput").value),
  diet: document.getElementById("dietInput").value,
  exercise: document.getElementById("exerciseInput").value,
  mood: document.getElementById("moodInput").value,
  memo: document.getElementById("memoInput").value
});

const renderLogs = () => {
  logList.innerHTML = "";
  const search = document.getElementById("searchInput").value.toLowerCase();
  const sort = document.getElementById("sortSelect").value;
  const filterEmoji = document.querySelector('#emojiFilter .active').dataset.emoji;

  let filtered = logs.filter(log =>
    log.memo.toLowerCase().includes(search) ||
    log.diet.toLowerCase().includes(search) ||
    log.exercise.toLowerCase().includes(search)
  );

  if (filterEmoji !== "all") {
    filtered = filtered.filter(log => log.mood.includes(filterEmoji));
  }

  filtered.sort((a, b) => {
    if (sort === "date-desc") return b.date - a.date;
    if (sort === "date-asc") return a.date - b.date;
    if (sort === "weight-desc") return b.weight - a.weight;
    if (sort === "weight-asc") return a.weight - b.weight;
  });

  filtered.forEach(log => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        📅 ${log.date.toLocaleDateString()} |
        ⚖️ ${log.weight}kg |
        🍱 ${log.diet} |
        🏃‍♀️ ${log.exercise} |
        😶 ${log.mood} |
        💬 ${log.memo}
      </div>
      <div>
        <button data-id="${log.id}" class="edit">수정</button>
        <button data-id="${log.id}" class="delete">삭제</button>
      </div>
    `;
    logList.appendChild(li);
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.onclick = async () => {
      await deleteDoc(doc(db, "dailyLogs", btn.dataset.id));
      loadLogs();
    };
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.onclick = () => {
      const log = logs.find(l => l.id === btn.dataset.id);
      document.getElementById("dateInput").value = log.date.toISOString().substring(0,10);
      document.getElementById("weightInput").value = log.weight;
      document.getElementById("dietInput").value = log.diet;
      document.getElementById("exerciseInput").value = log.exercise;
      document.getElementById("moodInput").value = log.mood;
      document.getElementById("memoInput").value = log.memo;
      document.getElementById("addLogBtn").textContent = "수정완료";
      document.getElementById("addLogBtn").onclick = async () => {
        const updated = getInputValues();
        await updateDoc(doc(db, "dailyLogs", btn.dataset.id), {
          ...updated,
          date: Timestamp.fromDate(new Date(updated.date))
        });
        resetForm();
        loadLogs();
      }
    };
  });
};

const loadLogs = async () => {
  const snapshot = await getDocs(colRef);
  logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() }));
  renderLogs();
};

const resetForm = () => {
  document.getElementById("addLogBtn").textContent = "저장";
  document.getElementById("addLogBtn").onclick = addLog;
  document.querySelector(".admin-form").reset();
};

const addLog = async () => {
  const { date, weight, diet, exercise, mood, memo } = getInputValues();
  if (!date || weight < 20 || weight > 300) return alert("입력값 오류 또는 비정상 몸무게");
  await addDoc(colRef, {
    date: Timestamp.fromDate(new Date(date)), weight, diet, exercise, mood, memo
  });
  resetForm();
  loadLogs();
};

document.getElementById("addLogBtn").onclick = addLog;
document.getElementById("searchInput").oninput = renderLogs;
document.getElementById("sortSelect").onchange = renderLogs;
document.querySelectorAll("#emojiFilter button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("#emojiFilter button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderLogs();
  };
});

loadLogs();
