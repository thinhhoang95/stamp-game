import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, ToastAndroid } from 'react-native'
import { connect } from 'react-redux';
import  { newTransactionAdd } from './AllActions'
import firestore, { firebase } from '@react-native-firebase/firestore';
import moment from 'moment';

let Regular = (props) => {

    const [stamp, setStamp] = useState({
        'content': '',
        'finish': '',
        'expiryDate': ''
    })
    useEffect(() => {
        console.log("Querying database for serial number of the regular stamp obtained")
        console.log(props.route.params.sn)
        let sn = props.route.params.sn
        firestore().collection('regular').doc(sn).get().then(snapshot => {
            let s = snapshot.data()
            console.log(s)
            setStamp({
                content: s.content,
                finish: s.finish,
                expiryDate: s.expiryDate.toDate(),
                sn: sn
            })
        })
    }, [])


    const addThisStamp = () => {
        if (moment(stamp.expiryDate).diff(moment()) > 0)
        {
            props.addTransaction(stamp.content, stamp.finish, stamp.sn)
            firestore().collection('regular').doc(stamp.sn).delete()
            props.navigation.popToTop()
        }
        else 
        {
            ToastAndroid.showWithGravity(
                "The stamp seems to have expired. We are sorry!",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'column'}}>
                <Text>Content: {stamp.content} </Text>
                <Text>Value: {stamp.finish} </Text>
                <Text>Expiry date: {moment(stamp.expiryDate).format("DD/MM/YYYY HH:mm")} </Text>
                <Button title='Confirm' onPress={addThisStamp}></Button>
            </View>
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

const RegularConnected = connect(mapStateToProps, mapDispatchToProps)(Regular)

export default RegularConnected