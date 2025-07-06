import { config } from 'dotenv';

import app from './app';

config(); // Carga variables de entorno

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
