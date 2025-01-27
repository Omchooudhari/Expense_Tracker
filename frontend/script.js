// Check if user is logged in
if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "loginpage.html"; // Redirect to dashboard if logged in
}

// Function to scroll to the top of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Function to show the Manage Expense section and hide the View Expenses section
function showManageExpense() {
  document.getElementById("manageExpenseSection").style.display = "block";
  document.getElementById("viewExpenseSection").style.display = "none";
  document
    .getElementById("manageExpenseSection")
    .scrollIntoView({ behavior: "smooth" });
}

// Function to show the View Expenses section and hide the Manage Expense section
function showViewExpenses() {
  document.getElementById("viewExpenseSection").style.display = "block";
  document.getElementById("manageExpenseSection").style.display = "none";
  document
    .getElementById("viewExpenseSection")
    .scrollIntoView({ behavior: "smooth" });
}

function handleLogoutClick() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("accessToken");
  window.location.href = "loginpage.html"; // Redirect to login page
}

// Event listeners for navbar buttons
document
  .querySelector('a[href="#manage-expense"] button')
  .addEventListener("click", function () {
    showManageExpense();
    document.querySelector(".feedback-form").style.display = "none";
  });
document
  .querySelector('a[href="#view-expense"] button')
  .addEventListener("click", function () {
    showViewExpenses();
    document.querySelector(".feedback-form").style.display = "none";
  });
document
  .querySelector('a[href="#dashboard"] button')
  .addEventListener("click", function () {
    scrollToTop();
    document.querySelector(".feedback-form").style.display = "block";
    document.getElementById("manageExpenseSection").style.display = "none";
    document.getElementById("viewExpenseSection").style.display = "none";
  });

// Initially hide both sections
document.getElementById("manageExpenseSection").style.display = "none";
document.getElementById("viewExpenseSection").style.display = "none";

/* function to auto update the cash in hand as per the income and expense */
function updateCashInHand() {
  let budget = parseFloat(document.getElementById("totalBudget").innerText);
  let totalExpense = parseFloat(
    document.getElementById("totalExpense")?.innerText || 0
  );
  document.getElementById("cashInHand").innerText = budget - totalExpense;
}

// Sample JavaScript logic for handling form submission
document
  .querySelector(".feedback-form form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for your feedback!");
    // write logic to send data to server
  });

function handleSubmit(event) {
  event.preventDefault(); // Prevent form submission to the server

  // Process the form data here
  // alert("Feedback submitted successfully!");

  // Clear the form fields
  document.getElementById("feedbackForm").reset();
}

// Function to show description
function showDescription(button) {
  const row = button.closest("tr");
  const descriptionRow = row.nextElementSibling;
  descriptionRow.classList.toggle("show");

  if (descriptionRow.classList.contains("show")) {
    button.textContent = "Hide";
    button.style.backgroundColor = "red";
    button.style.color = "white";
  } else {
    button.textContent = "Show";
    button.style.backgroundColor = "";
    button.style.color = "";
  }
}

// Function to show/hide the feedback form
function toggleFeedbackForm() {
  const feedbackForm = document.querySelector(".feedback-form");
  feedbackForm.style.display =
    feedbackForm.style.display === "none" ? "block" : "none";
}

// Initially hide the feedback form
document.querySelector(".feedback-form").style.display = "block";

// Initialize variables
// Function to scroll to the top of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize variables
let expenses = [];
let transactionId = Date.now();
let totalBudget = 0;
let totalExpense = 0;
let cashInHand = 0;
let totalTransactions = 0;

// Global chart instances
let pieChartInstance = null;
let barChartInstance = null;

// Function to add an expense
function addExpense(amount, category, date, description) {
  fetch("http://localhost:8000/api/v1/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({ amount, category, date, description }),
    credentials: "include", // or 'same-origin' for same-origin requests
  })
    .then((response) => {
      if (!response.ok) {
        alert("Failed to add expense");
        return;
      }

      return response.json();
    })
    .then((data) => {
      alert("Data added successfully!");
      expenses.push(data.data); // Assuming 'data.data' contains the newly added expense
      updateValues();
      renderExpenseTable();
      updateCharts();
      document.getElementById("expenseForm").reset();
    })
    .catch((error) => {
      alert("There was a problem with your fetch operation:", error);
    });
}

// Function to delete an expense
// Function to delete an expense
// Function to delete an expense
async function deleteExpense(_id) {
  try {
    // Make the DELETE request to the server first
    const response = await fetch(
      `http://localhost:8000/api/v1/expenses/${_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include", // or 'same-origin' for same-origin requests
      }
    );

    if (!response.ok) {
      alert("Failed to delete expense");
      return;
    }

    // If deletion is successful, remove the expense from the local array
    expenses = expenses.filter((expense) => expense._id !== _id);
    updateValues(); // Update totals (total expense, cash in hand, etc.)
    renderExpenseTable(); // Update the expense table
    updateCharts(); // Update the charts

    alert("Expense deleted successfully!");
  } catch (error) {
    console.log(error);
    alert("There was a problem with deleting the expense");
  }
}

// Function to render expense table
async function renderExpenseTable() {
  const response = await fetch("http://localhost:8000/api/v1/expenses/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    credentials: "include", // or 'same-origin' for same-origin requests
  });

  if (!response.ok) {
    return alert("Failed to load data");
  }

  const data = await response.json();
  console.log(data);

  // Clear previous entries
  expenses.length = 0;

  data.data.forEach((record) => {
    expenses.push(record);
  });
  console.log(expenses);

  let tbody = document.getElementById("expenseTableBody");
  tbody.innerHTML = "";
  let index = 1;
  expenses.forEach((exp) => {
    tbody.innerHTML += `
      <tr class="expense-row">
          <td>${index++}</td>
          <td>${exp.category}</td>
          <td>${exp.date}</td>
          <td>₹${exp.amount}</td>
          <td><button class="show-description" onclick="showDescription(this)">Show</button></td>
          <td><button onclick="deleteExpense('${exp._id}')">Delete</button></td>
        </tr>
        <tr class="expense-description-row">
          <td colspan="6">${exp.description}</td>
        </tr>
      `;
  });
}

// Function to update charts
function updateCharts() {
  let pieData = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  let pieLabels = Object.keys(pieData);
  let pieValues = Object.values(pieData);

  if (pieChartInstance) {
    pieChartInstance.destroy();
  }

  const pieCtx = document.getElementById("pieChart").getContext("2d");
  pieChartInstance = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: pieLabels,
      datasets: [
        {
          data: pieValues,
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"],
        },
      ],
    },
  });

  let barData = new Array(7).fill(0);
  expenses.forEach((exp) => {
    let day = new Date(exp.date).getDay();
    barData[day] += exp.amount;
  });

  let barLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  const barCtx = document.getElementById("barChart").getContext("2d");
  barChartInstance = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: barLabels,
      datasets: [
        {
          label: "Weekly Spending",
          data: barData,
          backgroundColor: "#36a2eb",
        },
      ],
    },
  });
}

// Function to update values dynamically
function updateValues() {
  totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  cashInHand = totalBudget - totalExpense;
  totalTransactions = expenses.length;

  document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
  document.getElementById("cashInHand").textContent = cashInHand.toFixed(2);
  document.getElementById("totalTransactions").textContent = totalTransactions;
}

// Function to edit budget without prompt for cash in hand
function editBudget() {
  let newBudget = prompt("Enter new budget:", totalBudget);
  if (newBudget !== null && !isNaN(newBudget) && newBudget.trim() !== "") {
    totalBudget = parseFloat(newBudget);
    document.getElementById("totalBudget").textContent = totalBudget.toFixed(2);
    updateValues();
  }
}

// Event listener for budget edit
document.getElementById("editBudgetBtn").addEventListener("click", editBudget);

// Event listener for form submission
document.getElementById("expenseForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  addExpense(amount, category, date, description);
});

// Initial setup
document.addEventListener("DOMContentLoaded", function () {
  updateValues();
  renderExpenseTable();
  updateCharts();
});
