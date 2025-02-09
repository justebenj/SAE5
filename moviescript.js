const apiKey = 'd2ce126fbc7fe822d2ea9332ea12a63a';


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

const moviesContainer = document.getElementById("movies");

async function recupereBanniere() {
    try {
        console.log("Tentative de récupération des données depuis l'API...");

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

    try{
        //TODO code banniere film (CTRL C CTRL V)
    } catch(error){
        //TODO code banniere serie
    }
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

    console.log(data.production_companies);

    const movieCard = document.createElement("div");
    movieCard.classList.add("infos")

    movieCard.innerHTML = `
    <article>
    <h1>${data.title || data.name}</h1>
    <h2>Nom original : ${data.original_title}</h2>
    <p>${data.overview}</p>
    <p> Produit par : ${data.production_companies[0].name}</p>
    </article>
    `;

    document.getElementById("movieContainer").appendChild(movieCard);
    return movieCard;
}

recupereDetails();
recupereBanniere();

