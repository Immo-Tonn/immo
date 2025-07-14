import express, { Application, Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDb from './config/db';
import './models'; // models/index.ts
import authRoutes from './routes/authRoutes';
import realEstateRoutes from './routes/realEstateObjectsRoutes';
import imagesRoutes from './routes/imagesRoutes';
import apartmentRoutes from './routes/apartmentsRoutes';
import commercial_NonResidentialBuildingsRoutes from './routes/commercial_NonResidentialBuildingsRoutes';
import landPlotRoutes from './routes/landPlotsRoutes';
import residentialHousesRoutes from './routes/residentialHousesRoutes';
import emailRoutes from './routes/emailRoutes';
import videosRoutes from './routes/videosRoutes';
import {
  errorLogger,
  errorHandler,
  setupUncaughtErrorHandlers,
} from './middleware/errorMiddleware';

setupUncaughtErrorHandlers();
const app: Application = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
// Test route without use MongoDB
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'API работает' });
});
app.use('/api/auth', authRoutes); // Добавлены маршруты аутентификации
app.use('/api/objects', realEstateRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use(
  '/api/commercial_NonResidentialBuildings',
  commercial_NonResidentialBuildingsRoutes,
);
app.use('/api/landPlots', landPlotRoutes);
app.use('/api/residentialHouses', residentialHousesRoutes);
app.use('/api/email', emailRoutes);

app.use(errorLogger);
app.use(errorHandler);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Serverfehler', error: err.message });
});

connectDb();

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;
