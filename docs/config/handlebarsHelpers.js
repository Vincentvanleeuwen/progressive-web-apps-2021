module.exports = {
  makeUrlSafe: (name) => {
    return name.toLowerCase().replace(/\s+/g, '-')
  }
}
