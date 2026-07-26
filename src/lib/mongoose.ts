import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getMongoCandidates = () => {
    const candidates = [
        process.env.MONGO_URI,
        'mongodb://mongodb:27017',
        'mongodb://localhost:27017',
    ].filter(Boolean) as string[];

    return [...new Set(candidates)];
};

export const connectToMongo = async () => {
    const dbName = process.env.MONGO_DBNAME || 'vaultvision';
    const mongoUris = getMongoCandidates();

    for (const mongoUri of mongoUris) {
        try {
            await mongoose.connect(mongoUri, { dbName });
            console.log(`✅ Conectado a MongoDB (${mongoUri})`);
            return;
        } catch (err) {
            console.error(`❌ No se pudo conectar a MongoDB con ${mongoUri}:`, err);
        }
    }

    process.exit(1);
};
