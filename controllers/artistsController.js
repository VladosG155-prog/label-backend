import axios from 'axios';
import User from '../models/User.js';
import { AlligatorSessionKey, createArtist } from '../services/alligatorService.js';

export const getArtists = async(req, res) => {
    const artists = await User.find({})

    res.json({ artists });
};

export const createUserArtist = async (req, res) => {
  try {
    const data = req.body;

    if (!data.nickname) {
      return res.status(400).json({ message: "Имя артиста обязательно" });
    }

    const artist = new User(data);
    await artist.save();

    res.status(201).json(artist);
  } catch (error) {
    console.error("Ошибка при создании артиста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const approveArtist = async (req,res) => {
    try {

    const payload = {
        spotifyLink: req.user.links.spotify,
        appleMusicLink: req.user.links.appleMusic,
        id: 0,
        name: req.user.username
    }

    await createArtist(payload)


    const responseArtist = await axios.get(`
https://v2api.musicalligator.com/api/artists?name=${req.user.username}&_changes=true`, {headers: {Authorization: AlligatorSessionKey.get('key')}})

    const alligatorArtist = responseArtist.data.data[0]

    await User.findByIdAndUpdate(req.user.id, {musicAlligator: alligatorArtist} )


     const payloadPersons = {
        name: `${req.user.lastName} ${req.user.firstName} ${req.user.surname}`,

        platforms: [
            {
                id: 291,
            name: 'Spotify',
            platformId:  req.user.links.spotify,
            },
             {
                id: 282,
            name: 'Apple Music',
            platformId:  req.user.links.appleMusic,
            },
        ]
    }


    const realArtist = await axios.post('https://v2api.musicalligator.com/api/persons', payloadPersons , {headers: {Authorization: AlligatorSessionKey.get('key')}})
    return res.status(200).send({message: 'ok'});
    } catch (error) {
        console.log(error);

    }
}