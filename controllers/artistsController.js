import User from '../models/User.js';

export const getArtists = async(req, res) => {
    const artists = await User.find({})
    console.log(artists);

    res.json({ artists });
};
