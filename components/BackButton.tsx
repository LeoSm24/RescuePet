import { Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../constants/theme';

const BackButton = () => {
  const navigation = useNavigation<any>();

  return (
    <Pressable onPress={() => navigation.goBack()} style={styles.button}>
      <Ionicons
        name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
        size={28}
        color={theme.colors.primary}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 40,
    left: 20,
    zIndex: 100,
  },
});
