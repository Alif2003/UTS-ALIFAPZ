"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db = require("../connection/connection");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
// CREATE user
app.post("/courses", (req, res) => {
    const { course_name, course_price, description, status } = req.body;
    // Menambahkan course baru ke dalam database tanpa menyertakan id
    db.query("INSERT INTO courses (course_name, course_price, description, status) VALUES (?, ?, ?, ?)", [course_name, course_price, description, status], (error, result) => {
        if (error) {
            console.error("Database insertion error:", error);
            return res.status(500).json({ error: "Database insertion error" });
        }
        // Mengambil id yang dihasilkan secara otomatis
        const newCourse = {
            id: result.insertId,
            course_name,
            course_price,
            description,
            status,
        };
        res.status(201).json(newCourse);
    });
});
// READ all users from the database (also logs them)
app.get("/courses", (req, res) => {
    db.query("SELECT * FROM courses", (error, result) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Database query error" });
        }
        res.status(200).json(result);
    });
});
// UPDATE user by id
app.put("/courses/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { course_name, course_price, description, status } = req.body;
    db.query("UPDATE courses SET course_name = ?, course_price = ?, description = ?, status = ? WHERE id = ?", [course_name, course_price, description, status, id], (error, result) => {
        if (error) {
            console.error("Database update error:", error);
            return res.status(500).json({ error: "Database update error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ msg: "Course updated successfully" });
    });
});
// DELETE user by id
app.delete("/courses/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.query("DELETE FROM courses WHERE id = ?", [id], (error, result) => {
        if (error) {
            console.error("Database deletion error:", error);
            return res.status(500).json({ error: "Database deletion error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ msg: "Course deleted successfully" });
    });
});
// GET one user by id
app.get("/courses/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.query("SELECT * FROM courses WHERE id = ?", [id], (error, result) => {
        if (error) {
            console.error("Database query error:", error);
            return res.status(500).json({ error: "Database query error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json(result[0]);
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/users`);
});
exports.default = app;
//# sourceMappingURL=index.js.map