import { config } from 'dotenv';

import app from './app';

config(); // Carga variables de entorno

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
