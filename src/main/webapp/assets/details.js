document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.game-details-container')) {
        loadGameDetails();
    }
});

function loadGameDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        displayError('No game ID specified');
        return;
    }

    // First fetch the main game details
    fetch(`/games/details/${gameId}`)
        .then(response => {
            if (!response.ok) throw new Error('Game not found');
            return response.json();
        })
        .then(gameData => {
            updateGameDetails(gameData);
            // Then fetch similar games
            return fetch(`/games/similar/${gameId}`);
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch similar games');
            return response.json();
        })
        .then(similarGames => {
            displaySimilarGames(similarGames);
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(error.message);
        });
}

function updateGameDetails(game) {
    // Update main game details
    document.getElementById('game-title').textContent = game.name || 'Unknown';
    document.getElementById('developer').textContent = game.developer || 'Unknown';
    document.getElementById('category').textContent = game.category || 'Unknown';
    document.getElementById('publisher').textContent = game.publisher || 'Unknown';
    document.getElementById('release-date').textContent = game.release_date || 'Unknown';
    document.getElementById('description').textContent = game.description || 'No description available';
    document.getElementById('detailed-description').textContent = game.detailed_description || 'No detailed description available';

    // Update price
    const priceElement = document.getElementById('game-price');
    if (priceElement) {
        priceElement.textContent = game.price ? formatPrice(game.price) : 'Price not available';
    }

    // Update image
    const gameImage = document.getElementById('game-image');
    if (gameImage) {
        gameImage.src = fixImagePath(game.image_url) || '../img/placeholder.jpg';
        gameImage.alt = game.name || 'Game image';
    }
}

function displaySimilarGames(games) {
    const slider = document.getElementById('similar-games-slider');
    if (!slider) {
        console.error('Similar games slider not found');
        return;
    }

    slider.innerHTML = ''; // Clear previous content

    if (!games || games.length === 0) {
        slider.innerHTML = '<p class="no-similar-games">No similar games found</p>';
        return;
    }

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'similar-game-card';

        gameCard.innerHTML = `
            <a href="game-details.html?id=${game.game_id}">
                <img src="${fixImagePath(game.image_url) || '../img/up.jpeg'}" 
                     alt="${game.name}"
                     onerror="this.src='../img/down.jpeg'">
                <div class="similar-game-info">
                    <h3>${game.name}</h3>
                </div>
            </a>
        `;

        slider.appendChild(gameCard);
    });
}

// Helper functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price * 23000);
}

function fixImagePath(url) {
    if (!url) return null;
    if (url.startsWith('img/img/')) return url.replace('img/img/', 'img/');
    if (!url.startsWith('img/') && !url.startsWith('http')) return `img/${url}`;
    return url;
}

function displayError(message) {
    const container = document.querySelector('.game-details-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Error Loading Game</h2>
                <p>${message}</p>
                <a href="../index.html" class="back-link">Return to Home</a>
            </div>
        `;
    }
}