import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async ()=> {
    console.log("Loaded");
    console.log(await modal.fetchData());
});