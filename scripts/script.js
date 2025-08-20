import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
  const logoContain = document.getElementById("logoContain");
  const startupLogo = document.getElementById("startupLogo");
  modal.authenticate()
  document.querySelector('form')
    .addEventListener('submit', async e => {
      e.preventDefault()
      const data = Object.fromEntries(
        new FormData(e.target)
      );
      let authenticator = JSON.parse(localStorage.getItem('authenticator'));
      authenticator.userEmail = data.email;
      authenticator.userPassword = data.password;
      localStorage.setItem('authenticator', JSON.stringify(authenticator));
      logoContain.classList.remove("active");
      startupLogo.classList.remove("active");
      logoContain.classList.add("hidden");
      startupLogo.classList.add("hidden");
      setTimeout(async () => {
        logoContain.classList.remove("hidden");
        startupLogo.classList.remove("hidden");
        logoContain.classList.add("active");
        startupLogo.classList.add("active");
      }, 50)
      await modal.authenticate()
    });
});