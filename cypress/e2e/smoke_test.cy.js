const baseUrl = 'http://localhost:3000';

describe('Pruebas de Humo para la API de Tareas', () => {

    // Prueba para obtener las tareas almacenadas en el sistema
    it('Debería mostrar las tareas almacenadas en el sistema', () => {
        cy.request(`${baseUrl}/tasks`)
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.be.greaterThan(0);
            });
    });

    // Prueba para crear una nueva tarea
    it('Debería permitir la creación de una nueva tarea', () => {
        cy.request('POST', `${baseUrl}/tasks`, {
            title: 'Tarea de Prueba',
            description: 'Descripción de la tarea de prueba',
            due_date: '2024-12-31'
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.title).to.eq('Tarea de Prueba');
        });
    });

    // Prueba para obtener una tarea por ID
    it('Debería permitir obtener una tarea por su ID', () => {
        cy.request(`${baseUrl}/tasks`)
            .then((response) => {
                const taskId = response.body[0].id;
                cy.request(`${baseUrl}/tasks/${taskId}`)
                    .then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property('id', taskId);
                    });
            });
    });

    // Prueba para actualizar una tarea existente
    it('Debería permitir la actualización de una tarea existente', () => {
        cy.request(`${baseUrl}/tasks`)
            .then((response) => {
                const taskId = response.body[0].id;
                cy.request('PUT', `${baseUrl}/tasks/${taskId}`, {
                    title: 'Tarea Actualizada',
                    description: 'Descripción actualizada',
                    due_date: '2024-12-31'
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('title', 'Tarea Actualizada');
                });
            });
    });

    // Prueba para eliminar una tarea
    it('Debería permitir la eliminación de una tarea', () => {
        cy.request(`${baseUrl}/tasks`)
            .then((response) => {
                const taskId = response.body[0].id;
                cy.request('DELETE', `${baseUrl}/tasks/${taskId}`)
                    .then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property('message', 'Tarea eliminada');
                    });
            });
    });
});
