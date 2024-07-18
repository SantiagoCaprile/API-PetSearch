import { schedule } from 'node-cron';
import { Schema, model } from 'mongoose';
import Pet from './pet.js';

// Define el esquema y el modelo para Metrics
const metricsSchema = new Schema({
    speciesDistribution: Object,
    adoptionStatus: Object,
    sizeDistribution: Object,
    ageDistribution: Object,
    updatedAt: { type: Date, default: Date.now }
});

export const Metrics = model('Metrics', metricsSchema);


// Función para actualizar las métricas
export async function updateMetrics() {
    try {
        // Obtener la distribución de especies
        const speciesDistribution = await Pet.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$specie", count: { $sum: 1 } } }
        ]);

        // Obtener el estado de adopción
        const adoptionStatus = await Pet.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Obtener la distribución de tamaños
        const sizeDistribution = await Pet.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$size", count: { $sum: 1 } } }
        ]);

        // Crear un nuevo documento de métricas
        const newMetrics = new Metrics({
            speciesDistribution,
            adoptionStatus,
            sizeDistribution,
        });

        // Guardar el documento en la base de datos
        await newMetrics.save();
        console.log('Metrics updated successfully at', new Date().toLocaleString());
    } catch (error) {
        console.error('Error updating metrics:', error);
    }
}

// // Programar la tarea para que se ejecute todos los días a las 12 de la noche
// schedule('0 0 * * *', updateMetrics);