import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./src/screens/StartScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CorridorScreen from "./src/screens/CorridorScreen";
import FigureEightScreen from "./src/screens/FigureEightScreen";

export type RootStackParamList = {
  Start: undefined;
  Home: undefined;
  Corridor: undefined;
  FigureEight: undefined;
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
        <Stack.Screen name="FigureEight" component={FigureEightScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
