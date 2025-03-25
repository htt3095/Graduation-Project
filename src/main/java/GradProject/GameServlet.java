package GradProject;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

public class GameServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String URL = "jdbc:sqlserver://localhost:1433;databaseName=gamesite;encrypt=true;trustServerCertificate=true";
    private static final String USER = "sa";
    private static final String PASSWORD = "1234";

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONArray gamesArray = new JSONArray();

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

            String query = "SELECT g.game_id, g.name, c.category_name, g.price, g.image_url, g.release_date " +
                           "FROM Games g " +
                           "JOIN Categories c ON g.category_id = c.category_id"; 

            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                JSONObject gameObject = new JSONObject();
                gameObject.put("game_id", rs.getInt("game_id"));
                gameObject.put("name", rs.getString("name"));
                gameObject.put("category_name", rs.getString("category_name"));
                gameObject.put("price", rs.getDouble("price"));
                gameObject.put("image_url", rs.getString("image_url"));
                gameObject.put("release_date", rs.getString("release_date"));

                gamesArray.put(gameObject);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"Internal Server Error\"}");
            return;
        }

        PrintWriter out = response.getWriter();
        out.print(gamesArray.toString());
        out.flush();
    }
}
