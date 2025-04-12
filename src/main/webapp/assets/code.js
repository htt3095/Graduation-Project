function openNav() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.style.width = "250px";
    document.body.classList.add('sidebar-open');
    document.body.style.overflow = "hidden";
    updateArticleBackground();
}

function closeNav() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.style.width = "0";
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = "auto";
    updateArticleBackground();
}

function openNav2() {
    var sidebar2 = document.getElementById("sidebar2");
    if (sidebar2) sidebar2.style.width = "250px";
    document.body.classList.add('sidebar-open');
    document.body.style.overflow = "hidden";
    updateArticleBackground();
}

function closeNav2() {
    var sidebar2 = document.getElementById("sidebar2");
    if (sidebar2) sidebar2.style.width = "0";
    document.body.classList.remove('sidebar-open');
    document.body.style.overflow = "auto";
    updateArticleBackground();
}

// Update article background based on sidebar state
function updateArticleBackground() {
    var sidebar = document.getElementById("sidebar");
    var sidebar2 = document.getElementById("sidebar2");
    var article = document.querySelector('article');

    if (!sidebar || !sidebar2 || !article) return;

    var sidebar1Open = sidebar.style.width === "250px";
    var sidebar2Open = sidebar2.style.width === "250px";

    if (sidebar1Open || sidebar2Open) {
        article.style.backgroundColor = "rgba(0,0,0,0.4)";
    } else {
        article.style.backgroundColor = "";
    }
}

// Initialize sidebars and game container
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebars
    var sidebar = document.getElementById("sidebar");
    var sidebar2 = document.getElementById("sidebar2");

    if (sidebar) sidebar.style.width = "0";
    if (sidebar2) sidebar2.style.width = "0";

    // Set up event listeners
    var openNavBtn = document.querySelector('[onclick="openNav()"]');
    var openNav2Btn = document.querySelector('[onclick="openNav2()"]');
    var closeNavBtn = document.querySelector('.closebtn');
    var closeNav2Btn = document.querySelector('.closebtn2');

    if (openNavBtn) openNavBtn.addEventListener('click', openNav);
    if (openNav2Btn) openNav2Btn.addEventListener('click', openNav2);
    if (closeNavBtn) closeNavBtn.addEventListener('click', closeNav);
    if (closeNav2Btn) closeNav2Btn.addEventListener('click', closeNav2);

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target === document.querySelector('body.sidebar-open')) {
            closeNav();
            closeNav2();
        }
    });

    // Game container logic
    var gameContainer = document.querySelector('#game-container');
    if (!gameContainer) return;

    var currentGenre = document.body.dataset.genre ? document.body.dataset.genre.trim() : '';

    var validGenres = ['Action', 'Adventure', 'RPG', 'Strategy', 'Horror'];

    // Validate genre configuration
    if (validGenres.indexOf(currentGenre) === -1) {
        gameContainer.innerHTML = [
            '<div class="error">',
            'Configuration error: Invalid/missing genre "', currentGenre, '"<br>',
            'Valid genres: ', validGenres.join(', '),
            '</div>'
        ].join('');
        return;
    }

    // Fetch game data from endpoint
    fetch('/games/games')
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
            var releaseDate = game.release_date ? new Date(game.release_date) : null;
            var releaseYear = releaseDate ? releaseDate.getFullYear() : 'N/A';
            var genre = game.category || currentGenre;

            // Use correct path for game details link
            var isIndexPage = window.location.pathname.endsWith('index.html') ||
                window.location.pathname.endsWith('/');
            var detailsPath = isIndexPage ? 'assets/game-details.html' : 'game-details.html';

            return [
                '<a href="', detailsPath, '?id=', game.game_id, '" class="game-box-link">',
                '<div class="game-box">',
                '<img class="game-image" src="', imageUrl, '" alt="', game.name, '" onerror="this.src=\'img/placeholder.jpg\'">',
                '<div class="game-info">',
                '<h3>', game.name, '</h3>',
                '<div class="game-details">',
                '<span class="genre">Genre: ', genre, '</span>',
                '<span class="publisher">Publisher: ', publisher, '</span>',
                '<span class="developer">Developer: ', developer, '</span>',
                '<span class="platform">Platform: ', game.platform || 'Unknown', '</span>',
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
            return '<a href="', g.toLowerCase(), '.html" class="', (g === genre ? 'current' : ''), '">', g, '</a>';
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

var currentUser = null;

// Check if user is already logged in
function checkLoginStatus() {
    fetch('/games/login/check', {
            credentials: 'include'
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok');
        })
        .then(function(user) {
            currentUser = user;
            updateAuthUI();
        })
        .catch(function(error) {
            console.log('No active session:', error);
        });
}

// Helper function to get form values safely
function getFormValues(formId) {
    var form = document.getElementById(formId);
    if (!form) return {};

    var values = {};
    var elements = form.elements;

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.name) {
            values[element.name] = element.value;
        }
    }

    return values;
}

// Handle login form submission
function handleLogin(e) {
    if (e) e.preventDefault();

    var values = getFormValues('loginForm');
    var email = values.email;
    var password = values.password;

    if (!email || !password) {
        var errorElement = document.getElementById('loginError');
        if (errorElement) errorElement.textContent = 'Email and password are required!';
        return;
    }

    fetch('/games/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password }),
            credentials: 'include'
        })
        .then(function(response) {
            if (!response.ok) {
                return response.text().then(function(text) { throw new Error(text || 'Login failed'); });
            }
            return response.json();
        })
        .then(function(result) {
            if (result.success) {
                currentUser = result.user;
                updateAuthUI();
                window.location.href = '/games/index.html';
            } else {
                throw new Error(result.message || 'Login failed');
            }
        })
        .catch(function(error) {
            var errorElement = document.getElementById('loginError');
            if (errorElement) {
                errorElement.textContent = error.message;
            }
            console.error('Login error:', error);
        });
}

// Handle registration form submission
function handleRegister(e) {
    if (e) e.preventDefault();

    var values = getFormValues('registerForm');
    var username = values.username;
    var email = values.email;
    var password = values.password;
    var confirmPassword = values.confirmPassword;

    if (!username || !email || !password || !confirmPassword) {
        var errorElement = document.getElementById('registerError');
        if (errorElement) errorElement.textContent = 'All fields are required!';
        return;
    }

    if (password !== confirmPassword) {
        var errorElement = document.getElementById('registerError');
        if (errorElement) errorElement.textContent = 'Passwords do not match!';
        return;
    }

    fetch('/games/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            }),
            credentials: 'include'
        })
        .then(function(response) {
            if (!response.ok) {
                return response.text().then(function(text) { throw new Error(text || 'Registration failed'); });
            }
            return response.json();
        })
        .then(function(result) {
            if (result.success) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        })
        .catch(function(error) {
            var errorElement = document.getElementById('registerError');
            if (errorElement) {
                errorElement.textContent = error.message.indexOf('Unexpected token') !== -1 ?
                    'Server error occurred' :
                    error.message;
            }
            console.error('Registration error:', error);
        });
}

// Update UI based on auth state
function updateAuthUI() {
    var loginButtons = document.querySelectorAll('.login-link');

    for (var i = 0; i < loginButtons.length; i++) {
        var btn = loginButtons[i];

        if (currentUser) {
            // Create account dropdown
            btn.innerHTML = [
                '<div class="account-dropdown">',
                '<button class="account-btn">', currentUser.username, '</button>',
                '<div class="dropdown-content">',
                '<a href="assets/account.html">Account</a>',
                '<a href="#" onclick="logoutUser()">Logout</a>',
                '</div>',
                '</div>'
            ].join('');
            btn.href = '#';
        } else {
            btn.textContent = 'SIGN IN';
            btn.href = 'login.html';
            btn.onclick = null;
        }
    }

    if (currentUser) initDropdowns();
}

// Initialize dropdown functionality
function initDropdowns() {
    var accountButtons = document.querySelectorAll('.account-btn');

    for (var i = 0; i < accountButtons.length; i++) {
        accountButtons[i].addEventListener('click', function(e) {
            e.stopPropagation();
            var dropdown = this.nextElementSibling;
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            } else {
                dropdown.classList.add('show');
            }
        });
    }

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        var dropdowns = document.querySelectorAll('.dropdown-content');
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    });
}

// Logout function
function logoutUser() {
    fetch('/games/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(function() {
            currentUser = null;
            updateAuthUI();
            window.location.href = '/games/index.html';
        })
        .catch(function(error) {
            console.error('Logout failed:', error);
        });
}

// Search functionality
function setupSearch() {
    const searchForm = document.querySelector('.search-container form');
    const searchBar = document.querySelector('.search-bar');

    if (!searchForm || !searchBar) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchBar.value.trim();

        if (query) {
            // Determine correct path based on current page
            const isIndexPage = window.location.pathname.endsWith('index.html') ||
                window.location.pathname.endsWith('/');
            const isLayoutPage = window.location.pathname.endsWith('layout.html');

            let searchPagePath;
            if (isIndexPage || isLayoutPage) {
                // Coming from index or layout page (outside assets)
                searchPagePath = 'assets/search.html';
            } else {
                // Coming from other pages (inside assets)
                searchPagePath = 'search.html';
            }

            window.location.href = `${searchPagePath}?query=${encodeURIComponent(query)}`;
        }
    });
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupSearch();
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});