// Declaraciones de tipos para módulos externos
// Estas declaraciones suprimen los errores "Cannot find module"
// hasta que se ejecute npm install

declare module 'react' {
  const React: any;
  export default React;
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useContext: any;
  export const createContext: any;
  export const Fragment: any;
  export type ReactNode = any;
  export type FC<T = {}> = any;
  export type ComponentProps<T> = any;
}

declare module 'react-native' {
  const RN: any;
  export default RN;
  export const View: any;
  export const Text: any;
  export const TouchableOpacity: any;
  export const StyleSheet: any;
  export const Image: any;
  export const TextInput: any;
  export const FlatList: any;
  export const ScrollView: any;
  export const Modal: any;
  export const Animated: any;
  export const Dimensions: any;
  export const Platform: any;
  export const StatusBar: any;
  export const ActivityIndicator: any;
  export const Alert: any;
  export const Linking: any;
  export const Share: any;
  export const Vibration: any;
  export const ImageBackground: any;
  export const KeyboardAvoidingView: any;
  export const SafeAreaView: any;
  export const Switch: any;
  export const RefreshControl: any;
}

declare module 'expo-av' {
  export const Audio: any;
  export const Video: any;
  export const ResizeMode: any;
  export const AVPlaybackStatus: any;
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: any;
}

declare module 'expo-blur' {
  export const BlurView: any;
}

declare module '@expo/vector-icons' {
  export const Ionicons: any;
  export const MaterialIcons: any;
  export const FontAwesome: any;
  export const AntDesign: any;
}

declare module 'expo-status-bar' {
  export const StatusBar: any;
}

declare module 'expo-font' {
  const ExpoFont: any;
  export default ExpoFont;
  export const loadAsync: any;
  export const useFonts: any;
}

declare module 'expo-splash-screen' {
  const SplashScreen: any;
  export default SplashScreen;
  export const preventAutoHideAsync: any;
  export const hideAsync: any;
}

declare module 'expo-file-system' {
  const FileSystem: any;
  export default FileSystem;
  export const documentDirectory: any;
  export const downloadAsync: any;
  export const getInfoAsync: any;
  export const deleteAsync: any;
}

declare module 'expo-sharing' {
  const Sharing: any;
  export default Sharing;
  export const shareAsync: any;
  export const isAvailableAsync: any;
}

declare module 'expo-media-library' {
  const MediaLibrary: any;
  export default MediaLibrary;
  export const saveToLibraryAsync: any;
  export const requestPermissionsAsync: any;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any;
  export default AsyncStorage;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export const useNavigation: any;
  export const useRoute: any;
  export const useFocusEffect: any;
  export const useIsFocused: any;
}

declare module '@react-navigation/stack' {
  export const createStackNavigator: any;
  export const TransitionPresets: any;
  export const CardStyleInterpolators: any;
}

declare module '@react-navigation/bottom-tabs' {
  export const createBottomTabNavigator: any;
}

declare module 'react-native-screens' {
  const Screens: any;
  export default Screens;
  export const enableScreens: any;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaProvider: any;
  export const SafeAreaView: any;
  export const useSafeAreaInsets: any;
}

declare module 'react-native-gesture-handler' {
  export const GestureHandlerRootView: any;
  export const TouchableOpacity: any;
  export const Swipeable: any;
  export const PanGestureHandler: any;
}

declare module 'react-native-reanimated' {
  const Reanimated: any;
  export default Reanimated;
  export const useSharedValue: any;
  export const useAnimatedStyle: any;
  export const withSpring: any;
  export const withTiming: any;
}

declare module 'react-native-webview' {
  export const WebView: any;
}

declare module 'zustand' {
  export const create: any;
  export const createStore: any;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.mp4' {
  const value: any;
  export default value;
}
