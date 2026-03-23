import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(username, password);
    } catch {
      Alert.alert("Login Failed", "Invalid username or password.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🍖</Text>
        <Text style={styles.appName}>ByteBites</Text>
        <Text style={styles.tagline}>Halal food, near you.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder="Enter your username" placeholderTextColor="#999" value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.secondaryBtnText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  hero: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  logo: { fontSize: 60, marginBottom: 12 },
  appName: { fontSize: 40, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  tagline: { fontSize: 16, color: "#888", marginTop: 6 },
  form: { backgroundColor: "#1a1a1a", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 48 },
  label: { color: "#aaa", fontSize: 13, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { backgroundColor: "#2a2a2a", color: "#fff", borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20 },
  btn: { backgroundColor: "#e63946", borderRadius: 14, padding: 18, alignItems: "center", marginTop: 4 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  secondaryBtn: { borderRadius: 14, padding: 16, alignItems: "center", marginTop: 10 },
  secondaryBtnText: { color: "#e63946", fontSize: 15, fontWeight: "600" },
});
