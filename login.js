const params = new URLSearchParams(window.location.search);
const loginOrSignup = params.get("id");

function init(loginOrSignup){
    if (loginOrSignup == "login") {
        document.querySelector("#info").innerHTML = `
        <h1>Connexion</h1>
        <p>Connectez-vous pour acceder à toutes les fonctionnalitées.</p>
        `
        document.querySelector("#toLogin").hidden = true;
        document.querySelector("#sendformS").hidden = true;
    } else {
        document.querySelector("#info").innerHTML = `
        <h1>S'identifier</h1>
        <p>Identifiez-vous pour acceder à toutes les fonctionnalitées.</p>
        `
        document.querySelector("#toSignup").hidden = true;
        document.querySelector("#sendformL").hidden = true;
    }
}

document.getElementById("login").addEventListener("submit", function(event){
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(email);
    console.log(password);
});

document.querySelectorAll(".change").addEventListener("click", function event)

init(loginOrSignup);

