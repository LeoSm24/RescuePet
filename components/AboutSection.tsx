import { View, Text, StyleSheet } from 'react-native';
import theme from '../constants/theme';

const AboutSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        RescuePet es una plataforma comunitaria para reportar mascotas perdidas y encontradas. ¡Ayudemos juntos a reunirlas con sus dueños!
      </Text>
    </View>
  );
};

export default AboutSection;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text,
    lineHeight: 24,
    maxWidth: 600, // se mantiene legible en pantallas grandes
  },
});
