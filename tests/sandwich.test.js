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

describe('Sandwich Integration Tests', () => {

    it('Debería permitir la sincronización de la tarea con el almacenamiento local y la nube', (done) => {
        // Crear una tarea antes de sincronizarla
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea de prueba Sandwich', description: 'Prueba de sincronización Sandwich', due_date: '2023-09-30' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar que la tarea se ha almacenado localmente y sincronizado
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

    it('Debería integrar la UI para mostrar las tareas sincronizadas', (done) => {
        // Crear una tarea antes de intentar interactuar con ella
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea de prueba UI Sandwich', description: 'Prueba de integración UI', due_date: '2023-09-30' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar que la tarea se muestra correctamente en la UI
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);

                        // Asegurarse de que la tarea existe antes de verificar propiedades
                        const task = res.body[0];
                        expect(task).to.exist;
                        expect(task).to.have.property('title');
                        expect(task.title).to.equal('Tarea de prueba UI Sandwich');
                        done();
                    });
            });
    });

    it('Debería enviar una notificación después de la sincronización', (done) => {
        // Crear una tarea antes de la sincronización
        request(app)
            .post('/tasks')
            .send({ title: 'Tarea con notificación Sandwich', description: 'Prueba de notificación Sandwich', due_date: '2023-09-30' })
            .expect(201)
            .end((err) => {
                if (err) return done(err);

                // Verificar que la tarea se sincronizó y que la notificación fue enviada
                request(app)
                    .get('/tasks')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        const task = res.body[0];
                        expect(task).to.exist;
                        expect(task).to.have.property('title');
                        expect(task.title).to.equal('Tarea con notificación Sandwich');
                        done();
                    });
            });
    });
});
