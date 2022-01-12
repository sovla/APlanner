import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../../assets/css/theme';

export default function PickerText({data, placeHolder, setData, value, type}) {
    const [isClick, setIsClick] = useState(false);
    const changeValue = value => {
        if (value !== '') {
            setData(data.find(item => item.idx === value));
        }
    };
    return (
        <View style={styles.Container}>
            <Picker
                itemStyle={{fontSize: 100}}
                onValueChange={changeValue}
                onFocus={() => setIsClick(true)}
                onBlur={() => setIsClick(false)}
                selectedValue={value.idx}
                dropdownIconColor={theme.colors.blue}
                dropdownIconRippleColor={theme.colors.blue}>
                <Picker.Item label={placeHolder} value="" color={theme.colors.textGray} />
                {data?.map((item, index) => {
                    return (
                        <Picker.Item
                            key={item + index}
                            label={item[type + '_name']}
                            value={item.idx}
                            color={item.idx === value.idx && isClick && theme.colors.blue}
                            style={styles.Picker}
                        />
                    );
                })}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        marginTop: 15,
        width: '100%',
        height: 50,
        borderColor: theme.colors.borderWhiteGray,
        backgroundColor: theme.colors.gray,
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
    },
    Picker: {
        fontSize: theme.size.sm,
        justifyContent: 'center',
        includeFontPadding: false,
    },
    Text: {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        textAlignVertical: 'center',
        paddingLeft: 20,
        color: theme.colors.textGray,
        fontSize: theme.size.sm,
        width: '80%',
        height: '100%',
        borderRadius: 5,
        backgroundColor: theme.colors.gray,
    },
});
