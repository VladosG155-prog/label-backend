import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sessions } from '../services/sessionService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * Генерация ссылки для Telegram логина
 */
export const requestTelegramLogin = (req, res) => {
  const sessionToken = uuidv4();
  const loginLink = `https://t.me/${process.env.BOT_USERNAME}?start=login_${sessionToken}`;

  // Сессия создаётся с null, пока пользователь не авторизован
  sessions.set(sessionToken, null);

  res.json({ sessionToken, loginLink });
};

/**
 * Получение данных пользователя от Telegram после клика
 */
export const receiveTelegramData = async (req, res) => {
  const { sessionToken, id, username, first_name, photo_url } = req.body;

  if (!sessionToken || !id) {
    return res.status(400).json({ error: 'Missing sessionToken or user data' });
  }

  try {
    // Проверяем, есть ли пользователь в базе
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, first_name, photo_url, role: 'artist' });
      await user.save();
    }

    // Сохраняем пользователя в сессию
    sessions.set(sessionToken, user);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};

/**
 * Поллинг статуса логина
 */
export const pollLoginStatus = (req, res) => {
  const { token } = req.query;

  if (!token || !sessions.has(token)) {
    return res.status(404).json({ authorized: false });
  }

  const user = sessions.get(token);

  if (!user) {
    // Пользователь ещё не авторизован
    return res.status(202).json({ authorized: false });
  }

  // После успешной авторизации сессия больше не нужна
  sessions.delete(token);

  // Генерируем JWT
  const jwtToken = jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).json({ authorized: true, token: jwtToken, user });
};

/**
 * Получение текущего пользователя по JWT
 */
export const authMe = async (req, res) => {
  res.json({ user: req.user });
};
