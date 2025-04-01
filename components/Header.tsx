import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../constants/theme';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

const Header = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [modalVisible, setModalVisible] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Obtener sesión al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  const isLoggedIn = !!session;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Botón centrado solo si está logueado */}
        {isLoggedIn && (
          <Pressable
            onPress={() => navigation.navigate('CreateReport')}
            style={styles.centerButton}
          >
            <Text style={styles.centerButtonText}>Reportar</Text>
          </Pressable>
        )}

        {/* Acciones derecha */}
        {isMobile ? (
          <>
            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons name="menu" size={28} color={theme.colors.primary} />
            </Pressable>

            <Modal
              visible={modalVisible}
              animationType="fade"
              transparent
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setModalVisible(false)}
                activeOpacity={1}
              >
                <View style={styles.modalContent}>
                  {isLoggedIn ? (
                    <Pressable
                      style={styles.modalButton}
                      onPress={() => {
                        setModalVisible(false);
                        handleLogout();
                      }}
                    >
                      <Text style={styles.modalButtonText}>Cerrar Sesión</Text>
                    </Pressable>
                  ) : (
                    <>
                      <Pressable
                        style={styles.modalButton}
                        onPress={() => {
                          setModalVisible(false);
                          navigation.push('Login');
                        }}
                      >
                        <Text style={styles.modalButtonText}>Iniciar Sesión</Text>
                      </Pressable>

                      <Pressable
                        style={styles.modalButton}
                        onPress={() => {
                          setModalVisible(false);
                          navigation.push('Register');
                        }}
                      >
                        <Text style={styles.modalButtonText}>Registrarse</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        ) : (
          <View style={styles.actions}>
            {isLoggedIn ? (
              <Pressable
                onPress={handleLogout}
                style={({ hovered }) => [
                  styles.button,
                  hovered && Platform.OS === 'web' && styles.buttonHover,
                ]}
              >
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  onPress={() => navigation.push('Login')}
                  style={({ hovered }) => [
                    styles.button,
                    hovered && Platform.OS === 'web' && styles.buttonHover,
                  ]}
                >
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </Pressable>

                <Pressable
                  onPress={() => navigation.push('Register')}
                  style={({ hovered }) => [
                    styles.button,
                    hovered && Platform.OS === 'web' && styles.buttonHover,
                  ]}
                >
                  <Text style={styles.buttonText}>Registrarse</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;

  
  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      zIndex: 10,
    },
    container: {
      width: '100%',
      paddingVertical: Platform.OS === 'android' ? 4 : 10,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: '#ffffff20',
      borderBottomWidth: 1,
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 10,
    },
    centerButton: {
      position: 'absolute',
      left: '50%',
      transform: [{ translateX: -40 }],
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
    },
    centerButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    buttonHover: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      color: theme.colors.secondaryText,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000080',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      padding: 20,
      zIndex: 99,
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: 10,
      gap: 12,
      width: 200,
      elevation: 5,
    },
    modalButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  