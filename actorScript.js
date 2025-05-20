const apiKey = "d2ce126fbc7fe822d2ea9332ea12a63a";

async function getActor(id) {
    const data = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=fr-FR`);
    const actor = await data.json();
    setPersonnalInfo(actor);
    mainOverview(actor);
}

async function getActorMovies(id) {
    const data = await fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=fr-FR`)
    const movies = await data.json();
    setMoviesOverview(movies.cast)
}

function setMoviesOverview(movies){
    movies.sort((a,b) => new Date(b.release_date) - new Date(a.release_date));
    //console.log(movies);
    movies.forEach((element) => {
        article = document.createElement("article");
        console.log(element);
        article.innerHTML = `
        <h2>${getYear(element.release_date || element.first_air_date)}</h2>
        <input type="checkbox"></input>
        <h3>${element.title || element.name}</h3>
        <h4>en tant que ${element.character}</h4> 
        `
        article.classList.add(getYear(element.release_date));
        document.querySelector("#projects").appendChild(article);
    });
}

function getYear(yearString){
    let year = new Date(yearString);
    return year.getFullYear();
}

function setPersonnalInfo(actor){
    document.querySelector("#leftOverview img").src = `https://image.tmdb.org/t/p/w780/${actor.profile_path}`;
    document.querySelector("#known div").innerHTML = `${actor.known_for_department}`;
    document.querySelector("#gender div").innerHTML = getSexe(actor.gender);
    document.querySelector("#birthday div").innerHTML = `${actor.birthday}`; //TODO
    document.querySelector("#birthplace div").innerHTML = `${actor.place_of_birth}`;
    getKnownAs(actor.also_known_as);
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

function getKnownAs(array){
    array.forEach(element => {
        let name = document.createElement("div");
        name.innerHTML = element;
        document.querySelector("#knownAs").appendChild(name);
    });
}

getActor(85);
getActorMovies(85);