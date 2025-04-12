package GradProject;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/similar/*")
public class SimilarGamesServlet extends HttpServlet {
    
    private static final String SIMILAR_GAMES_SQL = 
        "SELECT TOP 5 g.game_id, g.name, g.image_url, g.price " +  // Changed LIMIT to TOP
    "FROM Games g " +
    "JOIN Categories c ON g.category_id = c.category_id " +
    "WHERE c.name = ? AND g.game_id != ?";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\":\"Missing game ID\"}");
            return;
        }

        String gameId = pathInfo.substring(1); // Get ID after the slash
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "SELECT c.name FROM Games g " +
                 "JOIN Categories c ON g.category_id = c.category_id " +
                 "WHERE g.game_id = ?")) {
            
            stmt.setInt(1, Integer.parseInt(gameId));
            String category = null;
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    category = rs.getString("name");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Game not found\"}");
                    return;
                }
            }

            // Get similar games
            try (PreparedStatement similarStmt = conn.prepareStatement(SIMILAR_GAMES_SQL)) {
                similarStmt.setString(1, category);
                similarStmt.setInt(2, Integer.parseInt(gameId));
                
                JSONArray similarGames = new JSONArray();
                try (ResultSet rs = similarStmt.executeQuery()) {
                    while (rs.next()) {
                        JSONObject game = new JSONObject();
                        game.put("game_id", rs.getInt("game_id"));
                        game.put("name", rs.getString("name"));
                        game.put("image_url", "img/" + rs.getString("image_url")); // Updated path
                        game.put("price", rs.getDouble("price"));
                        similarGames.put(game);
                    }
                }
                out.print(similarGames.toString());
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"Server error\"}");
            e.printStackTrace();
        }
    }
}