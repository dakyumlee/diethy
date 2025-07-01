import { db } from './firebase.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

document.getElementById("saveBtn").addEventListener("click", async () => {
  const weight = document.getElementById("weight").value;
  const message = document.getElementById("message").value;

  if (!weight || !message) return alert("입력 안 된 게 있어!");

  try {
    await addDoc(collection(db, "dailyLogs"), {
      weight: parseFloat(weight),
      message,
      date: Timestamp.now()
    });
    alert("기록 완료!");
  } catch (e) {
    console.error("에러 발생", e);
    alert("저장 실패: " + e.message);
  }
});
