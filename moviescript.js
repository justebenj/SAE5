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
        
        data.posters.forEach(media => {
            const bannerCard = recupereBanniereFilms(media);
            console.log("Carte créée pour le média :", media);
            moviesContainer.appendChild(bannerCard);
        });
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
recupereBanniere();