import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchRestaurants } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function HomeScreen({ navigation }) {
  const { signOut } = useAuth();
  const { cartItems } = useCart();
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) return;
    setLoading(true);
    try {
      const res = await searchRestaurants(location);
      setResults(res.data);
    } catch {
      Alert.alert("Error", "Could not fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>ByteBites</Text>
          <Text style={styles.subtitle}>Halal food near you</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("Cart")}>
            <Text style={styles.cartBtnText}>🛒 {cartItems.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search a city..."
          placeholderTextColor="#666"
          value={location}
          onChangeText={setLocation}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Go</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#e63946" style={{ marginTop: 40 }} />}

      {!loading && results.length > 0 && (
        <Text style={styles.resultsLabel}>{results.length} restaurants found</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.here_id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Menu", { restaurant: item })}
            activeOpacity={0.85}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardEmoji}>🍽️</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
            </View>
            <View style={styles.cardRight}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{Math.round((item.similarity_score || 0) * 100)}%</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f", overflow: "hidden" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  appName: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitle: { fontSize: 13, color: "#666", marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartBtn: { backgroundColor: "#e63946", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  cartBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  logoutBtn: { backgroundColor: "#2a2a2a", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  logoutText: { color: "#888", fontSize: 13, fontWeight: "600" },
  searchRow: { flexDirection: "row", paddingHorizontal: 24, marginBottom: 16, gap: 10 },
  input: { flex: 1, backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
  searchBtn: { backgroundColor: "#e63946", borderRadius: 14, paddingHorizontal: 20, justifyContent: "center" },
  searchBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  resultsLabel: { color: "#666", fontSize: 13, paddingHorizontal: 24, marginBottom: 12 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", marginHorizontal: 24, marginBottom: 12, borderRadius: 18, padding: 16 },
  cardLeft: { width: 48, height: 48, backgroundColor: "#2a2a2a", borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 14 },
  cardEmoji: { fontSize: 22 },
  cardBody: { flex: 1 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cardAddress: { color: "#666", fontSize: 12, marginTop: 3 },
  cardCategory: { color: "#e63946", fontSize: 12, marginTop: 4, fontWeight: "600" },
  cardRight: { alignItems: "center", gap: 6 },
  badge: { backgroundColor: "#2a2a2a", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: "#e63946", fontSize: 11, fontWeight: "700" },
  arrow: { color: "#555", fontSize: 22, fontWeight: "300" },
});
