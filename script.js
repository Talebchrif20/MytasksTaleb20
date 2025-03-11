// Select DOM elements
const taskInput = document.getElementById('taskInput');
const endDateInput = document.getElementById('endDateInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const saveScheduleBtn = document.getElementById('saveScheduleBtn');
const timetable = document.getElementById('timetable');

// Function to save tasks to local storage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach((li) => {
    const taskName = li.querySelector('.task-name').textContent;
    const dueDate = li.querySelector('.due-date').textContent.replace('Due: ', '');
    const priority = li.dataset.priority;
    const isCompleted = li.classList.contains('completed');
    const notes = li.querySelector('.notes').textContent.replace('Notes: ', '');

    tasks.push({ taskName, dueDate, priority, isCompleted, notes });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  savedTasks.forEach((task) => {
    const li = document.createElement('li');
    li.dataset.priority = task.priority;

    // Task header (checkbox, task name, delete button)
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('task-header');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.isCompleted;
    if (task.isCompleted) li.classList.add('completed');

    const taskName = document.createElement('span');
    taskName.textContent = task.taskName;
    taskName.classList.add('task-name');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      taskList.removeChild(li);
      saveTasks();
    });

    taskHeader.appendChild(checkbox);
    taskHeader.appendChild(taskName);
    taskHeader.appendChild(deleteBtn);

    // Due date
    const dueDate = document.createElement('div');
    dueDate.textContent = `Due: ${task.dueDate}`;
    dueDate.classList.add('due-date');

    // Notes
    const notes = document.createElement('div');
    notes.textContent = `Notes: ${task.notes}`;
    notes.classList.add('notes');

    // Append all elements to the list item
    li.appendChild(taskHeader);
    li.appendChild(dueDate);
    li.appendChild(notes);

    // Add priority class for styling
    li.classList.add(`priority-${task.priority}`);

    // Append the list item to the task list
    taskList.appendChild(li);

    // Add event listener for checkbox
    checkbox.addEventListener('change', () => {
      li.classList.toggle('completed');
      saveTasks();
    });
  });
}

// Function to save schedule to local storage
function saveSchedule() {
  const workDays = Array.from(document.querySelectorAll('.schedule-container .day-options:nth-of-type(1) input:checked'))
    .map((checkbox) => checkbox.value);
  const studyDays = Array.from(document.querySelectorAll('.schedule-container .day-options:nth-of-type(2) input:checked'))
    .map((checkbox) => checkbox.value);
  const restDays = Array.from(document.querySelectorAll('.schedule-container .day-options:nth-of-type(3) input:checked'))
    .map((checkbox) => checkbox.value);

  const schedule = { workDays, studyDays, restDays };
  localStorage.setItem('schedule', JSON.stringify(schedule));

  // Update the timetable
  updateTimetable(workDays, studyDays, restDays);

  alert('Schedule saved successfully!');
}

// Function to load schedule from local storage
function loadSchedule() {
  const savedSchedule = JSON.parse(localStorage.getItem('schedule')) || {};

  // Populate checkboxes
  savedSchedule.workDays?.forEach((day) => {
    document.querySelector(`.schedule-container .day-options:nth-of-type(1) input[value="${day}"]`).checked = true;
  });
  savedSchedule.studyDays?.forEach((day) => {
    document.querySelector(`.schedule-container .day-options:nth-of-type(2) input[value="${day}"]`).checked = true;
  });
  savedSchedule.restDays?.forEach((day) => {
    document.querySelector(`.schedule-container .day-options:nth-of-type(3) input[value="${day}"]`).checked = true;
  });

  // Update the timetable
  updateTimetable(savedSchedule.workDays, savedSchedule.studyDays, savedSchedule.restDays);
}

// Function to update the timetable
function updateTimetable(workDays, studyDays, restDays) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const rows = timetable.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    const day = row.querySelector('td').textContent;

    // Clear existing data
    row.querySelectorAll('td').forEach((cell, index) => {
      if (index > 0) cell.textContent = '';
    });

    // Populate timetable
    if (workDays.includes(day)) row.children[1].textContent = '✔️';
    if (studyDays.includes(day)) row.children[2].textContent = '✔️';
    if (restDays.includes(day)) row.children[3].textContent = '✔️';
  });
}

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  const endDate = endDateInput.value;
  const priority = priorityInput.value;

  if (taskText === '' || endDate === '') {
    alert('Please enter a task and select an end date!');
    return;
  }

  // Create a new list item
  const li = document.createElement('li');
  li.dataset.priority = priority;

  // Task header (checkbox, task name, delete button)
  const taskHeader = document.createElement('div');
  taskHeader.classList.add('task-header');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const taskName = document.createElement('span');
  taskName.textContent = taskText;
  taskName.classList.add('task-name');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(li);
    saveTasks();
  });

  taskHeader.appendChild(checkbox);
  taskHeader.appendChild(taskName);
  taskHeader.appendChild(deleteBtn);

  // Due date
  const dueDate = document.createElement('div');
  dueDate.textContent = `Due: ${endDate}`;
  dueDate.classList.add('due-date');

  // Notes
  const notes = document.createElement('div');
  notes.textContent = 'Notes: None';
  notes.classList.add('notes');

  // Append all elements to the list item
  li.appendChild(taskHeader);
  li.appendChild(dueDate);
  li.appendChild(notes);

  // Add priority class for styling
  li.classList.add(`priority-${priority}`);

  // Append the list item to the task list
  taskList.appendChild(li);

  // Add event listener for checkbox
  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed');
    saveTasks();
  });

  // Clear the input fields
  taskInput.value = '';
  endDateInput.value = '';
  priorityInput.value = 'low';

  // Save tasks to local storage
  saveTasks();
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

saveScheduleBtn.addEventListener('click', saveSchedule);

// Load tasks and schedule on page load
window.addEventListener('load', () => {
  loadTasks();
  loadSchedule();
});