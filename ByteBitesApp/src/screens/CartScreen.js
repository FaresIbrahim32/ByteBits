import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { cartItems, total, removeItem, clearCart } = useCart();

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty", "Add items before placing an order.");
      return;
    }
    Alert.alert(
      "Order Placed! 🎉",
      `Your order of $${total.toFixed(2)} has been placed.`,
      [{ text: "OK", onPress: () => { clearCart(); navigation.navigate("Home"); } }]
    );
  };

  const handleRemove = (item, index) => {
    removeItem(item, index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Order</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Browse restaurants and add items</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ paddingBottom: 220 }}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🥘</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCat}>{item.category}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleRemove(item, index)} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeBtnText}>Place Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate("OrderHistory")}>
          <Text style={styles.historyBtnText}>View Order History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  back: { paddingHorizontal: 24, paddingTop: 8 },
  backText: { color: "#e63946", fontSize: 16, fontWeight: "600" },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", paddingHorizontal: 24, marginTop: 8, marginBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  emptySubText: { color: "#555", fontSize: 14, marginTop: 6 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", marginHorizontal: 24, marginBottom: 10, borderRadius: 16, padding: 14 },
  cardIcon: { width: 44, height: 44, backgroundColor: "#2a2a2a", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardEmoji: { fontSize: 20 },
  cardBody: { flex: 1 },
  itemName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  itemCat: { color: "#555", fontSize: 12, marginTop: 2 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  price: { color: "#fff", fontSize: 15, fontWeight: "800" },
  removeBtn: { backgroundColor: "#2a2a2a", width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  removeBtnText: { color: "#e63946", fontSize: 13, fontWeight: "800" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#1a1a1a", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  totalLabel: { color: "#aaa", fontSize: 17, fontWeight: "600" },
  totalValue: { color: "#fff", fontSize: 24, fontWeight: "900" },
  placeBtn: { backgroundColor: "#e63946", borderRadius: 16, padding: 18, alignItems: "center", marginBottom: 10 },
  placeBtnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  historyBtn: { borderRadius: 16, padding: 14, alignItems: "center" },
  historyBtnText: { color: "#555", fontSize: 14, fontWeight: "600" },
});
