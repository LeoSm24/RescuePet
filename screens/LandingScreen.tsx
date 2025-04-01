import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import AboutSection from "../components/AboutSection";
import Header from "../components/Header";
import theme from "../constants/theme";

const LandingScreen = () => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />

        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <Image
              source={require("../assets/logo.png")}
              style={[
                styles.logo,
                isWeb && styles.logoWeb, // si es web, aplica tamaño reducido
              ]}
              resizeMode="contain"
            />
            <AboutSection />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centeredContent: {
    alignItems: "center",
    maxWidth: 600,
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 20, // 🔄 Esquinas redondeadas
    overflow: "hidden",
    backgroundColor: "#fff", // opcional, por si hay transparencia
  },
  logoWeb: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
});
