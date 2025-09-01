import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  firstname: String,
  photo_url: String,
  username: String,
  age: Number,
  email: String,
  role: String,
  nickname: String,
  lastname: String,
  surname: String,
  INN: String,
  adress: String,
  postadress: String,
  rsnumber: String,
  ksnumber: String,
  bankname: String,
  bik: String,
  phone: String,
  documentInfo: String,
  musicAlligator: {
    id: String,
    platforms: [
      {
        id: Number,
        name: String,
        platformId: String
      }
    ]
  },
  links: {
    spotify: String,
    yandex: String,
    soundcloud: String,
    vk: String,
    appleMusic: String
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
