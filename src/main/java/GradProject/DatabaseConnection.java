package GradProject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String DB_URL = "jdbc:sqlserver://LAPTOPMAXXING:1433;databaseName=gamesite;user=sa;password=1234;encrypt=true;trustServerCertificate=true";


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
        Connection conn = DriverManager.getConnection(DB_URL);
        System.out.println("Database connected successfully!");
        return conn;
    }
}