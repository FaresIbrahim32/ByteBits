# we created 4 classes in this file, each class is a table in our database
# from the uml diagram, we can see that we have 4 tables: User, Restaurant, FoodItem, Order


class FoodItem:
    def __init__(self, name: str, price: float, category: str, popularity_rating: float):
        self.name = name
        self.price = price
        self.category = category
        self.popularity_rating = popularity_rating


class Restaurant:
    def __init__(self):
        self.menu: list[FoodItem] = []

    def add_item(self, item: FoodItem) -> None:
        self.menu.append(item)

    def remove_item(self, item: FoodItem) -> None:
        self.menu.remove(item)

    def filter_by_category(self, category: str) -> list[FoodItem]:
        return [item for item in self.menu if item.category == category]


class Order:
    def __init__(self, customer: "User"):
        self.items: list[FoodItem] = []
        self.customer = customer
        customer.purchase_history.append(self)

    def add_item(self, item: FoodItem) -> None:
        self.items.append(item)

    def remove_item(self, item: FoodItem) -> None:
        self.items.remove(item)

    def compute_total(self) -> float:
        return sum(item.price for item in self.items)


class User:
    def __init__(self, name: str):
        self.name = name
        self.purchase_history: list[Order] = []

    def verify_user(self) -> bool:
        return bool(self.name)
