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
    let max1 = 0;
    let max1i = 0;
    let max2 = 0;
    let max2i = 0;
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
    genre = categorie[max1i];
    genre2 = categorie[max2i];
    const ranking = document.getElementById("ranking");
    const language = document.getElementById("langue");
    console.log(genre);   // Affiche la valeur de genre
    console.log(genre2);
    apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre},${genre2}&include_adult=${adults}&sort_by=${ranking.value}&with_original_language=${langue.value}`;
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

    
    const { original_title, name, backdrop_path, release_date, overview } = media;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie_item")

    movieCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" onerror="this.src='Img/notfound.jpg';this.id='errorimg';" class="movie_img">
    <div class="title">${original_title || name}, sortie en : ${release_date}</div>
    <p>Description : ${overview} </p>
    `;
    return movieCard;
}


send.onclick = () => {
    choixgenre();
    recupereFilms();
    document.getElementById("form").remove();
    console.log(apiUrl); 
}
   
