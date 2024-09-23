let tasks = [];

exports.getAllTasks = () => tasks;

exports.createTask = (task) => {
    const newTask = { id: tasks.length + 1, ...task };
    tasks.push(newTask);
    return newTask;
};

exports.getTaskById = (id) => tasks.find(task => task.id === parseInt(id));

exports.updateTask = (id, updatedTask) => {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    tasks[taskIndex] = { id: parseInt(id), ...updatedTask };
    return tasks[taskIndex];
};

exports.deleteTask = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return true;
    }
    return false;
};
