import React from 'react';
import {Dimensions, ScrollView, ScrollViewBase, StyleSheet, Text, View} from 'react-native';
import theme from '../../assets/css/theme';
import BorderView from './BorderView';

const screenHeight = Dimensions.get('window').height;
export default function Title({children, Notice}) {
    return (
        <View style={styles.MainView}>
            <View style={styles.MainContainer}>
                <View style={styles.TextContainer}>
                    <Text style={styles.NoticeText}>{Notice}</Text>
                </View>

                <BorderView />
                <View style={styles.ChildrenContainer}>{children}</View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    MainView:{
        flex:1,
    },
    MainContainer: {
        flex:1,
    },
    TextContainer: {
        height: 88,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoticeText: {
        fontSize: theme.size.base,
        color: theme.colors.white,
        fontWeight: theme.weight.bold,
    },
    ChildrenContainer: {
        flex:1,
        // minHeight:screenHeight - 238,
        paddingBottom: 80,
        backgroundColor: theme.colors.white,
    },
});
