import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // Adjust path as needed

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes); // Mounts /api/register

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
