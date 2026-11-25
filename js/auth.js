export async function login(identifier, password) {
    const credentials = btoa(`${identifier}:${password}`);

    const response = await fetch(
        `https://learn.01founders.co/api/auth/signin`,
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Invalid username/email or password");
    }

    console.log("Status:", response.status);

    const token = JSON.parse(await response.text());

    localStorage.setItem("jwt", token);

    return token;
}

export function getToken() {
    return localStorage.getItem("jwt");
}

export function isAuthenticated() {
    return !!getToken();
}

export function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "index.html";
}
