import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, ToastAndroid, ScrollView, TextInput } from 'react-native'
import { connect } from 'react-redux';
import  { addAccumulatedTU, resetAccumulatedTU } from './AllActions'
import firestore, { firebase } from '@react-native-firebase/firestore';
import moment from 'moment';

let DeclareTU = (props) => {

    const [tu, setTu] = useState(0)

    const onChangeTU = (text) => {
        setTu(Number(text))
    }

    const addBtnHandler = () => {
        console.log('Dispatch: adding ' + String(tu) + ' into the accumulated TU')
        props.addTU(tu)
        ToastAndroid.show('Time units changed!', ToastAndroid.SHORT)
    }

    const commitBtnHandler = () => {
        firestore().collection('tu').doc('default').set(
            {
                'tu_tovalidate': props.all.tu,
                'updated': new Date()
            }
        ).then(() => {
            props.resetTU()
            ToastAndroid.show('The time units were sent awaiting validation!', ToastAndroid.SHORT)
        })
    }

    // useEffect(() => {
    //     console.log("Querying database for serial number of the regular stamp obtained")
    //     console.log(props.route.params.sn)
    //     let sn = props.route.params.sn
    //     firestore().collection('regular').doc(sn).get().then(snapshot => {
    //         let s = snapshot.data()
    //         console.log(s)
    //         setStamp({
    //             content: s.content,
    //             finish: s.finish,
    //             expiryDate: s.expiryDate.toDate(),
    //             sn: sn
    //         })
    //     })
    // }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{margin: 16, flexDirection: 'column', flex: 1}}>
                    <View>
                        <Text style={{textAlign: 'left'}}>The Time Units you declare here will stay local until you press Commit. They will have to be validated independently on the server, then become a salary stamp which you can claim later. </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 40}}>
                        <Text style={{fontSize: 24}}>Declared TUs: {props.all.tu}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput style={{ height: 40, width: 120, borderColor: 'gray', borderWidth: 1 }} onChangeText={text => onChangeTU(text)} value={String(tu)}></TextInput>  
                        <View style={{width: 20, height: 20}}></View> 
                        <Button title="ADD" onPress={addBtnHandler}></Button> 
                    </View>
                    <View>
                        <Text>Last updated: {moment(props.all.tu_date).format('ddd DD/MM/YYYY HH:mm:ss')}</Text>
                    </View>
                    <View style={{marginTop: 40}}>
                        <Button color='green' title="COMMIT" onPress={() => commitBtnHandler()}></Button>
                    </View>
                    
                    </View>
            </ScrollView>
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
    addTU: (tu) => {
        dispatch(addAccumulatedTU(tu))
    },
    resetTU: () => {
        dispatch(resetAccumulatedTU())
    }
};
};

const DeclareTUConnected = connect(mapStateToProps, mapDispatchToProps)(DeclareTU)

export default DeclareTUConnected