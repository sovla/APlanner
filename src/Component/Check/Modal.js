import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import theme from '../../assets/css/theme';
import FooterButton from '../layout/FooterButton';

const screenWidth = Dimensions.get('window').width;

export default function Modal({isVisible, clickButtonComplete, textArray}) {
    return (
        <ReactNativeModal isVisible={isVisible}>
            <View style={styles.Container}>
                <Text style={styles.Text}>{textArray}</Text>

                <FooterButton
                    buttonContent="확인"
                    onPressButton={clickButtonComplete}
                    isTop={true}></FooterButton>
            </View>
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    Container: {
        paddingTop: 40,
        backgroundColor: theme.colors.white,
        borderRadius: 8,

        width: screenWidth - 40,
        height: 250,
        alignItems: 'center',
    },
    Text: {
        fontWeight: theme.weight.bold,
        fontSize: theme.size.base,
        lineHeight: 27,
        textAlign: 'center',
    },
});
