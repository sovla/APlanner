import React from 'react';
import {View, Text, StyleSheet, Image, Alert, Dimensions, ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';
import theme from '../../assets/css/theme';
import DummyImage from '../../assets/images/logo.png';
import {Facility} from '../../State/Atom/Facility';

const screenWidth = Dimensions.get('window').width;
export default function BorderView() {
    const facility = useRecoilValue(Facility);
    const uri = {
        uri: `https://dmonster1701.cafe24.com/images/uploads/${facility.ft_image1}`,
    };

    return (
        <View style={styles.BorderView}>
            <Image
                style={styles.ImageItem}
                resizeMode="contain"
                source={facility?.idx ? uri : DummyImage}></Image>
            <View style={styles.Border}>
                <View style={styles.BorderWhiteView}></View>
                <View style={styles.BorderGrayView}></View>
                <View style={styles.BorderWhiteView}></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    BorderView: {
        height: 100,
        backgroundColor: 'white',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageItem: {
        width: '50%',
        height: '60%',
    },
    Border: {
        position: 'absolute',
        bottom: -1,
        width: '100%',

        height: 2,

        zIndex: 100,
        flexDirection: 'row',
    },
    BorderWhiteView: {
        width: 20,
        height: 2,
        backgroundColor: theme.colors.white,
    },
    BorderGrayView: {
        width: screenWidth - 40,
        height: 2,
        backgroundColor: theme.colors.borderGray,
    },
});
