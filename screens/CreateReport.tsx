import { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import theme from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';


const CreateReport = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [image, setImage] = useState<any>(null);
  const navigation = useNavigation<any>();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para subir una imagen.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0]); // ← Aquí guardas la imagen seleccionada
    }
  };
  

  const handleSubmit = async () => {
    if (!nombre || !descripcion || !ubicacion) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
  
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();
  
    if (!user || sessionError) {
      Alert.alert('Sesión no válida', 'Inicia sesión nuevamente.');
      return;
    }
  
    let foto_url = ""; // <-- Usa tu imagen por defecto
  
    // Si el usuario seleccionó una imagen, intenta subirla
    if (image?.uri) {
      try {
        const fileExt = image.uri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `reportes/${user.id}/${fileName}`;
  
        const response = await fetch(image.uri);
        const blob = await response.blob();
  
        const { error: uploadError } = await supabase.storage
          .from('reportes')
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: false,
            contentType: blob.type,
          });
  
        if (uploadError) {
          console.error('Error al subir imagen:', uploadError.message);
          Alert.alert('Error al subir imagen', uploadError.message);
          return;
        }
  
        const { data: publicUrlData } = supabase.storage
          .from('reportes')
          .getPublicUrl(filePath);
  
        foto_url = publicUrlData?.publicUrl || '';
      } catch (err) {
        console.error('Error al procesar imagen:', err);
        return;
      }
    }
  
    // Insertar el reporte con o sin imagen
    const { error: insertError } = await supabase.from('reportes').insert([
      {
        usuario_id: user.id,
        nombre,
        descripcion,
        ubicacion,
        foto_url,
      },
    ]);
  
    if (insertError) {
      console.error('Error al insertar reporte:', insertError.message);
      Alert.alert('Error al registrar el reporte', insertError.message);
    } else {
      Alert.alert('¡Reporte creado!', 'Gracias por ayudar.');
      navigation.goBack();
    }
  };
  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reportar Mascota Perdida</Text>

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

        <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>
            {image ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Publicar reporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateReport;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
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
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
