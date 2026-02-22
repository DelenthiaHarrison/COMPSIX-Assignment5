const { body } = require("express-validator");

const VALID_CATEGORIES = ["appetizer", "entree", "dessert", "beverage"];

const menuItemValidationRules = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number greater than 0"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isIn(VALID_CATEGORIES)
      .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),

    body("ingredients")
      .notEmpty()
      .withMessage("Ingredients are required")
      .isArray({ min: 1 })
      .withMessage("Ingredients must be an array with at least 1 ingredient"),

    body("ingredients.*")
      .isString()
      .withMessage("Each ingredient must be a string")
      .trim()
      .notEmpty()
      .withMessage("Ingredients cannot contain empty values"),

    body("available")
      .optional()
      .isBoolean()
      .withMessage("Available must be a boolean (true or false)"),
  ];
};

module.exports = { menuItemValidationRules };