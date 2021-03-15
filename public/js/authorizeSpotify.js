// import { toggleLogin } from "./toggleLogin";
// import { fetchData } from "./fetchData";
//
// (function() {
//
//   /**
//    * Obtains parameters from the hash of the URL
//    * @return Object
//    */
//   function getHashParams() {
//     let hashParams = {};
//     let e, r = /([^&;=]+)=?([^&;]*)/g,
//       q = window.location.hash.substring(1);
//     while ( e = r.exec(q)) {
//       hashParams[e[1]] = decodeURIComponent(e[2]);
//     }
//     return hashParams;
//   }
//
//   let userProfileSource = document.getElementById('user-profile-template').innerHTML,
//     userProfileTemplate = Handlebars.compile(userProfileSource),
//     userProfilePlaceholder = document.getElementById('user-profile');
//
//   let oauthSource = document.getElementById('oauth-template').innerHTML,
//     oauthTemplate = Handlebars.compile(oauthSource),
//     oauthPlaceholder = document.getElementById('oauth');
//
//   let params = getHashParams();
//
//   let access_token = params.access_token,
//     refresh_token = params.refresh_token,
//     error = params.error;
//
//   if (error) {
//     alert('There was an error during the authentication');
//   } else {
//     if (access_token) {
//       // render oauth info
//       oauthPlaceholder.innerHTML = oauthTemplate({
//         access_token: access_token,
//         refresh_token: refresh_token
//       });
//
//       const options = {
//         headers: {
//           'Authorization': 'Bearer ' + access_token
//         }
//       }
//
//       fetchData('https://api.spotify.com/v1/me', options)
//         .then(userData => {
//           userProfilePlaceholder.innerHTML = userProfileTemplate(userData);
//           toggleLogin()
//         }).catch(err => {
//           console.log('Error getting personal data', err)
//           toggleLogin()
//         })
//
//     } else {
//       // render initial login screen
//       toggleLogin()
//     }
//
//     document.getElementById('obtain-new-token').addEventListener('click', function() {
//
//       const refreshOptions = {
//         data: {
//           'refresh_token': refresh_token
//         }
//       }
//
//       fetchData('/refresh_token', refreshOptions)
//       .then(data => {
//         access_token = data.access_token;
//         oauthPlaceholder.innerHTML = oauthTemplate({
//           access_token: access_token,
//           refresh_token: refresh_token
//         });
//       }).catch(err => {
//         console.log('Error refreshing token', err)
//
//       })
//
//       // $.ajax({
//       //   url: '/refresh_token',
//       //   data: {
//       //     'refresh_token': refresh_token
//       //   }
//       // }).done(function(data) {
//       //   access_token = data.access_token;
//       //   oauthPlaceholder.innerHTML = oauthTemplate({
//       //     access_token: access_token,
//       //     refresh_token: refresh_token
//       //   });
//       // });
//     }, false);
//   }
// })();
