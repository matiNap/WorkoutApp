import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import { View } from 'react-native';
import AppContainer from './screens/AppContainer';
import { SafeAreaProvider } from 'react-native-safe-area-view';
import { store, persistor } from './store';
import { ThemeProvider } from 'react-native-elements';
import elementsTheme from './elementsTheme';

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    if (!this.state.fontLoaded) {
      await Font.loadAsync({
        rubik: require('./assets/fonts/rubik.ttf'),
      });
      this.setState({ fontLoaded: true });
    }
  }

  render() {
    if (this.state.fontLoaded) {
      return (
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <ThemeProvider theme={elementsTheme}>
                <AppContainer />
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      );
    }
    return <View />;
  }
}
