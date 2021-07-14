import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, TextInput, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux';
import  { } from './AllActions'
import moment from 'moment'
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

let UselessScreen = (props) => {   
    
    const [modalVisible, setModalVisible] = useState(true)

    const images = [
    {
        url: '',
        props: {
            // Or you can set source directory.
            source: require('./img/1.jpg')
        }
    },
    {
        url: '',
        props: {
            // Or you can set source directory.
            source: require('./img/2.jpg')
        }
    },
    {
        url: '',
        props: {
            // Or you can set source directory.
            source: require('./img/3.jpg')
        }
    },
    {
        url: '',
        props: {
            // Or you can set source directory.
            source: require('./img/4.jpg')
        }
    },
    {
        url: '',
        props: {
            // Or you can set source directory.
            source: require('./img/5.jpg')
        }
    }]

    const closeModal = () => {
        if (modalVisible) 
        {
            setModalVisible(false)
        }
    }

    
    return (
        <Modal visible={true} transparent={true} visible={modalVisible} onRequestClose={closeModal}>
            <ImageViewer imageUrls={images}/>
        </Modal>
    )

}

export default UselessScreen