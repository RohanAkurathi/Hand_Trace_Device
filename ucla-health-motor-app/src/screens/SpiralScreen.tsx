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

type Props = NativeStackScreenProps<RootStackParamList, "Spiral">;

type DrawPoint = {
  x: number;
  y: number;
  t: number;
};

export default function SpiralScreen({ navigation }: Props) {
  const [strokes, setStrokes] = useState<{ points: DrawPoint[] }[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const currentStroke = useRef<DrawPoint[]>([]);
  const minStep = 1.5;

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

  const guidePoints = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) {
      return [];
    }
    const samples = 620;
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const maxRadius = Math.min(canvasSize.width, canvasSize.height) * 0.38;
    const startRadius = 6;
    const maxT = Math.PI * 6;
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
  }, [canvasSize.height, canvasSize.width]);

  const calculateMetrics = () => {
    const filteredStrokes = strokes.filter((stroke) => stroke.points.length > 2);
    if (
      filteredStrokes.length === 0 ||
      canvasSize.width === 0 ||
      guidePoints.length === 0
    ) {
      return {
        coverageRate: 0,
        meanDeviation: 0,
        p95Deviation: 0,
        maxDeviation: 0,
        outOfBoundsPct: 0,
        speedStd: 0,
        jerkStd: 0,
        pathEfficiency: 0,
        scores: {
          coverage: 0,
          meanDeviation: 0,
          p95Deviation: 0,
          outOfBounds: 0,
          pathEfficiency: 0,
          speedVariability: 0,
          jerk: 0,
          maxDeviation: 0,
        },
        finalScore: 0,
      };
    }

    const tolerance = Math.max(
      10,
      Math.min(canvasSize.width, canvasSize.height) * 0.04
    );
    const deviations: number[] = [];
    const speeds: number[] = [];
    const accelerations: number[] = [];
    let totalPoints = 0;
    let outOfBoundsPoints = 0;
    let totalPathLength = 0;
    const allPoints: DrawPoint[] = [];

    const minDistanceToGuide = (point: { x: number; y: number }) => {
      let minDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < guidePoints.length; i += 1) {
        const guidePoint = guidePoints[i];
        const dx = point.x - guidePoint.x;
        const dy = point.y - guidePoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      return minDistance;
    };

    filteredStrokes.forEach((stroke) => {
      const points = stroke.points;
      const strokeSpeeds: number[] = [];
      allPoints.push(...points);
      for (let i = 1; i < points.length; i += 1) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        totalPathLength += segmentLength;
        const dt = p2.t - p1.t;
        if (dt > 0 && segmentLength > 0) {
          const speed = segmentLength / dt;
          speeds.push(speed);
          strokeSpeeds.push(speed);
        }
      }

      for (let i = 1; i < strokeSpeeds.length; i += 1) {
        const dv = strokeSpeeds[i] - strokeSpeeds[i - 1];
        if (dv !== 0) {
          accelerations.push(Math.abs(dv));
        }
      }

      points.forEach((point) => {
        totalPoints += 1;
        const deviation = minDistanceToGuide(point);
        deviations.push(deviation);
        if (deviation > tolerance) {
          outOfBoundsPoints += 1;
        }
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

    let coveredGuidePoints = 0;
    for (let i = 0; i < guidePoints.length; i += 1) {
      const guidePoint = guidePoints[i];
      let isCovered = false;
      for (let j = 0; j < allPoints.length; j += 1) {
        const point = allPoints[j];
        const dx = guidePoint.x - point.x;
        const dy = guidePoint.y - point.y;
        if (Math.sqrt(dx * dx + dy * dy) <= tolerance) {
          isCovered = true;
          break;
        }
      }
      if (isCovered) {
        coveredGuidePoints += 1;
      }
    }
    const coverageRate =
      (coveredGuidePoints / Math.max(guidePoints.length, 1)) * 100;

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

    let guideLength = 0;
    for (let i = 1; i < guidePoints.length; i += 1) {
      const p1 = guidePoints[i - 1];
      const p2 = guidePoints[i];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      guideLength += Math.sqrt(dx * dx + dy * dy);
    }
    const pathEfficiency =
      guideLength > 0 ? guideLength / Math.max(totalPathLength, 1) : 0;

    const clampScore = (value: number) =>
      Math.max(0, Math.min(100, value));
    const deviationBaseline =
      Math.min(canvasSize.width, canvasSize.height) * 0.15;
    const scoreFromDeviation = (dev: number, scale: number) =>
      clampScore(100 * (1 - dev / Math.max(scale, 1)));
    const scoreFromPercent = (percent: number) =>
      clampScore(100 * (1 - percent / 30));

    const scores = {
      coverage: clampScore(coverageRate),
      meanDeviation: scoreFromDeviation(meanDeviation, deviationBaseline),
      p95Deviation: scoreFromDeviation(p95Deviation, deviationBaseline * 1.4),
      outOfBounds: scoreFromPercent(outOfBoundsPct),
      pathEfficiency: clampScore(pathEfficiency * 100),
      speedVariability: scoreFromDeviation(speedStd, 0.002),
      jerk: scoreFromDeviation(jerkStd, 0.003),
      maxDeviation: scoreFromDeviation(maxDeviation, deviationBaseline * 2),
    };

    const finalScore =
      (scores.coverage +
        scores.meanDeviation +
        scores.p95Deviation +
        scores.outOfBounds +
        scores.pathEfficiency) /
      5;

    return {
      coverageRate,
      meanDeviation,
      p95Deviation,
      maxDeviation,
      outOfBoundsPct,
      speedStd,
      jerkStd,
      pathEfficiency,
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

      <Text style={styles.title}>Spiral</Text>
      <Text style={styles.instructions}>
        Begin at the center and trace outward in one continuous motion. Try to
        follow the spiral path closely.
      </Text>

      <View style={styles.content}>
        <View
          style={styles.canvas}
          onLayout={handleCanvasLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.spiral} pointerEvents="none">
            {guidePoints.slice(1).map((point, index) => {
              const prev = guidePoints[index];
              const dx = point.x - prev.x;
              const dy = point.y - prev.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx);
              return (
                <View
                  key={`guide-${index}`}
                  style={[
                    styles.guideSegment,
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
          {renderSegments()}
        </View>

        <Pressable
          style={styles.doneButton}
          onPress={() =>
            navigation.navigate("SpiralResults", {
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
  canvas: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D5E2F0",
    borderRadius: 16,
    backgroundColor: "#F7FAFD",
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  spiral: {
    ...StyleSheet.absoluteFillObject,
  },
  guideSegment: {
    position: "absolute",
    height: 6,
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
