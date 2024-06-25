let currentDraggedTask = null;

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function dragStart(ev) {
            currentDraggedTask = ev.target;
        }

        function drop(ev) {
            ev.preventDefault();
            if (currentDraggedTask && ev.target.classList.contains('task-list')) {
                ev.target.appendChild(currentDraggedTask);
                currentDraggedTask = null;
                updateLocalStorage();
            }
        }

        function openModal(columnId) {
            document.getElementById('columnId').value = columnId;
            document.getElementById('taskBar').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('taskBar').style.display = 'none';
        }

        function deleteTask(taskElement) {
            taskElement.remove();
            updateLocalStorage();
        }

        function updateLocalStorage() {
            const todoTasks = document.getElementById('todo').querySelector('.task-list').innerHTML;
            const inprogressTasks = document.getElementById('inprogress').querySelector('.task-list').innerHTML;
            const completeTasks = document.getElementById('complete').querySelector('.task-list').innerHTML;

            localStorage.setItem('todoTasks', todoTasks);
            localStorage.setItem('inprogressTasks', inprogressTasks);
            localStorage.setItem('completeTasks', completeTasks);
        }

        function loadTasksFromStorage() {
            const todoTasks = localStorage.getItem('todoTasks');
            const inprogressTasks = localStorage.getItem('inprogressTasks');
            const completeTasks = localStorage.getItem('completeTasks');

            document.getElementById('todo').querySelector('.task-list').innerHTML = todoTasks || '';
            document.getElementById('inprogress').querySelector('.task-list').innerHTML = inprogressTasks || '';
            document.getElementById('complete').querySelector('.task-list').innerHTML = completeTasks || '';

            document.querySelectorAll('.task').forEach(task => {
                task.draggable = true;
                task.addEventListener('dragstart', dragStart);
            });
        }

        document.getElementById('taskForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const columnId = document.getElementById('columnId').value;
            const taskName = document.getElementById('taskName').value;
            const taskDate = document.getElementById('taskDate').value;
            const taskDetails = document.getElementById('taskDetails').value;

            const task = document.createElement('div');
            task.className = 'task';
            task.draggable = true;
            task.addEventListener('dragstart', dragStart);
            task.innerHTML = `
                <strong>${taskName}</strong><br>
                ${taskDate}<br>
                <p>${taskDetails}</p>
                <button onclick="deleteTask(this.parentElement)">Delete</button>
            `;

            document.querySelector(`#${columnId} .task-list`).appendChild(task);
            updateLocalStorage();
            closeModal();
            document.getElementById('taskForm').reset();
        });

        document.querySelectorAll('.task-list').forEach(taskList => {
            taskList.addEventListener('dragover', allowDrop);
            taskList.addEventListener('drop', drop);
        });

        window.addEventListener('load', function () {
            loadTasksFromStorage();
        });