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
        if (userApi.role === "student") {
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