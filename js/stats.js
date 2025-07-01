import { db } from './firebase.js';
import {
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const colRef = collection(db, "dailyLogs");
const weightCtx = document.getElementById("weightChart").getContext("2d");
const moodCtx = document.getElementById("moodChart").getContext("2d");
const monthSelect = document.getElementById("monthSelect");
let logs = [];
let weightChart, moodChart;

const loadLogs = async () => {
  const snapshot = await getDocs(colRef);
  logs = snapshot.docs.map(doc => {
    const d = doc.data();
    return { date: d.date.toDate(), weight: d.weight, mood: d.mood };
  });
  populateMonthSelect();
  renderCharts();
};

const populateMonthSelect = () => {
  const months = [...new Set(logs.map(log => log.date.toISOString().slice(0, 7)))];
  monthSelect.innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join("");
};

const renderCharts = () => {
  const selected = monthSelect.value;
  const monthLogs = logs.filter(l => l.date.toISOString().startsWith(selected));
  const labels = monthLogs.map(l => l.date.toISOString().slice(5, 10));
  const weights = monthLogs.map(l => l.weight);

  if (weightChart) weightChart.destroy();
  weightChart = new Chart(weightCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '몸무게(kg)',
        data: weights,
        borderWidth: 2,
        borderColor: 'rgb(255,99,132)',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        legend: { display: true },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });

  const moodCounts = {};
  monthLogs.forEach(l => {
    const key = l.mood || '😶';
    moodCounts[key] = (moodCounts[key] || 0) + 1;
  });
  if (moodChart) moodChart.destroy();
  moodChart = new Chart(moodCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(moodCounts),
      datasets: [{
        label: '감정 빈도',
        data: Object.values(moodCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
};

monthSelect.addEventListener("change", renderCharts);
loadLogs();
