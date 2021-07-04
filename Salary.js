import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView, FlatList, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux';
import  { newTransactionAdd } from './AllActions'
import firestore from '@react-native-firebase/firestore';

let Salary = (props) => {

    const [stamps, setStamps] = useState([])
    useEffect(() => {
        console.log("Querying database for available salary stamps")
        let vStamps = []
        let collectionRef = firestore().collection('salary')
        collectionRef.where('claimed', '==', false).get().then(snapshot => {
            snapshot.forEach((doc) => {
                let data = doc.data()
                vStamps.push({
                    'sn': data.sn,
                    'content': data.content,
                    'value': data.value
                })
            })
            console.log(vStamps)
            setStamps(vStamps)
        })
    }, [])

    const addStamp = ({sn, content, value}) => {
        firestore().collection('salary').doc(sn).update({
            'claimed': true
        })
        props.addTransaction(content, value, sn)
        // Remove that stamp from the list
        let newStamps = stamps.filter((elem) => elem.sn != sn)
        console.log(newStamps)
        setStamps(newStamps)
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
            <TouchableWithoutFeedback onPress={ () => addStamp(item)}>
                <View style={{margin: 16}}>
                    <Text>SN: {item.sn}</Text>
                    <Text>Content: {item.content}</Text>
                    <Text>Value: {item.value}</Text>
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

const SalaryConnected = connect(mapStateToProps, mapDispatchToProps)(Salary)

export default SalaryConnected