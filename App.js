import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import FirstComponent from './src/FirstComponent';
import LinkWithSQLite from './src/LInkWithSQLite';
import FirstComponentWithSQLite from './src/FirstComponentWithSQLite';

export default function App() {

  const isHermes = () => !!global.hermesInternal;
  console.log("Hermes enabled: ",isHermes())
  return (
    <View style={styles.container}>
      <LinkWithSQLite />
      {/* <FirstComponentWithSQLite/> */}
      <Text>Open up App.js to start working on your app!</Text>
      
      {/* <FirstComponent /> */}
      {/* <StatusBar style="auto" /> */}
    </View>
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
