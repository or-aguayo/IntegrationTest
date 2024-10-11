# Proyecto de Pruebas de Humo, Integración y de regresión - Tareas API

Este proyecto implementa **pruebas de humo, integración y regresión** para una API de gestión de tareas. Las pruebas de regresión aseguran que los cambios recientes no impacten negativamente el sistema.

## Pruebas de regresión
En este proyecto, se han implementado pruebas de regresión progresivas, enfocadas en validar el comportamiento de los módulos afectados por los cambios recientes. Las pruebas permiten identificar si las funcionalidades clave continúan funcionando correctamente después de realizar actualizaciones.

### Pruebas de regresión progresivas

Este tipo de pruebas se realizan de manera continua y progresiva, conforme se agregan nuevas funcionalidades o correcciones de errores. Se verifican primero las partes más críticas del sistema, asegurando que los módulos afectados por los cambios se comporten correctamente sin ejecutar todas las pruebas.



### Implementación de Pruebas de Regresión con Selenium
Selenium se utilizó para automatizar las pruebas de regresión en la interfaz de usuario de la aplicación. Estas pruebas incluyen operaciones como la creación, edición y eliminación de tareas, validando que el sistema siga comportándose de manera adecuada después de las modificaciones.

#### **Código Ejemplo:**
```javascript
import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Pruebas de Regresión con Selenium - Gestión de Tareas', function() {
    let driver;

    // Configuración inicial
    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Cerrar el navegador después de las pruebas
    after(async () => {
        await driver.quit();
    });

    // Prueba de creación de tarea
    it('Debería permitir la creación de una tarea desde la UI', async () => {
        await driver.get('http://localhost:3000');
        await driver.wait(until.elementLocated(By.id('add-task-btn')), 15000);
        await driver.findElement(By.id('add-task-btn')).click();
        await driver.findElement(By.id('task-title')).sendKeys('Tarea de Regresión Selenium');
        await driver.findElement(By.id('task-desc')).sendKeys('Descripción de la tarea para prueba de regresión');
        await driver.findElement(By.id('task-date')).sendKeys('2023-12-31');
        await driver.findElement(By.id('submit-task-btn')).click();
        await driver.get('http://localhost:3000');
        const taskElement = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Tarea de Regresión Selenium')]")), 10000);
        expect(await taskElement.getText()).to.include('Tarea de Regresión Selenium');
    });

    // Prueba de edición de tarea
    it('Debería permitir la edición de una tarea', async () => {
        await driver.get('http://localhost:3000');
        const editButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'edit-task-btn')]")), 15000);
        await editButton.click();
        const titleField = await driver.findElement(By.id('task-title'));
        await titleField.clear();
        await titleField.sendKeys('Tarea Editada Selenium');
        await driver.findElement(By.id('submit-task-btn')).click();
        await driver.get('http://localhost:3000');
        const updatedTask = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Tarea Editada Selenium')]")), 15000);
        expect(await updatedTask.getText()).to.include('Tarea Editada Selenium');
    });

    // Prueba de eliminación de tarea
    it('Debería permitir la eliminación de una tarea', async () => {
        await driver.get('http://localhost:3000');
        const deleteButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'delete-task-btn')]")), 15000);
        await deleteButton.click();
        const taskList = await driver.findElements(By.css('.task-item'));
        expect(taskList.length).to.be.equal(0);
    });
});


```

### Características de las pruebas de regresión
1- Objetivo: Asegurar que las funcionalidades previas continúan operativas después de realizar modificaciones.

2- Cobertura: Dependiendo del tipo de regresión, puede variar desde pruebas parciales hasta la ejecución de todo el conjunto de pruebas.

3- Frecuencia de Ejecución: Se ejecutan regularmente, después de cada cambio significativo o actualización en el sistema.

4- Herramienta: Selenium se utiliza para automatizar las pruebas de la interfaz de usuario, garantizando que la interacción con la aplicación funcione correctamente después de los cambios.