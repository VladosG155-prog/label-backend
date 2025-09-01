import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = process.env.BACKEND_URL || 'https://yourdomain.com'; // можно указать локальный URL

if (!BOT_TOKEN) {
  throw new Error('Missing BOT_TOKEN in .env');
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start (.+)/, async (msg, match) => {
  const payload = match[1]; // например: login_abc123
  const chatId = msg.chat.id;
  const user = msg.from;



  console.log(`🚀 Получен payload: ${payload} от ${user.username || user.first_name}`);

  if (!payload.startsWith('login_')) {
    bot.sendMessage(chatId, '⚠️ Неверная ссылка для входа.');
    return;
  }

  const sessionToken = payload.replace('login_', '');

  try {
    const res = await fetch(`${API_URL}/auth/telegram/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionToken,
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        photo_url: user.photo_url,
      }),
    });

    if (!res.ok) {
      bot.sendMessage(chatId, '❌ Ошибка при подтверждении авторизации.');
      return;
    }

    bot.sendMessage(chatId, '✅ Вы успешно авторизовались! Можете вернуться на сайт.');
  } catch (error) {
    console.error('Ошибка запроса к backend:', error);
    bot.sendMessage(chatId, '❌ Произошла ошибка при подключении к серверу.');
  }
});
