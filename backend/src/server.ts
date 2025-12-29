import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db';
import userRoutes from './routes/user.routes';
import activityRoutes from './routes/activity.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('SafeGate Visitor & Parcel Management System API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
