const loginScreen = document.getElementById('login')
const loggedInScreen = document.getElementById('loggedin')

export const toggleLogin = () => {
  loginScreen.classList.toggle('hide')
  loggedInScreen.classList.toggle('hide')
}
