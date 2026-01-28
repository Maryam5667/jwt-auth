import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "path";




const app = express();
app.use(cors());
app.use(express.json());

console.log("server.ts file loaded");

const SECRET = "jwt_secret_key";

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "build")));


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
    const token = authHeader.split(" ")[1]; 
    jwt.verify(token, SECRET);
    res.json({ message: "Welcome to dashboard" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build"));
});