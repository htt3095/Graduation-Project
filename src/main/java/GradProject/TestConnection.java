package GradProject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class TestConnection {
    public static void main(String[] args) {
        System.out.println("Testing database connection...");
        
        try (Connection conn = DatabaseConnection.getConnection()) {
            System.out.println("Connection successful! Testing query...");
            
            String testQuery = "SELECT COUNT(*) AS total FROM Games";
            try (PreparedStatement stmt = conn.prepareStatement(testQuery);
                 ResultSet rs = stmt.executeQuery()) {
                
                if (rs.next()) {
                    System.out.println("Test successful! Found " + rs.getInt("total") + " games in database");
                } else {
                    System.out.println("Test query executed but no results returned");
                }
            }
        } catch (Exception e) {
            System.err.println("Database test failed:");
            e.printStackTrace();
        }
    }
}