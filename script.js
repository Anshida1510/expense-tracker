let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editExpenseId = null;

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");

const totalEl = document.getElementById("total");
const foodTotal = document.getElementById("foodTotal");
const travelTotal = document.getElementById("travelTotal");
const shoppingTotal = document.getElementById("shoppingTotal");
const billsTotal = document.getElementById("billsTotal");
const otherTotal = document.getElementById("otherTotal");

const search = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const sortExpenses = document.getElementById("sortExpenses");

let chart;

// ===================== ADD / UPDATE EXPENSE =====================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const expense = {
        id: editExpenseId ?? Date.now(),
        title: document.getElementById("title").value,
        amount: Number(document.getElementById("amount").value),
        date: document.getElementById("date").value,
        category: document.getElementById("category").value
    };

    if (editExpenseId !== null) {

        expenses = expenses.map(exp =>
            exp.id === editExpenseId ? expense : exp
        );

        editExpenseId = null;
        form.querySelector("button").innerText = "Add Expense";

    } else {

        expenses.push(expense);

    }

    saveData();
    updateUI();
    form.reset();

});

// ===================== SAVE DATA =====================

function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// ===================== UPDATE UI =====================

function updateUI() {

    list.innerHTML = "";

    let total = 0;
    let food = 0;
    let travel = 0;
    let shopping = 0;
    let bills = 0;
    let other = 0;

    expenses.forEach(exp => {

        total += exp.amount;

        switch (exp.category) {

            case "Food":
                food += exp.amount;
                break;

            case "Travel":
                travel += exp.amount;
                break;

            case "Shopping":
                shopping += exp.amount;
                break;

            case "Bills":
                bills += exp.amount;
                break;

            default:
                other += exp.amount;

        }

    });

    totalEl.textContent = total;
    foodTotal.textContent = food;
    travelTotal.textContent = travel;
    shoppingTotal.textContent = shopping;
    billsTotal.textContent = bills;
    otherTotal.textContent = other;

    const keyword = search.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    let filteredExpenses = [...expenses];

    // SORT

    switch (sortExpenses.value) {

        case "oldest":
            filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;

        case "highest":
            filteredExpenses.sort((a, b) => b.amount - a.amount);
            break;

        case "lowest":
            filteredExpenses.sort((a, b) => a.amount - b.amount);
            break;

        default:
            filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    }

    filteredExpenses.forEach(exp => {

        if (
            !exp.title.toLowerCase().includes(keyword) &&
            !exp.category.toLowerCase().includes(keyword)
        ) {
            return;
        }

        if (
            selectedCategory !== "All" &&
            exp.category !== selectedCategory
        ) {
            return;
        }

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>${exp.title}</strong><br>
                ${exp.category} • ₹${exp.amount}<br>
                ${exp.date}
            </div>

            <div>
                <button onclick="editExpense(${exp.id})">✏️</button>
                <button onclick="deleteExpense(${exp.id})">🗑️</button>
            </div>
        `;

        list.appendChild(li);

    });

    updateChart();

}

// ===================== DELETE =====================

function deleteExpense(id) {

    expenses = expenses.filter(exp => exp.id !== id);

    saveData();
    updateUI();

}

// ===================== EDIT =====================

function editExpense(id) {

    const expense = expenses.find(exp => exp.id === id);

    document.getElementById("title").value = expense.title;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("date").value = expense.date;
    document.getElementById("category").value = expense.category;

    editExpenseId = id;

    form.querySelector("button").innerText = "Update Expense";

}

// ===================== PIE CHART =====================

function updateChart() {

    const categoryTotals = {};

    expenses.forEach(exp => {

        categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + exp.amount;

    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chart) {
        chart.destroy();
    }

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

// ===================== EVENTS =====================

search.addEventListener("input", updateUI);

filterCategory.addEventListener("change", updateUI);

sortExpenses.addEventListener("change", updateUI);

// ===================== INITIAL LOAD =====================

updateUI();