package GradProject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/games")
public class GameServlet extends HttpServlet {

    private static final String SELECT_GAMES_SQL = 
    "SELECT g.game_id, g.name AS game_name, " +
    "c.name AS category, p.name AS platform, " +
    "d.name AS developer, pub.name AS publisher, " +
    "g.price, g.image_url, g.release_date, g.description " + // Added description
    "FROM Games g " +
    "JOIN Categories c ON g.category_id = c.category_id " +
    "JOIN Platforms p ON g.platform_id = p.platform_id " +
    "JOIN Developers d ON g.developer_id = d.developer_id " +
    "JOIN Publishers pub ON g.publisher_id = pub.publisher_id";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Content-Type", "application/json");
        PrintWriter out = response.getWriter();
        JSONArray jsonArray = new JSONArray();

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(SELECT_GAMES_SQL)) {

            while (rs.next()) {
                JSONObject gameJson = new JSONObject();
                gameJson.put("game_id", rs.getInt("game_id"));
                gameJson.put("name", rs.getString("game_name"));
                gameJson.put("category", rs.getString("category"));
                gameJson.put("platform", rs.getString("platform"));
                gameJson.put("developer", rs.getString("developer"));
                gameJson.put("publisher", rs.getString("publisher"));
                gameJson.put("price", rs.getDouble("price"));
                gameJson.put("image_url", rs.getString("image_url"));
                gameJson.put("release_date", rs.getDate("release_date").toString());
                gameJson.put("description", rs.getString("description")); // Added description
                
                jsonArray.put(gameJson);
            }
            
            out.print(jsonArray.toString());
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JSONObject error = new JSONObject();
            error.put("error", "Database access error");
            error.put("details", e.getMessage());
            out.print(error.toString());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }
}