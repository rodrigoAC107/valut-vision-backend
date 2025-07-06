# 📁 Estructura Base para Dashboard de Gastos en Vue 3

## 🧱 Estructura de Directorios

```plaintext
src/
├── config/                  # Configuraciones generales (env, DB, etc.)
│   ├── env.ts
│   └── database.ts
├── modules/                # Módulos de negocio (como components/views en Vue)
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.model.ts
│   │   └── user.routes.ts
│   ├── expense/
│   │   ├── expense.controller.ts
│   │   ├── expense.service.ts
│   │   ├── expense.model.ts
│   │   └── expense.routes.ts
├── middlewares/            # Middlewares personalizados (auth, logs, etc.)
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── utils/                  # Funciones utilitarias generales
│   ├── logger.ts
│   └── formatter.ts
├── types/                  # Tipos globales y personalizados
│   └── index.d.ts
├── routes/                 # Rutas principales (usa los de cada módulo)
│   └── index.ts
├── app.ts                  # Configuración principal de la app (Express)
└── server.ts               # Punto de entrada: levanta el server
```

---

## 🧠 Recomendaciones Iniciales

## Podemos sumar:

- Express para una API REST rápida. (INSTALADO Y CONFIGURADO)
- Eslint + Prettier para mantener el código limpio. (INSTALADO Y CONFIGURADO)
- RECOMENDACION: Siempre corré npm run lint:fix antes de hacer commits. Podés incluso automatizarlo con Husky y Lint-Staged más adelante si te interesa.
- Dotenv para variables de entorno. (INSTALADO Y CONFIGURADO)
- Prisma y postgreSQL si vas a usar una DB.
- Tests con Jest. (INSTALAR AL FINAL DE DESARROLLO PARA TEST)

## Extras para un setup pro

- Dotenv: npm i dotenv para variables de entorno.
- Zod o Joi: para validaciones.
- Winston o Pino: para logging serio.
- Jest o Vitest: para tests unitarios.
- Swagger: para documentar tu API.
