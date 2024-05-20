import {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider, useSelector} from 'react-redux';
import store from './store/store';

// Import Screens
import PrayerTime from './screen/prayerTime/PrayerTime';
import Qibla from './screen/qibla/Qibla';
import AsmaAlHusna from './screen/asmaAlHusna/AsmaAlHusna';
import SplashScreen from './screen/splashScreen/SplashScreen';
import Color from './utils/Color';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const isLoading = useSelector(state => state.isLoading.value);

  // console.log(!isLoading);

  return (
    <>
      {!isLoading ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {display: !isLoading ? '' : 'none'},
          }}>
          <Tab.Screen name="Prayer Time" component={PrayerTime} />
          <Tab.Screen name="Qibla" component={Qibla} />
          <Tab.Screen name="Asma Al Husna" component={AsmaAlHusna} />
        </Tab.Navigator>
      ) : (
        <PrayerTime />
      )}
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
