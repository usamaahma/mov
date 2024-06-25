const apikey = "9f60807ab4802d70e9d53ffbf834dc1d";
const searchInput = document.getElementById("search-input");
const moviesContainer = document.getElementById("movies-container");
const movieDetails = document.getElementById("movie-details");
const overlay = document.getElementById("overlay");

loadMoviesFromLocalStorage();

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
        fetchMovies(searchTerm);
    } else {
        moviesContainer.innerHTML = "";
    }
});
function fetchMovies(searchTerm) {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${apikey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                console.log(data);
                displayMovies(data.results);
                saveMoviesToLocalStorage(data.results);
            } else {
                NotFound();
            }
        })
        .catch(error => {
            console.log("An Error Occured: ", error);
            NotFound();
        });
}

function NotFound() {
    moviesContainer.innerHTML = `<h3>Movie Not Found</h3>`;
}

function displayMovies(movies) {
    moviesContainer.innerHTML = "";
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <h3>Release Date: ${movie.release_date}</h3>
        `;
        movieCard.addEventListener("click", () => showMovieDetails(movie));
        moviesContainer.appendChild(movieCard);
    });
}

function showMovieDetails(movie) {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apikey}`)
        .then(response => response.json())
        .then(data => {
            const cast = data.cast.slice(0, 5).map(actor => actor.name).join(", ");
            movieDetails.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" style="width:5rem">
                <h2>${movie.title}</h2>
                <h3>Rating: ${movie.vote_average}</h3>
                <p>Plot: ${movie.overview}</p>
                <h3>Cast: ${cast}</h3>
                <button onclick="closeDetails()">Close</button>
            `;
            movieDetails.style.display = "block";
            overlay.style.display = "block";
        })
        .catch(error => console.log("An Error Occurred: ", error));
}

function closeDetails() {
    movieDetails.style.display = "none";
    overlay.style.display = "none";
}
document.addEventListener('click', function (event) {
    if (movieDetails.style.display === "block") {
        closeDetails();
    }
});

function saveMoviesToLocalStorage(movies) {
    localStorage.setItem("searchedMovies", JSON.stringify(movies));
}

function loadMoviesFromLocalStorage() {
    const savedMovies = localStorage.getItem("searchedMovies");
    if (savedMovies) {
        const movies = JSON.parse(savedMovies);
        displayMovies(movies);
    }
}
function hideDetails() {
    movieDetails.style.display = "none";
}
