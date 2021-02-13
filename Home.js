import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import  { newTransactionAdd, newTransactionMinus, resetAll } from './AllActions'

let Home = (props) => {
    const [spendValue, onChangeSpendValue] = useState('0.00')
    const spendMoneyHandler = () => { // spend money onclick
        Alert.alert(
            "Spending confirmation",
            "Do you confirm to withdraw " + Number(spendValue).toFixed(2) + " from your balance? This transaction cannot be undone!",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                props.minusTransaction('Debit (widthdrawal)', spendValue)
                onChangeSpendValue('0.00')
              } }
            ],
            { cancelable: false }
          );
    }

    const nuclearResetHandler = () => { // reset balance
        Alert.alert(
            "Reset confirmation",
            "Caution! You are trying to reset the balance to zero and clear all transactions. Are you sure to do this?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                  props.reset()
              } }
            ],
            { cancelable: false }
          );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.money_bg}>
                    <Text style={styles.money_bg_text}> Your balance is </Text>
                    <Text style={styles.balance_amount}> { Number(props.all.balance).toFixed(2) } </Text>
                </View>
                <View style={styles.controls_bg}>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row'}}>
                        <TextInput style={{ height: 40, width: 120, borderColor: 'gray', borderWidth: 1 }} onChangeText={text => onChangeSpendValue(text)} value={spendValue}></TextInput><Button title="SPEND" onPress={spendMoneyHandler}></Button> 
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 20}}>
                        <Button title="COLLECT STAMP" onPress={() => props.navigation.navigate('Scanstamp')}></Button> 
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 20}}>
                        <Text style={{color: 'blue'}} onPress={() => props.navigation.navigate('Transactions')}>View transactions</Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 100}}>
                        <Text style={{color: 'blue'}} onPress={nuclearResetHandler}>Reset balance (!)</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    money_bg: {
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 120
    },
    controls_bg: {
        flex: 1,
        paddingTop: 40 
    },
    money_bg_text: {
        color: 'white',
        fontSize: 24
    },
    balance_amount: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold'
    }
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
    },
    reset: () => {
        dispatch(resetAll());
    }
};
};

const HomeConnected = connect(mapStateToProps, mapDispatchToProps)(Home)

export default HomeConnected