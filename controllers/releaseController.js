import { Release } from '../models/Release.js';

export const createRelease = async (req, res) => {
  const {
    title,
    releaseDate,
    participants,
    pitchRu,
    pitchEn,
    tariff,
  } = req.body;

  if (!title || !releaseDate || !participants || !tariff) {
    return res.status(400).json({ error: 'Обязательные поля отсутствуют' });
  }
  if (!pitchRu && !pitchEn) {
    return res.status(400).json({ error: 'Нужен pitch' });
  }
  if (!req.files?.cover || !req.files?.wavFiles) {
    return res.status(400).json({ error: 'Нужны файлы: обложка и wav' });
  }

  const coverPath = req.files.cover[0].path;
  const wavPaths = req.files.wavFiles.map(f => f.path);

  const release = new Release({
    title,
    releaseDate,
    participants,
    pitchRu,
    pitchEn,
    coverPath,
    wavPaths,
    tariff,
    status: 'pending',
    createdBy: req.user.telegramId,
  });

  await release.save();
  res.status(201).json({ message: 'Релиз создан' });
};

export const getUserReleases = async (req, res) => {
  const releases = await Release.find({ createdBy: req.user.telegramId }).sort({ createdAt: -1 });
  const releasesWithUrls = releases.map(r => ({
    ...r.toObject(),
    coverUrl: r.coverPath.replace(process.cwd() + '/', '').replace(/\\/g, '/'),
    wavUrls: r.wavPaths.map(p => p.replace(process.cwd() + '/', '').replace(/\\/g, '/')),
  }));

  res.json({ releases: releasesWithUrls });
};
