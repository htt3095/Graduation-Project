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
        const response = await fetch('/Graduation-Project/GameServlet'); // Adjust to your actual path
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const games = await response.json();
        console.log("Games received:", games);
        if (games.length === 0) {
            console.warn("No games found in database.");
        }
        return games;
    } catch (error) {
        console.error("Failed to fetch games:", error);
    }
}

// Call the function
fetchGames();