// Initial Data
const initialState = [
    { id: 101, name: "Alice Johnson", status: 'present' },
    { id: 102, name: "Bob Smith", status: 'absent' },
    { id: 103, name: "Charlie Davis", status: 'pending' },
    { id: 104, name: "Diana Evans", status: 'present' },
];

// State
let students = JSON.parse(localStorage.getItem('attendance_students')) || initialState;

// DOM Elements
const studentListEl = document.getElementById('student-list');
const totalCountEl = document.getElementById('total-count');
const presentCountEl = document.getElementById('present-count');
const absentCountEl = document.getElementById('absent-count');
const attendanceRateEl = document.getElementById('attendance-rate');
const currentDateEl = document.getElementById('current-date');
const newStudentInput = document.getElementById('new-student-name');
const addStudentBtn = document.getElementById('add-student-btn');
const ringCircle = document.querySelector('.progress-ring__circle');
const ringText = document.getElementById('ring-text');

// Init
function init() {
    renderDate();
    renderStudents();
    updateStats();
}

function renderDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

function updateStats() {
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    
    // Update DOM
    totalCountEl.textContent = total;
    presentCountEl.textContent = present;
    absentCountEl.textContent = absent;
    
    const rate = total === 0 ? 0 : Math.round((present / total) * 100);
    attendanceRateEl.textContent = `${rate}%`;
    ringText.textContent = `${rate}%`;
    
    // Update Ring
    const radius = ringCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (rate / 100) * circumference;
    ringCircle.style.strokeDashoffset = offset;

    // Save to local storage
    localStorage.setItem('attendance_students', JSON.stringify(students));
}

function renderStudents() {
    studentListEl.innerHTML = '';
    
    if (students.length === 0) {
        studentListEl.innerHTML = `
            <div class="empty-state" style="text-align: center; color: var(--text-muted); padding: 40px;">
                <span class="material-icons-round" style="font-size: 48px; opacity: 0.5;">person_off</span>
                <p>No students added yet.</p>
            </div>
        `;
        return;
    }

    students.forEach(student => {
        const row = document.createElement('div');
        row.className = 'student-row';
        
        row.innerHTML = `
            <div class="name">${student.name}</div>
            <div class="id">ID #${student.id}</div>
            <div class="status-toggle">
                <button class="status-btn ${student.status === 'present' ? 'active present' : ''}" 
                        onclick="setStatus(${student.id}, 'present')">P</button>
                <button class="status-btn ${student.status === 'absent' ? 'active absent' : ''}" 
                        onclick="setStatus(${student.id}, 'absent')">A</button>
            </div>
            <button class="delete-btn" onclick="deleteStudent(${student.id})">
                <span class="material-icons-round">delete</span>
            </button>
        `;
        studentListEl.appendChild(row);
    });
}

// Actions
window.setStatus = (id, status) => {
    students = students.map(s => s.id === id ? { ...s, status } : s);
    renderStudents();
    updateStats();
}

window.deleteStudent = (id) => {
    students = students.filter(s => s.id !== id);
    renderStudents();
    updateStats();
}

window.markAllPresent = () => {
    students = students.map(s => ({ ...s, status: 'present' }));
    renderStudents();
    updateStats();
}

window.markAllAbsent = () => {
    students = students.map(s => ({ ...s, status: 'absent' }));
    renderStudents();
    updateStats();
}

document.getElementById('reset-day').addEventListener('click', () => {
    students = students.map(s => ({ ...s, status: 'pending' }));
    renderStudents();
    updateStats();
});

// Add Student
addStudentBtn.addEventListener('click', addStudent);
newStudentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStudent();
});

function addStudent() {
    const name = newStudentInput.value.trim();
    if (!name) return;
    
    const newStudent = {
        id: Math.floor(Math.random() * 9000) + 1000,
        name: name,
        status: 'present' // Default to present
    };
    
    students.unshift(newStudent);
    newStudentInput.value = '';
    renderStudents();
    updateStats();
}

// Start
init();
