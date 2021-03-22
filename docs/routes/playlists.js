const firebase = require('firebase/app');
require('firebase/database');
const router = require('express').Router();
const request = require('request'); // "Request" library
const { deleteColumns, restructureSongs } = require('../helpers/transformData')

const globalRef = firebase.database().ref('playlists/')
globalRef.on('value', function (snap) {
  let playlists = snap.val()
  if(!playlists) {
    return
  }
  let playlistKeys = Object.keys(playlists)
  playlistKeys.forEach(playlist => {

    router.get(`/${playlist}`, (req, res) => {

      if(!req.session.user) {
        res.redirect('/')
        return
      }

      const playlistRef = firebase.database().ref('playlists/').child(`${playlist}`)
      playlistRef.on('value', (snap) => {

        let snapVals = Object.values(snap.val())[0]

        const options = {
          url: `https://api.spotify.com/v1/me/top/tracks/?time_range=${snapVals.term + '_term'}&limit=${snapVals.duration}`,
          headers: {
            'Authorization': 'Bearer ' + req.session.access_token,
            'Content-Type': 'application/json'
          },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          let filtered = deleteColumns(body)

          const songsRef = firebase.database().ref(`playlists/${playlist}/songs`)

          songsRef.on('value', (snap) => {
            if(!snapVals.songs) {
              playlistRef.update({
                songs: restructureSongs(filtered)
              })
            } else {
              restructureSongs(filtered).forEach(song => {
                songsRef.update(song)
              })
            }
          })




          res.render('playlist', {
            layout: 'main',
            name: req.session.user.name,
            image: req.session.user.image,
            playlistTitle: playlist,
            playlistUrl: snapVals.url,
            songs: snap.val().songs
          });

        });
      })
    })

    router.post(`/${playlist}`, (req, res) => {
      if(!req.session.access_token) {
        res.redirect('/')
        return
      }
      let uris = ""
      const playlistRef = firebase.database().ref(`playlists/${playlist}`)
      playlistRef.on('value', (snap) => {
        snap.val().songs.map(song => {
          uris = uris + song.uri + ","
        })
      })

      console.log('post songs', uris)

      const options = {
        method: 'POST',
        url: `https://api.spotify.com/v1/playlists/${req.session.playlistId}/tracks?uris=${uris}`,
        headers: {
          'Authorization': 'Bearer ' + req.session.access_token,
          'Content-Type': 'application/json'
        },
        json: true
      };
      console.log(options)
      // use the access token to access the Spotify Web API
      request.post(options, function(error, response, body) {

        if(!body.error) {
          res.redirect(`/playlists/${req.session.playlistName}`)
        }

      });

    })
  })
})

module.exports = router
