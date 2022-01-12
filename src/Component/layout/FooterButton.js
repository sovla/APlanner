import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import theme from '../../assets/css/theme';

const screenWidth = Dimensions.get('window').width;

export default function FooterButton({onPressButton, buttonContent, isTop, display = true}) {
    return (
        <View
            style={
                isTop
                    ? display
                        ? styles.LoginButton
                        : styles.LoginButtonDisplay
                    : styles.DefaultButton
            }>
            <TouchableOpacity style={styles.ButtonTouch} onPress={onPressButton}>
                <Text style={styles.ButtonText}>{buttonContent}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    ButtonText: {
        color: theme.colors.white,
        fontSize: theme.size.base,
    },
    ButtonTouch: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    LoginButton: {
        position: 'absolute',
        marginVertical: 20,
        left: '5%',
        width: '90%',
        height: 50,
        backgroundColor: theme.colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        bottom: 0,
    },
    DefaultButton: {
        position: 'absolute',
        bottom: 0,

        width: screenWidth,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.blue,
    },
    LoginButtonDisplay: {
        position: 'absolute',
        marginVertical: 20,
        bottom: 0,
        left: '5%',
        width: '90%',
        height: 50,
        backgroundColor: theme.colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
});
