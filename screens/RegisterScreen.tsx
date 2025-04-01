import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";
import theme from "../constants/theme";
import BackButton from "../components/BackButton";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<any>();

  const handleRegister = async () => {
    if (!nombre || !telefono || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error al registrar", error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from("usuarios").insert([
        {
          id: userId,
          nombre,
          telefono,
        },
      ]);

      if (insertError) {
        Alert.alert("Error al guardar datos adicionales", insertError.message);
        return;
      }
    }

    Alert.alert("¡Registro exitoso!", "Ya puedes iniciar sesión.");

    navigation.reset({
      index: 0,
      routes: [{ name: "PetLost" }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton />

        <Text style={styles.title}>Registrarse</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#aaa"
          onChangeText={setNombre}
          value={nombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          onChangeText={setTelefono}
          value={telefono}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: theme.colors.text,
    width: "100%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
