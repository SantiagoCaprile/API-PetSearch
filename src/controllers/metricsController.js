import { Metrics } from '../models/metrics.js';

export async function getMetrics(req, res) {
    try {
        // Obtener las métricas más recientes
        const metrics = await Metrics.find().limit(1);
        // Enviar las métricas al cliente
        res.json(metrics[0]);
    } catch (error) {
        console.error('Error getting metrics:', error);
        res.status(500).json({ error: 'Error getting metrics' });
    }
}