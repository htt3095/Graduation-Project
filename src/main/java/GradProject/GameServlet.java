package GradProject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;


public class GameServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        System.out.println("GameServlet: Processing GET request for /games");

        JSONArray gamesArray = new JSONArray();

        try (Connection conn = DatabaseConnection.getConnection()) {
            System.out.println("Database connection established.");

            // Updated column names to match your database schema
            String query = "SELECT g.GameID, g.Title, c.GenreName, g.Price, g.ImageURL, g.ReleaseDate " +
                           "FROM Games g " +
                           "JOIN Categories c ON g.GenreID = c.GenreID";

            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {

                System.out.println("Query executed. Fetching results...");

                while (rs.next()) {
                    JSONObject gameObject = new JSONObject();
                    gameObject.put("game_id", rs.getInt("GameID"));
                    gameObject.put("title", rs.getString("Title"));
                    gameObject.put("genre", rs.getString("GenreName"));
                    gameObject.put("price", rs.getDouble("Price"));
                    gameObject.put("image_url", rs.getString("ImageURL"));
                    gameObject.put("release_date", rs.getString("ReleaseDate"));
                    gamesArray.put(gameObject);
                }
            }

            System.out.println("Retrieved " + gamesArray.length() + " games.");

            try (PrintWriter out = response.getWriter()) {
                out.print(gamesArray.toString());
                out.flush();
            }

        } catch (SQLException e) {
            System.err.println("SQL Error in GameServlet: " + e.getMessage());
            e.printStackTrace();
            sendErrorResponse(response, "Database error occurred.", e);
        } catch (Exception e) {
            System.err.println("Unexpected error in GameServlet: " + e.getMessage());
            e.printStackTrace();
            sendErrorResponse(response, "An unexpected error occurred.", e);
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String message, Exception e) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        JSONObject errorResponse = new JSONObject();
        errorResponse.put("error", message);
        errorResponse.put("details", e.getMessage());
        
        try (PrintWriter out = response.getWriter()) {
            out.print(errorResponse.toString());
            out.flush();
        }
    }
}
