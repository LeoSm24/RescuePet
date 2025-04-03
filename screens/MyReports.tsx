import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import theme from "../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import { useNavigation } from "@react-navigation/native";

const MyReports = () => {
  const [session, setSession] = useState<any>(null);
  const [misReportes, setMisReportes] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    obtenerSesion();
  }, []);

  useEffect(() => {
    if (session) {
      fetchMisReportes();
    }
  }, [session]);

  const fetchMisReportes = async () => {
    const { data: reportes, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("usuario_id", session.user.id)
      .order("id", { ascending: false });

    if (!error) setMisReportes(reportes);
  };

  const eliminarReporte = async (id: number) => {
    Alert.alert(
      "Eliminar",
      "¿Estás seguro que quieres eliminar este reporte?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("reportes")
              .delete()
              .eq("id", id);
            if (error) {
              Alert.alert("Error", "No se pudo eliminar el reporte.");
            } else {
              setMisReportes((prev) => prev.filter((r) => r.id !== id));
              Alert.alert(
                "Eliminado",
                "El reporte fue eliminado correctamente."
              );
            }
          },
        },
      ]
    );
  };

  const abrirWhatsapp = (telefono: string) => {
    const url = `https://wa.me/${telefono}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {session && <Header session={session} />}
      <ScrollView contentContainerStyle={styles.content}>
        {/* <BackButton /> */}
        <Text style={styles.title}>Mis Reportes</Text>
        <TouchableOpacity
          style={styles.backToPetLostButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backToPetLostText}>Volver a Reportes</Text>
        </TouchableOpacity>

        {misReportes.length === 0 ? (
          <Text style={styles.placeholder}>Aún no has publicado reportes.</Text>
        ) : (
          misReportes.map((reporte) => (
            <View key={reporte.id} style={styles.card}>
              {reporte.foto_url && (
                <Image
                  source={{ uri: reporte.foto_url }}
                  style={styles.image}
                />
              )}
              <View style={styles.cardRow}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{reporte.nombre}</Text>
                  <Text style={styles.cardText}>{reporte.descripcion}</Text>
                  <Text style={styles.cardUbicacion}>
                    📍 {reporte.ubicacion}
                  </Text>
                  {reporte.raza && (
                    <Text style={styles.cardText}>🐶 Raza: {reporte.raza}</Text>
                  )}
                  {reporte.telefono && (
                    <Pressable
                      style={styles.whatsappButton}
                      onPress={() => abrirWhatsapp(reporte.telefono)}
                    >
                      <FontAwesome name="whatsapp" size={20} color="#fff" />
                      <Text style={styles.whatsappText}>
                        {reporte.telefono}
                      </Text>
                    </Pressable>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => eliminarReporte(reporte.id)}
                  >
                    <Text style={styles.deleteButtonText}>
                      Eliminar Reporte
                    </Text>
                  </TouchableOpacity>
                </View>

                {reporte.imagen_raza && (
                  <Image
                    source={{ uri: reporte.imagen_raza }}
                    style={styles.razaImage}
                  />
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default MyReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardInfo: {
    flex: 1,
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
  razaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 8,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  whatsappText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
