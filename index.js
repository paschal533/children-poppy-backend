const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


//mongodb+srv://childDB:<password>@cluster0.ukpuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
var allowedOrigins = ['https://children-poppy.web.app', 'http://localhost:3000', 'https://childrenspoppy.com'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.options("*", cors());

mongoose
  .connect('mongodb+srv://childDB:childDB@cluster0.ukpuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.get("/", async (req, res) => {
  try {
    res.status(200).json('hello user');
  } catch (err) {
    res.status(500).json(err);
  }
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);


function saveImage(movie, imgEncoded) {
  // CHECKING FOR IMAGE IS ALREADY ENCODED OR NOT
  if (imgEncoded == null) return;

  // ENCODING IMAGE BY JSON PARSE
  // The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string
  const img = JSON.parse(imgEncoded);
  console.log( "JSON parse: "+ img);
  
  // CHECKING FOR JSON ENCODED IMAGE NOT NULL 
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  // AND HAVE VALID IMAGE TYPES WITH IMAGE MIME TYPES
  if (img != null && imageMimeTypes.includes(img.type)) {

    // https://nodejs.org/api/buffer.html
    // The Buffer class in Node.js is designed to handle raw binary data. 
    // SETTING IMAGE AS BINARY DATA
    movie.img = new Buffer.from(img.data, "base64");
    movie.imgType = img.type;
  }
}

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend is running.");
});
