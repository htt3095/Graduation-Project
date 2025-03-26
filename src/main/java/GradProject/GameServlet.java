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
            if (conn == null) {
                System.err.println("Database connection failed.");
                sendErrorResponse(response, "Database connection failed.", null);
                return;
            }

            System.out.println("Database connection established.");

            // Use only columns that exist in your Games table
            String query = "SELECT name, category_id, price FROM Games";

            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {

                System.out.println("Query executed successfully. Fetching results...");

                while (rs.next()) {
                    JSONObject gameObject = new JSONObject();
                    gameObject.put("name", rs.getString("name"));
                    gameObject.put("category_id", rs.getInt("category_id"));
                    gameObject.put("price", rs.getDouble("price"));
                    // Provide default values for missing columns
                    gameObject.put("image_url", "default.jpg");
                    gameObject.put("release_date", "Unknown");
                    gameObject.put("developer_id", 0);
                    gamesArray.put(gameObject);
                }

                System.out.println("Retrieved " + gamesArray.length() + " games.");
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
        response.setContentType("application/json");

        JSONObject errorResponse = new JSONObject();
        errorResponse.put("error", message);
        if (e != null) {
            errorResponse.put("details", e.getMessage());
        }

        System.err.println("Error Response Sent: " + errorResponse.toString());

        try (PrintWriter out = response.getWriter()) {
            out.print(errorResponse.toString());
            out.flush();
        }
    }
}
