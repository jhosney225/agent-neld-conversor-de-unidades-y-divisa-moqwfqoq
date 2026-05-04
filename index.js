
```javascript
const Anthropic = require("@anthropic-ai/sdk").default;
const readline = require("readline");

const client = new Anthropic();

// Define tools for unit and currency conversion
const tools = [
  {
    name: "convert_length",
    description:
      "Converts length measurements between different units (meters, feet, kilometers, miles, inches, centimeters, etc.)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from_unit: {
          type: "string",
          description:
            "The unit to convert from (e.g., meters, feet, kilometers, miles)",
        },
        to_unit: {
          type: "string",
          description: "The unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_weight",
    description:
      "Converts weight measurements between different units (kilograms, pounds, grams, ounces, tons, etc.)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from_unit: {
          type: "string",
          description: "The unit to convert from (e.g., kilograms, pounds)",
        },
        to_unit: {
          type: "string",
          description: "The unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_temperature",
    description:
      "Converts temperature between Celsius, Fahrenheit, and Kelvin",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The temperature value to convert",
        },
        from_unit: {
          type: "string",
          enum: ["Celsius", "Fahrenheit", "Kelvin"],
          description: "The temperature unit to convert from",
        },
        to_unit: {
          type: "string",
          enum: ["Celsius", "Fahrenheit", "Kelvin"],
          description: "The temperature unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_currency",
    description:
      "Converts amounts between different currencies using current exchange rates",
    input_schema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "The amount to convert",
        },
        from_currency: {
          type: "string",
          description: "The currency code to convert from (e.g., USD, EUR, GBP)",
        },
        to_currency: {
          type: "string",
          description: "The currency code to convert to",
        },
      },
      required: ["amount", "from_currency", "to_currency"],
    },
  },
  {
    name: "convert_volume",
    description:
      "Converts volume measurements between different units (liters, gallons, milliliters, cubic meters, etc.)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "The value to convert",
        },
        from_unit: {
          type: "string",
          description:
            "The unit to convert from (e.g., liters, gallons, milliliters)",
        },
        to_unit: {
          type: "string",
          description: "The unit to convert to",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
];

// Conversion functions
function convertLength(value, fromUnit, toUnit) {
  // Convert to meters first
  const toMeters = {
    meter: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  };

  const fromKey = fromUnit.toLowerCase();
  const toKey = toUnit.toLowerCase();

  if (!toMeters[fromKey] || !toMeters[toKey]) {
    return `Unknown unit. Supported units: ${Object.keys(toMeters).join(", ")}`;
  }

  const meters = value * toMeters[fromKey];
  const result = meters / toMeters[toKey];
  return `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
}

function convertWeight(value, fromUnit, toUnit) {
  // Convert to kilograms first
  const toKg = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000,
    stone: 6.35029,
  };

  const fromKey = fromUnit.toLowerCase();
  const toKey = toUnit.toLowerCase();

  if (!toKg[fromKey] || !toKg[toKey]) {
    return `Unknown unit. Supported units: ${Object.keys(toKg).join(", ")}`;
  }

  const kg = value * toKg[fromKey];
  const result = kg / toKg[toKey];
  return `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
}

function convertTemperature(value, fromUnit, toUnit) {
  let celsius;

  // Convert to Celsius first
  if (fromUnit === "Celsius") {
    celsius = value;
  } else if (fromUnit === "Fahrenheit") {