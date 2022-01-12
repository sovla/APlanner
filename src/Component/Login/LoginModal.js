import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import ReactNativeModal from 'react-native-modal';
import theme from '../../assets/css/theme';
import FooterButton from '../layout/FooterButton';

export default function LoginModal({
    isVisible,
    clickButtonComplete,
    text,
    text1,
    onPressBackArray,
}) {
    return (
        <ReactNativeModal isVisible={isVisible} onBackButtonPress={clickButtonComplete}>
            <View style={styles.Container}>
                <View style={styles.HeightContainer}>
                    <Text style={styles.HeaderText}>이용약관</Text>
                    <ScrollView style={styles.TextContainer}>
                        <Text style={styles.Text}>{text}</Text>
                    </ScrollView>
                </View>
                <View style={styles.HeightContainer}>
                    <Text style={styles.HeaderText}>개인정보이용처리방침</Text>
                    <ScrollView style={styles.TextContainer}>
                        <Text style={styles.Text}>{text1}</Text>
                    </ScrollView>
                </View>
            </View>
            <FooterButton buttonContent={'확인'} onPressButton={clickButtonComplete} isTop />
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingBottom: 80,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    TextContainer: {
        fontSize: theme.size.base,

        borderWidth: 1,
        borderColor: theme.colors.borderWhiteGray,
        borderRadius: 4,
    },
    HeaderText: {
        textAlignVertical: 'center',
        fontSize: 20,
        textAlign: 'center',
        height: 50,
        padding: 10,
    },
    Text: {
        padding: 20,
        lineHeight: theme.lineHeight.lg,
    },
    HeightContainer: {
        height: '50%',
    },
});
