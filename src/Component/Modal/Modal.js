import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useRecoilValue} from 'recoil';
import theme from '../../assets/css/theme';
import FooterButton from '../layout/FooterButton';
import ModalState from '../../State/Atom/ModalState';

const screenWidth = Dimensions.get('window').width;

export default function Modal() {
    const modalState = useRecoilValue(ModalState);
    return (
        <ReactNativeModal isVisible={modalState.isOpen}>
            <View style={styles.Container}>
                <Text style={styles.Text}>{modalState.text}</Text>

                <FooterButton
                    buttonContent={modalState.buttonContent}
                    onPressButton={modalState.onPress}
                    isTop={true}></FooterButton>
            </View>
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    Container: {
        paddingTop: 50,
        backgroundColor: theme.colors.white,
        borderRadius: 8,

        width: screenWidth - 40,
        height: 250,
        alignItems: 'center',
    },
    Text: {
        fontWeight: theme.weight.bold,
        fontSize: theme.size.sm,
        textAlign: 'center',
    },
});
