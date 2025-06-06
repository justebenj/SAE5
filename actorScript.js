const apiKey = "d2ce126fbc7fe822d2ea9332ea12a63a";

const params = new URLSearchParams(window.location.search);
const idMovie = params.get("id");
const actorId=getId();

async function getActor(id) {
    const data = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=fr-FR`);
    const actor = await data.json();
    setPersonnalInfo(actor);
    mainOverview(actor);
}

async function getActorMovies(id) {
    const data = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}&language=fr-FR`)
    const movies = await data.json();
    setMoviesOverview(movies.cast)
    getPopular(movies);
}

let postersPop = [];
let isPos = 0;

function getPopular(movies){
    let popularMovies = movies.cast
    .filter(movie => parseFloat(movie.vote_count) >= 200)
    .sort((a,b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
    if (popularMovies.length < 4) {
        popularMovies = movies.cast
        .sort((a,b) => parseFloat(b.vote_average) - parseFloat(a.vote_average));
    }
    for (let i = 0; i < 4; i++) {
        const element = popularMovies[i];
        const article = document.createElement("article");
        let date = element.release_date;
        date = date.replace(/-/g, "/");
        article.innerHTML = `
        <a href="movie.html?id=${element.id}">
        <img class="pos${i}" src="https://image.tmdb.org/t/p/w780/${element.poster_path}"></a>
        <h1>${element.title}</h1>
        <h2>${date}</h2>
        `;
        document.querySelector("#movPop").appendChild(article);
        postersPop.push("https://image.tmdb.org/t/p/original/" + element.backdrop_path);
        preloadImage(`https://image.tmdb.org/t/p/w780/${element.poster_path}`);
    }
    document.documentElement.style.setProperty('--banner-url2', `url(${postersPop[0]})`);
    pos0 = document.querySelector('#pos0');
}

function setMoviesOverview(movies){
    movies.sort((a,b) => new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0));
    let visitedYear = new Set();
    movies.forEach((element) => {
        let date = new Date(element.release_date || element.first_air_date || 0)
        if (!visitedYear.has(date.getFullYear())){
            let section = document.createElement("section");
            section.id = "temp" + date.getFullYear();
            section.classList.add("dates");
            document.querySelector("#projects").appendChild(section);
            visitedYear.add(date.getFullYear());
        }
        article = document.createElement("article");
        article.innerHTML = `
        <h2>${getYear(element.release_date || element.first_air_date)}</h2>
        <a href="movie.html?id=${element.id}">
        <h3>${element.title || element.name}</h3></a>
        <h4>incarnant ${element.character}</h4>
        `
        article.classList.add(getYear(element.release_date || element.first_air_date));
        document.querySelector(`#temp${date.getFullYear()}`).appendChild(article);
    });
}

function getYear(yearString){
    let year = new Date(yearString);
    return year.getFullYear();
}

function setPersonnalInfo(actor) {
    document.querySelector("#background h1").textContent = `Films cultes de ${actor.name}`;
    document.querySelector("#leftOverview img").src = `https://image.tmdb.org/t/p/w780/${actor.profile_path}`;
    document.querySelector("#known div").innerHTML = `${actor.known_for_department}`;
    document.querySelector("#gender div").innerHTML = getSexe(actor.gender);
    document.querySelector("#birthday div").innerHTML = `${actor.birthday} ` + '(' + ageActor(actor.birthday) + ')';
    document.querySelector("#birthplace div").innerHTML = `${actor.place_of_birth}`;
    getKnownAs(actor.also_known_as);
    ageActor(new Date(actor.birthday));
}

function ageActor(birthday){
    var years = new Date(new Date() - new Date(birthday)).getFullYear() - 1970;
    return years;
}

function mainOverview(actor){
    let main = document.querySelector("#mainOverview");
    main.querySelector("h1").textContent = `${actor.name}`;
    main.querySelector("p").textContent = `${actor.biography}`;
}

function getSexe(id){
    switch (id) {
        case 0:
            return "Inconnu";
        case 1:
            return "Femme";
        case 2:
            return "Homme";
        default:
            return "Fou";
    }
}

function getId(){
    const params = new URLSearchParams(window.location.search);
    const idMovie = params.get("id");

    if (idMovie) {
        return idMovie;
    } else {
        console.error("Aucun ID trouvé dans l'URL");
    }
}

function getKnownAs(array){
    array.forEach(element => {
        let name = document.createElement("div");
        name.innerHTML = element;
        document.querySelector("#knownAs").appendChild(name);
    });
}

const preloadImage = (url) => {
    const img = new Image();
    img.src = url;
};

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    sessionStorage.setItem('theme', html.getAttribute('data-theme'));
}

document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('pos0')) {
        document.documentElement.style.setProperty('--banner-url2', `url(${postersPop[0]})`);
    }
});
document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('pos1')) {
        document.documentElement.style.setProperty('--banner-url2', `url(${postersPop[1]})`);
    }
});

document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('pos2')) {
        document.documentElement.style.setProperty('--banner-url2', `url(${postersPop[2]})`);
    }
});

document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('pos3')) {
        document.documentElement.style.setProperty('--banner-url2', `url(${postersPop[3]})`);
    }
});

getActor(actorId);
getActorMovies(actorId);

document.querySelectorAll("header img").forEach(element =>{
    element.addEventListener('click', (event =>{
        if (event.target.id == "sun"){
            toggleTheme();
            document.querySelector("#sun").classList.add("hidden");
            document.querySelector("#moon").classList.remove("hidden");
        }
        else {
            toggleTheme();
            document.querySelector("#moon").classList.add("hidden");
            document.querySelector("#sun").classList.remove("hidden");
        }
    }));
});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = sessionStorage.getItem('theme') || 'light'; // Définit 'light' comme valeur par défaut si rien n'est trouvé
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme == "light") {
        document.querySelector("#moon").classList.add("hidden");
        document.querySelector("#sun").classList.remove("hidden");
    }
    else {
        document.querySelector("#sun").classList.add("hidden");
        document.querySelector("#moon").classList.remove("hidden");
    }
});

const text = document.getElementById("text");
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", function (e) {
  e.preventDefault();
  text.classList.toggle("collapsed");
  text.classList.toggle("expanded");
  toggle.textContent = text.classList.contains("collapsed") ? "Afficher plus" : "Afficher moins";
});