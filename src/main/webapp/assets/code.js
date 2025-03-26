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

document.addEventListener("DOMContentLoaded", function() {
    fetchGames();
});

function fetchGames() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Graduation-Project/games", true); // Ensure the correct servlet URL

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Games data received successfully.");
                var games = JSON.parse(xhr.responseText);
                if (games.length === 0) {
                    console.warn("No games found in database.");
                } else {
                    filterGamesByGenre(games);
                }
            } else {
                console.error("Failed to fetch games. Server responded with status:", xhr.status);
            }
        }
    };

    xhr.send();
}

function getCurrentGenre() {
    var path = window.location.pathname; // Example: /genres/Action.html
    var pageName = path.split("/").pop(); // Extracts "Action.html"
    var genre = pageName.replace(".html", ""); // Removes ".html" to get "Action"
    return genre;
}

function filterGamesByGenre(games) {
    var genre = getCurrentGenre();
    console.log("Filtering games for genre:", genre);

    var filteredGames = games.filter(function(game) {
        return game.category_id === getCategoryId(genre); // Match games by category_id
    });

    displayGames(filteredGames);
}

function displayGames(games) {
    var gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; // Clear previous content

    if (games.length === 0) {
        gameContainer.innerHTML = "<p>No games available for this genre.</p>";
        return;
    }

    games.forEach(function(game) {
        var gameBox = document.createElement("div");
        gameBox.className = "game-box";
        gameBox.setAttribute("data-genre", getCategoryName(game.category_id));

        var img = document.createElement("img");
        img.className = "game-image";
        img.src = game.image_url;
        img.alt = game.name;

        var gameInfo = document.createElement("div");
        gameInfo.className = "game-info";

        var title = document.createElement("h3");
        title.textContent = game.name;

        var details = document.createElement("p");
        details.textContent = getCategoryName(game.category_id) + " | Developer ID: " + game.developer_id + " | " + game.release_date;

        var price = document.createElement("div");
        price.className = "game-price";
        price.textContent = "$" + game.price.toFixed(2);

        gameInfo.appendChild(title);
        gameInfo.appendChild(details);
        gameBox.appendChild(img);
        gameBox.appendChild(gameInfo);
        gameBox.appendChild(price);
        gameContainer.appendChild(gameBox);
    });
}

// Map category IDs to category names
function getCategoryName(categoryId) {
    var categories = {
        1: "Action",
        2: "RPG",
        3: "Adventure",
        4: "Strategy",
        5: "Simulation"
    };

    return categories[categoryId] || "Unknown";
}

// Map genre names to category IDs
function getCategoryId(genre) {
    var categories = {
        "Action": 1,
        "RPG": 2,
        "Adventure": 3,
        "Strategy": 4,
        "Simulation": 5
    };

    return categories[genre] || null;
}