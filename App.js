import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './StackNavigator';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import consoleOveride from "./consoleOverride/consoleOverride";

export default function App() {
  return (
    <>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Navigation /> 
      <StatusBar style="auto" />
    </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
