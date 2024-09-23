import db from '../config/db.js';  // Ahora db está exportado por defecto

class TaskModel {
    static getAllTasks() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM tasks", [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static getTaskById(id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM tasks WHERE id = ?", [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static createTask(task) {
        return new Promise((resolve, reject) => {
            const { title, description, due_date } = task;
            db.run(
                "INSERT INTO tasks (title, description, due_date) VALUES (?, ?, ?)",
                [title, description, due_date],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, ...task });
                }
            );
        });
    }

    static updateTask(id, task) {
        return new Promise((resolve, reject) => {
            const { title, description, due_date, status } = task;
            db.run(
                "UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?",
                [title, description, due_date, status, id],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id, ...task });
                }
            );
        });
    }

    static deleteTask(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}

export default TaskModel;
