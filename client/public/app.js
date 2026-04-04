const state = {
  apiBaseUrl: "http://localhost:4000",
  token: "",
  user: null,
  activeView: "overviewView",
  users: []
};

const loginView = document.querySelector("#loginView");
const dashboardView = document.querySelector("#dashboardView");
const loginForm = document.querySelector("#loginForm");
const logoutButton = document.querySelector("#logoutButton");
const refreshButton = document.querySelector("#refreshButton");
const filterForm = document.querySelector("#filterForm");
const recordForm = document.querySelector("#recordForm");
const userCreateForm = document.querySelector("#userCreateForm");
const loginMessage = document.querySelector("#loginMessage");
const recordMessage = document.querySelector("#recordMessage");
const userCreateMessage = document.querySelector("#userCreateMessage");
const userUpdateMessage = document.querySelector("#userUpdateMessage");
const sessionInfo = document.querySelector("#sessionInfo");
const summaryCards = document.querySelector("#summaryCards");
const categoryTotals = document.querySelector("#categoryTotals");
const monthlyTrends = document.querySelector("#monthlyTrends");
const recentActivity = document.querySelector("#recentActivity");
const recordsTableBody = document.querySelector("#recordsTableBody");
const recordsMeta = document.querySelector("#recordsMeta");
const usersList = document.querySelector("#usersList");
const adminRecordsSection = document.querySelector("#adminRecordsSection");
const viewTitle = document.querySelector("#viewTitle");
const navButtons = [...document.querySelectorAll(".nav-button")];
const adminOnlyButtons = [...document.querySelectorAll(".admin-only")];
const viewPanels = [...document.querySelectorAll(".view-panel")];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function setMessage(target, message = "", type = "") {
  target.textContent = message;
  target.className = `message ${type}`.trim();
}

function getHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    ...extra
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${state.apiBaseUrl}${path}`, {
    ...options,
    headers: getHeaders(options.headers || {})
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

function showView(viewId) {
  state.activeView = viewId;
  viewPanels.forEach((panel) => panel.classList.toggle("hidden", panel.id !== viewId));
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });
  const activeButton = navButtons.find((button) => button.dataset.view === viewId);
  viewTitle.textContent = activeButton ? activeButton.textContent : "Overview";
}

function renderSession() {
  if (!state.user) {
    loginView.classList.remove("hidden");
    dashboardView.classList.add("hidden");
    sessionInfo.textContent = "";
    return;
  }

  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
  sessionInfo.innerHTML = `
    <strong>${state.user.name}</strong><br />
    ${state.user.email}<br />
    Role: ${state.user.role} | Status: ${state.user.status}
  `;

  const isAdmin = state.user.role === "ADMIN";
  adminRecordsSection.classList.toggle("hidden", !isAdmin);
  adminOnlyButtons.forEach((button) => button.classList.toggle("hidden", !isAdmin));

  if (!isAdmin && state.activeView === "usersView") {
    showView("overviewView");
  }
}

function renderSummary(summary) {
  summaryCards.innerHTML = `
    <article class="metric-card">
      <span>Total Income</span>
      <strong>${formatCurrency(summary.totals.income)}</strong>
    </article>
    <article class="metric-card">
      <span>Total Expenses</span>
      <strong>${formatCurrency(summary.totals.expenses)}</strong>
    </article>
    <article class="metric-card">
      <span>Net Balance</span>
      <strong>${formatCurrency(summary.totals.netBalance)}</strong>
    </article>
    <article class="metric-card">
      <span>Recent Activity Count</span>
      <strong>${summary.recentActivity.length}</strong>
    </article>
  `;

  categoryTotals.innerHTML = summary.categoryTotals.length
    ? summary.categoryTotals.map((item) => `
        <div class="list-item">
          <div class="list-item-meta">
            <strong>${item.category}</strong>
            <span>Total across matching records</span>
          </div>
          <strong>${formatCurrency(item.total)}</strong>
        </div>
      `).join("")
    : '<div class="empty-state">No category data available.</div>';

  monthlyTrends.innerHTML = summary.monthlyTrends.length
    ? summary.monthlyTrends.map((item) => `
        <div class="list-item">
          <div class="list-item-meta">
            <strong>${item.month}</strong>
            <span>Income ${formatCurrency(item.income)} / Expense ${formatCurrency(item.expenses)}</span>
          </div>
          <strong>${formatCurrency(item.net)}</strong>
        </div>
      `).join("")
    : '<div class="empty-state">No monthly trend data available.</div>';

  recentActivity.innerHTML = summary.recentActivity.length
    ? summary.recentActivity.map((item) => `
        <div class="list-item">
          <div class="list-item-meta">
            <strong>${item.category}</strong>
            <span>${formatDate(item.date)}${item.description ? ` | ${item.description}` : ""}</span>
          </div>
          <strong>${formatCurrency(item.amount)}</strong>
        </div>
      `).join("")
    : '<div class="empty-state">No recent activity found.</div>';
}

function renderRecords(recordsResponse) {
  if (!recordsResponse?.data?.length) {
    recordsMeta.textContent = "";
    recordsTableBody.innerHTML =
      '<tr><td colspan="5" class="empty-table">No records found for the current filters.</td></tr>';
    return;
  }

  recordsMeta.textContent = `Showing ${recordsResponse.data.length} of ${recordsResponse.meta.total} records`;
  recordsTableBody.innerHTML = recordsResponse.data.map((record) => `
    <tr>
      <td>${formatDate(record.date)}</td>
      <td>${record.category}</td>
      <td><span class="type-pill ${record.type === "INCOME" ? "income" : "expense"}">${record.type}</span></td>
      <td>${formatCurrency(record.amount)}</td>
      <td>${record.description || "-"}</td>
    </tr>
  `).join("");
}

function renderUsers() {
  if (!state.users.length) {
    usersList.innerHTML = '<div class="empty-state">No users found.</div>';
    return;
  }

  usersList.innerHTML = state.users.map((user) => `
    <article class="user-card">
      <div class="user-card-top">
        <div>
          <strong>${user.name}</strong>
          <div class="lead">${user.email}</div>
        </div>
        <span class="badge ${user.status === "INACTIVE" ? "inactive" : ""}">${user.status}</span>
      </div>
      <div class="list-item-meta">
        <span>Role: ${user.role}</span>
        <span>Created: ${formatDate(user.createdAt)}</span>
      </div>
      <div class="card-actions">
        <button class="status-button" data-action="toggle-role" data-id="${user.id}" type="button">
          Switch to ${user.role === "VIEWER" ? "ANALYST" : user.role === "ANALYST" ? "ADMIN" : "VIEWER"}
        </button>
        <button class="status-button ${user.status === "ACTIVE" ? "inactive" : ""}" data-action="toggle-status" data-id="${user.id}" type="button">
          Mark ${user.status === "ACTIVE" ? "Inactive" : "Active"}
        </button>
      </div>
    </article>
  `).join("");
}

async function loadSummary() {
  const summary = await apiRequest("/api/dashboard/summary");
  renderSummary(summary);
}

async function loadRecords() {
  if (!state.user || !["ADMIN", "ANALYST"].includes(state.user.role)) {
    recordsMeta.textContent = "";
    recordsTableBody.innerHTML =
      '<tr><td colspan="5" class="empty-table">This role cannot access the record list.</td></tr>';
    return;
  }

  const params = new URLSearchParams();
  const type = document.querySelector("#filterType").value;
  const category = document.querySelector("#filterCategory").value.trim();
  const startDate = document.querySelector("#filterStartDate").value;
  const endDate = document.querySelector("#filterEndDate").value;

  if (type) params.set("type", type);
  if (category) params.set("category", category);
  if (startDate) params.set("startDate", new Date(startDate).toISOString());
  if (endDate) params.set("endDate", new Date(endDate).toISOString());

  const records = await apiRequest(`/api/records${params.toString() ? `?${params.toString()}` : ""}`);
  renderRecords(records);
}

async function loadUsers() {
  if (!state.user || state.user.role !== "ADMIN") {
    usersList.innerHTML = '<div class="empty-state">Admin login required.</div>';
    return;
  }

  const response = await apiRequest("/api/users");
  state.users = response.data;
  renderUsers();
}

async function refreshApp() {
  if (!state.token) {
    setMessage(loginMessage, "Login first to load data.");
    return;
  }

  try {
    const jobs = [loadSummary(), loadRecords()];
    if (state.user.role === "ADMIN") jobs.push(loadUsers());
    await Promise.all(jobs);
    setMessage(loginMessage, "Workspace refreshed.", "success");
  } catch (error) {
    setMessage(loginMessage, error.message, "error");
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  state.apiBaseUrl = document.querySelector("#apiBaseUrl").value.trim().replace(/\/$/, "");

  try {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.querySelector("#email").value.trim(),
        password: document.querySelector("#password").value
      })
    });

    state.token = result.token;
    state.user = result.user;
    renderSession();
    showView("overviewView");
    setMessage(loginMessage, `Welcome, ${result.user.name}.`, "success");
    await refreshApp();
  } catch (error) {
    state.token = "";
    state.user = null;
    renderSession();
    setMessage(loginMessage, error.message, "error");
  }
});

logoutButton.addEventListener("click", () => {
  state.token = "";
  state.user = null;
  state.users = [];
  renderSession();
  showView("overviewView");
  summaryCards.innerHTML = "";
  categoryTotals.textContent = "Login to load data.";
  monthlyTrends.textContent = "Login to load data.";
  recentActivity.textContent = "Login to load data.";
  recordsTableBody.innerHTML =
    '<tr><td colspan="5" class="empty-table">Login as Admin or Analyst to view records.</td></tr>';
  usersList.textContent = "Admin login required.";
  setMessage(loginMessage, "Logged out.");
  setMessage(recordMessage, "");
  setMessage(userCreateMessage, "");
  setMessage(userUpdateMessage, "");
});

refreshButton.addEventListener("click", refreshApp);

filterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await loadRecords();
  } catch (error) {
    setMessage(loginMessage, error.message, "error");
  }
});

recordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/api/records", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(document.querySelector("#recordAmount").value),
        type: document.querySelector("#recordType").value,
        category: document.querySelector("#recordCategory").value.trim(),
        date: new Date(document.querySelector("#recordDate").value).toISOString(),
        description: document.querySelector("#recordDescription").value.trim()
      })
    });

    recordForm.reset();
    setMessage(recordMessage, "Record created successfully.", "success");
    await refreshApp();
  } catch (error) {
    setMessage(recordMessage, error.message, "error");
  }
});

userCreateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: document.querySelector("#userName").value.trim(),
        email: document.querySelector("#userEmail").value.trim(),
        password: document.querySelector("#userPassword").value,
        role: document.querySelector("#userRole").value,
        status: document.querySelector("#userStatus").value
      })
    });

    userCreateForm.reset();
    setMessage(userCreateMessage, "User created successfully.", "success");
    await loadUsers();
  } catch (error) {
    setMessage(userCreateMessage, error.message, "error");
  }
});

usersList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const user = state.users.find((item) => item.id === button.dataset.id);
  if (!user) return;

  try {
    if (button.dataset.action === "toggle-status") {
      await apiRequest(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        })
      });
    }

    if (button.dataset.action === "toggle-role") {
      const nextRole =
        user.role === "VIEWER" ? "ANALYST" : user.role === "ANALYST" ? "ADMIN" : "VIEWER";
      await apiRequest(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole })
      });
    }

    setMessage(userUpdateMessage, "User updated successfully.", "success");
    await loadUsers();
  } catch (error) {
    setMessage(userUpdateMessage, error.message, "error");
  }
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

renderSession();
showView("overviewView");
