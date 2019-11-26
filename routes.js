// Import reuired modules from other files
const express = require("express");

// Setup a routing object for the server
const routes = express.Router();

// Setup hard-coded cart items
let cartItems = [
  { id: 1, product: "soap", price: 3.5, quantity: 6 },
  { id: 2, product: "capacitor", price: 1.25, quantity: 10 },
  { id: 3, product: "cable", price: 2.00, quantity: 3 },
  { id: 4, product: "umbrella", price: 5.0, quantity: 1 }
];
let nextId = 5;

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
  res.json(cartItems);
});

// GET /cart-items/:id Endpoint
// Action: none
// ResponseL a JSON object of the item with the given ID
// Response Code: 200 (OK)
// If the item with the ID cannot be found in the array, returna  string response "ID Not Found" with response 404
routes.get("/cart-items/:id", (req, res) => {
  // Get the ID of the item from the URL params
  const id = parseInt(req.params.id);
  // console.log(id);
  // Find the item with the id from the URL
  const foundItem = cartItems.find(item => item.id === id);
  if (foundItem) {
    // If the item was found, return the item object
    res.json(foundItem);
  } else {
    // If the id was not found among the itemCart, return a not found message.
    res.status(404);
    res.send("ID Not Found");
  }
});

// POST /cart-items Endpoint
// Action: Add a cart item to the array using the JSON body of the request and generate a unique ID for the item
// Response: the added cart item object as JSON
// Response Code: 201 (Created)
routes.post("/cart-items", (req, res) => {
  // Get the item info from the request body
  const item = req.body;
  // Add an id to the item
  item.id = nextId;
  // Increment the nextId variable
  nextId++;
  // Add the item to the cartItems array
  cartItems.push(item);

  // Respond with the created item
  res.status(201);
  res.json(item);
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
  // Attach the item id to the item
  updatedItem.id = id;
  // Find the item Index by ID
  const index = cartItems.findIndex(item => item.id === id);
  // Replace the item at index
  cartItems.splice(index, 1, updatedItem);
  res.json(updatedItem);
  // console.log("Updated item");
});

// DELETE /cart-items/:id Endpoint
// Action: Remove the item from the array that has the given ID. 
// Response: Empty 
// Response Code: 204 (No Content) 
routes.delete("/cart-items/:id", (req, res) => {
  // Get the id of the item from the request URL params
  const id = parseInt(req.params.id);
  // Try to find the item by id
  const index = cartItems.findIndex(item => item.id === id);
  // If found...
  if (index !== -1) {
    // Remove the item from the cart
    cartItems.splice(index, 1);
    // Set and send response code 204. Send no content.
    res.sendStatus(204);
  } else {
    // Otherwise, send a 404, item not found response
    res.status(404);
    res.send(`Item ID ${id} Not Found`);
  }
});


// Send out the routes object for other JS files to use
module.exports = routes;