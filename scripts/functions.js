export async function fetchUsers() {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/users`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function searchUser(user) {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/users?email=${user.userEmail}&password=${user.userPassword}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function signIn(authenticator) {
    authenticator.status = "unauthenticated"
    const apiUser = await searchUser(authenticator);
    for (const element of apiUser) {
        if (authenticator.userEmail === element.email && authenticator.userPassword === element.password) {
            authenticator.status = "authenticated";
            authenticator.userId = element.id;
            authenticator.userEmail = element.email;
            authenticator.userPassword = element.password;
        }
    }
    return authenticator;
};

export async function authenticate() {
    let authenticator = JSON.parse(localStorage.getItem('authenticator'));
    if (authenticator === null) {
        authenticator = {
            status: "unauthenticated",
            userId: "",
            userEmail: "",
            userPassword: ""
        };
        localStorage.setItem('authenticator', JSON.stringify(authenticator));
    }
    if (authenticator.userEmail && authenticator.userPassword) {
        authenticator = await signIn(authenticator)
        if (authenticator.status === "authenticated") {
            localStorage.setItem('authenticator', JSON.stringify(authenticator));
            const signInContain = document.getElementById("signInContain");
            document.getElementById("dashboard").addEventListener('click', e => {
                e.preventDefault()
                animation()
                startContent()
            });
            document.getElementById("courses").addEventListener('click', e => {
                e.preventDefault()
                animation()
                startCourses()
            });
            document.getElementById("assignments").addEventListener('click', e => {
                e.preventDefault()
                animation()
                startAssignments()
            });
            document.getElementById("teachers").addEventListener('click', e => {
                e.preventDefault()
                animation()
                startTeachers()
            });
            document.getElementById("profile").addEventListener('click', e => {
                e.preventDefault()
                animation()
                startProfile()
            });
            const main = document.getElementById("main");
            signInContain.classList.remove("active");
            signInContain.classList.add("hidden");
            main.classList.remove("hidden");
            main.classList.add("grid");
            startContent()
        };
    };
};

export async function startContent() {
    const authenticator = JSON.parse(localStorage.getItem('authenticator'));
    if (authenticator.status === "authenticated") {
        const userApi = await fetchAUser(authenticator.userId);
        const imgProfile = document.getElementById("imgProfile");
        imgProfile.src = userApi.imageUrl;
        const main = document.querySelector("main");
        main.innerHTML = "";
        if (userApi.role === "student") {
            const numberActiveCourses = userApi.enrolledCourses.length // Primera data

            const submittedAssignments = await fetchUserSubmittedAssignments(userApi.id)
            let numberPendingAssignments = 0;
            submittedAssignments.forEach(element => {
                if (!element.done) {
                    numberPendingAssignments += 1;
                }
            }); // Segunda data

            let doneCourses = 0;
            userApi.enrolledCourses.forEach(element => {
                let lessons = element.lessons.length;
                let doneLessons = 0;
                element.lessons.forEach(element => {
                    if (element.done) {
                        doneLessons += 1;
                    }
                });
                doneCourses += (doneLessons / lessons);
            });
            const progress = Math.floor(doneCourses / userApi.enrolledCourses.length * 100); // Tercera data

            const sectionCourses = document.createElement("section");
            sectionCourses.innerHTML = `
        <section>
            <div class="space-between">
                <h2>My Enrolled Courses</h2>
                <button class="BrowseMoreCourses">Browse More Courses</button>
            </div>
            <div class="row">
            </div>
        </section>
            `
            const row = sectionCourses.querySelector(".row");
            let counter = 0;
            for (const element of userApi.enrolledCourses) {
                if (counter > 2) {
                    break;
                }


                let doneLessons = 0;
                userApi.enrolledCourses[counter].lessons.forEach(element => {
                    if (element.done) {
                        doneLessons += 1;
                    }
                });
                const apiCourse = await fetchACourse(element.courseId);
                const apiTeacher = await fetchAUser(apiCourse.teacherInChargeId);
                const progress = Math.floor(doneLessons / apiCourse.lessons.length * 100);
                row.innerHTML += `
                <div class="card">
                    <img src="${apiCourse.imageUrl}" alt="">
                    <div class="cardContent">
                        <span class="t2">${apiCourse.name}</span>
                        <span class="t5">${apiTeacher.name}</span>
                        <div class="row2">
                            <progress max="100" value="${progress}"></progress>
                            <span class="t5">${progress}% Complete</span>
                            <span class="t3">${doneLessons}/${apiCourse.lessons.length} Lessons</span>
                        </div>
                    </div>
                    <button class="continueLearning" courseId="${apiCourse.id}">Continue Learning</button>
                </div>
                `
                counter += 1;
            }
            const dashboard = document.createElement("section");
            dashboard.innerHTML = `
            <h1>Dashboard</h1>
            <div class="row">
                <div class="card">
                    <div class="cardContent">
                        <h3>Active Courses</h3>
                        <h3 id="numberActiveCourses">${numberActiveCourses}</h3>
                    </div>
                </div>
                <div class="card">
                    <div class="cardContent">
                        <h3>Pending Assignments</h3>
                        <h3 id="numberPendingAssignments">${numberPendingAssignments}</h3>
                    </div>
                </div>
                <div class="card">
                    <div class="cardContent">
                        <h3>Overall Progress</h3>
                        <div class="row2">
                            <progress max="100" value="${progress}"></progress>
                            <h3>${progress}%</h3>
                        </div>
                    </div>
                </div>
            </div>
        `;
            main.appendChild(dashboard);
            main.appendChild(sectionCourses);
        } else if (userApi.role === "teacher") {
        } else if (userApi.role === "admin") {
        }
    }
}

export async function fetchCourses() {
    const response = await fetch(`https://68a09e396e38a02c58193795.mockapi.io/courses`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function fetchACourse(id) {
    const response = await fetch(`https://68a09e396e38a02c58193795.mockapi.io/courses/${id}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function fetchAssignments() {
    const response = await fetch(`https://68a09e396e38a02c58193795.mockapi.io/assignments`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function fetchSubmittedAssignments() {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/submittedAssignments`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function fetchUserSubmittedAssignments(id) {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/users/${id}/submittedAssignments`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function fetchAssignmentsOfCourse(courseId) {
    const response = await fetch(`https://68a09e396e38a02c58193795.mockapi.io/courses/${courseId}/assignments`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export function getDateFormatted(timestamp) {
    const fecha = new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    return fecha;
};

export async function fetchAUser(id) {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/users/${id}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function studentDashboard() {
    const main = document.getElementByTagName("main")
}

export function animation() {
    const logoContain = document.getElementById("logoContain");
    const startupLogo = document.getElementById("startupLogo");
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
}