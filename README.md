# ByteBites

Backend logic for the ByteBites food ordering app. Manages customers, menu items, restaurants, and orders.

## Classes

| Class | Description |
|---|---|
| `FoodItem` | A menu item with name, price, category, and popularity rating |
| `Restaurant` | Holds the full menu and supports filtering by category |
| `Order` | Groups selected food items into a transaction and computes the total |
| `User` | A customer with a name, purchase history, and verification |

## Relationships

- A `User` places `Order`s — automatically tracked in `purchase_history`
- An `Order` contains one or more `FoodItem`s
- A `Restaurant` manages a collection of `FoodItem`s

## Structure

```
bytebits/
├── models.py        # Core class definitions
├── test_models.py   # Sample objects and output verification
├── uml_diagram.md   # Mermaid UML class diagram
└── UML.png          # Visual UML reference
```

## Running the tests

```bash
python test_models.py
```
