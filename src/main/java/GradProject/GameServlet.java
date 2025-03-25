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

        System.out.println("GameServlet: Received GET request for /games");

        JSONArray gamesArray = new JSONArray();

        try (Connection conn = DatabaseConnection.getConnection()) {
            System.out.println("Database connection established.");

            String query = "SELECT game_id, name, category_id, platform_id, developer_id, publisher_id, price, image_url, release_date FROM Games";
            
            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {
                
                System.out.println("Query executed successfully. Fetching results...");

                int count = 0;
                while (rs.next()) {
                    JSONObject gameObject = new JSONObject();
                    gameObject.put("game_id", rs.getInt("game_id"));
                    gameObject.put("name", rs.getString("name"));
                    gameObject.put("category_id", rs.getInt("category_id"));
                    gameObject.put("platform_id", rs.getInt("platform_id"));
                    gameObject.put("developer_id", rs.getInt("developer_id"));
                    gameObject.put("publisher_id", rs.getInt("publisher_id"));
                    gameObject.put("price", rs.getDouble("price"));
                    gameObject.put("image_url", rs.getString("image_url"));
                    gameObject.put("release_date", rs.getString("release_date"));
                    gamesArray.put(gameObject);
                    count++;
                }

                System.out.println("Retrieved " + count + " games.");
            }

            try (PrintWriter out = response.getWriter()) {
                out.print(gamesArray.toString());
                out.flush();
                System.out.println("JSON response sent successfully.");
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

        System.err.println("Error Response Sent: " + errorResponse.toString());

        try (PrintWriter out = response.getWriter()) {
            out.print(errorResponse.toString());
            out.flush();
        }
    }
}
