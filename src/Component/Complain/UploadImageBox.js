import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import theme from '../../assets/css/theme';
import deleteIcon from '../../assets/images/deleteIcon.png';

export default function UploadImageBox({item, length, index, deleteFn, itemPath}) {
    return (
        <View style={styles.Container}>
            <Text style={styles.Text}>{`${index + 1}/${length}`}</Text>
            <Image
                width={100}
                height={100}
                source={{uri: itemPath ? itemPath : item.path}}
                resizeMode="cover"
                onPress={e => console.log(e)}
                style={styles.Image}></Image>
            <TouchableOpacity
                style={styles.Delete}
                onPress={() => {
                    deleteFn(item.path);
                }}>
                <Image source={deleteIcon} style={styles.CloseImage} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 15,
    },
    Text: {
        position: 'absolute',
        width: 100,
        height: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: theme.colors.white,
        fontSize: theme.size.sm,
        zIndex: 5,
    },
    Image: {
        width: 100,
        height: 100,
        backgroundColor: '#000',
        opacity: 0.7,
        borderRadius: 5,
    },
    Delete: {
        position: 'absolute',
        right: 5,
        top: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
        zIndex: 10,
    },
    DeleteText: {
        color: theme.colors.white,
        fontSize: theme.size.base,
    },
    CloseImage: {
        width: 16,
        height: 16,
    },
});
