import {useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Third party library
import DatePicker from 'react-native-date-picker';
import {scale} from '../../utils/Scale';
import Color from '../../utils/Color';

const DateSelector = ({selectedDate, setDate}) => {
  // Screen state
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setOpen(true)}>
        <View style={styles.gregorianDate}>
          <Ionicons style={styles.icon} name="calendar" />
          <Text style={styles.date}>
            {selectedDate.toLocaleDateString('en-CA')}
          </Text>
        </View>
      </Pressable>

      <DatePicker
        modal
        open={open}
        date={selectedDate}
        mode="date"
        theme="auto"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  gregorianDate: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    color: Color.white,
    fontSize: scale(20),
  },
  date: {
    color: Color.white,
    fontFamily: 'Poppins-Medium',
  },
});
