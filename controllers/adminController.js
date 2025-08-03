import User from '../models/User.js';

export const updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

     /*    // Проверка: является ли текущий пользователь админом
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Доступ запрещён' });
        } */

        // Обновление роли
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ message: 'Роль обновлена', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
