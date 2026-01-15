import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PanResponder,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "FigureEight">;

export default function FigureEightScreen({ navigation }: Props) {
  const [strokes, setStrokes] = useState<
    { points: { x: number; y: number }[] }[]
  >([]);
  const currentStroke = useRef<{ x: number; y: number }[]>([]);
  const minStep = 2;

  const addInterpolatedPoints = (x: number, y: number) => {
    const last = currentStroke.current[currentStroke.current.length - 1];
    if (!last) {
      currentStroke.current.push({ x, y });
      return;
    }
    const dx = x - last.x;
    const dy = y - last.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(distance / minStep);
    for (let i = 1; i <= steps; i += 1) {
      const t = i / Math.max(steps, 1);
      currentStroke.current.push({
        x: last.x + dx * t,
        y: last.y + dy * t,
      });
    }
    if (steps === 0) {
      currentStroke.current.push({ x, y });
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          currentStroke.current = [{ x: locationX, y: locationY }];
          setStrokes((prev) => [...prev, { points: currentStroke.current }]);
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          addInterpolatedPoints(locationX, locationY);
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
          <Image
            source={require("../../assets/arrow.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <Text style={styles.title}>Figure-8</Text>
      <Text style={styles.instructions}>
        Trace the figure-8 smoothly in one continuous motion without lifting
        your finger.
      </Text>

      <View style={styles.content}>
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <View style={styles.figureEight} pointerEvents="none">
            <View style={styles.loopLeft} />
            <View style={styles.loopRight} />
          </View>
          {renderSegments()}
        </View>

        <Pressable style={styles.doneButton} onPress={() => navigation.goBack()}>
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
  figureEight: {
    width: 220,
    height: 120,
  },
  loopLeft: {
    position: "absolute",
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "#0B3556",
  },
  loopRight: {
    position: "absolute",
    right: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "#0B3556",
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
