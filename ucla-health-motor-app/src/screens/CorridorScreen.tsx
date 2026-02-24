import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PanResponder,
  LayoutChangeEvent,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Corridor">;

type DrawPoint = {
  x: number;
  y: number;
  t: number;
};

export default function CorridorScreen({ navigation }: Props) {
  const [strokes, setStrokes] = useState<{ points: DrawPoint[] }[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const currentStroke = useRef<DrawPoint[]>([]);
  const minStep = 2;
  const guideInset = 14;
  const guideWidth = 6;
  const completionThreshold = 12;

  const addInterpolatedPoints = (x: number, y: number, t: number) => {
    const last = currentStroke.current[currentStroke.current.length - 1];
    if (!last) {
      currentStroke.current.push({ x, y, t });
      return;
    }
    const dx = x - last.x;
    const dy = y - last.y;
    const dt = t - last.t;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(distance / minStep);
    for (let i = 1; i <= steps; i += 1) {
      const ratio = i / Math.max(steps, 1);
      currentStroke.current.push({
        x: last.x + dx * ratio,
        y: last.y + dy * ratio,
        t: last.t + dt * ratio,
      });
    }
    if (steps === 0) {
      currentStroke.current.push({ x, y, t });
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { locationX, locationY, timestamp } = event.nativeEvent;
          currentStroke.current = [{ x: locationX, y: locationY, t: timestamp }];
          setStrokes((prev) => [...prev, { points: currentStroke.current }]);
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY, timestamp } = event.nativeEvent;
          addInterpolatedPoints(locationX, locationY, timestamp);
          setStrokes((prev) => {
            if (prev.length === 0) {
              return prev;
            }
            const next = [...prev];
            next[next.length - 1] = { points: currentStroke.current };
            return next;
          });
        },
        onPanResponderRelease: () => {
          currentStroke.current = [];
        },
        onPanResponderTerminate: () => {
          currentStroke.current = [];
        },
      }),
    []
  );

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasSize({ width, height });
  };

  const calculateMetrics = () => {
    const filteredStrokes = strokes.filter((stroke) => stroke.points.length > 2);
    if (filteredStrokes.length === 0 || canvasSize.width === 0) {
      return {
        completionRate: 0,
        lineCount: 0,
        meanDeviation: 0,
        p95Deviation: 0,
        maxDeviation: 0,
        outOfBoundsPct: 0,
        boundaryCrossings: 0,
        speedStd: 0,
        jerkStd: 0,
        pathEfficiency: 0,
        angleErrorDeg: 0,
        scores: {
          completion: 0,
          lineCount: 0,
          meanDeviation: 0,
          p95Deviation: 0,
          outOfBounds: 0,
          pathEfficiency: 0,
          angleError: 0,
          speedVariability: 0,
          jerk: 0,
          boundaryCrossings: 0,
          maxDeviation: 0,
        },
        finalScore: 0,
      };
    }

    const leftBoundary = guideInset + guideWidth;
    const rightBoundary = canvasSize.width - guideInset - guideWidth;
    const deviations: number[] = [];
    const speeds: number[] = [];
    const accelerations: number[] = [];
    const efficiencyValues: number[] = [];
    const angleErrors: number[] = [];
    let totalPoints = 0;
    let outOfBoundsPoints = 0;
    let boundaryCrossings = 0;
    let completedCount = 0;
    const lineCount = filteredStrokes.length;

    const addBoundaryCrossings = (x1: number, x2: number) => {
      if ((x1 - leftBoundary) * (x2 - leftBoundary) < 0) {
        boundaryCrossings += 1;
      }
      if ((x1 - rightBoundary) * (x2 - rightBoundary) < 0) {
        boundaryCrossings += 1;
      }
    };

    filteredStrokes.forEach((stroke) => {
      const points = stroke.points;
      const start = points[0];
      const end = points[points.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const lineLength = Math.sqrt(dx * dx + dy * dy) || 1;
      const lineAngle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
      angleErrors.push(lineAngle);

      if (
        start.x <= leftBoundary + completionThreshold &&
        end.x >= rightBoundary - completionThreshold
      ) {
        completedCount += 1;
      }

      let pathLength = 0;
      const strokeSpeeds: number[] = [];
      for (let i = 1; i < points.length; i += 1) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const segmentDx = p2.x - p1.x;
        const segmentDy = p2.y - p1.y;
        const segmentLength = Math.sqrt(
          segmentDx * segmentDx + segmentDy * segmentDy
        );
        pathLength += segmentLength;

        const dt = p2.t - p1.t;
        if (dt > 0 && segmentLength > 0) {
          const speed = segmentLength / dt;
          speeds.push(speed);
          strokeSpeeds.push(speed);
        }
        addBoundaryCrossings(p1.x, p2.x);
      }

      for (let i = 1; i < strokeSpeeds.length; i += 1) {
        const dv = strokeSpeeds[i] - strokeSpeeds[i - 1];
        if (dv !== 0) {
          accelerations.push(Math.abs(dv));
        }
      }

      const efficiency = lineLength > 0 ? lineLength / Math.max(pathLength, 1) : 0;
      efficiencyValues.push(efficiency);

      points.forEach((point) => {
        totalPoints += 1;
        if (point.x < leftBoundary || point.x > rightBoundary) {
          outOfBoundsPoints += 1;
        }
        const distance =
          Math.abs(dy * point.x - dx * point.y + end.x * start.y - end.y * start.x) /
          lineLength;
        deviations.push(distance);
      });
    });

    const meanDeviation =
      deviations.reduce((sum, value) => sum + value, 0) /
      Math.max(deviations.length, 1);
    const sortedDeviations = [...deviations].sort((a, b) => a - b);
    const p95Index = Math.floor(0.95 * (sortedDeviations.length - 1));
    const p95Deviation = sortedDeviations[p95Index] || 0;
    const maxDeviation = sortedDeviations[sortedDeviations.length - 1] || 0;
    const outOfBoundsPct =
      (outOfBoundsPoints / Math.max(totalPoints, 1)) * 100;
    const completionRate =
      (completedCount / Math.max(filteredStrokes.length, 1)) * 100;
    const meanSpeed =
      speeds.reduce((sum, value) => sum + value, 0) / Math.max(speeds.length, 1);
    const speedVariance =
      speeds.reduce((sum, value) => sum + (value - meanSpeed) ** 2, 0) /
      Math.max(speeds.length, 1);
    const speedStd = Math.sqrt(speedVariance) || 0;
    const meanAccel =
      accelerations.reduce((sum, value) => sum + value, 0) /
      Math.max(accelerations.length, 1);
    const accelVariance =
      accelerations.reduce((sum, value) => sum + (value - meanAccel) ** 2, 0) /
      Math.max(accelerations.length, 1);
    const jerkStd = Math.sqrt(accelVariance) || 0;
    const pathEfficiency =
      efficiencyValues.reduce((sum, value) => sum + value, 0) /
      Math.max(efficiencyValues.length, 1);
    const angleErrorDeg =
      angleErrors.reduce((sum, value) => sum + value, 0) /
      Math.max(angleErrors.length, 1);

    const clampScore = (value: number) =>
      Math.max(0, Math.min(100, value));
    const deviationBaseline = canvasSize.height * 0.12;
    const scoreFromDeviation = (dev: number, scale: number) =>
      clampScore(100 * (1 - dev / Math.max(scale, 1)));
    const scoreFromPercent = (percent: number) =>
      clampScore(100 * (1 - percent / 30));

    const scores = {
      completion: clampScore(completionRate),
      lineCount: clampScore((lineCount / 7) * 100),
      meanDeviation: scoreFromDeviation(meanDeviation, deviationBaseline),
      p95Deviation: scoreFromDeviation(p95Deviation, deviationBaseline * 1.5),
      outOfBounds: scoreFromPercent(outOfBoundsPct),
      pathEfficiency: clampScore(pathEfficiency * 100),
      angleError: scoreFromDeviation(angleErrorDeg, 20),
      speedVariability: scoreFromDeviation(speedStd, 0.002),
      jerk: scoreFromDeviation(jerkStd, 0.003),
      boundaryCrossings: scoreFromDeviation(boundaryCrossings, 6),
      maxDeviation: scoreFromDeviation(maxDeviation, deviationBaseline * 2),
    };

    const finalScore =
      (scores.completion +
        scores.lineCount +
        scores.meanDeviation +
        scores.p95Deviation +
        scores.outOfBounds +
        scores.pathEfficiency) /
      6;

    return {
      completionRate,
      lineCount,
      meanDeviation,
      p95Deviation,
      maxDeviation,
      outOfBoundsPct,
      boundaryCrossings,
      speedStd,
      jerkStd,
      pathEfficiency,
      angleErrorDeg,
      scores,
      finalScore,
    };
  };

  const renderSegments = () =>
    strokes.flatMap((stroke, strokeIndex) =>
      stroke.points.slice(1).map((point, pointIndex) => {
        const prev = stroke.points[pointIndex];
        const dx = point.x - prev.x;
        const dy = point.y - prev.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return (
          <View
            key={`${strokeIndex}-${pointIndex}`}
            style={[
              styles.drawSegment,
              {
                left: prev.x,
                top: prev.y,
                width: Math.max(1, length),
                transform: [{ rotate: `${angle}rad` }],
              },
            ]}
          />
        );
      })
    );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"<"}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Straight-Line Corridor</Text>
      <Text style={styles.instructions}>
        Draw 7 horizontal straight lines. Each line should begin at the left
        guide and finish at the right guide.
      </Text>

      <View style={styles.content}>
        <View
          style={styles.corridor}
          onLayout={handleCanvasLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.verticalGuideLeft} pointerEvents="none" />
          <View style={styles.verticalGuideRight} pointerEvents="none" />
          {renderSegments()}
        </View>

        <Pressable
          style={styles.doneButton}
          onPress={() =>
            navigation.navigate("CorridorResults", {
              metrics: calculateMetrics(),
            })
          }
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
    paddingTop: 64,
  },
  topRow: {
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2774AE",
    lineHeight: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B3556",
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: "#4B647A",
    lineHeight: 20,
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  corridor: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D5E2F0",
    borderRadius: 16,
    backgroundColor: "#F7FAFD",
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  verticalGuideLeft: {
    position: "absolute",
    left: 14,
    top: 16,
    bottom: 16,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#0B3556",
  },
  verticalGuideRight: {
    position: "absolute",
    right: 14,
    top: 16,
    bottom: 16,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#0B3556",
  },
  drawSegment: {
    position: "absolute",
    height: 4,
    borderRadius: 3,
    backgroundColor: "#2774AE",
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
