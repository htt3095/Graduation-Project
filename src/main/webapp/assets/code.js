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
    fetch('/games') // ✅ Changed to match servlet mapping
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            console.log("Fetched games:", games); // Debugging

            let gameContainer = document.getElementById("game-container");
            gameContainer.innerHTML = ""; // Clear placeholder boxes

            if (games.length === 0) {
                gameContainer.innerHTML = "<p>No games available.</p>";
                return;
            }

            games.forEach(game => {
                let gameBox = document.createElement("div");
                gameBox.classList.add("game-box");
                gameBox.dataset.genre = game.category_name || "Unknown";

                gameBox.innerHTML = `
                    <img class="game-image" src="${game.image_url}" alt="${game.name}" onerror="this.src='assets/img/placeholder.jpg';">
                    <div class="game-info">
                        <h3>${game.name}</h3>
                        <p>${game.category_name || "Unknown Genre"} | ${game.release_date || "Unknown Date"}</p>
                    </div>
                    <div class="game-price">$${game.price.toFixed(2)}</div>
                `;

                gameContainer.appendChild(gameBox);
            });
        })
        .catch(error => console.error("Error fetching games:", error));
});