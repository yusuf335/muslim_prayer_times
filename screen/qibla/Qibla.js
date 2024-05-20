import React from 'react';
import {View, Button} from 'react-native';
import notifee, {
  TriggerType,
  AndroidNotificationSetting,
  AndroidImportance,
} from '@notifee/react-native';

const Qibla = () => {
  async function onCreateTriggerNotification() {
    const settings = await notifee.getNotificationSettings();
    await notifee.createChannel({
      id: 'alarm',
      name: 'Firing alarms & timers',
      lights: false,
      vibration: true,
      importance: AndroidImportance.HIGH,
    });
    if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
      //Create timestamp trigger
      const date = new Date(Date.now());
      date.setHours(18);
      date.setMinutes(55);

      // Create a time-based trigger
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
        alarmManager: true,
      };

      // Create a trigger notification
      await notifee.createTriggerNotification(
        {
          title: 'Meeting with Jane',
          body: 'Today at 11:20am',
          android: {
            channelId: 'alarm',
          },
        },
        trigger,
      );
      console.log(date);
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      await notifee.openAlarmPermissionSettings();
    }
  }

  notifee
    .getTriggerNotificationIds()
    .then(ids => console.log('All trigger notifications: ', ids));

  return (
    <View>
      <Button
        title="Create Trigger Notification"
        onPress={() => onCreateTriggerNotification()}
      />
    </View>
  );
};

export default Qibla;
