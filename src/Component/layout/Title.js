import React from 'react';
import {Dimensions, Platform, ScrollView, ScrollViewBase, StyleSheet, Text, View} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import theme from '../../assets/css/theme';
import BorderView from './BorderView';

const screenHeight = Dimensions.get('window').height;
export default function Title({children, Notice}) {
    const RenderView = Platform.OS === "android" ? View:KeyboardAwareScrollView
    return (
        <View style={styles.MainView}>
            <RenderView style={styles.MainContainer}
            >
                <View style={styles.TextContainer}>
                    <Text style={styles.NoticeText}>{Notice}</Text>
                </View>

                <BorderView />
                <View style={styles.ChildrenContainer}>{children}</View>
            </RenderView>
        </View>
    );
}

const styles = StyleSheet.create({
    MainView:{
        flex:1
    },
    MainContainer: {
        flex:1
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
    // 51 88 139  156
    ChildrenContainer: {
        paddingBottom:80,
        minHeight:screenHeight - 256,
        backgroundColor: theme.colors.white,
    },
});
