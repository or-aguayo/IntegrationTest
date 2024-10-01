// Reemplazar require con import
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

app.use(express.static('public')); // Sirviendo archivos estáticos
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html')); // Sirve el archivo principal (si usas uno)
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


