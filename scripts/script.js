import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    let user = await modal.fetchAUser(1);
    let imgProfile = document.getElementById("imgProfile");
    imgProfile.src = user.imageUrl;
});