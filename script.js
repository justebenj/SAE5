const apiKey = 'd2ce126fbc7fe822d2ea9332ea12a63a';
let genre;
let genre2;

function getAdultFilter() {
    const checkboxadults = document.getElementById("adult_movies");
    return checkboxadults.checked;
}


const adults = getAdultFilter();

function choixgenre() {
    let categorie = [35, 28, 18, 27];
    let emotionsvalues = [humour.value, action.value, triste.value, peur.value];
    let max1 = 1;
    let max1i = 1;
    let max2 = 1;
    let max2i = 1;
    for (let i = 0; i < emotionsvalues.length; i++) {
        if (emotionsvalues[i] > max1) {
            max2 = max1;
            max2i = max1i;
            max1 = emotionsvalues[i];
            max1i = i;
        }
        else if(emotionsvalues[i] > max2) {
            max2 = emotionsvalues[i];
            max2i = i;
        }
    }

    if (max1 != 1) {genre = categorie[max1i]}
    if (max2 != 1) {genre2 = categorie[max2i]} else{genre2 = categorie[max1i]}
    const ranking = document.getElementById("ranking").value;
    const language = document.getElementById("langue").value;

    if (language == 'undefined') {
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre},${genre2}&include_adult=${adults}&sort_by=${ranking}&vote_count.gte=300`;
    }
    else{
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre},${genre2}&include_adult=${adults}&sort_by=${ranking}&vote_count.gte=300&with_original_language=${language}`;
    }

    console.log(genre);
    console.log(genre2);
}

function chercherFilm() {
    const recherche = search.value;
    apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${recherche}`
}

let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre},${genre2}&include_adult=${adults}&sort_by=${ranking.value}&with_original_language=${langue.value}`;
const moviesContainer = document.getElementById("movies");



async function recupereFilms() {
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        data.results.forEach(media => {
            const movieCard = recupereInfoFilms(media);
            moviesContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error("Impossible de recuperer les informations");
    }
}

function recupereInfoFilms (media) {

    
    const { original_title, name, backdrop_path, release_date, overview, id } = media;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie_item")

    movieCard.innerHTML = `
    <h1 class="title">${original_title || name}</h1>
    <a href="movie.html?id=${id}" id="${id}" class="link">
    <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" onerror="this.src='Img/notfound.jpg';this.id='errorimg';" class="movie_img">
    </a>
    <p>Description : ${overview} </p>
    <p> Date de parution : ${release_date}</p>
    `;
    return movieCard;
}

document.getElementById("joy").addEventListener("input", function() {
    console.log((11-this.value));
    if (this.value <= 11) {
        document.documentElement.style.setProperty("--tailleGauche", `calc( 25% + calc(11%-${this.value}%))`)
    } else {
        document.documentElement.style.setProperty("--tailleGauche", `calc( 25% - ${this.value}%)`)
    }
    
})

document.querySelector(".slider").addEventListener("input", function() {
    
    if (this.value <= 11) {
        console.log((11 - this.value));
        document.documentElement.style.setProperty("--tailleBot", `calc(35% - ${11 - this.value}%)`);
        document.documentElement.style.setProperty("--tailleTop", `calc(35% + ${11 - this.value}%)`);
    } else {
        console.log(-(11 - this.value));
        document.documentElement.style.setProperty("--tailleTop", `calc(35% - ${-(11 - this.value)}%)`);
        document.documentElement.style.setProperty("--tailleBot", `calc(35% + ${-(11 - this.value)}%)`);
    }
    
})



startanimation.onclick = () => {
    document.querySelector("#wrap1").classList.add("rotateClass");
}

sendsearch.onclick = () => {
    chercherFilm();
    recupereFilms();
    document.getElementById("form").remove();
    document.querySelector("#testwrap").remove();
}

movies.addEventListener('mouseover', (event) => {
    const movieItem = event.target.closest('.movie_item');  
    if (movieItem) {
        movieItem.classList.add('permahover');
    }
});

movies.addEventListener('mouseout', (event) =>{
    const movieItem = event.target.closest('.movie_item');  
    if (movieItem){
        movieItem.classList.remove('permahover');
    }
})



send.onclick = () => {
    choixgenre();
    recupereFilms();
    document.getElementById("form").remove();
    document.querySelector("#testwrap").remove();
    console.log(apiUrl); 
}
   
