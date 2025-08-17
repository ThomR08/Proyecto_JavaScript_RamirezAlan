import * as modal from './functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Loaded");
    console.log(await modal.fetchUsers());
    
    const courses = await modal.fetchCourses();
    for (const element of courses) {
        console.log(element.name);
        const assignments = await modal.fetchAssignmentsOfCourse(element.id);
        console.log(assignments);
        assignments.forEach(element => {
            const fecha = modal.getDateFormatted(element.due)
            console.log(fecha)
        });
    }
});