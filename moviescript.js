const apiKey = 'd2ce126fbc7fe822d2ea9332ea12a63a';
const NOMBRERECOMMANDATION = 5;

function getId(){
    const params = new URLSearchParams(window.location.search);
    const idMovie = params.get("id");

    if (idMovie) {
        console.log("ID récupéré :", idMovie);
        return idMovie;
    } else {
        console.error("Aucun ID trouvé dans l'URL");
    }
}

const movieId=getId();

let apiUrl2 = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}&language=fr-FR&include_image_language=fr,null`;
let apiUrl3 = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr`;
let apiUrl4 = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`;
let IdCollection;

const moviesContainer = document.getElementById("movies");

async function recupereBanniere() {
    try {
        const response = await fetch(apiUrl2);
        const data = await response.json();

        console.log("Données récupérées :", data);

        if (!data.posters || data.posters.length === 0) {
            throw new Error("Aucun poster trouvé dans la réponse de l'API.");
        }
        for (let i = 0; i < data.posters.length; i++) {
            if (i == 0){
                const bannerCard = recupereBanniereFilms(data.posters[i]);
                console.log("Carte créée pour le média :", data.posters[i]);
                moviesContainer.appendChild(bannerCard);
                document.createElement("ul");
            }
            else{
                const bannerCard = recupereBanniereFilmsListe(data.posters[i], i);
                //console.log("Carte créée pour le média :", data.posters[i]);
                //document.getElementById("splide-list").appendChild(bannerCard);   //rajoute toutes les autres bannieres

                
            }
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des informations :", error);
    }
}


function recupereBanniereFilms (media) {
    const { file_path } = media;

    const imageUrl = file_path ? `https://image.tmdb.org/t/p/w500/${file_path}` : 'Img/notfound.jpg';


    const bannerCard = document.createElement("div");
    bannerCard.classList.add("movie_banner_item")

    bannerCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500/${file_path}" onerror="this.src='Img/notfound.jpg';this.id='errorimg';" class="movie_img">
    `;
    return bannerCard;
}

function recupereBanniereFilmsListe (media, i) {

    
    const { file_path } = media;

    const imageUrl = file_path ? `https://image.tmdb.org/t/p/w500/${file_path}` : 'Img/notfound.jpg';


    const bannerCard1 = document.createElement("li");
    bannerCard1.classList.add("splide_slide")


    bannerCard1.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500/${file_path}" onerror="this.src='Img/notfound.jpg';this.id='errorimg';" class="splide_slide" id="${i}">
    `;
    return bannerCard1;
}

async function recupereDetails(){

    const response = await fetch(apiUrl3);
    const data = await response.json();

    console.log(data.belongs_to_collection);

    const movieCard = document.createElement("div");
    movieCard.classList.add("infos");

    movieCard.innerHTML = `
    <article>
    <h1>${data.title || data.name}</h1>
    <h2>Nom original : ${data.original_title}</h2>
    <p>${data.overview}</p>
    <p> Produit par : ${data.production_companies[0].name}</p>
    </article>
    `;

    document.getElementById("movieContainer").appendChild(movieCard);
    if (data.belongs_to_collection) {
        IdCollection = (data.belongs_to_collection.id);
    }
    else{
        document.getElementById("collection.show").hidden = true;
    }
    return movieCard;
}

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0'); 

    return `${year}/${month}/${day}`;
}

async function collectionFilm(collection_id){
    let apiUrl5 = `https://api.themoviedb.org/3/collection/${collection_id}?api_key=${apiKey}&language=fr`;
    const response = await fetch(apiUrl5);
    const data = await response.json();

    data.parts.forEach(part => {
        const collectionCard = document.createElement("article");
        collectionCard.classList.add("collectionCard");

        if (part.release_date < getFormattedDate()) {
            collectionCard.innerHTML = `
            <h1>${part.title}</h1>
            <img id="poster" src="https://image.tmdb.org/t/p/w500/${part.poster_path}">             
            <p>${part.overview}</p>
            `
        }
        else{
            collectionCard.innerHTML = `
            <h1>${part.title}</h1>
            <img id="poster" src="https://image.tmdb.org/t/p/w500/${part.poster_path}">
            <p>Le film sortira le : ${part.release_date}</p>
            `
        }

        
        document.getElementById("collection").appendChild(collectionCard);
    });
}

function minEnHeure(m){
    let res = [Math.floor(m/60),m%60];
    return res;
}

async function plusDetails(){
    const response = await fetch(apiUrl4);
    const data = await response.json();

    const genreHTML = document.createElement("p");
    genreHTML.classList.add("movie_item");
    genreHTML.innerHTML = `Genres de ${data.title} :`
    placedetails.appendChild(genreHTML);

    data.genres.forEach(element => {
        const movieDetails = creationHTMLDetails(element);
        placedetails.appendChild(movieDetails);
    });

    const moredetails = document.createElement("article");
    moredetails.classList.add("movie_item");
    moredetails.innerHTML = `
    <p> Durée du film : ${minEnHeure(data.runtime)[0]}h${minEnHeure(data.runtime)[1]}</p>
    <p> Votes moyens du film : ${data.vote_average}</p>
    <p> Budget du film : ${data.budget} $</p>
    <p> Recette : ${data.revenue} $</p>
    `
    placedetails.appendChild(moredetails);
}

function creationHTMLDetails(element) {
    const movieDetails = document.createElement("div");
    movieDetails.classList.add("movie_item");

    movieDetails.innerHTML = `
    <article>
    <button>${element.name}</button>
    </article>
    `
    return movieDetails;
}


async function recupereSimilar() {
    let apiUrl6 = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1&`;

    const response = await fetch(apiUrl6);
    const data = await response.json();

    console.log(data.results);

    for (let i = 0; i < NOMBRERECOMMANDATION; i++) {
        const similarCard = document.createElement("article");
        similarCard.classList.add("movie_similar");
        
        similarCard.innerHTML = `
        <h1>${data.results[i].title}</h1>
        <img src="https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}">
        <p>${data.results[i].overview}</p>
        `

        document.getElementById("similarMovies").append(similarCard);
    }
}

const details = document.getElementsByClassName("details");

let clicke = false;
document.body.addEventListener("click", (event) =>{
    if (event.target.matches(".details")){
        if (clicke == false) {
            plusDetails();
            document.getElementById("+details").hidden = true;
            document.getElementById("-details").hidden = false;
            clicke = true;
        } else {
            document.getElementById("-details").hidden = true;
            document.getElementById("+details").hidden = false;
            var elements = document.getElementsByClassName("movie_item");
            while (elements[0]){
                elements[0].parentNode.removeChild(elements[0]);
            }
            clicke = false;
        }  
    }
})




let clicke2 = false;
document.body.addEventListener("click", (event) =>{
    if (event.target.matches(".similar")){
        if (clicke2 == false) {
            document.getElementById("+similar").hidden = true;
            document.getElementById("-similar").hidden = false;
            recupereSimilar();
            clicke2 = true;
        } else {
            document.getElementById("-similar").hidden = true;
            document.getElementById("+similar").hidden = false;
            var elements = document.getElementsByClassName("movie_similar");
            while (elements[0]){
                elements[0].parentNode.removeChild(elements[0]);
            }
            clicke2 = false;
        }  
    }
})

let clicke3 = false;
document.body.addEventListener("click", (event) =>{
    if (event.target.matches(".collsh")){
        if (clicke3 == false) {
            document.getElementById("collection.show").hidden = true;
            document.getElementById("collection.hide").hidden = false;
            collectionFilm(IdCollection);
            clicke3 = true;
        } else {
            document.getElementById("collection.hide").hidden = true;
            document.getElementById("collection.show").hidden = false;
            var elements = document.getElementsByClassName("collectionCard");
            while (elements[0]){
                elements[0].parentNode.removeChild(elements[0]);
            }
            clicke3 = false;
        }  
    }
})

recupereDetails();
recupereBanniere();

