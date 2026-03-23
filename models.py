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
        '''The Restaurant class represents a restaurant that has a menu of food items. It provides methods to add and remove food items from the menu, as well as to filter the menu by category.
        '''
        self.menu: list[FoodItem] = []

    def add_item(self, item: FoodItem) -> None:
        '''Adds a food item to the restaurant's menu.'''
        self.menu.append(item)

    def remove_item(self, item: FoodItem) -> None:
        '''Removes a food item from the restaurant's menu.'''
        self.menu.remove(item)

    def filter_by_category(self, category: str) -> list[FoodItem]:
        '''Filters the restaurant's menu by category.'''
        return [item for item in self.menu if item.category == category]


class Order:
    def __init__(self, customer: "User"):
        if not customer.verify_user():
            raise ValueError("Customer is not a verified user.")
        self.items: list[FoodItem] = []
        self.customer = customer
        customer.purchase_history.append(self)

    def add_item(self, item: FoodItem) -> None:
        '''Adds a food item to the order.'''
        self.items.append(item)

    def remove_item(self, item: FoodItem) -> None:
        '''Removes a food item from the order.'''
        self.items.remove(item)

    def compute_total(self) -> float:
        '''Computes the total cost of the order.'''
        return sum(item.price for item in self.items)


class User:
    def __init__(self, name: str):
        self.name = name
        self.purchase_history: list[Order] = []

    def verify_user(self) -> bool:
        '''Verifies that the user has a valid name.'''
        return bool(self.name)

    def get_orders(self) -> list["Order"]:
        if not self.verify_user():
            raise ValueError("User is not verified.")
        return self.purchase_history
