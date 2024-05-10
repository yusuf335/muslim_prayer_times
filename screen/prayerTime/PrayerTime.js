import {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';

// Third party library
import moment from 'moment';
import GetLocation from 'react-native-get-location';
import LottieView from 'lottie-react-native';
import notifee, {TriggerType} from '@notifee/react-native';

// Utils
import {scale} from '../../utils/Scale';
import Color from '../../utils/Color';

// Components
import DateSelector from '../../components/UI/DateSelector';
import PrayerTimeList from '../../components/UI/PrayerTimeList';
import AsmaAlHusna from '../../components/card/AsmaAlHusna';

// Const
let DATA = [];
const prayerName = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
  'Imsak',
];

const PrayerTime = () => {
  // Current Prayer Number
  let currentPrayerCount = -1;
  const startTime = new Date();

  // Google Map API

  // Screen state
  const [date, setDate] = useState(new Date());
  const [currentPrayer, setCurrentPrayer] = useState({});
  const [nextPrayer, setNextPrayer] = useState({});
  const [nextPrayerTime, setNextPrayerTime] = useState(0);
  const [coordinate, setCoordinate] = useState({});
  const [timeZone, setTimeZone] = useState('');
  const [calculationMethod, setCalculationMethod] = useState({});

  // Boolean state
  const [isFetched, setIsFetched] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [getLocation, setGetLocation] = useState(false);
  const [error, setError] = useState(true);

  // Animation config
  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    animation.current?.play();
  }, []);

  // Create a time-based trigger
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: new Date(), // fire at 11:10am (10 minutes before meeting)
  };

  // Get user location
  useEffect(() => {
    setGetLocation(false);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setCoordinate(prevState => ({...prevState, ...location}));
        setGetLocation(true);
      })
      .then(() => {
        notifee.requestPermission();
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
      });
  }, []);

  // useEffect(() => {
  //   const notification = async () => {
  //     await notifee.requestPermission();
  //   };
  //   notification();
  // }, []);

  // Fetching data from api
  useEffect(() => {
    if (getLocation) {
      const fetchPrayerTime = async () => {
        setIsFetched(false);

        const dateFetch = date.toLocaleDateString('es-CL');

        const resquest = await fetch(
          `https://api.aladhan.com/v1/timings/${dateFetch}?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`,
        );

        const response = await resquest.json();

        if (resquest.ok) {
          setTimeZone(prevState => (prevState = response.data.meta.timezone));
          setCalculationMethod(prevState => ({
            ...prevState,
            ...response.data.meta.method,
          }));

          // Make array empty
          DATA = [];
          prayerName.map(name =>
            DATA.push({
              id: name,
              name,
              time: moment(response.data.timings[name], 'HH:mm').format(
                'hh:mm A',
              ),
              h_24: response.data.timings[name],
            }),
          );
          setIsFetched(true);
        }

        // const requestLocationCoordiante = await fetch(
        //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}=true&key=${googleMapApi}`,
        // );

        // const responseLocation = await requestLocationCoordiante.json();
        // console.log(responseLocation);
      };
      fetchPrayerTime();
    }
  }, [date, getLocation]);

  /*
  This code block calculate the current prayer and also the upcoming prayer time and time difference.
  */
  useEffect(() => {
    if (isFetched) {
      // Set calculation boolean to ture to keep loadin screen
      setIsCalculated(false);
      const currentTime24H = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      // console.log('--------------------------------');
      DATA.map(prayer => {
        if (prayer.name !== 'Imsak') {
          if (prayer.h_24 <= currentTime24H) {
            currentPrayerCount += 1;
          }

          // else {
          //   setCurrentPrayer(DATA[5]);
          //   setNextPrayer(DATA[0]);
          // }
          // else if (currentPrayerTime === -1)
          // console.log(
          //   currentPrayerCount,
          //   currentTime24H,
          //   prayer.h_24,
          //   prayer.name,
          //   prayer.h_24 <= currentTime24H,
          // );
        }
      });

      if (currentPrayerCount === -1) {
        setCurrentPrayer(prevState => ({...prevState, ...DATA[5]}));
        setNextPrayer(prevState => ({...prevState, ...DATA[0]}));
      } else {
        setCurrentPrayer(prevState => ({
          ...prevState,
          ...DATA[currentPrayerCount],
        }));
        // Next Prayer time Calculation
        if (currentPrayerCount === 5) {
          setNextPrayer(prevState => ({...prevState, ...DATA[0]}));
        } else {
          setNextPrayer(prevState => ({
            ...prevState,
            ...DATA[currentPrayerCount + 1],
          }));
        }
      }
      const endTime = new Date();
      const secondsDifference =
        1500 - Math.abs(endTime.getTime() - startTime.getTime()) / 1000;
      setTimeout(
        () => {
          setIsCalculated(true);
        },
        secondsDifference < 0 ? secondsDifference : 0,
      );
    }
  }, [isFetched]);

  // Screen UI starts here
  return (
    <View style={[styles.screen, isCalculated ? '' : styles.screenAlignment]}>
      {/* Loading Screen */}
      {!isCalculated && (
        <>
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
        </>
      )}

      {/* Main Screen */}
      {isCalculated && (
        <>
          {/* Hero container */}
          <View style={styles.heroContainer}>
            {/*  */}
            {/* Hero Image conatiner */}
            <View>
              <Image
                style={styles.heroImage}
                source={require('../../assets/images/hero_image.jpg')}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}></View>
            </View>

            {/* Hero date conatiner */}
            <View style={styles.heroDateConatiner}>
              <DateSelector selectedDate={date} setDate={setDate} />
            </View>

            {/* Hero Address */}
            <View style={styles.heroAddressContainer}>
              <Text style={styles.heroAddress}>Calgary, AB, T3A 1C6</Text>
              <Text style={styles.heroCountry}>Canada</Text>
            </View>

            {/* Hero prayer name and time container */}
            <View style={styles.heroPrayerInfoContainer}>
              <Text style={styles.heroPrayerName}>{currentPrayer.name}</Text>
              <View style={styles.heroPrayerTimeContainer}>
                <Text style={styles.heroPrayerTime}>{currentPrayer.time}</Text>
                <Text style={styles.heroTimeZone}>{timeZone}</Text>
              </View>
            </View>

            {/* Hero next prayer time and name */}
            <View style={styles.heroNextPrayerContainer}>
              <Text style={styles.heroNextPrayerTitle}>
                Next salah is {nextPrayer.name} in
              </Text>
              {/* <Text style={styles.heroNextPrayerTime}>- {nextPrayerTime}</Text> */}
              <Text style={styles.heroNextPrayerTime}>
                At {nextPrayer.time}
              </Text>
            </View>
          </View>

          {/* Prayer Calculation Method */}
          <View style={styles.calculationMethodContainer}>
            {/* Card */}
            <View style={styles.calculationMethodCard}>
              <Text style={styles.calculationMethodTitle}>
                Calculation Method
              </Text>

              <Text style={styles.calculationMethodName}>
                {calculationMethod.name}
              </Text>
              <View style={styles.calculationMethodAngle}>
                <Text style={styles.calculationMethodAngleName}>
                  Fajr: {calculationMethod.params['Fajr']}
                </Text>
                <Text style={styles.calculationMethodAngleName}>
                  Tap to change
                </Text>
                <Text style={styles.calculationMethodAngleName}>
                  Isha: {calculationMethod.params['Isha']}
                </Text>
              </View>
            </View>
          </View>

          {/* Prayer time list */}
          <View style={styles.prayerTimeContainer}>
            <FlatList
              data={DATA}
              renderItem={({item}) => (
                <PrayerTimeList
                  name={item.name}
                  time={item.time}
                  iconName={item.icon ? item.icon : ''}
                />
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default PrayerTime;

// Get windiw diemension
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Get platfrom information either ios or Android
const ios = Platform.OS === 'ios';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.white,
  },

  screenAlignment: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero section Styles start here
  heroContainer: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    alignSelf: 'center',
    width: windowWidth,
    // height: scale(ios ? scale(310) : scale(300)),
    height: windowHeight * 0.3,
  },
  heroOverlay: {
    width: windowWidth,
    // height: scale(ios ? scale(310) : scale(300)),
    height: windowHeight * 0.3,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
  },
  heroDateConatiner: {
    position: 'absolute',
    top: ios ? '22%' : '10%',
    left: '5%',
  },
  heroPrayerInfoContainer: {
    marginTop: scale(4),
    position: 'absolute',
    width: '100%',
    top: ios ? '34%' : '26%',
    left: '5%',
  },
  heroPrayerName: {
    color: Color.white,
    fontSize: scale(54),
    fontFamily: 'Poppins-Medium',
  },
  heroPrayerTimeContainer: {
    position: 'absolute',
    width: '100%',
    top: '80%',
  },
  heroPrayerTime: {
    color: Color.white,
    fontSize: scale(36),
    fontFamily: 'Poppins-Medium',
  },
  heroTimeZone: {
    color: Color.white,
    fontSize: scale(15),
    fontFamily: 'Poppins-Medium',
    position: 'absolute',
    top: ios ? '96%' : '92%',
  },
  heroAddressContainer: {
    position: 'absolute',
    top: ios ? '22%' : '10%',
    right: '4%',
  },
  heroAddress: {
    color: Color.white,
    fontSize: scale(16),
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },
  heroCountry: {
    color: Color.white,
    fontSize: scale(16),
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },
  heroNextPrayerContainer: {
    position: 'absolute',
    top: '58%',
    right: '4%',
  },
  heroNextPrayerTitle: {
    color: Color.white,
    fontSize: scale(16),
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },

  heroNextPrayerTime: {
    color: Color.white,
    fontSize: scale(16),
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },
  // Hero section style Ends here

  // Prayer calculation method
  calculationMethodContainer: {
    alignSelf: 'center',
    width: windowWidth,
    marginVertical: scale(20),
  },
  calculationMethodCard: {
    paddingVertical: scale(8),
    marginHorizontal: scale(16),
    borderRadius: scale(8),
    backgroundColor: Color.white,
    backgroundColor: Color.white,
    // Android Specific
    elevation: 4,
    // IOS Specific
    shadowColor: '#868e96',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    shadowOpacity: 0.25,
  },
  calculationMethodTitle: {
    fontSize: scale(20),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Color.primary_shade_20,
    marginBottom: ios ? scale(8) : scale(2),
  },
  calculationMethodName: {
    fontSize: scale(15),
    fontFamily: 'Poppins-Regular',
    color: Color.gray_600,
    textAlign: 'center',
  },
  calculationMethodAngle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(51),
    marginTop: ios ? scale(4) : scale(0),
  },
  calculationMethodAngleName: {
    color: Color.gray_600,
  },

  // Prayer list style starts here
  prayerTimeContainer: {
    flex: 1,
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
