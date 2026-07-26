"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const app_1 = __importDefault(require("./app"));
(0, dotenv_1.config)(); // Carga variables de entorno
const PORT = Number(process.env.PORT) || 3000;
app_1.default.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
