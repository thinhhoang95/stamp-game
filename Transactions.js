import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView, FlatList } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import  { newTransactionAdd, newTransactionMinus } from './AllActions'

let Transactions = (props) => {

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
            <View>
                <Text>Date: {item.date}</Text>
                <Text>Amount: {item.amount}</Text>
                <Text>{item.description}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
                <FlatList data={props.all.transactions.slice(0, 100)} renderItem={renderItem} ItemSeparatorComponent={flatListItemSeparator} keyExtractor={(item) => item.sn}>
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
    addTransaction: (description, amount) => {
    dispatch(newTransactionAdd(description, amount));
    },
    minusTransaction: (description, amount) => {
        dispatch(newTransactionMinus(description, amount));
    }
};
};

const TransactionsConnected = connect(mapStateToProps, mapDispatchToProps)(Transactions)

export default TransactionsConnected