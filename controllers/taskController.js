import TaskModel from '../models/taskModel.js'; 

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.getAllTasks();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await TaskModel.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener la tarea' });
    }
};

export const createTask = async (req, res) => {
    try {
        const newTask = await TaskModel.createTask(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await TaskModel.updateTask(req.params.id, req.body);
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const success = await TaskModel.deleteTask(req.params.id);
        if (success) {
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
};
