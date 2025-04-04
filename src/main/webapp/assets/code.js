// Sidebar functions
function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.body.style.backgroundColor = "white";
}

function openNav2() {
    document.getElementById("sidebar2").style.width = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav2() {
    document.getElementById("sidebar2").style.width = "0";
    document.body.style.backgroundColor = "white";
}

document.addEventListener('DOMContentLoaded', function() {
    var gameContainer = document.querySelector('#game-container');
    var bodyDataset = document.body.dataset;
    var currentGenre = '';

    // Get genre from data attribute
    if (bodyDataset && bodyDataset.genre) {
        currentGenre = bodyDataset.genre.trim();
    }

    var validGenres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Horror'];

    // Validate genre configuration
    if (!validGenres.includes(currentGenre)) {
        gameContainer.innerHTML = [
            '<div class="error">',
            'Configuration error: Invalid/missing genre "', currentGenre, '"<br>',
            'Valid genres: ', validGenres.join(', '),
            '</div>'
        ].join('');
        return;
    }

    // Fetch game data from endpoint
    fetch('http://localhost:8080/games/games')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(function(games) {
            var filteredGames = games.filter(function(game) {
                return game.category === currentGenre;
            });

            gameContainer.innerHTML = filteredGames.length > 0 ?
                createGameCards(filteredGames) :
                createNoGamesMessage(currentGenre);
        })
        .catch(function(error) {
            console.error('Fetch Error:', error);
            gameContainer.innerHTML = [
                '<div class="error">',
                error.message.replace('Unexpected token', 'Server response error'), '<br>',
                'Verify the endpoint /games/games returns valid JSON',
                '</div>'
            ].join('');
        });

    function createGameCards(games) {
        return games.map(function(game) {
            var imageUrl = game.image_url || 'img/placeholder.jpg';
            var price = game.price ? game.price.toFixed(2) : '0.00';
            var publisher = game.publisher || 'Unknown Publisher';
            var developer = game.developer || 'Unknown Developer';
            var releaseYear = game.release_date ? new Date(game.release_date).getFullYear() : 'N/A';
            var genre = game.category || currentGenre;

            return [
                '<a href="game-details.html?id=', game.game_id, '" class="game-box-link">',
                '<div class="game-box">',
                '<img class="game-image" src="', imageUrl, '" alt="', game.name, '" onerror="this.src=\'img/placeholder.jpg\'">',
                '<div class="game-info">',
                '<h3>', game.name, '</h3>',
                '<div class="game-details">',
                '<span class="genre">Genre: ', genre, '</span>',
                '<span class="publisher">Publisher: ', publisher, '</span>',
                '<span class="developer">Developer: ', developer, '</span>',
                '<span class="platform">Platform: ', game.platform, '</span>',
                '<span class="year">Released: ', releaseYear, '</span>',
                '</div>',
                '<div class="game-price">$', price, '</div>',
                '</div>',
                '</div>',
                '</a>'
            ].join('');
        }).join('');
    }

    function createNoGamesMessage(genre) {
        var links = validGenres.map(function(g) {
            return '<a href="/', g.toLowerCase(), '.html" class="', (g === genre ? 'current' : ''), '">', g, '</a>';
        }).join('');

        return [
            '<div class="no-games">',
            '<h2>No ', genre, ' Games Found</h2>',
            '<p>Please check back later or browse other categories:</p>',
            '<div class="genre-links">', links, '</div>',
            '</div>'
        ].join('');
    }
});