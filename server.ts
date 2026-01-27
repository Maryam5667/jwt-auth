import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

console.log("server.ts file loaded");

const SECRET = "jwt_secret_key";

// LOGIN API (JWT only – demo purpose)
app.post("/login", (req, res) => {
  const { email } = req.body;

  // generate JWT after frontend login
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

// PROTECTED ROUTE
app.get("/dashboard", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const token = authHeader.split(" ")[1]; // 👈 VERY IMPORTANT
    jwt.verify(token, SECRET);
    res.json({ message: "Welcome to dashboard" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});


app.listen(5000, () => {
  console.log("Server running on 5000");
});
