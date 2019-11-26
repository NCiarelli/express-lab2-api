// Import reuired modules from other files
const express = require("express");
const pool = require("./pg-connection-pool");

// Setup a routing object for the server
const routes = express.Router();

// Quick response from server to show its alive and working
// at http://localhost:3000/
routes.get("/", (req, res) => {
  res.send("Server is up and working.");
});

// GET /cart-items Endpoint
// Action: none
// Response: a JSON array of all cart items
// Response Code: 200 (OK)
routes.get("/cart-items", (req, res) => {
  const sql = "SELECT * FROM shopping_cart ORDER BY id";
  pool.query(sql).then(result => {
    res.json(result.rows);
  });
});

// GET /cart-items/:id Endpoint
// Action: none
// ResponseL a JSON object of the item with the given ID
// Response Code: 200 (OK)
// If the item with the ID cannot be found in the array, returna  string response "ID Not Found" with response 404
routes.get("/cart-items/:id", (req, res) => {
  // Get the ID of the item from the URL params
  const id = parseInt(req.params.id);

  // Setup SQL query to request an item with the specified ID
  const sql = "SELECT * FROM shopping_cart WHERE id = $1::INT;";
  // Make the request with the specified 'id' as a parameter
  pool.query(sql, [id]).then(result => {
    // If the returned result has somthing in it...
    if (result.rows.length !== 0) {
      // return the (should be only) first row of result.
      res.json(result.rows[0]);
    } else {
      // Otherwise return 'ID Not Found' with a status of 404
      res.status(404);
      res.send("ID Not Found");
    }
  });
});

// POST /cart-items Endpoint
// Action: Add a cart item to the array using the JSON body of the request and generate a unique ID for the item
// Response: the added cart item object as JSON
// Response Code: 201 (Created)
routes.post("/cart-items", (req, res) => {
  // Get the item info from the request body
  const item = req.body;

  // Setup SQL query to insert the flight info in the request to the database, 
  // including the addon to make it return what it added
  const sql = "INSERT INTO shopping_cart (product, price, quantity) VALUES ($1::TEXT,$2::REAL,$3::INT) RETURNING *;";
  // Get the values to populate the database entry from the body of the request
  let params = [item.product, item.price, item.quantity];
  // Send the request with the parameters
  pool.query(sql, params).then(result => {
    // Send the copied back resulting database entry with a status code of 201 
    res.status(201);
    res.json(result.rows[0]);
  });
});

// PUT /cart-items/:id Endpoint
// Action: Update the cart item in the array that has the given id. Use the JSON body of the request as the new properties
// Reqponse: the updated cart item object as JSON
// Response Code: 200 (OK)
routes.put("/cart-items/:id", (req, res) => {
  // Get the item id from the URL params
  const id = parseInt(req.params.id);
  // Create an item object from the JSON body of the request
  const updatedItem = req.body;

  // Setup SQL query to update the item info specified by the id, 
  // including the addon to make it return what it added
  const sql = "UPDATE shopping_cart set product=$1::TEXT, price=$2::REAL, quantity=$3::INT WHERE id=$4::INT RETURNING *;";
  // Get the values to populate the database entry from the body of the request and the id from the URL
  let params = [updatedItem.product, updatedItem.price, updatedItem.quantity, id];
  // Send the request with the parameters
  pool.query(sql, params).then(result => {
    // Send the copied back resulting database entry
    res.json(result.rows[0]);
  });
});

// DELETE /cart-items/:id Endpoint
// Action: Remove the item from the array that has the given ID. 
// Response: Empty 
// Response Code: 204 (No Content) 
routes.delete("/cart-items/:id", (req, res) => {
  // Get the id of the item from the request URL params
  const id = parseInt(req.params.id);

  // Setup SQL query to delete the item specified by the id
  const sql = "DELETE FROM shopping_cart WHERE id=$1::INT;";
  // Send the request with the parameters
  pool.query(sql, id).then(() => {
    // On successul return, send status code 204 (No Content)
    res.sendStatus(204);
  });
});


// Send out the routes object for other JS files to use
module.exports = routes;