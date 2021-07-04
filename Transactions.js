import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  TextInput,
  ScrollView,
  FlatList,
  ToastAndroid,
  PermissionsAndroid
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {newTransactionAdd, newTransactionMinus, restoreBackup} from './AllActions';

const RNFS = require('react-native-fs');

let Transactions = (props) => {

  const requestFilePermissionR = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "PayMe needs access",
          message:
            "Allow PayMe to read the backup file from your local storage?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Read storage permission granted")
        requestFilePermissionW()
      } else {
        console.log("Read Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestFilePermissionW = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "PayMe needs access",
          message:
            "Allow PayMe to write the backup file to your local storage?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Write storage permission granted")
        backUp()
      } else {
        console.log("Write Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const backUp = () => {
    console.log('Backup transactions to file here!');

    var path = RNFS.ExternalStorageDirectoryPath + '/transactions.json';
    var content = JSON.stringify(props.all)

    // write the file
    RNFS.writeFile(path, content, 'utf8')
      .then((success) => {
        ToastAndroid.show('Backup file has been successfully written to local storage', ToastAndroid.SHORT)
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const restoreBackUpTap = () => {
    RNFS.readFile(RNFS.ExternalStorageDirectoryPath + '/transactions.json', 'utf8').then(res => {
      let ob = JSON.parse(res)
      props.performRestoreBackup(ob.balance, ob.transactions)
      ToastAndroid.show('Backup file has been successfully restored from local storage', ToastAndroid.SHORT)
      
    })
    .catch(err => {
        console.log(err.message, err.code);
    });
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Button onPress={requestFilePermissionR} title="BACK UP"></Button>
        <Button onPress={restoreBackUpTap} title="RESTORE"></Button>
      </View>),
    });
  }, [props.navigation]);

  const flatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={{margin: 16}}>
        <Text>Date: {item.date}</Text>
        <Text>Amount: {Number(item.amount).toFixed(2)}</Text>
        <Text>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={props.all.transactions.slice(0, 100)}
        renderItem={renderItem}
        ItemSeparatorComponent={flatListItemSeparator}
        keyExtractor={(item) => item.sn}></FlatList>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = (state) => {
  // console.log(state.all.transactions);
  return {all: state.all};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTransaction: (description, amount) => {
      dispatch(newTransactionAdd(description, amount));
    },
    minusTransaction: (description, amount) => {
      dispatch(newTransactionMinus(description, amount));
    },
    performRestoreBackup: (balance, trans) => {
      dispatch(restoreBackup(balance, trans));
    }
  };
};

const TransactionsConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transactions);

export default TransactionsConnected;
