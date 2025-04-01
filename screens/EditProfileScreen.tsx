import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import theme from '../constants/theme';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) {
        navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
        return;
      }

      const { data, error: userError } = await supabase
        .from('usuarios')
        .select('nombre, telefono')
        .eq('id', user.id)
        .single();

      if (!userError && data) {
        setNombre(data.nombre);
        setTelefono(data.telefono);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('usuarios')
      .update({ nombre, telefono })
      .eq('id', user?.id);

    if (error) {
      Alert.alert('Error al actualizar', error.message);
    } else {
      Alert.alert('¡Perfil actualizado!', 'Tus datos se guardaron correctamente.');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <>
            <Text style={styles.title}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#aaa"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
