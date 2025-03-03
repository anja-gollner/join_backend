/**
 * @module TaskBoard
 */


/**
 * Holds the tasks data.
 * @type {Array<Object>}
 */
let tasks;


/**
 * Holds the contacts data.
 * @type {Array<Object>}
 */
let contacts;


/**
 * Currently dragged element reference.
 * @type {HTMLElement}
 */
let currentDraggedElement;


/**
 * Filtered search results for tasks.
 * @type {Array<Object>}
 */
let filteredSearchTasks = [];


/**
 * Initializes the task board on load by fetching tasks and contacts from the database.
 * @async
 * @function onloadFuncBoard
 */
async function onloadFuncBoard() {
    let tasksData = await loadFromDatabase('join/tasks');
    tasks = Object.entries(tasksData).map(([id, task]) => ({ id, ...task }));
    let contactsData = await loadFromDatabase('join/contacts');
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    renderTasksBoard();
}


/**
 * Renders tasks grouped by their progress status on the board.
 * @function renderTasksBoard
 */
function renderTasksBoard() {
    renderTasksByProgress('todo', 'ctn-tasks-todo', 'No tasks To do');
    renderTasksByProgress('in progress', 'ctn-tasks-in-progress', 'No tasks In Progress');
    renderTasksByProgress('await feedback', 'ctn-tasks-await-feedback', 'No tasks Awaiting Feedback');
    renderTasksByProgress('done', 'ctn-tasks-done', 'No tasks Done');
}


/**
 * Renders tasks based on their progress status into the specified container.
 * @param {string} progressStatus - The status of the tasks (e.g., 'todo', 'in progress', etc.).
 * @param {string} containerId - The ID of the container to render the tasks into.
 * @param {string} noTaskMessage - The message to display if there are no tasks.
 * @function renderTasksByProgress
 */
function renderTasksByProgress(progressStatus, containerId, noTaskMessage) {
    let containerRef = document.getElementById(containerId);
    let inputRef = document.getElementById('input-search-task');
    containerRef.innerHTML = "";
    let tasksToRender = (filteredSearchTasks.length > 0 || inputRef.value !== "") ? filteredSearchTasks : tasks;
    let filteredTasks = tasksToRender.filter(task => task.progress === progressStatus);
    if (filteredTasks.length === 0) {
        containerRef.innerHTML = getBoardNoTaskTemplate(noTaskMessage);
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            containerRef.innerHTML += getBoardTaskTemplate(filteredTasks[i]);
        }
    }
}


/**
 * Renders a progress bar for the specified subtasks.
 * @param {Array<Object>} subtasks - The subtasks of the task.
 * @returns {string} The HTML string for the progress bar.
 * @function renderTaskProgressBar
 */
function renderTaskProgressBar(subtasks) {
    if (!subtasks || subtasks.length === 0) {
        return '';
    } else {
        let totalSubtasks = subtasks.length;
        let completedSubtasks = subtasks.filter(subtask => subtask.completed == true).length;
        let progressBar = getTaskProgressBarTemplate(totalSubtasks, completedSubtasks);
        return progressBar;
    }
}


/**
 * Renders the assigned contacts for a task.
 * @param {Array<Object>|Object} assignedTo - The assigned contacts.
 * @returns {string} The HTML string of assigned contacts.
 * @function renderAssignedTo
 */
function renderAssignedTo(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return '';
    } else {
        return processAssignedToContacts(assignedToArray);
    }
}


/**
 * Processes the assigned contacts and generates their HTML representation.
 * @param {Array<Object>} assignedToArray - Array of assigned contacts.
 * @returns {string} The HTML string of assigned contacts.
 * @function processAssignedToContacts
 */
function processAssignedToContacts(assignedToArray) {
    let assignedToContent = '';
    for (let i = 0; i < assignedToArray.length; i++) {
        if (i > 4) {
            assignedToContent += getAssignedToTemplateAdditional(assignedToArray.length);
            break;
        }
        assignedToContent += getContactTemplate(assignedToArray[i]);
    }
    return assignedToContent;
}


/**
 * Generates the HTML template for a contact.
 * @param {Object} assignedToArrayContact - The contact data.
 * @returns {string} The HTML string of the contact.
 * @function getContactTemplate
 */
function getContactTemplate(assignedToArrayContact) {
    let contact = contacts.find(c => c.id == assignedToArrayContact);
    let initial = contact.initials;
    let color = contact.color;
    return getAssignedToTemplate(initial, color);
}


/**
 * Closes the task detail overlay.
 * @function closeDetailTaskOverlay
 */
function closeDetailTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardDetailRef = document.getElementById('overlay-board-detail');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardDetailRef.classList.add('slide-out');
    overlayBoardEditRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardDetailRef.classList.add('d-none');
        overlayBoardDetailRef.classList.remove('slide-out');
        overlayBoardEditRef.classList.add('d-none');
        overlayBoardEditRef.classList.remove('slide-out');
    }, 200);
}


/**
 * Shows the task detail overlay for a specific task.
 * @param {string} taskId - The ID of the task to display.
 * @function showDetailTaskOverlay
 */
function showDetailTaskOverlay(taskId) {
    document.body.style.overflow = 'hidden';
    let overlayBoardRef = document.getElementById('overlay-board-detail');
    overlayBoardRef.classList.remove('d-none');
    overlayBoardRef.classList.add('slide-in');
    setTimeout(() => {
        overlayBoardRef.classList.remove('slide-in');
    }, 200);
    overlayBoardRef.innerHTML = "";
    let task = tasks.find(t => t.id == taskId);
    overlayBoardRef.innerHTML = getTaskOverlayTemplate(task);
}


/**
 * Renders assigned contacts in the task detail overlay.
 * @param {Array<Object>|Object} assignedTo - The assigned contacts.
 * @returns {string} The HTML string of assigned contacts.
 * @function renderAssignedToOverlay
 */
function renderAssignedToOverlay(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return 'No contact in Assign To';
    } else {
        return processAssignedToOverlay(assignedToArray);
    }
}


/**
 * Processes assigned contacts for the overlay and generates their HTML representation.
 * @param {Array<Object>} assignedToArray - Array of assigned contacts.
 * @returns {string} The HTML string of assigned contacts.
 * @function processAssignedToOverlay
 */
function processAssignedToOverlay(assignedToArray) {
    let assignedToContent = '';
    for (let i = 0; i < assignedToArray.length; i++) {
        assignedToContent += getContactOverlayTemplate(assignedToArray[i]);
    }
    return assignedToContent;
}


/**
 * Generates the HTML template for a contact in the overlay.
 * @param {Object} assignedToArrayContact - The contact data.
 * @returns {string} The HTML string of the contact.
 * @function getContactOverlayTemplate
 */
function getContactOverlayTemplate(assignedToArrayContact) {
    let contact = contacts.find(c => c.id == assignedToArrayContact);
    let initial = contact.initials;
    let color = contact.color;
    let name = contact.name;
    return getAssignedToTemplateOverlay(initial, color, name);
}


/**
 * Renders the subtasks in the task detail overlay.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The HTML string of subtasks or a message if none exist.
 * @function renderSubtasksOverlay
 */
function renderSubtasksOverlay(task) {
    let subtasksArray = task.subtasks;
    if (!subtasksArray || subtasksArray.length === 0 || subtasksArray === "") {
        return 'No subtasks in this task!';
    } else {
        let ctnSubtasks = "";
        for (let indexSubTask = 0; indexSubTask < subtasksArray.length; indexSubTask++) {
            ctnSubtasks += getSubtasksOverlayTemplate(indexSubTask, task);
        }
        return ctnSubtasks;
    }
}


/**
 * Updates the completion status of a subtask.
 * @async
 * @param {number} indexSubTask - The index of the subtask to update.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @function updateSubtaskStatus
 */
async function updateSubtaskStatus(indexSubTask, taskId) {
    let task = tasks.find(t => t.id == taskId);
    let subtasksArray = task.subtasks;
    subtasksArray[indexSubTask].completed = !subtasksArray[indexSubTask].completed;
    await updateOnDatabase(`join/subtasks/${subtasksArray[indexSubTask].id}`, subtasksArray[indexSubTask]);
    renderTasksBoard();
}


/**
 * Deletes a task by its ID.
 * @async
 * @param {string} taskId - The ID of the task to delete.
 * @function deleteTask
 */
async function deleteTask(taskId) {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser === 'Guest') {
        showPopup('You do not have permission to delete this task!');
        return;
    }
    await deleteFromDatabase(`join/tasks/${taskId}`);
    closeDetailTaskOverlay()
    onloadFuncBoard();
}


/**
 * Filters tasks based on the input search term.
 * @function filterTasksBoard
 */
function filterTasksBoard() {
    filteredSearchTasks = [];
    let inputRef = document.getElementById('input-search-task');
    let input = inputRef.value.toLowerCase();
    for (let i = 0; i < tasks.length; i++) {
        let taskTitle = tasks[i].title.toLowerCase();
        let taskDescription = tasks[i].description.toLowerCase();
        if (taskTitle.includes(input) || taskDescription.includes(input)) {
            filteredSearchTasks.push(tasks[i]);
        }
    }
    renderTasksBoard();
}


/**
 * Displays the "Add Task" overlay and sets the progress status in local storage.
 * @param {number} progress - The progress status to be saved.
 * @function showAddTaskOverlay
 * @returns {void}
 */
function showAddTaskOverlay(progress) {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser === 'Guest') {
        showPopup('You do not have permission to add this task!');
        return;
    }
    localStorage.setItem('progressStatus', progress);
    document.body.style.overflow = 'hidden';
    let overlayBoardAddTaskRef = document.getElementById('overlay-board-add-task');
    let iframeRef = document.getElementById('addTaskIframe');
    if (overlayBoardAddTaskRef && iframeRef) {
        overlayBoardAddTaskRef.classList.remove('slide-out', 'd-none');
        overlayBoardAddTaskRef.classList.add('slide-in');
        iframeRef.classList.add('slide-in');
    }
}


/**
 * Closes the "Add Task" overlay, resets the progress status, and applies slide-out animation.
 * @function closeAddTaskOverlay
 * @returns {void}
 */
function closeAddTaskOverlay() {
    document.body.style.overflow = '';
    localStorage.removeItem('progressStatus');
    let overlayBoardAddTaskRef = document.getElementById('overlay-board-add-task');
    let iframeRef = document.getElementById('addTaskIframe');
    if (overlayBoardAddTaskRef && iframeRef) {
        overlayBoardAddTaskRef.classList.remove('slide-in');
        overlayBoardAddTaskRef.classList.add('slide-out');
        iframeRef.classList.add('slide-out');
        hideOverlay(overlayBoardAddTaskRef, iframeRef);
    }
}


/**
 * Hides the overlay after a delay and resets the iframe source.
 * @param {HTMLElement} overlayBoardAddTaskRef - The overlay element.
 * @param {HTMLElement} iframeRef - The iframe element.
 * @function hideOverlay
 * @returns {void}
 */
function hideOverlay(overlayBoardAddTaskRef, iframeRef) {
    setTimeout(() => {
        overlayBoardAddTaskRef.classList.add('d-none');
        overlayBoardAddTaskRef.classList.remove('slide-out');
        iframeRef.classList.remove('slide-out');
        const iframe = document.getElementById('addTaskIframe');
        if (iframe) {
            iframe.src = 'addTaskBoard.html';
        }
    }, 200);
    onloadFuncBoard();
}


/**
 * Listens for messages from the parent window to close the overlay.
 * @function
 */
window.addEventListener("message", (event) => {
    if (event.data === "closeAddTaskOverlay") {
        closeAddTaskOverlay();
    }
});


