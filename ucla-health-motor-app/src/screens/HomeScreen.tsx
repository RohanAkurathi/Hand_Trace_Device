import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.replace("Start")}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        <View style={styles.header}>
          <Text style={styles.kicker}>Task Selection</Text>
          <Text style={styles.title}>Choose a tracing task</Text>
          <Text style={styles.subtitle}>
            Each task captures precision, smoothness, and completion in a
            consistent clinical format.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Straight-Line Corridor</Text>
          </View>
          <View style={styles.preview}>
            <View style={styles.previewLine} />
            <View style={styles.previewLine} />
            <View style={styles.previewLine} />
          </View>
          <Text style={styles.cardBody}>
            Trace each horizontal line from left to right. Keep your finger
            steady and stay within the corridor.
          </Text>
          <Pressable
            style={styles.cardButton}
            onPress={() => navigation.navigate("Corridor")}
          >
            <Text style={styles.cardButtonText}>Start Corridor</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Figure-8 (∞)</Text>
          </View>
          <View style={styles.preview}>
            <View style={styles.figureEightPreview}>
              <View style={styles.figureEightLoopLeft} />
              <View style={styles.figureEightLoopRight} />
            </View>
          </View>
          <Text style={styles.cardBody}>
            Trace the continuous loop smoothly without lifting your finger.
          </Text>
          <Pressable
            style={styles.cardButton}
            onPress={() => navigation.navigate("FigureEight")}
          >
            <Text style={styles.cardButtonText}>Start Figure-8</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Spiral</Text>
          </View>
          <View style={styles.preview}>
            <Text style={styles.previewText}>Spiral tracing task.</Text>
          </View>
          <Text style={styles.cardBody}>
            Begin at the center and trace outward in one continuous motion.
          </Text>
          <View style={styles.cardButtonDisabled}>
            <Text style={styles.cardButtonTextDisabled}>Coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  topRow: {
    marginBottom: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2774AE",
  },
  backButtonText: {
    color: "#2774AE",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    marginBottom: 24,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#2774AE",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B3556",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B647A",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E3ECF5",
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B3556",
  },
  preview: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5E2F0",
    backgroundColor: "#F7FAFD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  previewLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#2774AE",
    opacity: 0.6,
    marginVertical: 8,
  },
  previewText: {
    textAlign: "center",
    color: "#4B647A",
    fontSize: 13,
  },
  figureEightPreview: {
    width: 140,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  figureEightLoopLeft: {
    position: "absolute",
    left: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#0B3556",
  },
  figureEightLoopRight: {
    position: "absolute",
    right: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#0B3556",
  },
  cardBody: {
    fontSize: 14,
    color: "#3B556C",
    lineHeight: 20,
    marginBottom: 14,
  },
  cardButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#2774AE",
    alignItems: "center",
    justifyContent: "center",
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  cardButtonDisabled: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7D7E8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7FAFD",
  },
  cardButtonTextDisabled: {
    color: "#7B93A8",
    fontSize: 14,
    fontWeight: "600",
  },
});
