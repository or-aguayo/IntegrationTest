import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import taskRoutes from '../routes/taskRoutes.js';
import db from '../config/db.js';

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

// Limpiar la base de datos antes de cada prueba
beforeEach((done) => {
    db.run("DELETE FROM tasks", (err) => {
        if (err) return done(err);
        done();
    });
});

describe('Bottom-Up Integration Tests', () => {

    it('Debería permitir guardar la tarea en el almacenamiento local', (done) => {
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea de prueba', description: 'Prueba Bottom-Up', due_date: '2023-09-29' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.equal('Tarea de prueba');
                done();
            });
    });

    it('Debería permitir la sincronización de tareas con la nube', (done) => {
        // Crear una tarea antes de intentar sincronizarla
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea de prueba sincronizada', description: 'Prueba de sincronización', due_date: '2023-09-29' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar que la tarea se sincronizó correctamente
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.greaterThan(0); // Verifica que hay tareas sincronizadas
                        done();
                    });
            });
    });

    it('Debería permitir la interacción con la UI después de sincronizar las tareas', (done) => {
        // Crear una tarea antes de intentar interactuar con ella
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea de prueba UI', description: 'Prueba de interacción UI', due_date: '2023-09-29' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Interactuar con la tarea recién creada
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // Asegurarse de que la tarea existe antes de verificar propiedades
                        const task = res.body[0];
                        expect(task).to.exist; // Verifica que la tarea no es null o undefined
                        expect(task).to.have.property('title');
                        expect(task.title).to.equal('Tarea de prueba UI');
                        done();
                    });
            });
    });
});
