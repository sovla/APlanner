import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {RowContainer} from '../../assets/css/component.style';
import theme from '../../assets/css/theme';

const screenWidth = Dimensions.get('window').width;

export default function SelectTime({data, clickButton, selectItem}) {
    const Array = data;

    return (
        <View style={[styles.BoxContainer, RowContainer]}>
            {Array.map((item, index) => {
                const posible = item.isPossible;
                const buttonStyle = [
                    styles.ButtonView,
                    posible ? styles.SelectButton : styles.DisableButtonText,
                    (index + 1) % 4 === 0 && styles.LastButton,
                    item.time === selectItem && styles.EnableButton,
                ];
                let type = "black";
                if(item.time === selectItem){
                    type = "white";
                }else if(posible){
                    type = "blue";
                }

                return (
                    <TouchableOpacity
                        key={item.time + index}
                        onPress={() => clickButton(item.time)}
                        disabled={!posible}
                        style={buttonStyle}
                        >
                        <Text style={[styles.ButtonText,{color:theme.colors[type]}]}>{item.time}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    BoxContainer: {
        width: screenWidth - 40,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    ButtonView:{
        height: 40,
        width: (screenWidth - 85) / 4,
        borderRadius: 50,
        marginRight: 15,
        marginBottom: 15,
        justifyContent:'center'
    },
    ButtonText: {
        textAlignVertical: 'center',
        textAlign: 'center',
        fontWeight: theme.weight.smBold,
        fontSize: theme.size.sm,
    },
    EnableButton: {
        backgroundColor: theme.colors.blue,
        color: theme.colors.white,
    },
    DisableButtonText: {
        backgroundColor: theme.colors.gray,
        color: theme.colors.black,
    },
    LastButton: {
        marginRight: 0,
    },
    SelectButton: {
        backgroundColor: theme.colors.white,
        color: theme.colors.blue,
        borderWidth: 1,
        borderColor: theme.colors.blue,
    },
});
