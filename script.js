let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");

let chart;

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const expense = {
    id: Date.now(),
    title: document.getElementById("title").value,
    amount: Number(document.getElementById("amount").value),
    date: document.getElementById("date").value,
    category: document.getElementById("category").value
  };

  expenses.push(expense);
  saveData();
  updateUI();
function updateChart() {
  const categoryTotals = {};

  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data
      }]
    }
  });
}
  form.reset();
});

function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateUI() {
  list.innerHTML = "";

  let total = 0;

  expenses.forEach(exp => {
    total += exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.title} (${exp.category}) - ₹${exp.amount} - ${exp.date}
      <button onclick="deleteExpense(${exp.id})">X</button>
    `;

    list.appendChild(li);
  });

  totalEl.textContent = total;

  updateChart();
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveData();
  updateUI();
}
updateUI();