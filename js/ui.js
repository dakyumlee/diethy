import html2pdf from "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";

const logList = document.getElementById("logList");
const darkToggle = document.getElementById("darkToggle");
const downloadPDF = document.getElementById("downloadPDF");
const downloadCSV = document.getElementById("downloadCSV");
const restoreCSV = document.getElementById("restoreCSV");
const formInputs = ["dateInput", "weightInput", "dietInput", "exerciseInput", "moodInput", "memoInput"];

if (localStorage.getItem("darkmode") === "on") {
  document.body.classList.add("dark");
}

darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkmode", document.body.classList.contains("dark") ? "on" : "off");
};

downloadPDF.onclick = () => {
  html2pdf().from(logList).save("hyunsook-diet.pdf");
};

function toCSV() {
  let csv = "날짜,몸무게,식단,운동,기분,메모\n";
  document.querySelectorAll("#logList li").forEach(li => {
    const text = li.innerText.replace(/\n/g, "").replace(/\s+/g, " ").trim();
    const parts = text.split("|").map(t => t.replace(/[📅⚖️🍱🏃‍♀️😶💬]/g, '').trim());
    csv += parts.join(",") + "\n";
  });
  return csv;
}

downloadCSV.onclick = () => {
  const blob = new Blob([toCSV()], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hyunsook-diet.csv";
  a.click();
};

restoreCSV.onclick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.split("\n").slice(1);
      lines.forEach(async line => {
        const [date, weight, diet, exercise, mood, memo] = line.split(",");
        if (!date) return;
        const { addDoc, collection, Timestamp } = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");
        const { db } = await import("./firebase.js");
        await addDoc(collection(db, "dailyLogs"), {
          date: Timestamp.fromDate(new Date(date)),
          weight: parseFloat(weight), diet, exercise, mood, memo
        });
      });
      alert("CSV 복원 완료");
      location.reload();
    };
    reader.readAsText(file);
  };
  input.click();
};

formInputs.forEach(id => {
  const input = document.getElementById(id);
  input.value = localStorage.getItem(id) || "";
  input.oninput = () => localStorage.setItem(id, input.value);
});
