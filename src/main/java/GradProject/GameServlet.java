import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/games")
public class GameServlet extends HttpServlet {
    private static final String URL = "jdbc:sqlserver://localhost:1433;databaseName=gamesite;user=sa;password=1234;encrypt=true;trustServerCertificate=true";

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try (Connection conn = DriverManager.getConnection(URL)) {
            String sql = "SELECT GameID, Name, Genre, ImageURL FROM Games";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();

            StringBuilder json = new StringBuilder("[");
            while (rs.next()) {
                if (json.length() > 1) json.append(",");
                json.append("{")
                    .append("\"id\":").append(rs.getInt("GameID")).append(",")
                    .append("\"name\":\"").append(rs.getString("Name")).append("\",")
                    .append("\"genre\":\"").append(rs.getString("Genre")).append("\",")
                    .append("\"image\":\"").append(rs.getString("ImageURL")).append("\"")
                    .append("}");
            }
            json.append("]");
            out.print(json.toString());
            out.flush();
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
