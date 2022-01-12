import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../Component/layout/Header';
import Title from '../Component/layout/Title';
import SplashImage from '../assets/images/splash.png';
import Spinner from 'react-native-loading-spinner-overlay';
import {useRecoilValue} from 'recoil';
import Loading from '../State/Atom/Loading';

export default function MainContainer({children, HeaderTitle, Notice, Back}) {
    const isLoading = useRecoilValue(Loading);
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.TopContainer}>
                <ImageBackground style={styles.Image} source={SplashImage}>
                    <Header HeaderTitle={HeaderTitle} Back={Back} />
                    <Title Notice={Notice} children={children} />
                </ImageBackground>
            </View>
            <Spinner visible={isLoading}></Spinner>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    TopContainer: {
        flex: 1,
    },
    Image: {
        flex: 1,
    },
});
