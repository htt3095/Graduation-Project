package GradProject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String URL = "jdbc:sqlserver://localhost:1433;databaseName=gamesite;encrypt=true;trustServerCertificate=true";
    private static final String USER = "sa";
    private static final String PASSWORD = "1234";

    static {
        try {
            // Load driver at class loading time
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            System.out.println("SQL Server JDBC Driver loaded successfully");
        } catch (ClassNotFoundException e) {
            System.err.println("Failed to load SQL Server JDBC Driver");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        System.out.println("Attempting to connect to database...");
        Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
        System.out.println("Database connected successfully!");
        return conn;
    }
}