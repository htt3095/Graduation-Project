document.addEventListener('DOMContentLoaded', function() {
    // Get the search query from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query') || '';

    // Set the search bar value
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.value = decodeURIComponent(searchQuery);

        // Update form submission to handle searches from search page
        searchBar.closest('form').addEventListener('submit', function(e) {
            e.preventDefault();
            const newQuery = searchBar.value.trim();
            if (newQuery) {
                window.location.search = `?query=${encodeURIComponent(newQuery)}`;
            }
        });
    }

    // Load and display search results
    if (searchQuery) {
        loadSearchResults(decodeURIComponent(searchQuery));
    } else {
        displayNoResults();
    }
});

function loadSearchResults(query) {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = '<div class="loading">Searching...</div>';
    }

    // CORRECTED ENDPOINT - points directly to /games/games
    fetch('/games/games')
        .then(function(response) {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(function(games) {
            const filteredGames = filterGames(games, query);
            displaySearchResults(filteredGames, query);
        })
        .catch(function(error) {
            console.error('Error:', error);
            displayError(error);
        });
}


function filterGames(games, query) {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();

    return games.filter(function(game) {
        return (
            game.name.toLowerCase().includes(lowerQuery) ||
            (game.category && game.category.toLowerCase().includes(lowerQuery)) ||
            (game.developer && game.developer.toLowerCase().includes(lowerQuery)) ||
            (game.publisher && game.publisher.toLowerCase().includes(lowerQuery)) ||
            (game.description && game.description.toLowerCase().includes(lowerQuery))
        );
    });
}

function displaySearchResults(games, query) {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    if (games.length === 0) {
        gameContainer.innerHTML = `
            <div class="no-results">
                <h2>No results found for "${query}"</h2>
                <p>Try a different search term or browse our categories.</p>
            </div>
        `;
        return;
    }

    // Determine correct path for game details links
    const isIndexPage = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/');
    const detailsPath = isIndexPage ? 'assets/game-details.html' : 'game-details.html';

    gameContainer.innerHTML = `
        <h2 class="search-results-title">Search Results for "${query}"</h2>
        <div class="game-results-grid">
            ${games.map(function(game) {
                return createGameCard(game, detailsPath);
            }).join('')}
        </div>
    `;
}

function createGameCard(game, detailsPath) {
    const imageUrl = game.image_url || (detailsPath.includes('assets/') ? 'assets/img/placeholder.jpg' : 'img/placeholder.jpg');
    const price = game.price ? game.price.toFixed(2) : '0.00';
    const publisher = game.publisher || 'Unknown Publisher';
    const developer = game.developer || 'Unknown Developer';
    const releaseDate = game.release_date ? new Date(game.release_date) : null;
    const releaseYear = releaseDate ? releaseDate.getFullYear() : 'N/A';
    const genre = game.category || 'Unknown Genre';

    return `
        <a href="${detailsPath}?id=${game.game_id}" class="game-box-link">
            <div class="game-box">
                <img class="game-image" src="${imageUrl}" alt="${game.name}" 
                     onerror="this.src='${detailsPath.includes('assets/') ? 'assets/img/placeholder.jpg' : 'img/placeholder.jpg'}'">
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <div class="game-details">
                        <span class="genre">Genre: ${genre}</span>
                        <span class="publisher">Publisher: ${publisher}</span>
                        <span class="developer">Developer: ${developer}</span>
                        <span class="platform">Platform: ${game.platform || 'Unknown'}</span>
                        <span class="year">Released: ${releaseYear}</span>
                    </div>
                    <div class="game-price">$${price}</div>
                </div>
            </div>
        </a>
    `;
}

function displayNoResults() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = `
            <div class="no-results">
                <h2>No search query provided</h2>
                <p>Please enter a search term in the search bar above.</p>
            </div>
        `;
    }
}

function displayError(error) {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = `
            <div class="error-message">
                <h2>Error loading search results</h2>
                <p>${error.message}</p>
                <p>Please try again later.</p>
            </div>
        `;
    }
}