const express = require("express");
const { validationResult } = require("express-validator");
const { menuItemValidationRules } = require("./middleware/validation");
const requestLogger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Built-in Middleware ───────────────────────────────────────────────────────
app.use(express.json());

// ─── Custom Middleware ─────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── In-Memory Data Store ──────────────────────────────────────────────────────
let menuItems = [
  {
    id: 1,
    name: "Garlic Bread",
    description: "Toasted baguette with roasted garlic butter and fresh parsley",
    price: 5.99,
    category: "appetizer",
    ingredients: ["baguette", "garlic", "butter", "parsley"],
    available: true,
  },
  {
    id: 2,
    name: "Grilled Salmon",
    description: "Atlantic salmon fillet with lemon herb sauce and seasonal vegetables",
    price: 24.99,
    category: "entree",
    ingredients: ["salmon", "lemon", "herbs", "seasonal vegetables", "olive oil"],
    available: true,
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a gooey molten center served with vanilla ice cream",
    price: 8.99,
    category: "dessert",
    ingredients: ["dark chocolate", "butter", "eggs", "flour", "sugar", "vanilla ice cream"],
    available: true,
  },
  {
    id: 4,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh squeezed lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "water", "sugar", "mint"],
    available: true,
  },
];

let nextId = 5;

// ─── Helper Function ───────────────────────────────────────────────────────────
const findMenuItemById = (id) => menuItems.find((item) => item.id === parseInt(id));

// ─── Routes ────────────────────────────────────────────────────────────────────

// GET /api/menu - Retrieve all menu items
app.get("/api/menu", (req, res) => {
  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

// GET /api/menu/:id - Retrieve a specific menu item
app.get("/api/menu/:id", (req, res) => {
  const menuItem = findMenuItemById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: `Menu item with ID ${req.params.id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: menuItem,
  });
});

// POST /api/menu - Add a new menu item
app.post("/api/menu", menuItemValidationRules(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  const { name, description, price, category, ingredients, available } = req.body;

  const newMenuItem = {
    id: nextId++,
    name,
    description,
    price,
    category,
    ingredients,
    available: available !== undefined ? available : true,
  };

  menuItems.push(newMenuItem);

  res.status(201).json({
    success: true,
    message: "Menu item created successfully",
    data: newMenuItem,
  });
});

// PUT /api/menu/:id - Update an existing menu item
app.put("/api/menu/:id", menuItemValidationRules(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  const menuItem = findMenuItemById(req.params.id);

  if (!menuItem) {
    return res.status(404).json({
      success: false,
      error: `Menu item with ID ${req.params.id} not found`,
    });
  }

  const { name, description, price, category, ingredients, available } = req.body;

  menuItem.name = name;
  menuItem.description = description;
  menuItem.price = price;
  menuItem.category = category;
  menuItem.ingredients = ingredients;
  menuItem.available = available !== undefined ? available : menuItem.available;

  res.status(200).json({
    success: true,
    message: "Menu item updated successfully",
    data: menuItem,
  });
});

// DELETE /api/menu/:id - Remove a menu item
app.delete("/api/menu/:id", (req, res) => {
  const menuItemIndex = menuItems.findIndex((item) => item.id === parseInt(req.params.id));

  if (menuItemIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Menu item with ID ${req.params.id} not found`,
    });
  }

  const deletedItem = menuItems.splice(menuItemIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: "Menu item deleted successfully",
    data: deletedItem,
  });
});

// ─── 404 Catch-All ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍽️  Tasty Bites API running on http://localhost:${PORT}`);
});

module.exports = app;
