"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getMongoCandidates = () => {
    const candidates = [
        process.env.MONGO_URI,
        'mongodb://mongodb:27017',
        'mongodb://localhost:27017',
    ].filter(Boolean);
    return [...new Set(candidates)];
};
const connectToMongo = async () => {
    const dbName = process.env.MONGO_DBNAME || 'vaultvision';
    const mongoUris = getMongoCandidates();
    for (const mongoUri of mongoUris) {
        try {
            await mongoose_1.default.connect(mongoUri, { dbName });
            console.log(`✅ Conectado a MongoDB (${mongoUri})`);
            return;
        }
        catch (err) {
            console.error(`❌ No se pudo conectar a MongoDB con ${mongoUri}:`, err);
        }
    }
    process.exit(1);
};
exports.connectToMongo = connectToMongo;
