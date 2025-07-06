// EJEMPLO DE CORS OPTIONS
// import { CorsOptions } from 'cors';

// const allowedOrigins = [
//   'http://localhost:5173',       // Desarrollo local
//   'https://miapp-produccion.com' // Producción (ejemplo)
// ];

// export const corsOptions: CorsOptions = {
//   origin: (origin, callback) => {
//     // Permitir solicitudes sin origen (como Postman o curl)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Origen no permitido por CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// };
