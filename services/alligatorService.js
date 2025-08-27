import axios from "axios"
import { Release } from "../models/Release.js"
import fs from 'fs'
import FormData from "form-data"
import User from '../models/User.js'


export const AlligatorSessionKey = new Map()

export const authAlligator = async () => {

    const body = {
        login: "contact@delayzero.com",
        password: "A@zb28%J_pB5"
    }

    const response = await axios.post('https://v2api.musicalligator.com/api/auth/sign_in', body)

    AlligatorSessionKey.set('key', response.data.data.sessionToken || response.data.data.account.sessionToken)

}

export const createArtist = async (payload) => {
    const {id, name, spotifyLink, appleMusicLink} = payload

    try {
        const body = {
        id,
        name,
        platforms:   [
        {
            "name": "Spotify",
            "platformId": spotifyLink,
            "id": 291
        },
        {
            "name": "Apple Music",
            "platformId": appleMusicLink,
            "id": 282
        }
]
    }

    const response = await axios.post('https://v2api.musicalligator.com/api/artists', body, {headers: {
        Authorization: AlligatorSessionKey.get('key')
    }})

    return response
    } catch (error) {
        console.log(error);
    }
}

/**
 *

https://v2api.musicalligator.com/api/releases/239487/status/moderate - на модерацию
 */
export const createAlligatorRelease = async (releaseId) => {


   try {
     const response = await axios.post('https://v2api.musicalligator.ru/api/releases/create', {releaseType: 'SINGLE'}, {
        headers: {
               Authorization: AlligatorSessionKey.get('key')
        }
    })

     const release = await Release.findByIdAndUpdate(
          releaseId,
          {
            $set: {
              alligatorReleaseId: response.data.data.release.releaseId,
              alligatorTracks: response.data.data.release.tracks
            },
          },
          { new: true, runValidators: true }
        );


     const form = new FormData();
  form.append('file', fs.createReadStream(release.coverPath));


    const uploadImage = await axios.post(`https://v2api.musicalligator.ru/api/releases/${release.alligatorReleaseId}/cover`, form, {headers: {
              ...form.getHeaders(),
               Authorization: AlligatorSessionKey.get('key')
        }})


    const artist = User.findById(release.createdBy)

    const uploadTrack = await axios.post(`https://v2api.musicalligator.com/api/releases/${release.alligatorReleaseId}/tracks/533363/upload`)

    return release
   } catch (error) {
    console.log(error);


   }
}


export const updateDraft = async (req, res) => {
  await axios.put(`https://v2api.musicalligator.com/api/releases/${release.alligatorReleaseId}`)
}