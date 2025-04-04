package GradProject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class TestConnection {
    public static void main(String[] args) {
        System.out.println("Testing database connection...");

        try (Connection conn = DatabaseConnection.getConnection()) {
            System.out.println("Connection successful! Testing sample data query...");

            // Query to fetch sample game data
            String testQuery = "SELECT TOP 5 name, category_id, price FROM Games";

            try (PreparedStatement stmt = conn.prepareStatement(testQuery);
                 ResultSet rs = stmt.executeQuery()) {

                System.out.println("Retrieved sample game data:");
                while (rs.next()) {
                    System.out.println("Game: " + rs.getString("name") + 
                                       " | Genre ID: " + rs.getInt("category_id") + 
                                       " | Price: $" + rs.getDouble("price"));
                }
            }
        } catch (Exception e) {
            System.err.println("Database test failed:");
            e.printStackTrace();
        }
    }
}