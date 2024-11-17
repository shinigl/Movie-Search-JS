let searchBar = document.getElementById('searchInput');
let moviesContainer = document.getElementById('results');
let loadMoreBtn = document.getElementById('load');

let currentPage = 1;  // To keep track of the current page
let movieName = '';

// Debounce function
let timer;
function debouncing(movie, delay) {
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            movieName = movie;
            currentPage = 1;  // Reset page to 1 when new search is made
            if (movieName.trim() === '') {
                // If input is empty, hide the "Load More" button and clear results
                moviesContainer.innerHTML = '';
                loadMoreBtn.style.display = 'none';
            } else {
                getMovies(movieName, currentPage);
            }
            getMovies(movieName, currentPage);
        }, delay);
    };
}

searchBar.addEventListener('keyup', () => {
    let movieName = searchBar.value;
    const improvedFunction = debouncing(movieName, 1000); 
    improvedFunction(); // Calling debouncing function
});

// Fetching OMDB API with pagination support
async function getMovies(movieName, currentPage) {
    try {
        let response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=37f749f4&s=${movieName}&page=${currentPage}`);
        let data = await response.json();
        console.log(data);
        // Check if data.Response is 'True'
        if (data.Response === 'True') {
          moviesContainer.innerHTML = '';
          showMovies(data); 
          loadMoreBtn.style.display = 'block';  
        } else { 
            moviesContainer.innerHTML = `<p class="error">No movies found for '${movieName}'. Please try a different search.</p>`;
            loadMoreBtn.style.display = 'none';  
        }

    } catch (err) {
        console.error('Error:', err);
        moviesContainer.innerHTML = `<p class="error">An error occurred while fetching data.Try again</p>`;
        loadMoreBtn.style.display = 'none';  
    }
}

// Show movies in the container
function showMovies(data) {

    // Check if data.Search exists and is an array
    if (Array.isArray(data.Search)) {
        data.Search.forEach((element) => {
            let movieBox = document.createElement('div');
            movieBox.id = 'movieCon';
            
            let photo = document.createElement('img');
            photo.src = element.Poster ;
            
            let title = document.createElement('h2');
            title.innerText = element.Title;
            
            let year = document.createElement('p');
            year.innerText = element.Year;

            movieBox.appendChild(photo);
            movieBox.appendChild(title);
            movieBox.appendChild(year);

            moviesContainer.appendChild(movieBox);

            // Store movie title for trailer search
            movieBox.dataset.title = element.Title;
            movieBox.addEventListener('click', () => showTrailer(element.Title));
        });
    } else {
        console.error("Error: 'Search' is not an array or doesn't exist", data);
        moviesContainer.innerHTML = `<p class="error">Search for an actual movie name</p>`;
        lo
         
    }
}

// Show trailer in a new tab
function showTrailer(movieTitle) {
    const trailerURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle)}+trailer`;
    window.open(trailerURL, '_blank');
}

// Load More Button functionality
loadMoreBtn.addEventListener('click', () => {
    loadMoreBtn.style.display = 'none';  // Hide the button while fetching
    currentPage++;  // Increment the current page
    getMovies(movieName, currentPage);  // Fetch next page of movies
});

window.onload = function() {
    getMovies('Batman', currentPage);  // Default search when the page loads
};
