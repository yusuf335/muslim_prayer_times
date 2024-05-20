import {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Dimensions, Text} from 'react-native';
import LottieView from 'lottie-react-native';

// Utils
import {scale} from '../../utils/Scale';
import Color from '../../utils/Color';

// Components
import AsmaAlHusna from '../../components/card/AsmaAlHusna';

const SplashScreen = () => {
  // Animation config
  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    animation.current?.play();
  }, []);

  return (
    <View style={styles.screen}>
      <View>
        <AsmaAlHusna />
      </View>
      <View style={styles.animationContainer}>
        <View>
          <LottieView
            ref={animation}
            style={styles.animation}
            source={require('../../assets/animations/loading.lottie')}
            autoPlay
            loop
          />
        </View>
        <View style={styles.animationTextBox}>
          <Text style={styles.animationText}>Geting Your Location</Text>
          <Text style={styles.animationText}>Calculating Prayer Times</Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const windowWidth = Dimensions.get('window').width;

// Screen Style
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Color.white,
  },
  animationContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '2%',
  },
  animation: {
    width: scale(300),
    height: scale(200),
    // backgroundColor: Color.red,
  },
  animationTextBox: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '8%',
  },
  animationText: {
    color: Color.black,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
});
