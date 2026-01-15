import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, PanResponder } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Corridor">;

export default function CorridorScreen({ navigation }: Props) {
  const [strokes, setStrokes] = useState<
    { points: { x: number; y: number }[] }[]
  >([]);
  const currentStroke = useRef<{ x: number; y: number }[]>([]);

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
          currentStroke.current.push({ x: locationX, y: locationY });
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
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Straight-Line Corridor</Text>
      <Text style={styles.instructions}>
        Draw as many horizontal straight lines as you can. Each line should
        begin at the left guide and finish at the right guide.
      </Text>

      <View style={styles.content}>
        <View style={styles.corridor} {...panResponder.panHandlers}>
          <View style={styles.verticalGuideLeft} />
          <View style={styles.verticalGuideRight} />
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
  backButtonText: {
    color: "#2774AE",
    fontSize: 14,
    fontWeight: "600",
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
    height: 3,
    borderRadius: 2,
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
