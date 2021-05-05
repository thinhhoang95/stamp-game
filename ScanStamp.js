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
        let valeurs = e.data.split('|')
        let value_contained = valeurs[1]
        let amount = value_contained.slice(0, value_contained.length-3)
        props.addTransaction('Salary stamp collection', Number(amount))
        props.navigation.popToTop()
        } catch(ex) {
            // Not a valid salary stamp, must be a task stamp
            let task = JSON.parse(e.data)
            let amount = task.finish    
            let expiryDate = moment(task.expired)
            let sn = task.sn // serial number
            let today = moment()
            
            // Check if serial number is already in the database
            let foundTransacs = props.all.transactions.findIndex((t,idx) => {
                if (t.sn == sn)
                {
                    return true
                }
            })

            if (foundTransacs != -1)
            {
                // Serial already existed
                ToastAndroid.showWithGravity(
                    "The check has already been taken!",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                  );
                return
            }

            // Check if stamp expired
            if (expiryDate.diff(today) > 0)
            {
                props.addTransaction('Pay check: ' + task.name + '. SN: ' + task.sn, Number(amount), task.sn)
                props.navigation.popToTop()
            }
            else
            {
                ToastAndroid.showWithGravity(
                    "The stamp has expired and cannot be collected.",
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                  );
            }
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