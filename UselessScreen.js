import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux';
import  { } from './AllActions'
import moment from 'moment'

let UselessScreen = (props) => {
    return (
        <View style={{flex: 1, backgroundColor: 'blue'}}>
            <Image style={{flex: 1, resizeMode: 'cover'}} source={require('./img/boots.png')}></Image>
        </View>
    )
}

export default UselessScreen