package GradProject;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;
import java.sql.*;
import org.json.*;

@WebServlet(urlPatterns = {"/login", "/login/check", "/logout"}, name = "AuthServlet")
public class AuthServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        
        String path = req.getServletPath();
        PrintWriter out = resp.getWriter();
        JSONObject responseJson = new JSONObject();
        
        try {
            if (path.equals("/login")) {
                // Handle login
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = req.getReader().readLine()) != null) {
                    sb.append(line);
                }
                
                JSONObject loginData = new JSONObject(sb.toString());
                String email = loginData.getString("email");
                String password = loginData.getString("password");
                
                try (Connection conn = DatabaseConnection.getConnection()) {
                    String sql = "SELECT user_id, username, email FROM Users WHERE email = ? AND password_hash = ?";
                    try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                        stmt.setString(1, email);
                        stmt.setString(2, password);
                        
                        ResultSet rs = stmt.executeQuery();
                        if (rs.next()) {
                            JSONObject user = new JSONObject();
                            user.put("id", rs.getInt("user_id"));
                            user.put("username", rs.getString("username"));
                            user.put("email", rs.getString("email"));
                            
                            HttpSession session = req.getSession();
                            session.setAttribute("user", user.toString());
                            
                            responseJson.put("success", true);
                            responseJson.put("user", user);
                        } else {
                            responseJson.put("success", false);
                            responseJson.put("message", "Invalid credentials");
                        }
                    }
                }
            } else if (path.equals("/logout")) {
                // Handle logout
                req.getSession().invalidate();
                responseJson.put("success", true);
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseJson.put("success", false);
            responseJson.put("message", e.getMessage());
        }
        
        out.print(responseJson.toString());
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        if (req.getServletPath().equals("/login/check")) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            
            HttpSession session = req.getSession(false);
            PrintWriter out = resp.getWriter();
            
            if (session != null && session.getAttribute("user") != null) {
                out.print(session.getAttribute("user"));
            } else {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print("{\"success\":false}");
            }
        }
    }
}