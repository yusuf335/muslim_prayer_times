import {StyleSheet, View, Text, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {scale} from '../../utils/Scale';
import Color from '../../utils/Color';

const PrayerTimeList = ({name, time, iconName = ''}) => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.listInnerContainer}>
        <View style={styles.listLayout}>
          <View style={styles.prayerNameConatiner}>
            <Text style={styles.prayerName}>{name}</Text>
            {iconName.length > 0 && (
              <Ionicons style={styles.icon} name={iconName} />
            )}
          </View>
          <Text style={styles.prayerTime}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

export default PrayerTimeList;

const windowWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  listContainer: {
    alignSelf: 'center',
    width: windowWidth,
    backgroundColor: Color.white,
  },
  listInnerContainer: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(8),
    marginVertical: scale(4),
    marginHorizontal: scale(16),
    borderBottomColor: Color.gray_400,
    borderBottomWidth: 1,
    // borderRadius: scale(8),

    // backgroundColor: Color.white,
    // // Android Specific
    // elevation: 4,
    // // IOS Specific
    // shadowColor: '#868e96',
    // shadowOffset: {width: 0, height: 2},
    // shadowRadius: 8,
    // shadowOpacity: 0.25,
  },
  listLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerNameConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  prayerName: {
    color: Color.primary_shade_10,
    fontSize: scale(16),
    fontFamily: 'Poppins-Bold',
  },
  icon: {
    color: Color.yellow,
    fontSize: scale(30),
  },
  prayerTime: {
    color: Color.black,
    fontSize: scale(16),
    fontFamily: 'Poppins-Medium',
  },
});
