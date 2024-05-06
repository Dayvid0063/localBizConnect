const express = require("express");
const http = require("http");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

// Import categoryController
const user = require("./routes/userRoutes");
const admin = require("./routes/adminRoutes");
const review = require("./routes/reviewRoutes");
const configRoute = require('./routes/configRoutes');

const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();
const server = http.createServer(app);

const db = require("./db/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for the React Native app
app.use("/", express.static("public"));

// Serve static files for the admin React app
app.use("/admin", express.static("uploads"));

// Use the db module to establish the MongoDB connection
db.connectToDatabase();

// Admin App
app.use("/api/v2/admin", admin);
app.use("/api/v2/user", user);
app.use("/api/v2/review", review);
app.use('/', configRoute);

const port = process.env.PORT || config.get("port");
server.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
