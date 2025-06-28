/**
 * @format
 */
import 'react-native-reanimated'; // this must be FIRST import
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';


if (!global.WebSocket && Platform.OS !== 'web') {
  global.WebSocket = ws;
}
AppRegistry.registerComponent(appName, () => App);
