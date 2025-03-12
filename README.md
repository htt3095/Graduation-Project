# Graduation-Project
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Layout</title>
    <style>
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        body {
            background-color: #1a1a1a;
            color: #fff;
        }

        .container {
            display: flex;
            padding: 20px;
        }

        .sidebar {
            width: 25%;
            padding-right: 20px;
        }

        .setting-box {
            background-color: #2a2a2a;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
        }

        .setting-box h3 {
            margin-bottom: 10px;
            font-size: 16px;
        }

        .setting-box p {
            margin: 10px 0;
            font-size: 14px;
        }

        .theme-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .theme-toggle div {
            width: 20px;
            height: 20px;
            border: 1px solid #fff;
        }

        .dark {
            background-color: #000;
        }

        .light {
            background-color: #fff;
        }

        .main-content {
            width: 75%;
        }

        .navbar {
            background-color: #2a2a2a;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
        }

        .navbar div {
            font-size: 14px;
        }

        .navbar .logo {
            font-weight: bold;
        }

        .navbar .menu {
            display: flex;
            gap: 20px;
        }

        .content {
            margin-top: 20px;
        }

        .category-section {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .category-section .category-list {
            background-color: #2a2a2a;
            padding: 10px;
            width: 30%;
            border-radius: 5px;
        }

        .category-list p {
            margin: 10px 0;
        }

        .category-section .featured {
            background-color: #2a2a2a;
            padding: 10px;
            width: 70%;
            border-radius: 5px;
        }

        .featured-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .featured-grid div {
            background-color: #ccc;
            height: 100px;
            border-radius: 5px;
        }

        .recommended {
            background-color: #2a2a2a;
            padding: 20px;
            border-radius: 5px;
        }

        .recommended h3 {
            margin-bottom: 20px;
            text-align: center;
        }

        .recommended-grid {
            display: grid;
grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .recommended-grid div {
            background-color: #ccc;
            height: 100px;
            border-radius: 5px;
        }

        .pagination {
            text-align: center;
            margin: 10px 0;
        }

        .pagination span {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #ccc;
            border-radius: 50%;
            margin: 0 5px;
        }

        .pagination span.active {
            background-color: #fff;
        }

        .footer {
            background-color: #2a2a2a;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="setting-box">
                <h3>GENERAL SETTING</h3>
                <p>User information</p>
                <p>Change dark/light mode</p>
                <div class="theme-toggle">
                    <div class="dark"></div>
                    <div class="light"></div>
                </div>
                <p>Log out</p>
            </div>
            <div class="setting-box">
                <h3>GUEST SETTING</h3>
                <p>Change dark/light mode</p>
                <div class="theme-toggle">
                    <div class="dark"></div>
                    <div class="light"></div>
                </div>
                <p>Sign in</p>
            </div>
        </div>

        <div class="main-content">
            <div class="navbar">
                <div class="logo">LOGO</div>
                <div class="menu">
                    <div>CATEGORIES</div>
                    <div>CONTACT US</div>
                    <div>SETTING</div>
                </div>
                <div>SIGN IN</div>
            </div>

            <div class="content">
                <div class="category-section">
                    <div class="category-list">
                        <p>FEATURED</p>
                        <p>RECOMMENDED</p>
                        <p>Action</p>
                        <p>RPG</p>
                        <p>Strategy</p>
                        <p>Horror</p>
                    </div>
                    <div class="featured">
                        <h3>TITLE</h3>
                        <div class="featured-grid">
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>

                <div class="recommended">
                    <h3>RECOMMENDED GAMES YOU SHOULD PLAY</h3>
                    <div class="recommended-grid">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>