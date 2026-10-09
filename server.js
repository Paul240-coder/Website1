
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = 3000;

// Connect Node.js to MariaDB
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "questionnaire_db"
});

// Read JSON sent by the website
app.use(express.json());

// Display the website
app.use(express.static(path.join(__dirname, "public")));

// Save a visitor's response
app.post("/api/responses", async (req, res) => {
    try {
        const { name, answer } = req.body;

        if (
            typeof name !== "string" ||
            typeof answer !== "string" ||
            !name.trim() ||
            !answer.trim()
        ) {
            return res.status(400).json({
                message: "Please enter your name and answer."
            });
        }

        const sql =
            "INSERT INTO responses (name, answer) VALUES (?, ?)";

        await db.execute(sql, [
            name.trim(),
            answer.trim()
        ]);

        res.json({
            message: "Your response was saved successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Could not save your response."
        });
    }
});

// Retrieve saved responses
app.get("/api/responses", async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, name, answer, created_at FROM responses ORDER BY id DESC"
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Could not retrieve responses."
        });
    }
});

// Start the server
app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
        
