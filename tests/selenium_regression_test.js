import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Pruebas de Regresión con Selenium - Gestión de Tareas', function() {
    let driver;

    // Configura el tiempo de espera para cada prueba
    this.timeout(40000);

    // Configuración inicial: iniciar el navegador antes de cada prueba
    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Cerrar el navegador después de las pruebas
    after(async () => {
        await driver.quit();
    });

    it('Debería permitir la creación de una tarea desde la UI', async () => {
        try {
            // Navega a la URL del formulario de creación de tareas
            await driver.get('http://localhost:3000/form.html');
    
            // Completar el formulario de nueva tarea
            await driver.findElement(By.id('task-title')).sendKeys('Tarea de Regresión Selenium');
            await driver.findElement(By.id('task-desc')).sendKeys('Descripción de la tarea para prueba de regresión');
            await driver.findElement(By.id('task-date')).sendKeys('2023-12-31');
    
            // Enviar el formulario
            await driver.findElement(By.id('submit-task-btn')).click();
    
            // Esperar a que se cargue la página principal (index.html)
            await driver.wait(until.urlIs('http://localhost:3000/index.html'), 10000);
    
            // Esperar unos segundos para que las tareas se sincronicen
            await driver.sleep(2000);
    
            // Verificar que la nueva tarea ha sido añadida a la lista de tareas
            const taskElement = await driver.wait(until.elementLocated(By.xpath("//li[contains(., 'Tarea de Regresión Selenium')]")), 10000);
            expect(await taskElement.getText()).to.include('Tarea de Regresión Selenium');
        } catch (err) {
            console.error('Error en la prueba de creación de tarea: ', err);
            throw err;
        }
    });
    
    it('Debería permitir la edición de una tarea', async () => {
        try {
            // Esperar a que la tarea esté disponible para editar
            const editButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'edit-task-btn')]")), 15000);
            await editButton.click();
    
            // Cambiar el título, descripción y fecha de la tarea
            const titleField = await driver.findElement(By.id('task-title'));
            const descField = await driver.findElement(By.id('task-desc'));
            const dateField = await driver.findElement(By.id('task-date'));
            await titleField.clear();
            await titleField.sendKeys('Tarea Editada Selenium');
            await descField.clear();
            await descField.sendKeys('Descripción Editada Selenium');
            await dateField.clear();
            await dateField.sendKeys('2024-10-11');
    
            // Guardar los cambios
            await driver.findElement(By.id('submit-task-btn')).click();
    
            // Recargar la página para asegurarse de que la lista de tareas se actualice
            await driver.get('http://localhost:3000'); // Recargar para mostrar la lista actualizada
            await driver.sleep(3000); // Agregar un retraso para asegurar que los cambios se reflejan
    
            // Verificar que los cambios fueron guardados
            const updatedTask = await driver.wait(until.elementLocated(By.xpath("//li[contains(., 'Tarea Editada Selenium')]")), 15000);
            expect(await updatedTask.getText()).to.include('Tarea Editada Selenium');
        } catch (err) {
            console.error('Error en la prueba de edición de tarea: ', err);
            throw err;
        }
    });
    
    
    

    it('Debería permitir la eliminación de una tarea', async () => {
        try {
            // Cargar la página principal
            await driver.get('http://localhost:3000');
    
            // Clic en el botón de eliminar la tarea
            const deleteButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'delete-task-btn')]")), 15000);
            await deleteButton.click();
    
            // Esperar unos segundos para procesar la eliminación
            await driver.sleep(2000);
    
            // Confirmar que la tarea fue eliminada
            const taskList = await driver.findElements(By.css('.task-item'));
            expect(taskList.length).to.be.equal(0); // Verifica que ya no hay tareas
        } catch (err) {
            console.error('Error en la prueba de eliminación de tarea: ', err);
            throw err;
        }
    });
    
});
