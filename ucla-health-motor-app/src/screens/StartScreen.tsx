import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

export default function StartScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundShell} pointerEvents="none">
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
        <View style={styles.orbThree} />
      </View>
      <View style={styles.center}>
        <Image
          source={require("../../assets/UCLA-Health.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.kicker}>UCLA Health</Text>
        <Text style={styles.title}>UCLA Health Assessment App</Text>
        <Text style={styles.subtitle}>
          Choose between motor tracing assessments and ICE cognitive scoring in
          a consistent clinical workflow.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.replace("TestSelection")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

      <Text style={styles.footer}>
        Optimized for phones and tablets on iOS and Android
      </Text>
    </View>
  );
}

const fontFamily = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backgroundShell: {
    ...StyleSheet.absoluteFillObject,
  },
  orbOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(39, 116, 174, 0.12)",
    top: -40,
    left: -60,
  },
  orbTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 199, 44, 0.15)",
    bottom: 120,
    right: -40,
  },
  orbThree: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0, 68, 136, 0.1)",
    bottom: -20,
    left: 40,
  },
  center: {
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    width: 240,
    height: 90,
    marginBottom: 24,
  },
  kicker: {
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#0B3556",
    marginBottom: 8,
    fontFamily,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#0A2742",
    fontFamily,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#35546F",
    maxWidth: 320,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: "#2774AE",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    fontSize: 12,
    color: "#4B647A",
    textAlign: "center",
  },
});
