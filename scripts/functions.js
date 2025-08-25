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

export async function searchUsersByRole(role) {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/users?role=${role}`, {
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

export async function fetchCoursesOfCategory(category) {
    const response = await fetch(`https://68a09e396e38a02c58193795.mockapi.io/courses?category=${category}`, {
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

export async function fetchAAssignment(id) {
    const response = await fetch(`https://68a09e396e38a02c58193795.mockapi.io/assignments/${id}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function fetchSubmittedAssignments(id) {
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/submittedAssignments/${id}`, {
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

export async function startCourses() {
    const authenticator = JSON.parse(localStorage.getItem('authenticator'));
    const userApi = await fetchAUser(authenticator.userId);
    const categories = [
        "Video Games",
        "Backend",
        "Frontend",
        "Schools"
    ]
    if (authenticator.status === "authenticated") {
        if (userApi.role === "student") {
            const main = document.querySelector("main");
            main.innerHTML = "";
            main.innerHTML += `
        <div class="space-between">
            <h1>My Enrolled Courses</h1>
        </div>
        <section>
            <div class="row">
            </div>
        </section>
            `;
            const row = document.querySelector(".row");
            let counter = 0;
            for (const element of userApi.enrolledCourses) {
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


            main.innerHTML += `
        <div class="space-between">
            <h1>Available Courses</h1>
        </div>
            `;
            for (const element of categories) {
                const courses = await fetchCoursesOfCategory(element)
                const section = document.createElement("section");
                section.innerHTML += `
            <div class="space-between">
                <h2>${element}</h2>
                <div class="afterBar"></div>
            </div>
            <div class="row">
            </div>
                `
                const row = section.querySelector(".row");
                for (const element of courses) {
                    row.innerHTML += `
                <div class="card">
                    <img src="${element.imageUrl}" alt="">
                    <div class="cardContent">
                        <span class="t2">${element.name}</span>
                        <p class="overview">${element.overview}</p>
                    </div>
                    <button class="moreInfo" courseId="${element.id}">More Info</button>
                </div>
                    `
                };
                main.appendChild(section)
            };
        } else if (userApi.role === "teacher") {
        } else if (userApi.role === "admin") {
        }
    }
}

export async function startAssignments() {
    const authenticator = JSON.parse(localStorage.getItem('authenticator'));
    const userApi = await fetchAUser(authenticator.userId);
    console.log(userApi);

    if (authenticator.status === "authenticated") {
        if (userApi.role === "student") {
            const main = document.querySelector("main");
            main.innerHTML = "";
            main.innerHTML = `
        <div class="space-between">
            <h1>Your Assignments</h1>
        </div>
            `
            const submittedAssignments = await fetchUserSubmittedAssignments(userApi.id);
            const date = new Date()
            for (const element of submittedAssignments) {
                const assignment = await fetchAAssignment(element.assignmentId)
                const course = await fetchACourse(assignment.courseId)
                const cardContent = document.createElement("div");
                cardContent.className = "assignmentContent";
                const button = document.createElement("button");
                button.className = "submitAssignment";
                button.setAttribute("assignmentId", element.id);
                button.textContent = "📤 Submit Assignment";
                const divAssignment = document.createElement("div");
                divAssignment.className = "assignment";
                divAssignment.append(cardContent, button)

                let status = "⏳ Pending";
                if (element.done && element.submittedOn > assignment.due) {
                    status = "⭕ Late submission"
                } else if (!element.done && date > assignment.due) {
                    status = "❌ Delayed"
                } else if (element.done && date < assignment.due) {
                    status = "✅ Completed"
                }
                let score;
                if (element.score != 0) {
                    score = element.score
                } else {
                    score = "Not rated"
                }
                cardContent.innerHTML = `
                    <span class="t5">${status}</span>
                    <span class="t2">${assignment.name}</span>
                    <span class="t4">${course.name}</span>
                    <span class="t5">📅 Due: ${new Date(assignment.due).toLocaleString()}</span>
                    <p>${assignment.overview}</p>
                    <span class="t5">🎯 Score: ${score}</span>
                    <span class="t3">📝 Type: ${assignment.type}</span>
                    <span class="t4">📎 ${assignment.attachments.length} attachment(s)</span>
                `
                main.appendChild(divAssignment)
            }

        } else if (userApi.role === "teacher") {
        } else if (userApi.role === "admin") {
        }
    }
}

export async function startTeachers() {
    const authenticator = JSON.parse(localStorage.getItem('authenticator'));
    const userApi = await fetchAUser(authenticator.userId);

    if (authenticator.status === "authenticated") {
        if (userApi.role === "student") {
            const main = document.querySelector("main");
            main.innerHTML = "";
            const users = await searchUsersByRole("teacher");
            main.innerHTML = `
            <div class="space-between">
                <h1>Teachers</h1>
            </div>
            <section>
                <div class="row">

                </div>
            </section>
            `;
            const row = document.querySelector(".row");
            users.forEach(element => {
                row.innerHTML += `
                <div class="userCard">
                    <img src="${element.imageUrl}" alt="">
                    <span class="t2">${element.name}</span>
                    <span class="t4">📬 Email: ${element.email}</span>
                    <span class="t5">📅 Since: ${new Date(element.since).getFullYear()}</span>
                </div>
                `
            });

        } else if (userApi.role === "teacher") {
        } else if (userApi.role === "admin") {
        }
    }
}

export async function startProfile() {

    const authenticator = JSON.parse(localStorage.getItem('authenticator'));
    const userApi = await fetchAUser(authenticator.userId);

    if (authenticator.status === "authenticated") {
        const main = document.querySelector("main");
        main.innerHTML = "";
    }
}