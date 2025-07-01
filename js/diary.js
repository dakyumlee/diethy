import { db } from './firebase.js';
import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const diaryList = document.getElementById("diaryList");

async function loadDiary() {
  const q = query(collection(db, "dailyLogs"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const d = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      📅 ${d.date?.toDate().toLocaleDateString() || "날짜없음"}<br>
      ⚖️ ${d.weight}kg<br>
      🍱 ${d.diet}<br>
      🏃‍♀️ ${d.exercise}<br>
      😶 ${d.mood}<br>
      💬 ${d.memo}<hr>
    `;
    diaryList.appendChild(li);
  });
}
loadDiary();
