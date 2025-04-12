package GradProject;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;
import java.sql.*;
import org.json.*;

@WebServlet(urlPatterns = "/register", name = "RegisterServlet")
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        JSONObject responseJson = new JSONObject();
        
        try {
            // Read request body
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = req.getReader().readLine()) != null) {
                sb.append(line);
            }
            
            JSONObject userData = new JSONObject(sb.toString());
            String username = userData.getString("username");
            String email = userData.getString("email");
            String password = userData.getString("password");
            
            // Validate input
            if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                responseJson.put("success", false);
                responseJson.put("message", "All fields are required");
                out.print(responseJson.toString());
                return;
            }
            
            // Check if user exists
            try (Connection conn = DatabaseConnection.getConnection()) {
                // Check for existing email
                String checkSql = "SELECT user_id FROM Users WHERE email = ? OR username = ?";
                try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                    checkStmt.setString(1, email);
                    checkStmt.setString(2, username);
                    
                    ResultSet rs = checkStmt.executeQuery();
                    if (rs.next()) {
                        resp.setStatus(HttpServletResponse.SC_CONFLICT);
                        responseJson.put("success", false);
                        responseJson.put("message", "Username or email already exists");
                        out.print(responseJson.toString());
                        return;
                    }
                }
                
                // Insert new user
                String insertSql = "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)";
                try (PreparedStatement insertStmt = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                    insertStmt.setString(1, username);
                    insertStmt.setString(2, email);
                    insertStmt.setString(3, password); // In production, hash the password
                    
                    int affectedRows = insertStmt.executeUpdate();
                    
                    if (affectedRows > 0) {
                        responseJson.put("success", true);
                        responseJson.put("message", "Registration successful");
                    } else {
                        responseJson.put("success", false);
                        responseJson.put("message", "Registration failed");
                    }
                }
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseJson.put("success", false);
            responseJson.put("message", "Server error: " + e.getMessage());
        }
        
        out.print(responseJson.toString());
    }
}