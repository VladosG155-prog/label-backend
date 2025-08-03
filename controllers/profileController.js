import User from '../models/User.js';

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  const updates = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { telegramId: req.user.telegramId },
      {
        $set: {
          first_name: updates.name,
          age: updates.age,
          email: updates.email,
          links: updates.links,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
};
