import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "IceTest">;

type YesNo = "yes" | "no";
type YesNoOrUnset = YesNo | null;

type BinaryQuestion = {
  id: "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q8";
  number: number;
  text: string;
  emphasis: string;
};

const binaryQuestions: BinaryQuestion[] = [
  { id: "q1", number: 1, text: "Can the patient state the", emphasis: "year?" },
  { id: "q2", number: 2, text: "Can the patient state the", emphasis: "month?" },
  { id: "q3", number: 3, text: "Can the patient state the", emphasis: "city?" },
  {
    id: "q4",
    number: 4,
    text: "Can the patient state the",
    emphasis: "hospital?",
  },
  {
    id: "q5",
    number: 5,
    text: "Can the patient",
    emphasis: "follow commands?",
  },
  {
    id: "q6",
    number: 6,
    text: "Can the patient write a",
    emphasis: "standard sentence?",
  },
  {
    id: "q8",
    number: 8,
    text: "Can the patient",
    emphasis: "count backwards from 100 by tens?",
  },
];

export default function IceTestScreen({ navigation }: Props) {
  const [arousable, setArousable] = useState<YesNoOrUnset>(null);
  const [binaryAnswers, setBinaryAnswers] = useState<
    Record<BinaryQuestion["id"], YesNoOrUnset>
  >({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q8: null,
  });
  const [objectScore, setObjectScore] = useState<number | null>(null);

  const iceScore = useMemo(() => {
    const arousablePoint = arousable === "yes" ? 1 : 0;
    const binaryTotal = Object.values(binaryAnswers).reduce(
      (sum, answer) => sum + (answer === "yes" ? 1 : 0),
      0
    );
    const objectPoint = objectScore !== null && objectScore > 0 ? 1 : 0;
    return arousablePoint + binaryTotal + objectPoint;
  }, [arousable, binaryAnswers, objectScore]);

  const selectBinary = (id: BinaryQuestion["id"], value: YesNo) => {
    setBinaryAnswers((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Calculate ICE Score</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>ICE Score: {iceScore}</Text>
        </View>

        <View style={styles.questionRow}>
          <View style={styles.questionCopyWrap}>
            <Text style={styles.questionText}>Is the patient arousable?</Text>
          </View>
          <View style={styles.toggleGroup}>
            <Pressable
              style={[
                styles.toggleOption,
                arousable === "yes" && styles.toggleOptionSelected,
              ]}
              onPress={() => setArousable("yes")}
            >
              <Text
                style={[
                  styles.toggleText,
                  arousable === "yes" && styles.toggleTextSelected,
                ]}
              >
                Yes
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleOption,
                arousable === "no" && styles.toggleOptionSelected,
              ]}
              onPress={() => setArousable("no")}
            >
              <Text
                style={[
                  styles.toggleText,
                  arousable === "no" && styles.toggleTextSelected,
                ]}
              >
                No
              </Text>
            </Pressable>
          </View>
        </View>

        {binaryQuestions.map((item) => (
          <View style={styles.questionRow} key={item.id}>
            <View style={styles.questionCopyWrap}>
              <Text style={styles.questionText}>
                {item.number}. {item.text}{" "}
                <Text style={styles.questionBold}>{item.emphasis}</Text>
              </Text>
            </View>
            <View style={styles.toggleGroup}>
              <Pressable
                style={[
                  styles.toggleOption,
                  binaryAnswers[item.id] === "yes" && styles.toggleOptionSelected,
                ]}
                onPress={() => selectBinary(item.id, "yes")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    binaryAnswers[item.id] === "yes" && styles.toggleTextSelected,
                  ]}
                >
                  Yes
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleOption,
                  binaryAnswers[item.id] === "no" && styles.toggleOptionSelected,
                ]}
                onPress={() => selectBinary(item.id, "no")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    binaryAnswers[item.id] === "no" && styles.toggleTextSelected,
                  ]}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={styles.questionRow}>
          <View style={styles.questionCopyWrap}>
            <Text style={styles.questionText}>
              7. Of <Text style={styles.questionBold}>three objects</Text>, how
              many can the patient identify correctly?
            </Text>
          </View>
          <View style={styles.numericRow}>
            {[0, 1, 2, 3].map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.numericOption,
                  value === 3 && styles.numericOptionLast,
                  objectScore === value && styles.numericOptionSelected,
                ]}
                onPress={() => setObjectScore(value)}
              >
                <Text
                  style={[
                    styles.numericText,
                    objectScore === value && styles.numericTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
    paddingTop: 56,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
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
  headerSpacer: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B3556",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  scoreCard: {
    backgroundColor: "#F7FAFD",
    borderWidth: 1,
    borderColor: "#D5E2F0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scoreText: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "700",
    color: "#0B3556",
  },
  questionRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EFF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  questionCopyWrap: {
    flex: 1,
    paddingRight: 8,
  },
  questionText: {
    fontSize: 17,
    lineHeight: 24,
    color: "#1E3D58",
  },
  questionBold: {
    fontWeight: "700",
  },
  toggleGroup: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2774AE",
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  toggleOption: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  toggleOptionSelected: {
    backgroundColor: "#2774AE",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2774AE",
  },
  toggleTextSelected: {
    color: "#FFFFFF",
  },
  numericRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2774AE",
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  numericOption: {
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: "#2774AE",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  numericOptionLast: {
    borderRightWidth: 0,
  },
  numericOptionSelected: {
    backgroundColor: "#2774AE",
  },
  numericText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2774AE",
  },
  numericTextSelected: {
    color: "#FFFFFF",
  },
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
  doneButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2774AE",
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
