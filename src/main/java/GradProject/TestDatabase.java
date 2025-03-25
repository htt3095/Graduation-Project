package GradProject;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestDatabase {
    public static void main(String[] args) {
        // Database connection details
        String url = "jdbc:sqlserver://localhost:1433;databaseName=gamesite;encrypt=true;trustServerCertificate=true";
        String user = "sa";  // Ensure this is correct
        String password = "1234";  // Ensure this is correct

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT game_id, name, category_id, platform_id, developer_id, publisher_id, price, image_url, release_date FROM Games")) {

            System.out.println("Database connected successfully!");
            
            // Loop through each game entry
            while (rs.next()) {
                int gameId = rs.getInt("game_id");
                String gameName = rs.getString("name");
                int categoryId = rs.getInt("category_id");
                int platformId = rs.getInt("platform_id");
                int developerId = rs.getInt("developer_id");
                int publisherId = rs.getInt("publisher_id");
                double price = rs.getDouble("price");
                String imageUrl = rs.getString("image_url");
                String releaseDate = rs.getString("release_date"); // Ensure correct format

                // Print game details to confirm they are retrieved correctly
                System.out.println("Game ID: " + gameId + ", Name: " + gameName + ", Category ID: " + categoryId + 
                                   ", Platform ID: " + platformId + ", Developer ID: " + developerId + 
                                   ", Publisher ID: " + publisherId + ", Price: $" + price + 
                                   ", Image URL: " + imageUrl + ", Release Date: " + releaseDate);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
