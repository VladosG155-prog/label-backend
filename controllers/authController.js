import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sessions } from '../services/sessionService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const requestTelegramLogin = (req, res) => {
  const sessionToken = uuidv4();
  const loginLink = `https://t.me/${process.env.BOT_USERNAME}?start=login_${sessionToken}`;
  sessions.set(sessionToken, null);
  res.json({ sessionToken, loginLink });
};

export const receiveTelegramData = async (req, res) => {
  const { sessionToken, id, username, first_name, photo_url } = req.body;

  if (!sessionToken || !id) {
    return res.status(400).json({ error: 'Missing sessionToken or user data' });
  }

  try {
    let user = await User.findOneAndUpdate(
      { telegramId: id },
      { username, first_name, photo_url },
      { upsert: true, new: true }
    );

    sessions.set(sessionToken, user);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
};

export const pollLoginStatus = (req, res) => {
  const { token } = req.query;
  if (!token || !sessions.has(token)) return res.status(404).json({ authorized: false });

  const user = sessions.get(token);
  if (!user) return res.status(202).json({ authorized: false });

  sessions.delete(token);
  const jwtToken = jwt.sign({ id: user.telegramId }, JWT_SECRET, { expiresIn: '7d' });

  res.status(200).json({ authorized: true, token: jwtToken, user });
};

export const authMe = async (req, res) => {
  res.json({ user: req.user });
};