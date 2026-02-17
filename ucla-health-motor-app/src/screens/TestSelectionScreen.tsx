import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "TestSelection">;

export default function TestSelectionScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Image
          source={require("../../assets/UCLA-Health.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.kicker}>Assessment Type</Text>
        <Text style={styles.title}>Choose a test</Text>
        <Text style={styles.subtitle}>
          Select a motor tracing assessment or an ICE cognitive status check.
        </Text>
      </View>

      <View style={styles.cardGroup}>
        <Pressable
          style={styles.cardButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.cardTitle}>Motor Test</Text>
          <Text style={styles.cardDescription}>
            Corridor, Figure-8, and Spiral tracing tasks.
          </Text>
        </Pressable>

        <Pressable
          style={styles.cardButton}
          onPress={() => navigation.navigate("IceTest")}
        >
          <Text style={styles.cardTitle}>ICE Test</Text>
          <Text style={styles.cardDescription}>
            Bedside cognitive orientation and command-following checklist.
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 32,
  },
  headerBlock: {
    marginBottom: 28,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 16,
  },
  kicker: {
    fontSize: 12,
    color: "#2774AE",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    color: "#0B3556",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#4B647A",
    lineHeight: 22,
  },
  cardGroup: {
    gap: 14,
  },
  cardButton: {
    borderWidth: 1,
    borderColor: "#D5E2F0",
    backgroundColor: "#F7FAFD",
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    color: "#0B3556",
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#3B556C",
    lineHeight: 20,
  },
});
