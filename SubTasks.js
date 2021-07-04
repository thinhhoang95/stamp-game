import React, { useState , useEffect} from 'react'
import { View, SafeAreaView, FlatList, Text, TouchableWithoutFeedback, Alert } from 'react-native'
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import  { newTransactionAdd } from './AllActions'
import moment from 'moment';

let SubTasks = (props) => {

    const [subtasks, setSubtasks] = useState([])

    useEffect(() => {
      console.log('Querying SN ' + props.route.params.sn)

      firestore().collection('subtasks').doc(props.route.params.sn).get()
      .then(snapshot => {
        let vsubtasks = []
        let t = snapshot.data()
        let sta = t.subs
        let taskExpiryTime = moment(t.expired) 
        if (taskExpiryTime.diff(moment()) < 0)
        {
          // The task has expired
          Alert.alert(
            "Check expired",
            "You cannot claim this check because it has expired!",
            [
              { text: "OK", onPress: () => { props.navigation.popToTop() } }
            ]
          );
          return // Do not proceed further
        }
        sta.forEach((st) => {
          let snIdx = props.all.transactions.findIndex(x => x.sn == st.sn)
          
          if (snIdx == -1)
          {
            vsubtasks.push(
              {
                  sname: t.id + ": " + st.sname,
                  finish: st.finish,
                  sn: st.sn
              }
          )
          }
        })
        let snIdx = props.all.transactions.findIndex(x => x.sn == t.sn)
        if (snIdx == -1)
        {
          vsubtasks.push(
              {
                  sname: t.id + ': task reward (on time constraint)',
                  finish: t.finish,
                  sn: t.sn
              }
          )
        }
        console.log(vsubtasks)
        setSubtasks(vsubtasks)
      })

      // const stq = firestore()
      //   .collection('subtasks')
      //   .doc(props.route.params.sn)
      //   .onSnapshot(querySnapshot => {
      //     let vsubtasks = []
      //     let counter = 0
      //     console.log("Snap Q")
      //     console.log(querySnapshot)
      //     querySnapshot.forEach(documentSnapshot => {
      //       if (counter < 1) // We only care about the first task since we have queried with a serial number
      //       {
      //         let t = documentSnapshot.data()
      //         let sta = t.subs
      //         sta.forEach((st) => {
      //             vsubtasks.push(
      //                 {
      //                     sname: st.sname,
      //                     finish: st.finish,
      //                     sn: st.sn
      //                 }
      //             )
      //         })
      //         vsubtasks.push(
      //             {
      //                 sname: 'Task reward (on time constraint)',
      //                 finish: t.finish,
      //                 sn: t.sn
      //             }
      //         )
      //         console.log(vsubtasks)
      //         setSubtasks(vsubtasks)
      //       }
      //     })
      //   })
      //   return () => stq()
      }, []);
      

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
            <TouchableWithoutFeedback onPress={ () => actionOnRow(item)}>
              <View style={{margin: 16}}>
                  <Text>Subtask: {item.sname}</Text>
                  <Text>Amount: {item.finish}</Text>
                  <Text>Serial: {item.sn}</Text>
              </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <SafeAreaView>
            <FlatList data={subtasks} renderItem={renderItem} ItemSeparatorComponent={flatListItemSeparator} keyExtractor={(item) => item.sn}>
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
    },
    minusTransaction: (description, amount) => {
        dispatch(newTransactionMinus(description, amount));
    }
};
};

const SubTasksConnected = connect(mapStateToProps, mapDispatchToProps)(SubTasks)

export default SubTasksConnected