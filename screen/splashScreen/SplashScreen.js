import {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Dimensions, Text} from 'react-native';
import {scale} from '../../utils/Scale';
import Color from '../../utils/Color';

const SplashScreen = () => {
  // Animation config
  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    animation.current?.play();
  }, []);

  return (
    <View style={styles.screen}>
      {/* Splash scrren image */}
      <View>
        {/* Title */}
        <Text style={styles.title}>Prayer Times</Text>
        {/* Splash screen Image */}
        <Image
          style={styles.image}
          source={require('../../assets/images/prayer_rug.png')}
          resizeMode="contain"
        />
        {/* Subtitle */}
        <Text style={styles.subtitle}>Qibla Direction and Prayer Times</Text>
      </View>

      {/* Loadin Animation Conatiner */}
      {/* <View style={styles.animationContainer}>
        <LottieView
          ref={animation}
          style={styles.animation}
          source={require('../../assets/animations/f.lottie')}
          autoPlay
          loop
        />
        <Text
          style={{
            color: Color.gray_400,
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
            paddingBottom: scale(10),
          }}>
          Please wait
        </Text>
      </View> */}
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
    paddingHorizontal: scale(10),
    backgroundColor: Color.primary_shade_10,
  },
  title: {
    fontSize: scale(40),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Color.gray_300,
  },
  subtitle: {
    fontSize: scale(20),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    lineHeight: scale(28),
    color: Color.gray_400,
  },
  image: {
    alignSelf: 'center',
    height: scale(260),
    position: 'relative',
  },
});
