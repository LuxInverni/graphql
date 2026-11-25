import { login } from "./auth.js";
import { graphqlRequest } from "./graphql.js";

console.log("main.js loaded");

const form = document.querySelector("#login-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username =document.querySelector("#identifier").value;
    const password =document.querySelector("#password").value;

    try {
        const token = await login(username, password);
        window.location.href = "profile.html";

    } catch (error) {
        console.error(error.message);
        const errorMessage = document.querySelector("#error");
        errorMessage.textContent = "Invalid username/email or password.";
        document.querySelector("#password").value = "";
    }
});

