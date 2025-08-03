import multer from 'multer';
import fs from 'fs';
import path from 'path';

const COVER_UPLOAD_DIR = path.join(process.cwd(), 'uploads/covers');
const WAV_UPLOAD_DIR = path.join(process.cwd(), 'uploads/wavs');

fs.mkdirSync(COVER_UPLOAD_DIR, { recursive: true });
fs.mkdirSync(WAV_UPLOAD_DIR, { recursive: true });

export const uploadFields = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'cover') cb(null, COVER_UPLOAD_DIR);
      else if (file.fieldname === 'wavFiles') cb(null, WAV_UPLOAD_DIR);
      else cb(new Error('Unexpected field'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const prefix = file.fieldname === 'cover' ? '_cover' : '';
      cb(null, `${Date.now()}${prefix}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isCover = file.fieldname === 'cover';
    const isWav = file.fieldname === 'wavFiles';
    const coverOk = file.mimetype === 'image/jpeg' || file.mimetype === 'image/png';
    const wavOk = file.mimetype === 'audio/wav' || file.mimetype === 'audio/x-wav';

    if ((isCover && coverOk) || (isWav && wavOk)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  },
  limits: {
    fileSize: 15 * 1024 * 1024,
  }
}).fields([
  { name: 'cover', maxCount: 1 },
  { name: 'wavFiles', maxCount: 20 },
]);
