import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView, FlatList, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux';
import  { newTransactionAdd } from './AllActions'
import firestore from '@react-native-firebase/firestore';

let AllTasks = (props) => {

    const [stamps, setStamps] = useState([])
    useEffect(() => {
        console.log("Querying database for all tasks")
        let vStamps = []
        let nowTime = firestore.Timestamp.fromDate(new Date())
        let collectionRef = firestore().collection('subtasks')
        collectionRef.where('expiredDate', '>', nowTime).get().then(snapshot => {
            snapshot.forEach((doc) => {
                let data = doc.data()
                vStamps.push({
                    'sn': data.sn,
                    'id': data.id,
                    'description': data.description,
                    'finish': data.finish
                })
            })
            console.log(vStamps)
            setStamps(vStamps)
        })
    }, [])

    const taskClick = (task) => {
        props.navigation.navigate('SubTasks', {'sn': task.sn})
        return
    }

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

    const renderItem = ({item}) => {
        return(
            <TouchableWithoutFeedback onPress={ () => taskClick(item)}>
                <View style={{margin: 16}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', color: 'blue'}}>ID: {item.id}</Text>
                    <Text style={{color: 'green', fontWeight: 'bold'}}>Description: {item.description}</Text>
                    <Text>Value: {item.finish}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
                <FlatList data={stamps} renderItem={renderItem} ItemSeparatorComponent={flatListItemSeparator} keyExtractor={(item) => item.sn}>
                </FlatList>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
})

const mapStateToProps = (state) => {
    console.log(state.all.transactions)
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

const AllTasksConnected = connect(mapStateToProps, mapDispatchToProps)(AllTasks)

export default AllTasksConnected