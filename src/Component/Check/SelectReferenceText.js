import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MiddleDot, RowContainer} from '../../assets/css/component.style';
import theme from '../../assets/css/theme';

export default function SelectReferenceText({
    leftColor,
    leftContent,
    depscription,
    rightColor,
    rightContent,
}) {
    return (
        <>
            <View style={[RowContainer, styles.Container]}>
                <View style={[MiddleDot, styles.Blue, {borderColor: leftColor}]}></View>
                <Text style={styles.ReferenceText}>{leftContent}</Text>
                <View style={[MiddleDot, styles.Gray, {borderColor: rightColor}]}></View>
                <Text style={styles.ReferenceText}>{rightContent}</Text>
            </View>
            {depscription.map((item, index) => {
                return (
                    <Text key={index} style={styles.ExampleText}>
                        {item}
                    </Text>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 30,
    },
    Blue: {
        borderWidth: 7,
        borderColor: theme.colors.blue,
    },
    Gray: {
        marginLeft: 10,
        borderWidth: 7,
        borderColor: theme.colors.gray,
    },
    ReferenceText: {
        color: theme.colors.black,
        fontSize: theme.size.sm,
    },
    ExampleText: {
        color: theme.colors.whiteGray,
        fontSize: theme.size.xs,
        textAlign: 'center',
    },
});
