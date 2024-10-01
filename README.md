# Proyecto de Pruebas de Humo e Integración - Tareas API

Este proyecto implementa **pruebas de humo e integración** para una API de gestión de tareas. Las pruebas de humo permiten validar rápidamente la estabilidad del sistema y verificar las funciones críticas, mientras que las pruebas de integración verifican cómo interactúan los diferentes módulos del sistema.

## Pruebas de humo
Las pruebas de humo son un conjunto básico de pruebas automatizadas que verifican si las funciones críticas de la API están operativas. Son rápidas y superficiales, y su objetivo es confirmar que el sistema es lo suficientemente estable para realizar pruebas más exhaustivas.

### Implementación de Pruebas de Humo con Cypress
Cypress se utilizó para automatizar las pruebas de humo en este proyecto. Las pruebas de humo se centran en los endpoints más importantes de la API *(/tasks)*, y verifican las operaciones básicas como la creación, obtención, actualización y eliminación de tareas.


#### **Código Ejemplo:**
```javascript
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

```

### Características de las pruebas de humo
1- Alcance: Superficial. Verifican que los endpoints básicos de la API están operativos.
2- Velocidad: Rápida. Su objetivo es identificar errores críticos rápidamente.
3- Frecuencia de Ejecución: Al inicio de una nueva compilación o después de cambios significativos.
4- Herramienta: Cypress permite realizar solicitudes HTTP a los endpoints de la API y validar las respuestas.