import express from 'express';
import { getAllTasks, createTask, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';  // Importación nombrada

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
