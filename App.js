import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './StackNavigator';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import consoleOveride from "./consoleOverride/consoleOverride";
import { PlayerContext } from './PlayerContext';
import { ModalPortal } from 'react-native-modals';

export default function App() {
  return (
    <>
    <PlayerContext>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Navigation /> 
        <ModalPortal />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </PlayerContext>
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
