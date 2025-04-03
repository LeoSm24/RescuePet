// ...tus imports sin cambios
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import Header from "../components/Header";
import theme from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import BackButton from "../components/BackButton";

const CreateReport = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [image, setImage] = useState<any>(null);
  const [razaSeleccionada, setRazaSeleccionada] = useState("");
  const [razas, setRazas] = useState<string[]>([]);
  const [loadingRazas, setLoadingRazas] = useState(false);
  const [imagenRaza, setImagenRaza] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const fetchRazas = async () => {
    setLoadingRazas(true);
    try {
      const response = await fetch("https://dog.ceo/api/breeds/list/all");
      const json = await response.json();
      const listaRazas = Object.keys(json.message);
      setRazas(listaRazas);
    } catch (error) {
      console.error("Error al cargar razas:", error);
    } finally {
      setLoadingRazas(false);
    }
  };

  const fetchImagenRaza = async (raza: string) => {
    try {
      const response = await fetch(
        `https://dog.ceo/api/breed/${raza}/images/random`
      );
      const json = await response.json();
      setImagenRaza(json.message);
    } catch (error) {
      console.error("Error al cargar imagen de raza:", error);
    }
  };

  useEffect(() => {
    fetchRazas();
  }, []);

  useEffect(() => {
    if (razaSeleccionada) {
      fetchImagenRaza(razaSeleccionada);
    }
  }, [razaSeleccionada]);

  const handleSubmit = async () => {
    if (!nombre || !descripcion || !ubicacion || !razaSeleccionada) {
      Alert.alert("Error", "Completa todos los campos y selecciona una raza.");
      return;
    }

    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (!user || sessionError) {
      Alert.alert("Sesión no válida", "Inicia sesión nuevamente.");
      return;
    }

    let foto_url = "";

    if (image?.uri) {
      try {
        const fileExt = image.uri.split(".").pop() || "jpg";
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `reportes/${user.id}/${fileName}`;

        const response = await fetch(image.uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from("reportes")
          .upload(filePath, blob, {
            cacheControl: "3600",
            upsert: false,
            contentType: blob.type,
          });

        if (uploadError) {
          console.error("Error al subir imagen:", uploadError.message);
          Alert.alert("Error al subir imagen", uploadError.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("reportes")
          .getPublicUrl(filePath);

        foto_url = publicUrlData?.publicUrl ?? "";
      } catch (err) {
        console.error("Error al procesar imagen:", err);
        return;
      }
    }

    const { error: insertError } = await supabase.from("reportes").insert([
      {
        usuario_id: user.id,
        nombre,
        descripcion,
        ubicacion,
        foto_url,
        raza: razaSeleccionada,
        imagen_raza: imagenRaza,
      },
    ]);

    if (insertError) {
      console.error("Error al insertar reporte:", insertError.message);
      Alert.alert("Error al registrar el reporte", insertError.message);
    } else {
      Alert.alert("¡Reporte creado!", "Gracias por ayudar.");
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reportar Mascota Perdida</Text>
        <Text style={styles.title}>Mis Reportes</Text>
        <TouchableOpacity
          style={styles.backToPetLostButton}
          onPress={() => navigation.navigate("PetLost")}
        >
          <Text style={styles.backToPetLostText}>Volver a Reportes</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          placeholderTextColor="#aaa"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor="#aaa"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          placeholderTextColor="#aaa"
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <Text style={styles.selectLabel}>Selecciona la raza de tu perro</Text>
        {loadingRazas ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Picker
            selectedValue={razaSeleccionada}
            style={styles.picker}
            onValueChange={(itemValue) => setRazaSeleccionada(itemValue)}
          >
            <Picker.Item label="-- Selecciona una raza --" value="" />
            {razas.map((raza) => (
              <Picker.Item key={raza} label={raza} value={raza} />
            ))}
          </Picker>
        )}

        {imagenRaza && (
          <Image source={{ uri: imagenRaza }} style={styles.preview} />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Publicar reporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateReport;

// ...estilos (sin cambios)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  backToPetLostButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  backToPetLostText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: theme.colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  preview: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  selectLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  picker: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
});
