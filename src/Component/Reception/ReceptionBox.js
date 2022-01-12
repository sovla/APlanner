import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Container, RowContainer, Width100} from '../../assets/css/component.style';
import theme from '../../assets/css/theme';

const screenWidth = Dimensions.get('window').width;

export default function ReceptionBox({
    title,
    contentArray,
    leftButtonPress,
    rightButtonPress,
    leftButtonContent = '수정',
    rightButtonContent = '삭제',
}) {
    return (
        <View style={styles.Container}>
            <Text style={styles.MainText}>{title}</Text>
            <View style={styles.Box}>
                {contentArray.map((item, index) => (
                    <View style={RowContainer} key={item.title + index}>
                        <Text style={styles.BoxBoldText}>{item.title}</Text>
                        <Text style={styles.BoxText}>{item.content}</Text>
                    </View>
                ))}
                <View style={[RowContainer, Width100, styles.SpaceBetween]}>
                    <TouchableOpacity onPress={leftButtonPress} style={[styles.Button, styles.WhiteButton]} >
                        <Text style={[styles.ButtonText, styles.WhiteButton]}>{leftButtonContent}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={rightButtonPress} style={[styles.Button, styles.BlueButton]} >
                        <Text style={[styles.ButtonText, styles.BlueButton]}>{rightButtonContent}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    Container: {
        paddingHorizontal: 20,
    },
    MainText: {
        color: theme.colors.blue,
        fontSize: theme.size.sm,
        marginTop: 30,
        marginBottom: 15,
    },
    Box: {
        borderColor: theme.colors.borderGray,
        borderWidth: 1,
        padding: 20,
    },
    Button: {
        width: (screenWidth - 95) / 2,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent:'center'
    },
    ButtonText:{
        fontSize: theme.size.sm,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    SpaceBetween: {
        marginTop: 15,
        justifyContent: 'space-between',
    },
    BlueButton: {
        backgroundColor: theme.colors.blue,
        color: theme.colors.white,
        borderWidth: 0,
    },
    WhiteButton: {
        backgroundColor: theme.colors.white,
        color: theme.colors.darkGray,
        borderColor: theme.colors.borderGray,
    },
    BoxBoldText: {
        fontSize: theme.size.sm,
        fontWeight: theme.weight.bold,
        width: 90,
        marginRight: 5,
        marginBottom: 5,
    },
    BoxText: {
        fontSize: theme.size.sm,
    },
});
