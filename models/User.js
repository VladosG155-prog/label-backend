import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  first_name: String,
  photo_url: String,
  age: Number,
  email: String,
  role: String,
  links: {
    spotify: String,
    yandex: String,
    soundcloud: String,
    vk: String,
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
