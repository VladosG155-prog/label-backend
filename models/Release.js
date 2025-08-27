import mongoose from 'mongoose';

const releaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  participants: { type: String, required: true },
  pitchRu: { type: String, required: true },
  pitchEn: { type: String, required: true },
  alligatorReleaseId: { type: String },
  coverPath: { type: String, required: true }, // путь к файлу обложки
  wavPaths: [{ type: String, required: true }], // пути к wav файлам
  tariff: { type: String, enum: ['80/20', '50/50'], default: '80/20' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: String, required: true }, // telegramId пользователя
  tracks:  [
    {
        trackId: Number,
        title: String,
         adult: Boolean,
        isntrumental: Boolean,
        authorRights: Number
    }
]
}, { timestamps: true });

export const Release = mongoose.model('Release', releaseSchema);