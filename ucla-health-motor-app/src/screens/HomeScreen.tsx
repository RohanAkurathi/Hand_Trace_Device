import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const previewPoints = React.useMemo(() => {
    const width = 120;
    const height = 60;
    const samples = 160;
    const a = width * 0.45;
    const b = height * 0.35;
    const centerX = width / 2;
    const centerY = height / 2;
    const points = [];
    for (let i = 0; i <= samples; i += 1) {
      const t = (i / samples) * Math.PI * 2;
      const x = centerX + a * Math.sin(t);
      const y = centerY + b * Math.sin(t) * Math.cos(t);
      points.push({ x, y });
    }
    return points;
  }, []);
  const spiralPreviewPoints = React.useMemo(() => {
    const width = 120;
    const height = 80;
    const samples = 220;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.38;
    const startRadius = 4;
    const maxT = Math.PI * 5;
    const b = (maxRadius - startRadius) / maxT;
    const points = [];
    for (let i = 0; i <= samples; i += 1) {
      const t = (i / samples) * maxT;
      const r = startRadius + b * t;
      const x = centerX + r * Math.cos(t);
      const y = centerY + r * Math.sin(t);
      points.push({ x, y });
    }
    return points;
  }, []);

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
            <Image
              source={require("../../assets/arrow.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
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
            <Text style={styles.cardTitle}>Figure-8 ∞</Text>
          </View>
          <View style={styles.preview}>
            <View style={styles.figureEightPreview}>
              {previewPoints.slice(1).map((point, index) => {
                const prev = previewPoints[index];
                const dx = point.x - prev.x;
                const dy = point.y - prev.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                return (
                  <View
                    key={`preview-${index}`}
                    style={[
                      styles.figureEightSegment,
                      {
                        left: prev.x,
                        top: prev.y,
                        width: Math.max(1, length + 1),
                        transform: [{ rotate: `${angle}rad` }],
                      },
                    ]}
                  />
                );
              })}
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
            <View style={styles.spiralPreview}>
              {spiralPreviewPoints.slice(1).map((point, index) => {
                const prev = spiralPreviewPoints[index];
                const dx = point.x - prev.x;
                const dy = point.y - prev.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                return (
                  <View
                    key={`spiral-${index}`}
                    style={[
                      styles.spiralSegment,
                      {
                        left: prev.x,
                        top: prev.y,
                        width: Math.max(1, length + 1),
                        transform: [{ rotate: `${angle}rad` }],
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
          <Text style={styles.cardBody}>
            Begin at the center and trace outward in one continuous motion.
          </Text>
          <Pressable
            style={styles.cardButton}
            onPress={() => navigation.navigate("Spiral")}
          >
            <Text style={styles.cardButtonText}>Start Spiral</Text>
          </Pressable>
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
  backIcon: {
    width: 18,
    height: 18,
    tintColor: "#2774AE",
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
    width: 120,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  figureEightSegment: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B3556",
  },
  spiralPreview: {
    width: 120,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  spiralSegment: {
    position: "absolute",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0B3556",
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
});
