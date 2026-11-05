// Shared LocalStorage State for Multi-Page Navigation
let employees = JSON.parse(localStorage.getItem('employees')) || [
  { id: 1, name: "Noufal Rizqi", role: "Software Developer", division: "Software Development", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: 2, name: "Budi Santoso", role: "UI/UX Designer", division: "UI/UX Design", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: 3, name: "Siti Rahma", role: "Project Manager", division: "Project Management", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }
];

let jobdesks = JSON.parse(localStorage.getItem('jobdesks')) || [
  { id: 101, title: "Slicing Frontend Landing Page", assigneeId: 1, priority: "Tinggi", status: "progress" },
  { id: 102, title: "Desain Wireframe Mobile App", assigneeId: 2, priority: "Sedang", status: "todo" },
  { id: 103, title: "Penyusunan Timeline Proyek Q3", assigneeId: 3, priority: "Rendah", status: "done" }
];

function saveData() {
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('jobdesks', JSON.stringify(jobdesks));
}

// Authentication
function handleLogin(e) {
  e.preventDefault();
  localStorage.setItem('isLoggedIn', 'true');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  initPage();
}

function fillLogin(user, pass) {
  document.getElementById('username').value = user;
  document.getElementById('password').value = pass;
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

// Page Auto-Init
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const loginScreen = document.getElementById('login-screen');
  const appScreen = document.getElementById('app-screen');

  if (loginScreen && appScreen) {
    if (isLoggedIn === 'true') {
      loginScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');
    }
  }

  initPage();
});

function initPage() {
  renderDashboard();
  renderEmployeesPage();
  renderJobdeskPage();
}

// Renderers
function renderDashboard() {
  const prioTable = document.getElementById('priority-jobs-body');
  if (prioTable) {
    prioTable.innerHTML = jobdesks.filter(j => j.priority === 'Tinggi' || j.status === 'progress').map(job => {
      const emp = employees.find(e => e.id == job.assigneeId) || { name: '-' };
      const statusText = job.status === 'progress' ? 'Sedang Dikerjakan' : (job.status === 'done' ? 'Selesai' : 'Belum Dimulai');
      return `<tr><td>${job.title}</td><td>${emp.name}</td><td><span class="badge-status badge-progress">${statusText}</span></td></tr>`;
    }).join('');
  }
}

function renderEmployeesPage() {
  const container = document.getElementById('employee-grid-container');
  if (!container) return;

  container.innerHTML = employees.map(emp => `
    <div class="employee-card">
      <img src="${emp.avatar}" class="emp-avatar-large" alt="${emp.name}" />
      <div class="emp-name">${emp.name}</div>
      <div class="emp-role">${emp.role}</div>
      <div class="emp-division">${emp.division}</div>
      <div class="emp-card-actions">
        <button class="btn btn-secondary btn-sm" onclick="deleteEmployee(${emp.id})"><i class="fa-solid fa-trash"></i> Hapus</button>
      </div>
    </div>
  `).join('');
}

function renderJobdeskPage() {
  const todoCol = document.getElementById('kanban-todo');
  const progressCol = document.getElementById('kanban-progress');
  const doneCol = document.getElementById('kanban-done');
  const assigneeSelect = document.getElementById('job-assignee');

  if (assigneeSelect) {
    assigneeSelect.innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }

  if (!todoCol) return;

  todoCol.innerHTML = ''; progressCol.innerHTML = ''; doneCol.innerHTML = '';

  jobdesks.forEach(job => {
    const assignee = employees.find(e => e.id == job.assigneeId) || { name: 'Unassigned' };
    const cardHtml = `
      <div class="kanban-card">
        <div class="kanban-title">${job.title}</div>
        <div class="kanban-meta">
          <span><i class="fa-solid fa-user"></i> ${assignee.name}</span>
          <span class="badge-status badge-todo">${job.priority}</span>
        </div>
      </div>
    `;

    if (job.status === 'todo') todoCol.innerHTML += cardHtml;
    else if (job.status === 'progress') progressCol.innerHTML += cardHtml;
    else if (job.status === 'done') doneCol.innerHTML += cardHtml;
  });

  document.getElementById('count-todo').innerText = jobdesks.filter(j => j.status === 'todo').length;
  document.getElementById('count-progress').innerText = jobdesks.filter(j => j.status === 'progress').length;
  document.getElementById('count-done').innerText = jobdesks.filter(j => j.status === 'done').length;
}

// Actions
function openEmployeeModal() { document.getElementById('employee-modal').classList.remove('hidden'); }
function closeEmployeeModal() { document.getElementById('employee-modal').classList.add('hidden'); }
function openJobdeskModal() { document.getElementById('jobdesk-modal').classList.remove('hidden'); }
function closeJobdeskModal() { document.getElementById('jobdesk-modal').classList.add('hidden'); }

function saveEmployee(e) {
  e.preventDefault();
  const name = document.getElementById('emp-name').value;
  const role = document.getElementById('emp-role').value;
  const division = document.getElementById('emp-division').value;
  const avatar = document.getElementById('emp-avatar').value || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  employees.push({ id: Date.now(), name, role, division, avatar });
  saveData();
  closeEmployeeModal();
  renderEmployeesPage();
}

function deleteEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  saveData();
  renderEmployeesPage();
}

function saveJobdesk(e) {
  e.preventDefault();
  const title = document.getElementById('job-title').value;
  const assigneeId = document.getElementById('job-assignee').value;
  const priority = document.getElementById('job-priority').value;
  const status = document.getElementById('job-status').value;

  jobdesks.push({ id: Date.now(), title, assigneeId, priority, status });
  saveData();
  closeJobdeskModal();
  renderJobdeskPage();
}