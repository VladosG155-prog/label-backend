import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import releaseRoutes from './routes/releaseRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import artistsRoutes from './routes/artistsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import documentsRoutes from './routes/docRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/music-label')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/auth', authRoutes);
app.use('/releases', releaseRoutes);
app.use('/profile', profileRoutes);
app.use('/artists', artistsRoutes);
app.use('/admin', adminRoutes);
app.use('/documents',documentsRoutes );

export default app;