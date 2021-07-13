import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Button
} from 'react-native';
import {connect} from 'react-redux';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {newTransactionAdd} from './AllActions';
import moment from 'moment';

let HabitsScreen = (props) => {
  const [habits, setHabits] = useState([]);
  const [orderMode, setOrderMode] = useState('DAILY');

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Button onPress={() => orderHabits()} title={orderMode}></Button>
      </View>),
    });
  }, [props.navigation, habits, orderMode]);

  const adjustTimeTo2AM = (date) => {
    let nextReset = moment().set('year', date.get('year'));
    nextReset.set('month', date.get('month'));
    nextReset.set('date', date.get('date'));
    if (date.get('hour') < 2)
    {
      // If we have passed 12AM but not 2AM today, this function should not turn the clock forward
      // but instead, the clock must be ensured to be always turned backward
      nextReset.add(-1, 'd')
    }
    nextReset.set('hour', 2);
    nextReset.set('minute', 0);
    return nextReset;
  };

  const orderHabits = () => {
    // console.log(habits)
    let mHabits = Object.assign([], habits)
    // console.log('Ordering habits: ', orderMode)
    if (orderMode == 'EXPIRE')
    {
      setOrderMode('DAILY')
      mHabits.sort((a,b) => {
        return a.orderx - b.orderx
      })
      setHabits(mHabits)
    }
    if (orderMode == 'DAILY')
    {
      setOrderMode('EXPIRE')
      mHabits.sort((a, b) => -b.nextReset + a.nextReset);
      setHabits(mHabits);
    }
  }

  useEffect(() => {
    // Query the habits and display into the list
    firestore()
      .collection('habits')
      .get()
      .then((snapshot) => {
        let mHabits = [];
        let now = moment().valueOf();
        snapshot.forEach((sns) => {
          let doc = Object.assign({}, sns.data());
          doc.lastReset = moment(doc.lastDone.toDate()).valueOf(); // unix timestamp in milisecs
          doc.nextReset = adjustTimeTo2AM(moment(doc.lastReset))
            .add(doc.autoReset, 'day')
            .valueOf();
          console.log(moment(doc.nextReset).format('DD/MM/YYYY HH:mm:ss'));
          // For expired habits, reset the lastDone date to today
          if (now > doc.nextReset) {
            console.log(
              'Correcting doc id ' +
                doc.id +
                '. Reset the payment to minimum level due to loss of streak',
            );
            doc.lastReset = adjustTimeTo2AM(moment()).valueOf(); // adjust to 2AM today
            doc.nextReset = moment(doc.lastReset)
              .add(doc.autoReset, 'd')
              .valueOf();
            doc.current = doc.start;
            doc.lastDone = firebase.firestore.Timestamp.fromDate(new Date());
            doc.current = doc.start;
            doc.count = 0;
            firestore()
              .collection('habits')
              .doc(doc.id)
              .set(doc);
          }
          // Append the count and maxCount fields if the doc in database does not have those.
          // By default, these fields not existing means it has only to be done ONCE every x days 
          if (!doc.hasOwnProperty('count')) {
            doc.count = 0;
          }
          if (!doc.hasOwnProperty('maxCount')) {
            doc.maxCount = 1;
          }
          // Assign a flag of "tomorrow" so that these tasks are highlighted
          if (moment(doc.nextReset).diff(moment(), 'h') < 25)
          {
            doc.tomorrow = true
            doc.orderx = doc.order - 100
          } else {
            doc.tomorrow = false
            doc.orderx = doc.order
          }
          mHabits.push(doc);
        });
        // Preventing tasks that ought to be completed in the future to be displayed
        mHabits = mHabits.filter((x) => {
          return now > x.lastReset;
        });
        mHabits.sort((a,b) => {
          return a.orderx - b.orderx
        })
        setHabits(mHabits);
      });
  }, []);

  const flatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };

  const make_serial = (length, terms) => {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (let term = 0; term < terms; term++) {
      for (var i = 0; i < length; i++) {
        result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength)),
        );
      }
      if (term != terms - 1) result.push('-');
    }
    return result.join('');
  };

  const getDurationInEnglish = (start, end) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
  
    //Get Days
    const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
    const daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all
  
    //Get Hours
    const hours = duration.hours();
    const hoursFormatted = `${hours}h `;
  
    //Get Minutes
    const minutes = duration.minutes();
    const minutesFormatted = `${minutes}m`;
  
    return [daysFormatted, hoursFormatted, minutesFormatted].join('');
  }

  const payMyHabit = (id) => {
    // Display an alert to prevent mistouches
    Alert.alert(
      'Check habit?',
      'Do you want to check this habit? This transaction cannot be undone!',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // >>>>>
            // On tap, add a transaction, update the lastDone
            const docRef = firestore().collection('habits').doc(id);
            let h = habits.find((x) => x.id == id);

            if (h.count + 1 == h.maxCount) {
              let newCurrent =
                h.current + h.increment > h.max
                  ? h.max
                  : h.current + h.increment;
              h.lastDone = firebase.firestore.Timestamp.fromDate(moment(h.nextReset).toDate());
              h.current = newCurrent;
              h.count = 0;
              docRef.set(h);

              props.addTransaction(
                'Habit payment: ' + h.name + '.',
                h.current,
                make_serial(5, 6),
              );

              Alert.alert(
                'Habit Checked',
                'Congratulations for extending the streak. Keep the momentum going! The payment will continue to increase.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      props.navigation.popToTop();
                    },
                  },
                ],
              );
            } else {
              // console.log(h);
              h.count += 1;
              docRef.set(h);
              Alert.alert('Keep going', 'Habit count was increased.', [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.popToTop();
                  },
                },
              ]);
            }
            // <<<<< end of on OK tap confirm check habit
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item}) => {
    //console.log(moment(item.nextReset).format("DD/MM/YYYY HH:mm"))
    //console.log(moment().format("DD/MM/YYYY HH:mm"))
    let howLongTillNextReset = getDurationInEnglish(moment.duration(moment(item.nextReset).diff(moment())))
    return (
      <TouchableWithoutFeedback onPress={() => payMyHabit(item.id)}>
        <View style={{margin: 16}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: item.tomorrow?'red':'black'}}>{item.tomorrow ? "(EXP+1) " : ""}{item.name}</Text>
          <Text style={{color: 'green', fontSize: 16}}>Current payment: {item.current.toFixed(2)}</Text>
          <Text style={{color: 'blue'}}>Reset in: {getDurationInEnglish(moment(), moment(item.nextReset))}</Text>
          <Text>
            Or precisely:{' '}
            {moment(item.nextReset).format('DD/MM HH:mm')} (every {item.autoReset} days)
          </Text>
          <Text>
            Count: {item.count} / {item.maxCount}{' '}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={habits}
        renderItem={renderItem}
        ItemSeparatorComponent={flatListItemSeparator}
        keyExtractor={(item) => item.id}></FlatList>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {all: state.all};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTransaction: (description, amount, sn) => {
      dispatch(newTransactionAdd(description, amount, sn));
    },
  };
};

const HabitsScreenConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HabitsScreen);

export default HabitsScreenConnected;
