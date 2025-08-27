import dotenv from 'dotenv';
import app from './app.js';
import { authAlligator } from './services/alligatorService.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
await authAlligator()
app.listen(PORT, async () => {

  console.log(`✅ Backend running on http://localhost:${PORT}`);

 setInterval(() => {
  authAlligator()
 }, 3600000 * 6 );
});
