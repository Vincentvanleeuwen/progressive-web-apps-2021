const firebase = require('firebase/app')
require('firebase/database')
const router = require('express').Router()
const request = require('request')
const { makeUrlSafe } = require('../helpers/makeUrlSafe')

router.get('/', (req, res) => {
  // Failed to log in! Send back
  if(!req.session.user) {
    res.redirect('/')
    return
  }
  // Show the create playlist page
  res.render('create', {
    layout: 'main',
    name: req.session.user.name,
    img: req.session.user.image
  })
})

router.post('/', (req, res) => {

  // Redirect to error if user doesn't exist
  if(!req.session.user.id) {
    res.redirect('/error')
  }

  // Get the playlist database object
  const playlistRef = firebase.database().ref('playlists/').child(`${req.body.playlist}`)

  const options = {
    method: 'POST',
    url: `https://api.spotify.com/v1/users/${req.session.user.id}/playlists`,
    headers: {
      'Authorization': 'Bearer ' + req.session.access_token,
      'Content-Type': 'application/json'
    },
    form: JSON.stringify({
      "name": req.body.playlist,
      "description": "Made with Combinify",
      "public": false,
      "collaborative": true
    }),
    json: true
  }
  // use the access token to access the Spotify Web API
  request.post(options, function(error, response, body) {
    // Push the new playlist to firebase
    playlistRef.push({
      duration: req.body.duration,
      term: req.body.term,
      url: body.external_urls.spotify
    })
    if(!body.error) {
      // If successful, set sessions so other pages
      // can use it and redirect to the brand new playlist
      req.session.playlistUrl = body.external_urls.spotify
      req.session.playlistId = body.id
      req.session.playlistName = req.body.playlist
      req.session.save()
      res.redirect(`/playlists/${req.body.playlist}`)
    }
  })
})

module.exports = router;
