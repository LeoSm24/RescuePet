import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import theme from '../constants/theme';
import { supabase } from '../lib/supabase';

const PetLost = () => {
  const [reportes, setReportes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReportes = async () => {
    const { data, error } = await supabase
      .from('reportes')
      .select('*')
      .order('fecha', { ascending: false });

    if (!error && data) {
      setReportes(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReportes();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Mascotas Perdidas</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>
            {refreshing ? 'Actualizando...' : '🔄 Actualizar'}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {reportes.map((r) => (
              <View key={r.id} style={styles.card}>
                {r.foto_url && (
                  <Image source={{ uri: r.foto_url }} style={styles.image} />
                )}
                <Text style={styles.cardTitle}>{r.nombre}</Text>
                <Text style={styles.cardText}>{r.descripcion}</Text>
                <Text style={styles.cardInfo}>📍 {r.ubicacion}</Text>
                <Text style={styles.cardInfo}>
                  🕒 {new Date(r.fecha).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PetLost;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  refreshButton: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 12,
    color: '#777',
  },
});
