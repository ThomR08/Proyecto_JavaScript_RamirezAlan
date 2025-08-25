import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
  modal.authenticate()
  document.querySelector('form')
    .addEventListener('submit', async e => {
      e.preventDefault()
      const data = Object.fromEntries(
        new FormData(e.target)
      );
      let authenticator = JSON.parse(localStorage.getItem('authenticator'));
      authenticator.userEmail = data.email.toLowerCase();
      authenticator.userPassword = data.password;
      localStorage.setItem('authenticator', JSON.stringify(authenticator));
      modal.animation()
      await modal.authenticate()
    });
});