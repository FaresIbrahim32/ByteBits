import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    try {
      await register(username, password, name);
    } catch {
      Alert.alert("Registration Failed", "Username may already be taken.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.logo}>🍖</Text>
          <Text style={styles.appName}>ByteBites</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="Your full name" placeholderTextColor="#999" value={name} onChangeText={setName} />

          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="Choose a username" placeholderTextColor="#999" value={username} onChangeText={setUsername} autoCapitalize="none" />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} placeholder="Create a password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.secondaryBtnText}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  scroll: { flexGrow: 1 },
  hero: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60, paddingBottom: 32 },
  logo: { fontSize: 50, marginBottom: 10 },
  appName: { fontSize: 36, fontWeight: "900", color: "#fff" },
  tagline: { fontSize: 15, color: "#888", marginTop: 6 },
  form: { backgroundColor: "#1a1a1a", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 48 },
  label: { color: "#aaa", fontSize: 13, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { backgroundColor: "#2a2a2a", color: "#fff", borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 20 },
  btn: { backgroundColor: "#e63946", borderRadius: 14, padding: 18, alignItems: "center", marginTop: 4 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
  secondaryBtn: { borderRadius: 14, padding: 16, alignItems: "center", marginTop: 10 },
  secondaryBtnText: { color: "#e63946", fontSize: 15, fontWeight: "600" },
});
