import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "CorridorResults">;

const formatScore = (value: number) => `${Math.round(value)} / 100`;
const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const formatPx = (value: number) => `${value.toFixed(1)} px`;

export default function CorridorResultsScreen({ navigation, route }: Props) {
  const { metrics } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/arrow.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <Text style={styles.title}>Results</Text>
      <Text style={styles.subtitle}>
        Corridor tracing summary for clinical review and patient feedback.
      </Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Final Score</Text>
        <Text style={styles.scoreValue}>{formatScore(metrics.finalScore)}</Text>
      </View>

      <View style={styles.metricsCard}>
        <Text style={styles.sectionTitle}>Core Metrics</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Line Count</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.lineCount)}{" "}
            <Text style={styles.metricDetail}>
              ({metrics.lineCount} lines)
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Start-to-End Completion</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.completion)}{" "}
            <Text style={styles.metricDetail}>
              ({formatPercent(metrics.completionRate)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Mean Deviation</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.meanDeviation)}{" "}
            <Text style={styles.metricDetail}>
              ({formatPx(metrics.meanDeviation)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>95th Percentile Deviation</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.p95Deviation)}{" "}
            <Text style={styles.metricDetail}>
              ({formatPx(metrics.p95Deviation)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Out-of-Bounds</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.outOfBounds)}{" "}
            <Text style={styles.metricDetail}>
              ({formatPercent(metrics.outOfBoundsPct)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Path Efficiency</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.pathEfficiency)}{" "}
            <Text style={styles.metricDetail}>
              ({formatPercent(metrics.pathEfficiency * 100)})
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.metricsCard}>
        <Text style={styles.sectionTitle}>Additional Metrics</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Max Deviation</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.maxDeviation)}{" "}
            <Text style={styles.metricDetail}>
              ({formatPx(metrics.maxDeviation)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Boundary Crossings</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.boundaryCrossings)}{" "}
            <Text style={styles.metricDetail}>
              ({metrics.boundaryCrossings})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Speed Variability</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.speedVariability)}{" "}
            <Text style={styles.metricDetail}>
              ({metrics.speedStd.toFixed(3)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Jerk (Smoothness)</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.jerk)}{" "}
            <Text style={styles.metricDetail}>
              ({metrics.jerkStd.toFixed(3)})
            </Text>
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Line Angle Error</Text>
          <Text style={styles.metricValue}>
            {formatScore(metrics.scores.angleError)}{" "}
            <Text style={styles.metricDetail}>
              ({metrics.angleErrorDeg.toFixed(1)}°)
            </Text>
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.doneButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.doneButtonText}>Return to Tasks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  topRow: {
    marginBottom: 16,
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B3556",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B647A",
    lineHeight: 20,
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: "#F7FAFD",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D5E2F0",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 13,
    color: "#4B647A",
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B3556",
  },
  metricsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E3ECF5",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B3556",
    marginBottom: 12,
  },
  metricRow: {
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 13,
    color: "#4B647A",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B3556",
  },
  metricDetail: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7D8F",
  },
  doneButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2774AE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
