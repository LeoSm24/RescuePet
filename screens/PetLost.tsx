import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import React from "react";
import theme from "../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native"
import { useIsFocused } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";


const PetLost = () => {
  const [session, setSession] = useState<any>(null);
  const [reportes, setReportes] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [razas, setRazas] = useState<string[]>([]);
  const [razaSeleccionada, setRazaSeleccionada] = useState<string>("");
  const [imagenRaza, setImagenRaza] = useState<string>("");
  const [loadingRazas, setLoadingRazas] = useState<boolean>(false);
  const route = useRoute();


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchReportes();
    }
  }, [isFocused]);
  
  

  const fetchReportes = async () => {
    const { data: reportesData, error: reportesError } = await supabase
      .from("reportes")
      .select("*")
      .order("id", { ascending: false });
    const { data: usuariosData, error: usuariosError } = await supabase
      .from("usuarios")
      .select("id, telefono");

    if (!reportesError && !usuariosError) {
      const reportesConTelefonos = reportesData.map((reporte) => {
        const usuario = usuariosData.find((u) => u.id === reporte.usuario_id);
        return { ...reporte, telefono: usuario?.telefono || null };
      });
      setReportes(reportesConTelefonos);
    }
  };

  const abrirWhatsapp = (telefono: string) => {
    const url = `https://wa.me/${telefono}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {session !== null && <Header session={session} />}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mascotas Perdidas</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={fetchReportes}>
          <FontAwesome name="refresh" size={16} color="#fff" />
          <Text style={styles.refreshText}>Actualizar</Text>
        </TouchableOpacity>

        {reportes.length === 0 ? (
          <Text style={styles.placeholder}>
            📋 Aquí aparecerán los reportes subidos por la comunidad.
          </Text>
        ) : (
          reportes.map((reporte) => (
            <View key={reporte.id} style={styles.card}>
              {reporte.imagen_raza && (
                <Image
                  source={{ uri: reporte.imagen_raza }}
                  style={styles.preview}
                />
              )}
              <Text style={styles.cardTitle}>{reporte.nombre}</Text>
              <Text style={styles.cardText}>{reporte.descripcion}</Text>
              <Text style={styles.cardUbicacion}>📍 {reporte.ubicacion}</Text>
              {reporte.raza && (
                <Text style={styles.cardText}>🐶 Raza: {reporte.raza}</Text>
              )}
              {reporte.telefono && (
                <Pressable
                  style={styles.whatsappButton}
                  onPress={() => abrirWhatsapp(reporte.telefono)}
                >
                  <FontAwesome name="whatsapp" size={20} color="#fff" />
                  <Text style={styles.whatsappText}>{reporte.telefono}</Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default PetLost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#2c2f3b",
    color: "#fff",
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: theme.colors.secondaryText,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#2c2f3b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    maxWidth: 400,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  preview: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.secondaryText,
    marginBottom: 8,
  },
  cardUbicacion: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  whatsappText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
