import React, { useState , useEffect} from 'react'
import { View, SafeAreaView, FlatList, Text, TouchableWithoutFeedback, Alert } from 'react-native'
import { connect } from 'react-redux'
import firestore, { firebase } from '@react-native-firebase/firestore';
import  { newTransactionAdd } from './AllActions'
import moment from 'moment';

let HabitsScreen = (props) => {
    const [habits, setHabits] = useState([])

    useEffect(() => {
        // Query the habits and display into the list
        firestore().collection('habits').get().then((snapshot) => {
            let mHabits = []
            let now = moment().valueOf()
            snapshot.forEach((sns) => {
                let doc = sns.data()
                doc.lastReset = moment(doc.lastDone.toDate()).valueOf() // unix timestamp in milisecs
                doc.nextReset = moment(doc.lastReset).add(doc.autoReset, 'hours').valueOf() // unix timestamp of the next reset
                // For expired habits, reset the lastDone date to today
                if (now > doc.nextReset)
                {
                    console.log('Correcting doc id ' + doc.id + '. Reset the payment to minimum level due to loss of streak')
                    doc.lastReset = now
                    doc.nextReset = moment().add(doc.autoReset, 'hours').valueOf()
                    doc.current = doc.start
                    doc.lastDone = firebase.firestore.Timestamp.fromDate(new Date())
                    firestore().collection('habits').doc(doc.id).set({
                        ...doc,
                        'lastDone': firebase.firestore.Timestamp.fromDate(new Date()),
                        'current': doc.start
                    })
                }
                mHabits.push(doc)
            })
            // Preventing tasks that ought to be completed in the future to be displayed
            mHabits = mHabits.filter((x) => {
                return now > x.lastReset
            })
            setHabits(mHabits)
        })
    }, [])

    const flatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#000",
            }}
          />
        );
      }

    const make_serial = (length, terms) => {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (let term = 0; term < terms; term++) {
        for (var i = 0; i < length; i++) {
        result.push(
            characters.charAt(Math.floor(Math.random() * charactersLength))
        );
        }
        if (term != terms - 1) result.push("-");
    }
    return result.join("");
    };

    const payMyHabit = (id) => {
        // On tap, add a transaction, update the lastDone
        const docRef = firestore().collection('habits').doc(id)
        let h = habits.find(x => x.id == id)
        let newCurrent = h.current + h.increment 
        docRef.set({
            ...h,
            lastDone: firebase.firestore.Timestamp.fromDate(moment(h.nextReset).toDate()),
            current: newCurrent
        })
        
        props.addTransaction("Habit payment: " + h.name + ".", h.current, make_serial(5,6))

        Alert.alert(
            "Habit Checked",
            "Congratulations for extending the streak. Keep the momentum going! The payment will continue to increase.",
            [
              { text: "OK", onPress: () => { props.navigation.popToTop() } }
            ]
        );
        
    }

    const actionOnRow = (item) => {
      // On tap, add the corresponding transaction
      props.addTransaction(item.sname, item.finish, item.sn)
      Alert.alert(
        "Transaction added",
        "You have claimed the reward for this subtask. Have a good work!",
        [
          { text: "OK", onPress: () => { props.navigation.popToTop() } }
        ]
      );
    }

    const renderItem = ({item}) => {
        return(
            <TouchableWithoutFeedback onPress={ () => payMyHabit(item.id)}>
              <View>
                  <Text>Habit: {item.name}</Text>
                  <Text>Description: {item.descr}</Text>
                  <Text>Current payment: {item.current}</Text>
                  <Text>Last reset: {moment(item.lastDone.toDate()).format("ddd DD/MM/YYYY HH:mm:ss")}</Text>
                  <Text>Reset every: {item.autoReset} hours</Text>
              </View>
            </TouchableWithoutFeedback>
        )
    }

    return(
        <SafeAreaView>
            <FlatList data={habits} renderItem={renderItem} ItemSeparatorComponent={flatListItemSeparator} keyExtractor={(item) => item.id}>
            </FlatList>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
    return { all: state.all }
  };

const mapDispatchToProps = dispatch => {
return {
    addTransaction: (description, amount, sn) => {
    dispatch(newTransactionAdd(description, amount, sn));
    }
};
};

const HabitsScreenConnected = connect(mapStateToProps, mapDispatchToProps)(HabitsScreen)

export default HabitsScreenConnected