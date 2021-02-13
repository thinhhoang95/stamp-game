import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import  { newTransactionAdd, newTransactionMinus } from './AllActions'

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

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
            props.addTransaction('Task stamp collection. ' + task.name + '. ' + task.description, Number(amount))
            props.navigation.popToTop()
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
    addTransaction: (description, amount) => {
    dispatch(newTransactionAdd(description, amount));
    },
    minusTransaction: (description, amount) => {
        dispatch(newTransactionMinus(description, amount));
    }
};
};

const ScanStampConnected = connect(mapStateToProps, mapDispatchToProps)(ScanStamp)

export default ScanStampConnected