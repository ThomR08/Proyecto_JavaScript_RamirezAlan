import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('form')
    .addEventListener('submit', async e => {
      e.preventDefault()
      const data = Object.fromEntries(
        new FormData(e.target)
      );
      console.log(data)
      let xd = await modal.signIn(data)
      console.log(xd)
    });
  let user = await modal.fetchAUser(1);
  let imgProfile = document.getElementById("imgProfile");
  imgProfile.src = user.imageUrl;
});