import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import dotenv from "dotenv";
const db = require("../connection/connection");

dotenv.config();
const app = express();
const port = process.env.PORT;

const cors = require("cors");
app.use(cors());

app.use(express.json());

// Middleware autentikasi
const isAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "kanjut") {
    next();
  } else {
    res.status(401).json({ msg: "Unauthorized access" });
  }
};

// CREATE user
app.post("/courses", (req: Request, res: Response) => {
  const { course_name, course_price, description, status } = req.body;

  // Menambahkan course baru ke dalam database tanpa menyertakan id
  db.query(
    "INSERT INTO courses (course_name, course_price, description, status) VALUES (?, ?, ?, ?)",
    [course_name, course_price, description, status],
    (error: Error | null, result: any) => {
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
    }
  );
});

// READ all users from the database (also logs them)
app.get("/courses", (req: Request, res: Response) => {
  db.query("SELECT * FROM courses", (error: Error | null, result: any) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(result);
  });
});

// UPDATE user by id
app.put("/courses/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { course_name, course_price, description, status } = req.body;

  db.query(
    "UPDATE courses SET course_name = ?, course_price = ?, description = ?, status = ? WHERE id = ?",
    [course_name, course_price, description, status, id],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database update error:", error);
        return res.status(500).json({ error: "Database update error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json({ msg: "Course updated successfully" });
    }
  );
});

// DELETE user by id
app.delete("/courses/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  db.query(
    "DELETE FROM courses WHERE id = ?",
    [id],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database deletion error:", error);
        return res.status(500).json({ error: "Database deletion error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json({ msg: "Course deleted successfully" });
    }
  );
});

// GET one user by id
app.get("/courses/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  db.query(
    "SELECT * FROM courses WHERE id = ?",
    [id],
    (error: Error | null, result: any) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database query error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json(result[0]);
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/users`);
});

export default app;
