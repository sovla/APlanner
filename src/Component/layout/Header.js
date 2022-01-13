import React from 'react';
import {Image, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import theme from '../../assets/css/theme';
import BackIcon from '../../assets/images/back.png';

export default function Header({HeaderTitle, Back = {isBack: false}}) {
    return (
        <View style={styles.Container}>
            <View style={styles.RowContainer}>
                {Back.isBack && (
                    <TouchableOpacity onPress={Back.BackFn} style={styles.ImageItem}>
                        <View style={styles.ImageView}>
                            <Image
                                source={BackIcon}
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 17,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                )}

                <Text style={styles.HeaderText}>{HeaderTitle}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        height: 51,
        borderBottomWidth: 1,
        borderBottomColor: '#82A6FB',
    },
    RowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    HeaderText: {
        position: 'absolute',
        width: '50%',
        left: '25%',
        textAlign: 'center',
        fontSize: theme.size.base,
        color: theme.colors.white,
    },
    ImageItem: {
        marginLeft: 12,
        padding: 10,
    },
});
