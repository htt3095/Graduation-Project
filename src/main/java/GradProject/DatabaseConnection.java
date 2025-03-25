package GradProject;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DatabaseConnection {
    private static final String URL = "jdbc:sqlserver://localhost:1433;databaseName=gamesite;encrypt=true;trustServerCertificate=true";
    private static final String USER = "sa";  // Use your actual username
    private static final String PASSWORD = "1234";  // Use your actual password

    // Static method to establish a connection
    public static Connection getConnection() {
        Connection conn = null;
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver"); // Load SQL Server Driver
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Database connected successfully!");
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }
}
