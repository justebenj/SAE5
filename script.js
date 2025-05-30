const apiKey = 'd2ce126fbc7fe822d2ea9332ea12a63a';
let genre;
let genre2;
let repAct = 0;
const catFilms = [12,28,53,27,10749,18,99,35,35,53];

let popAct = 0;

tabLeft = ['Img/smileEmoji.png','Img/energyEmoji.png','Img/complexEmoji.png','Img/tensionEmoji.png','Img/romanceEmoji.png'];
tabRight = ['Img/sadEmoji.png','Img/calmEmoji.png','Img/simpleEmoji.png','Img/chillEmoji.png','Img/notRomanceEmoji.png'];
tabLib = ['Comment te sens-tu?', 'Comment est ton energie ?', 'Est-tu fatigue intelectuellement ?', 'Est-tu tendu ?', 'Est-tu dans un mood romantique ?', 'Quelques parametres supplementaires :'];

let currentTheme = sessionStorage.getItem('theme');
document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');

const moviesContainer = document.getElementById("movies");


async function recupereFilms(apiUrl) {
    
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
    <img src="https://image.tmdb.org/t/p/w780/${backdrop_path}" onerror="this.src='Img/notfound.jpg';this.id='errorimg';" class="movie_img">
    </a>
    <p hidden=true>Description : ${overview} </p>
    `;
    return movieCard;
}


let slider = document.querySelector('#caca');

slider.addEventListener("input", function() {
    let newSize;
    const distanceFromCenter = Math.abs(this.value - 10);
    if (this.value <= 10) {
        slider.classList.remove('sad');
        document.documentElement.style.setProperty('--img-range', `url(${tabLeft[repAct]})`);
    } else {
        slider.classList.add('sad');
        document.documentElement.style.setProperty('--img-range', `url(${tabRight[repAct]})`);
    }
    newSize = 35 + ((distanceFromCenter / 10) * (20)/1.5);
    changeThumbSize(newSize);
})

function changeThumbSize(size) {
    slider.style.setProperty('--thumb-size', size + 'px');
}


sendsearch.onclick = () => {
    const recherche = document.querySelector('#search').value;
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${recherche}`;
    let items = document.querySelectorAll('.movie_item')
    if (items){
        items.forEach(element => element.remove());
    }
    let wrap = document.querySelector("#pureWrap");
    if (wrap) {document.querySelector("#pureWrap").remove()};
    let poster = document.querySelector("#popular");
    if (poster) {document.querySelector("#popular").remove()};
    recupereFilms(apiUrl);
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


const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
        else{
            entry.target.classList.remove("visible");
        }
    });
}, { 
    root:null,
    threshold: 0.1 
});

const observeNewElements = () => {
    document.querySelectorAll(".movie_item").forEach(box => observer.observe(box));
};

// Observer les éléments déjà présents
observeNewElements();

// Observer les nouveaux éléments après un chargement dynamique
const mutationObserver = new MutationObserver(observeNewElements);
mutationObserver.observe(document.body, { childList: true, subtree: true });


let tabAnswer = [];

function sendAnswer(){
    const range = document.querySelector('#caca');
    const title = document.querySelector('#titleWrap');
    const button = document.querySelector('#sendAnswer');
    if (repAct == 4) {
        tabAnswer[repAct] = range.value;
        range.remove();
        button.innerHTML = 'Afficher les films !'
        document.querySelector('#ranking').removeAttribute("hidden");
        document.querySelector('#langue').removeAttribute("hidden");
    }
    if (repAct == 5) {
        let indices = get2Max(tabAnswer);
        let genres = [];
        indices.forEach(valeur =>{
            let val = valeur > 0 ? valeur + 5 : -valeur;
            genres.push(catFilms[val]);
        });
        const ranking = document.getElementById("ranking").value;
        const language = document.getElementById("langue").value; 
        const apiUrl = language == "undefined" ? 
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genres[0]},${genres[1]}&sort_by=${ranking}&vote_count.gte=300` : 
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genres[0]},${genres[1]}&sort_by=${ranking}&vote_count.gte=300&with_original_language=${language}`;
        recupereFilms(apiUrl);
        document.querySelector('#pureWrap').remove();
        document.querySelector('#popular').remove();
    }
    else {
        tabAnswer[repAct] = range.value;
        range.value = 10;
        title.innerHTML = `${tabLib[repAct+1]}`;
        document.documentElement.style.setProperty('--img-range', `url(${tabLeft[repAct+1]})`);
    }
    repAct++;
    
}

function get2Max(tabAnswer) {
    let max1 = { diff: -1, index: -1, sign: 1 };
    let max2 = { diff: -1, index: -1, sign: 1 };

    tabAnswer.forEach((val, i) => {
        const num = parseInt(val);
        const diff = Math.abs(num - 10);
        const sign = num < 10 ? -1 : 1;

        if (diff > max1.diff) {
            max2 = { ...max1 }; 
            max1 = { diff, index: i, sign };
        } else if (diff > max2.diff) {
            max2 = { diff, index: i, sign };
        }
    });

    const result = [
        max1.sign < 0 ? -max1.index : max1.index,
        max2.sign < 0 ? -max2.index : max2.index
    ];
    return result;
}
let postersPop = [];
let isPos = 0;
let pos0,pos1,po2,pos3;
async function getPopular(){
    const answer = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`);
    const data = await answer.json();
    const listPop = data.results.slice(0,4);
    listPop.forEach((element,index) => {
        const article = document.createElement('article');
        let date = element.release_date;
        date = date.replace(/-/g, "/");
        article.innerHTML = `
        <a href="movie.html?id=${element.id}">
        <img class="pos${index}" src="https://image.tmdb.org/t/p/w780/${element.poster_path}">
        </a>
        <h1>${element.title}</h1>
        <h2>${date}</h2>
        `;
        preloadImage(`https://image.tmdb.org/t/p/w780/${element.poster_path}`);
        document.querySelector('#movPop').appendChild(article);
        postersPop.push("https://image.tmdb.org/t/p/original/" + element.backdrop_path);
    });
    isPos = 1;
    document.documentElement.style.setProperty('--banner-url2', `url(${postersPop[0]})`);
    pos0 = document.querySelector('#pos0');
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


getPopular();

document.addEventListener("keypress", function(event){
    if (event.ctrlKey) {
        if (event.keyCode == 13) {
            const recherche = document.querySelector('#search').value;
            const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${recherche}`;
            let items = document.querySelectorAll('.movie_item')
            if (items){
                items.forEach(element => element.remove());
            }
            let wrap = document.querySelector("#pureWrap");
            if (wrap) {document.querySelector("#pureWrap").remove()};
            let poster = document.querySelector("#popular");
            if (poster) {document.querySelector("#popular").remove()};
            recupereFilms(apiUrl);
        }
    }
});

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