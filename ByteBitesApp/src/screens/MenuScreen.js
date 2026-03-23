import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMenu } from "../api";
import { useCart } from "../context/CartContext";

export default function MenuScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { cartItems, total, addItem } = useCart();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu(restaurant.here_id)
      .then((res) => setMenu(res.data))
      .catch(() => setMenu([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddItem = async (item) => {
    try {
      await addItem({ ...item, item_id: item.item_id || String(Math.random()) });
    } catch {
      Alert.alert("Error", "Could not add item.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back + Header */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>{restaurant.name}</Text>
      <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
      <Text style={styles.categoryTag}>{restaurant.category}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e63946" style={{ marginTop: 40 }} />
      ) : menu.length === 0 ? (
        <Text style={styles.empty}>No menu items available.</Text>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>🥘</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCat}>{item.category}</Text>
                <Text style={styles.rating}>★ {item.popularity_rating}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => handleAddItem(item)}>
                  <Text style={styles.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.cartBarLeft}>🛒 {cartItems.length} item(s)</Text>
          <Text style={styles.cartBarRight}>${total.toFixed(2)}  View Cart ›</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  back: { paddingHorizontal: 24, paddingTop: 8 },
  backText: { color: "#e63946", fontSize: 16, fontWeight: "600" },
  title: { color: "#fff", fontSize: 24, fontWeight: "900", paddingHorizontal: 24, marginTop: 8 },
  address: { color: "#666", fontSize: 13, paddingHorizontal: 24, marginTop: 4 },
  categoryTag: { color: "#e63946", fontSize: 12, fontWeight: "700", paddingHorizontal: 24, marginTop: 6, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 },
  empty: { color: "#555", textAlign: "center", marginTop: 60, fontSize: 15 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", marginHorizontal: 24, marginBottom: 10, borderRadius: 16, padding: 14 },
  cardIcon: { width: 44, height: 44, backgroundColor: "#2a2a2a", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardEmoji: { fontSize: 20 },
  cardBody: { flex: 1 },
  itemName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  itemCat: { color: "#555", fontSize: 12, marginTop: 2 },
  rating: { color: "#f4a261", fontSize: 12, marginTop: 3 },
  cardRight: { alignItems: "flex-end" },
  price: { color: "#fff", fontSize: 15, fontWeight: "800" },
  addBtn: { backgroundColor: "#e63946", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 6 },
  addBtnText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  cartBar: { position: "absolute", bottom: 24, left: 24, right: 24, backgroundColor: "#e63946", borderRadius: 16, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cartBarLeft: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cartBarRight: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
