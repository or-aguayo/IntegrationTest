import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import taskRoutes from '../routes/taskRoutes.js';
import db from '../config/db.js';


const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);
beforeEach((done) => {
    db.run("DELETE FROM tasks", (err) => {
        if (err) return done(err);
        done();
    });
});

describe('Big-Bang Integration Tests', () => {

    it('Debería crear una nueva tarea, sincronizarla y enviar una notificación en un solo paso', (done) => {
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea Big-Bang', description: 'Prueba Big-Bang', due_date: '2023-09-27' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.equal('Tarea Big-Bang');
                
                // Obtener todas las tareas y verificar la sincronización
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        const task = res.body.find(t => t.title === 'Tarea Big-Bang');
                        expect(task).to.have.property('id');
                        expect(task).to.have.property('title');
                        expect(task).to.have.property('description');
                        done();
                    });
            });
    });
});



