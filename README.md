# Proyecto de Pruebas de Integración - Tareas API

Este proyecto implementa diferentes tipos de **pruebas de integración** para una API de gestión de tareas, utilizando enfoques **Bottom-Up**, **Top-Down**, **Sandwich**, y **Big-Bang**. Las pruebas verifican la interacción entre múltiples módulos del sistema, como el almacenamiento local, la sincronización con la nube, la UI, y el envío de notificaciones.

## Tipos de Pruebas de Integración

### 1. **Bottom-Up Integration Tests**
En las pruebas **Bottom-Up**, comenzamos probando primero los **módulos inferiores** (por ejemplo, el almacenamiento local y la sincronización con la base de datos) antes de integrar y probar los **módulos superiores** como la UI.

#### **Estructura del flujo:**
1. Primero, se prueba que la tarea se almacene en la base de datos.
2. Luego, se verifica que las tareas se sincronizan correctamente.
3. Finalmente, se prueba la interacción con la UI.

#### **Características:**
- Estas pruebas aseguran que la funcionalidad básica del sistema esté correcta antes de agregar componentes más complejos.

#### **Código Ejemplo:**
```javascript
it('Debería permitir guardar la tarea en el almacenamiento local', ...)
it('Debería permitir la sincronización de tareas con la nube', ...)
it('Debería permitir la interacción con la UI después de sincronizar las tareas', ...)
```

### 2. **Top-Down Integration Tests**
En las pruebas **Top-Down**, comenzamos desde los **módulos superiores**, como la UI, y luego probamos cómo interactúan con los **módulos inferiores** (almacenamiento local y sincronización).

#### **Estructura del flujo:**
1. Primero, se prueba la funcionalidad de la UI.
2. Luego, se prueba cómo las tareas se sincronizan con la base de datos y la nube.
3. Finalmente, se verifica si la notificación se envía correctamente.

#### **Características:**
- Este enfoque permite detectar problemas en las capas superiores del sistema antes de probar los módulos más bajos.

#### **Código Ejemplo:**
```javascript
it('Debería permitir agregar una tarea desde la UI (simulación de capa superior)', ...)
it('Debería permitir la sincronización de la tarea con el módulo de almacenamiento local', ...)
it('Debería sincronizar las tareas con la nube y enviar notificaciones', ...)
```
### 3. **Sandwich Integration Tests**
El enfoque **Sandwich** combina los enfoques **Bottom-Up** y **Top-Down**. Se prueban simultáneamente los **módulos superiores** (como la UI) y los **módulos inferiores** (como el almacenamiento local y la sincronización).

#### **Estructura del flujo:**
1. Se prueban ambos extremos: la sincronización con el almacenamiento local y la nube.
2. Luego, se prueba la interacción con la UI.
3. Finalmente, se verifica si las notificaciones se envían correctamente.

#### **Características:**
- Combina la robustez del enfoque **Bottom-Up** con la cobertura de los módulos superiores del **Top-Down**.

#### **Código Ejemplo:**
```javascript
it('Debería permitir la sincronización de la tarea con el almacenamiento local y la nube', ...)
it('Debería integrar la UI para mostrar las tareas sincronizadas', ...)
it('Debería enviar una notificación después de la sincronización', ...)
```
### 4. **Big-Bang Integration Tests**
En las pruebas **Big-Bang**, todos los módulos se integran y se prueban juntos al mismo tiempo sin hacer pruebas incrementales previas.

#### **Estructura del flujo:**
1. Se crea una tarea y luego se prueba la sincronización, la interacción con la UI y las notificaciones en un solo paso.

#### **Características:**
- Este enfoque no sigue un orden incremental, sino que prueba todo de una vez, lo que puede ser útil cuando el sistema ya está completamente integrado.

#### **Código Ejemplo:**
```javascript
it('Debería crear una nueva tarea, sincronizarla y enviar una notificación en un solo paso', ...)
```
### ¿Cómo sabemos que son pruebas de integración?

- **Múltiples módulos interactuando**: En cada una de estas pruebas se están probando múltiples módulos del sistema (almacenamiento local, sincronización, UI, notificaciones) y cómo interactúan entre sí.

- **Validación de la comunicación entre componentes**: Las pruebas validan que los datos se transfieren correctamente entre los diferentes módulos del sistema, asegurando que las operaciones completas de la API funcionan como se espera.

- **Flujo completo del sistema**: Cada prueba cubre el flujo completo desde la creación de una tarea hasta su sincronización y la verificación de que los resultados finales (notificación, almacenamiento, etc.) sean correctos.
