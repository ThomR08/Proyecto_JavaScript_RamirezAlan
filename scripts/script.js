import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loaded");
    const courses = await modal.fetchData();
    console.log(courses);
});