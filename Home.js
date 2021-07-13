import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import  { newTransactionAdd, newTransactionMinus, resetAll } from './AllActions'
import moment from 'moment'

let Home = (props) => {
    const [spendValue, onChangeSpendValue] = useState('0.00')
    const [spendingReason, setSpendingReason] = useState('')

    const spendMoneyHandler = () => { // spend money onclick
        if (spendingReason == '' || spendValue <= 0)
        {
            Alert.alert("Error", "The spending reason and spend amount must be valid");
            return
        }
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
                props.minusTransaction('Debit: ' + spendingReason, spendValue)
                onChangeSpendValue('0.00')
                setSpendingReason('')
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

    const getTodayEarnedAmount = (transactions) => {
        // Filter out today's transactions (from 2AM) 
        let mtodayEarned = 0
        let mtodaySpent = 0
        const todayTrans = transactions.filter((t) => 
        {
            let tDate = moment(t.date)
            let now = moment() 
            if (now.get('h')<2) {
                now.add(-1, 'd')
            }
            now.set('hour', 2) // set to 2 AM of today (or yesterday if we work late)
            now.set('minute', 0)
            now.set('second', 0)
            now.add(1, 'd')
            // console.log(now.format("DD/MM HH:mm"))
            return now.diff(tDate, 'hour') <= 24
        })
        todayTrans.forEach((t) => {
            mtodayEarned += t.description.indexOf('Debit') == -1 ? Number(t.amount) : 0
            mtodaySpent += t.description.indexOf('Debit') >= 0 ? Number(t.amount) : 0
        })
        let delta = mtodayEarned - mtodaySpent
        return {mtodayEarned, mtodaySpent, delta}
    }

    
    const getThisWeekEarnedAmount = (transactions) => {
        // Filter out today's transactions (from 2AM) 
        let mtodayEarned = 0
        let mtodaySpent = 0
        const todayTrans = transactions.filter((t) => 
        {
            let tDate = moment(t.date)
            let now = moment() 
            now = now.startOf('week')
            now.set('hour', 2) // set to 2 AM of Sunday
            now.add(7, 'd')
            return now.diff(tDate, 'hour') <= 168 // 1 week has 768 hours
        })
        todayTrans.forEach((t) => {
            mtodayEarned += t.description.indexOf('Debit') == -1 ? Number(t.amount) : 0
            mtodaySpent += t.description.indexOf('Debit') >= 0 ? Number(t.amount) : 0
        })
        let delta = mtodayEarned - mtodaySpent
        return {mtodayEarned, mtodaySpent, delta}
    }

    const getThisMonthEarnedAmount = (transactions) => {
        // Filter out today's transactions (from 2AM) 
        let mtodayEarned = 0
        let mtodaySpent = 0
        const todayTrans = transactions.filter((t) => 
        {
            let tDate = moment(t.date)
            let now = moment() 
            now = now.startOf('month')
            now.set('hour', 2) // set to 2 AM of 1st of month
            now.set('minute', 0)
            let nextMonth = moment().startOf('month').add(1, 'month')
            nextMonth.set('hour', 2)
            nextMonth.set('minute', 0)
            let monthDuration = nextMonth.diff(now, 'hours')
            return nextMonth.diff(tDate, 'hour') <= monthDuration // 1 week has 768 hours
        })
        // console.log(todayTrans)
        todayTrans.forEach((t) => {
            mtodayEarned += t.description.indexOf('Debit') == -1 ? Number(t.amount) : 0
            mtodaySpent += t.description.indexOf('Debit') >= 0 ? Number(t.amount) : 0
        })
        let delta = mtodayEarned - mtodaySpent
        return {mtodayEarned, mtodaySpent, delta}
    }

    const openUselessScreen = () => {
        props.navigation.navigate('UselessScreen')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.money_bg}>
                    <Text style={styles.money_bg_text}> Your balance is </Text>
                    <Text style={styles.balance_amount}> { Number(props.all.balance).toFixed(2) } </Text>
                    <Text style={styles.today_earned}>Daily: +{getTodayEarnedAmount(props.all.transactions.slice(-50)).mtodayEarned.toFixed(2)} / -{getTodayEarnedAmount(props.all.transactions.slice(-50)).mtodaySpent.toFixed(2)} / {getTodayEarnedAmount(props.all.transactions.slice(-50)).delta.toFixed(2)}</Text>
                    <Text style={styles.today_earned}>Weekly: +{getThisWeekEarnedAmount(props.all.transactions.slice(-150)).mtodayEarned.toFixed(2)} / -{getThisWeekEarnedAmount(props.all.transactions.slice(-150)).mtodaySpent.toFixed(2)}  / {getThisWeekEarnedAmount(props.all.transactions.slice(-50)).delta.toFixed(2)}</Text>
                    <Text style={styles.today_earned}>Monthly: +{getThisMonthEarnedAmount(props.all.transactions.slice(-400)).mtodayEarned.toFixed(2)} / -{getThisMonthEarnedAmount(props.all.transactions.slice(-400)).mtodaySpent.toFixed(2)} /  / {getThisMonthEarnedAmount(props.all.transactions.slice(-50)).delta.toFixed(2)}</Text>
                
                </View>
                <View style={styles.controls_bg}>
                    <View style={{alignSelf: 'center', flex: 1, paddingBottom: 40, paddingHorizontal: 10}}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center'}}> Hard work puts you in the place where luck shall find you.</Text>
                        <Text style={{fontWeight: 'bold', color: 'blue', textAlign: 'center'}}> Hold on and Keep on going!</Text>
                        <Text style={{fontWeight: 'bold', color: 'blue', textAlign: 'center'}}> Make your time count! </Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row'}}>
                        <TextInput style={{ height: 40, flex: 1, borderColor: 'gray', borderWidth: 1 }} onChangeText={text => onChangeSpendValue(text)} value={spendValue} keyboardType='numeric'></TextInput>
                        <TextInput style={{ height: 40, flex: 2, borderColor: 'gray', borderWidth: 1 }} placeholder="Reason for spending" value={spendingReason} onChangeText={(text)=>setSpendingReason(text)}></TextInput>
                        <Button title="SPEND" onPress={spendMoneyHandler}></Button> 
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 20}}>
                        <Button title="COLLECT STAMP" onPress={() => props.navigation.navigate('Scanstamp')}></Button> 
                        <View style={{width: 20}}></View>
                        <Button title="REWARD HABITS" color='green' onPress={() => props.navigation.navigate('Habits')}></Button>
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 20}}>
                        <Button title="CLAIM SALARY" color='black' onPress={() => props.navigation.navigate('Salary')}></Button>
                        <View style={{width: 10}}></View>
                        <Button title="LIST TASKS" color='#d4c41c' onPress={() => props.navigation.navigate('AllTasks')}></Button>
                        <View style={{width: 10}}></View>
                        <Button title="TIME DECLARE" color='#e834eb' onPress={() => props.navigation.navigate('DeclareTU')}></Button>
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 20}}>
                        <Text style={{color: 'blue', padding: 8}} onPress={() => props.navigation.navigate('Transactions')}>View transactions</Text>
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 40}}>
                        <Button title="RESET BALANCE" color="red" onPress={nuclearResetHandler}></Button>
                    </View>
                    <View style={{alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: 8}}>
                        <Text onPress={openUselessScreen}>Designed by Thinh Hoang in Toulouse, France</Text>
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
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30
    },
    controls_bg: {
        flex: 1,
        paddingTop: 40 
    },
    money_bg_text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    balance_amount: {
        color: 'white',
        fontSize: 42,
        fontWeight: '300'
    },
    today_earned: {
        color: 'white',
        fontSize: 14,
        marginTop: 6
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