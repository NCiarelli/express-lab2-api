// Import reuired modules from other files
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

// Server setup
const app = express();
app.use(cors());
app.use(express.json());

// Setup routes from the import
app.use(routes);

// Starts the server on port=3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server started http://localhost:${port}`);
});