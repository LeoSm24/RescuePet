import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
}

const PrimaryButton = ({ title, onPress }: Props) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 40,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
