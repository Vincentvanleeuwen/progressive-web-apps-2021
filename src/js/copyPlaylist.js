const copyBtn = document.getElementById('copy-button');
const copyTxt = document.getElementById('copy-text');

if(copyBtn && copyTxt) {
  copyBtn.addEventListener('click', () => {
    // copyTxt.value = playlist.external_urls.spotify
    // Select the url
    copyTxt.focus();
    copyTxt.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      copyBtn.innerHTML = "Copied URL"
    } catch (err) {
      console.log('Oops, unable to copy');
      copyBtn.innerHTML = "Please retry"
    }
    // console.log(copyTxt)
    // // Enable copy on mobile devices
    // copyTxt.setSelectionRange(0, 99999);
    // // Copy text
    // document.execCommand('copy')

  })

}
