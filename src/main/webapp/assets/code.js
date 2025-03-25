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
async function fetchGames() {
    try {
        console.log("Fetching games from server...");
        const response = await fetch('/GradProject/games'); // Adjust URL based on deployment
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const games = await response.json();
        console.log("Games received:", games);

        const gameContainer = document.getElementById("game-container");
        gameContainer.innerHTML = ""; // Clear existing content

        games.forEach(game => {
            const gameBox = document.createElement("div");
            gameBox.classList.add("game-box");
            gameBox.innerHTML = `
                <img src="${game.image_url}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>Genre: ${game.genre}</p>
                <p>Price: $${game.price.toFixed(2)}</p>
                <p>Release Date: ${game.release_date}</p>
            `;
            gameContainer.appendChild(gameBox);
        });

    } catch (error) {
        console.error("Error fetching game data:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchGames);