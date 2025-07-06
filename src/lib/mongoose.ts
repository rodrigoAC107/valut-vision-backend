import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaultvision', {
            dbName: 'vaultvision',
        });

        console.log('✅ Conectado a MongoDB');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err);
        process.exit(1);
    }
};
