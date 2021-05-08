import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView, ToastAndroid } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import  { newTransactionAdd, newTransactionMinus } from './AllActions'

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import moment from 'moment';

let ScanStamp = (props) => {

    const onSuccess = (e) => {
        try {
        // Open up a new screen to look up the serial number in the database, let user choose the subtask, or take the salary of the stamp
        let task = JSON.parse(e.data)
        if (task.sn)
        {
            props.navigation.navigate('SubTasks', {'sn': task.sn})
        }
        else
        {
            ToastAndroid.showWithGravity(
                "An invalid stamp was detected! Try again with a valid stamp!",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            props.navigation.popToTop()
        }
        } catch(ex) {
            ToastAndroid.showWithGravity(
                "The stamp has expired and cannot be collected.",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <QRCodeScanner
                onRead={onSuccess}
                flashMode={RNCamera.Constants.FlashMode.off}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
})

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

const ScanStampConnected = connect(mapStateToProps, mapDispatchToProps)(ScanStamp)

export default ScanStampConnected