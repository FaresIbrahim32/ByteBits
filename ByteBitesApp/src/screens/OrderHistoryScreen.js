import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMyOrders } from "../api";

export default function OrderHistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Order History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e63946" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No past orders</Text>
          <Text style={styles.emptySubText}>Your completed orders will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderNum}>Order #{index + 1}</Text>
                  <Text style={styles.itemCount}>{item.items.length} item(s)</Text>
                </View>
                <View style={styles.totalBadge}>
                  <Text style={styles.totalBadgeText}>${item.total.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              {item.items.map((name, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.itemName}>{name}</Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
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
  card: { backgroundColor: "#1a1a1a", marginHorizontal: 24, marginBottom: 14, borderRadius: 18, padding: 18 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderNum: { color: "#fff", fontSize: 16, fontWeight: "800" },
  itemCount: { color: "#555", fontSize: 12, marginTop: 2 },
  totalBadge: { backgroundColor: "#2a2a2a", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  totalBadgeText: { color: "#e63946", fontSize: 16, fontWeight: "900" },
  divider: { height: 1, backgroundColor: "#2a2a2a", marginVertical: 14 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { color: "#e63946", fontSize: 16, marginRight: 8 },
  itemName: { color: "#aaa", fontSize: 14 },
});
