from models import FoodItem, Restaurant, Order, User

# --- FoodItem ---
burger = FoodItem("Spicy Burger", 8.99, "Mains", 4.5)
soda   = FoodItem("Large Soda",   2.49, "Drinks", 3.8)
cake   = FoodItem("Chocolate Cake", 4.99, "Desserts", 4.9)

print("=== FoodItem ===")
print(f"  name={burger.name}, price={burger.price}, category={burger.category}, rating={burger.popularity_rating}")
print(f"  name={soda.name},   price={soda.price}, category={soda.category}, rating={soda.popularity_rating}")
print(f"  name={cake.name}, price={cake.price}, category={cake.category}, rating={cake.popularity_rating}")

# --- Restaurant ---
restaurant = Restaurant()
restaurant.add_item(burger)
restaurant.add_item(soda)
restaurant.add_item(cake)

print("\n=== Restaurant ===")
print(f"  menu count: {len(restaurant.menu)}")
drinks = restaurant.filter_by_category("Drinks")
print(f"  filter 'Drinks': {[i.name for i in drinks]}")
desserts = restaurant.filter_by_category("Desserts")
print(f"  filter 'Desserts': {[i.name for i in desserts]}")

restaurant.remove_item(soda)
print(f"  after remove soda, menu: {[i.name for i in restaurant.menu]}")

# --- User ---
user = User("Fares")
print("\n=== User ===")
print(f"  name={user.name}")
print(f"  verify_user={user.verify_user()}")
print(f"  purchase_history (before order): {user.purchase_history}")

# --- Order ---
order = Order(user)          # auto-registers in user.purchase_history
order.add_item(burger)
order.add_item(cake)

print("\n=== Order ===")
print(f"  customer={order.customer.name}")
print(f"  items={[i.name for i in order.items]}")
print(f"  total={order.compute_total()}")

order.remove_item(cake)
print(f"  after remove cake, total={order.compute_total()}")

print("\n=== User purchase_history (after order) ===")
print(f"  history count: {len(user.purchase_history)}")
print(f"  order items: {[i.name for i in user.purchase_history[0].items]}")
