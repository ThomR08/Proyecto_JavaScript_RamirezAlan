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
    const response = await fetch(`https://68a1ebfa6f8c17b8f5db1b38.mockapi.io/users?mail=${user.mail}&password=${user.password}`, {
        method: 'GET',
        headers: {
            'content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};

export async function signIn(user) {
  const apiUser = await searchUser(user);
for (const element of apiUser) {
    if (user.mail ===  element.mail &&  user.password === element.password) {
        console.log("Autenticado");
        console.log(element)
        return element.id;
    } else  {
        console.log("No Autenticado")
        return 0;
    }
  }
};

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