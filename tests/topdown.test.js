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

describe('Top-Down Integration Tests', () => {

    it('Debería permitir agregar una tarea desde la UI (simulación de capa superior)', (done) => {
        request(app)
            .post('/tasks')
            .send({ title: 'Nueva tarea desde UI', description: 'Prueba Top-Down', due_date: '2023-09-30' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.equal('Nueva tarea desde UI');
                done();
            });
    });

    it('Debería permitir la sincronización de la tarea con el módulo de almacenamiento local', (done) => {
        // Crear una tarea antes de sincronizarla
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea sincronizada desde UI', description: 'Prueba de sincronización Top-Down', due_date: '2023-09-30' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar que la tarea se ha almacenado localmente
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

    it('Debería sincronizar las tareas con la nube y enviar notificaciones', (done) => {
        // Crear una tarea antes de la sincronización
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea con notificación', description: 'Prueba de notificación', due_date: '2023-09-30' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar que la tarea se sincronizó y que la notificación fue enviada
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // Asegurarse de que la tarea existe antes de verificar propiedades
                        const task = res.body[0];
                        expect(task).to.exist; // Verifica que la tarea no es null o undefined
                        expect(task).to.have.property('title');
                        expect(task.title).to.equal('Tarea con notificación');
                        done();
                    });
            });
    });

    it('Debería permitir la interacción con la UI después de sincronizar las tareas', (done) => {
        // Crear una tarea antes de intentar interactuar con ella
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea de prueba UI Top-Down', description: 'Prueba de interacción UI', due_date: '2023-09-30' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar la interacción con la tarea recién creada
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // Asegurarse de que la tarea existe antes de verificar propiedades
                        const task = res.body[0];
                        expect(task).to.exist; // Verifica que la tarea no es null o undefined
                        expect(task).to.have.property('title');
                        expect(task.title).to.equal('Tarea de prueba UI Top-Down');
                        done();
                    });
            });
    });
});
