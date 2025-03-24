import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    public static void main(String[] args) {
        String URL = "jdbc:sqlserver://localhost:1433;databaseName=gamesite;user=sa;password=1234;encrypt=true;trustServerCertificate=true";

        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            System.out.println("✅ SQL Server JDBC Driver Loaded!");

            Connection conn = DriverManager.getConnection(URL);
            System.out.println("✅ Connection successful!");
        } catch (ClassNotFoundException e) {
            System.out.println("❌ JDBC Driver not found!");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("❌ Connection failed!");
            e.printStackTrace();
        }
    }
}