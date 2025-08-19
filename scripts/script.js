import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log(1)
  document.querySelector('form')
    .addEventListener('submit', async e => {
      e.preventDefault()
      const data = Object.fromEntries(
        new FormData(e.target)
      );
      alert(JSON.stringify(data))
    });
  let user = await modal.fetchAUser(1);
  let imgProfile = document.getElementById("imgProfile");
  imgProfile.src = user.imageUrl;
});