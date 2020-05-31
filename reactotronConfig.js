import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import { AsyncStorage } from "react-native";

const reactotron = Reactotron.useReactNative()
  .configure({ name: "ReactNativeNavApp", overlayer: false })
  .setAsyncStorageHandler(AsyncStorage)
  .use(reactotronRedux())
  .connect();
export default reactotron;
