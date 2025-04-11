// =============================================
// COMPLETE GAME DISPLAY SYSTEM WITH SIDEBAR FIX
// =============================================

/**
 * Helper function to determine correct image path
 */
function getImagePath(imageUrl) {
    const isIndexPage = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/');

    // Handle empty image URLs
    if (!imageUrl) {
        return isIndexPage ? 'assets/img/default-game.jpg' : 'img/default-game.jpg';
    }

    // Handle absolute URLs and paths
    if (imageUrl.includes('://') || imageUrl.startsWith('/')) {
        return imageUrl;
    }

    // Special handling for up/down images on index page
    if (isIndexPage && (imageUrl === 'img/up.jpeg' || imageUrl === 'img/down.jpeg')) {
        return `assets/${imageUrl}`;
    }

    // Default handling for other cases
    return isIndexPage && imageUrl.startsWith('img/') ?
        `assets/${imageUrl}` :
        imageUrl;
}

/**
 * Fixes background issue when sidebars appear
 */
function fixSidebarBackground() {
    const article = document.querySelector('article');
    const sidebar = document.getElementById('sidebar');
    const sidebar2 = document.getElementById('sidebar2');

    function updateArticleZIndex() {
        const sidebarOpen = sidebar.style.width !== '0px' && sidebar.style.width !== '';
        const sidebar2Open = sidebar2.style.width !== '0px' && sidebar2.style.width !== '';

        if (sidebarOpen || sidebar2Open) {
            article.classList.add('sidebar-open');
        } else {
            article.classList.remove('sidebar-open');
        }
    }

    // Create mutation observers to watch for sidebar changes
    const observer = new MutationObserver(updateArticleZIndex);
    const observer2 = new MutationObserver(updateArticleZIndex);

    if (sidebar) {
        observer.observe(sidebar, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    if (sidebar2) {
        observer2.observe(sidebar2, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // Initial check
    updateArticleZIndex();
}

/**
 * Main function to load and display games
 */
async function loadGames() {
    try {
        // Add the games.css stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'games.css';
        document.head.appendChild(link);

        // Add game-display class to article
        const article = document.querySelector('article');
        article.classList.add('game-display');

        // Fix sidebar background issue
        fixSidebarBackground();

        // Fetch games from endpoint
        const response = await fetch('/games/games');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const games = await response.json();

        // Clear and populate article section
        article.innerHTML = '';
        createFeaturedCarousel(article, games);
        createGenreSections(article, games);

    } catch (error) {
        console.error('Error loading games:', error);
        showErrorMessage(error);
    }
}

/**
 * Create featured carousel at the top
 */
function createFeaturedCarousel(container, games) {
    if (!games || games.length === 0) {
        container.innerHTML = `
            <div class="game-error-message">
                <h2>No Games Found</h2>
                <p>No games were returned from the server</p>
            </div>
        `;
        return;
    }

    // Select 5 random featured games
    const featuredGames = [...games]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(5, games.length));

    const carouselHTML = `
        <section class="game-featured-carousel">
            <h2 class="game-section-title">Featured Games</h2>
            <div class="game-carousel-container">
                ${featuredGames.map(game => `
                    <div class="game-carousel-item">
                        <div class="game-carousel-img-container">
                            <img src="${getImagePath(game.image_url)}" 
                                 alt="${game.name}" 
                                 class="game-carousel-img"
                                 loading="lazy">
                        </div>
                        <div class="game-carousel-info">
                            <h3>${game.name}</h3>
                            <p>${game.description || 'No description available'}</p>
                            <div class="game-carousel-price">$${(game.price || 0).toFixed(2)}</div>
                            <button class="game-view-btn" data-id="${game.game_id}">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="game-carousel-controls">
                <button class="game-carousel-btn game-carousel-prev">❮</button>
                <button class="game-carousel-btn game-carousel-next">❯</button>
            </div>
        </section>
    `;
    
    container.insertAdjacentHTML('beforeend', carouselHTML);
    setupCarousel();
}

/**
 * Create genre sections below the carousel
 */
function createGenreSections(container, games) {
    // Group games by category
    const gamesByCategory = {};
    games.forEach(game => {
        const category = game.category || 'Other';
        if (!gamesByCategory[category]) {
            gamesByCategory[category] = [];
        }
        gamesByCategory[category].push(game);
    });
    
    // Create a section for each category
    for (const [category, categoryGames] of Object.entries(gamesByCategory)) {
        const sectionHTML = `
            <section class="game-category-section">
                <h2 class="game-section-title">${category} Games</h2>
                <div class="game-category-grid">
                    ${categoryGames.map(game => `
                        <div class="game-card">
                            <img src="${getImagePath(game.image_url)}" 
                                 alt="${game.name}" 
                                 class="game-card-img"
                                 loading="lazy">
                            <div class="game-card-info">
                                <h3 class="game-card-title">${game.name}</h3>
                                <div class="game-card-meta">
                                    <span class="game-card-platform">${game.platform || 'Multiple'}</span>
                                    <span class="game-card-price">$${(game.price || 0).toFixed(2)}</span>
                                </div>
                                <button class="game-view-btn" data-id="${game.game_id}">View Details</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
        
        container.insertAdjacentHTML('beforeend', sectionHTML);
    }
}

/**
 * Setup carousel functionality
 */
function setupCarousel() {
    const carousel = document.querySelector('.game-carousel-container');
    const items = document.querySelectorAll('.game-carousel-item');
    
    if (!carousel || items.length === 0) return;
    
    const prevBtn = document.querySelector('.game-carousel-prev');
    const nextBtn = document.querySelector('.game-carousel-next');
    
    let currentIndex = 0;
    const itemWidth = items[0].clientWidth;
    const totalItems = items.length;
    let carouselInterval;
    
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    
    function startCarousel() {
        carouselInterval = setInterval(() => {
            currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        }, 5000);
    }
    
    prevBtn.addEventListener('click', () => {
        clearInterval(carouselInterval);
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalItems - 1;
        updateCarousel();
        startCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        clearInterval(carouselInterval);
        currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : 0;
        updateCarousel();
        startCarousel();
    });
    
    // Pause on hover
    carousel.parentElement.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carousel.parentElement.addEventListener('mouseleave', () => {
        startCarousel();
    });
    
    // Initialize
    startCarousel();
}

/**
 * Show error message
 */
function showErrorMessage(error) {
    document.querySelector('article').innerHTML = `
        <div class="game-error-message">
            <h2>Error loading games</h2>
            <p>${error.message}</p>
            <p>Please check if the server is running and accessible at http://localhost:8080/games/games</p>
        </div>
    `;
}

/**
 * Handle view buttons
 */
function setupViewButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('game-view-btn')) {
            const gameId = e.target.getAttribute('data-id');
            const isIndexPage = window.location.pathname.endsWith('index.html') || 
                              window.location.pathname.endsWith('/');
            
            // Use correct path based on current page
            const basePath = isIndexPage ? 'assets/' : '';
            window.location.href = `${basePath}game-details.html?id=${gameId}`;
        }
    });
}

/**
 * Initialize when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Only load games if we're on the homepage
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname.endsWith('/') || 
        window.location.pathname.endsWith('layout.html')) {
        loadGames();
    }
    
    // Setup view buttons
    setupViewButtons();
});