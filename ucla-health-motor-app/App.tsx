import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./src/screens/StartScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CorridorScreen from "./src/screens/CorridorScreen";
import FigureEightScreen from "./src/screens/FigureEightScreen";
import CorridorResultsScreen from "./src/screens/CorridorResultsScreen";
import FigureEightResultsScreen from "./src/screens/FigureEightResultsScreen";
import SpiralScreen from "./src/screens/SpiralScreen";
import SpiralResultsScreen from "./src/screens/SpiralResultsScreen";

export type RootStackParamList = {
  Start: undefined;
  Home: undefined;
  Corridor: undefined;
  CorridorResults: {
    metrics: {
      completionRate: number;
      lineCount: number;
      meanDeviation: number;
      p95Deviation: number;
      maxDeviation: number;
      outOfBoundsPct: number;
      boundaryCrossings: number;
      speedStd: number;
      jerkStd: number;
      pathEfficiency: number;
      angleErrorDeg: number;
      scores: {
        completion: number;
        lineCount: number;
        meanDeviation: number;
        p95Deviation: number;
        outOfBounds: number;
        pathEfficiency: number;
        angleError: number;
        speedVariability: number;
        jerk: number;
        boundaryCrossings: number;
        maxDeviation: number;
      };
      finalScore: number;
    };
  };
  FigureEight: undefined;
  FigureEightResults: {
    metrics: {
      coverageRate: number;
      meanDeviation: number;
      p95Deviation: number;
      maxDeviation: number;
      outOfBoundsPct: number;
      speedStd: number;
      jerkStd: number;
      pathEfficiency: number;
      scores: {
        coverage: number;
        meanDeviation: number;
        p95Deviation: number;
        outOfBounds: number;
        pathEfficiency: number;
        speedVariability: number;
        jerk: number;
        maxDeviation: number;
      };
      finalScore: number;
    };
  };
  Spiral: undefined;
  SpiralResults: {
    metrics: {
      coverageRate: number;
      meanDeviation: number;
      p95Deviation: number;
      maxDeviation: number;
      outOfBoundsPct: number;
      speedStd: number;
      jerkStd: number;
      pathEfficiency: number;
      scores: {
        coverage: number;
        meanDeviation: number;
        p95Deviation: number;
        outOfBounds: number;
        pathEfficiency: number;
        speedVariability: number;
        jerk: number;
        maxDeviation: number;
      };
      finalScore: number;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Corridor" component={CorridorScreen} />
        <Stack.Screen
          name="CorridorResults"
          component={CorridorResultsScreen}
        />
        <Stack.Screen name="FigureEight" component={FigureEightScreen} />
        <Stack.Screen
          name="FigureEightResults"
          component={FigureEightResultsScreen}
        />
        <Stack.Screen name="Spiral" component={SpiralScreen} />
        <Stack.Screen name="SpiralResults" component={SpiralResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
