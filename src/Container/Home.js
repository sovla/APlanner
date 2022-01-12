import {useFocusEffect, useIsFocused} from '@react-navigation/core';
import React, {useCallback, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    Alert,
    BackHandler,
    ToastAndroid,
} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {MainButton} from '../assets/css/component.style';
import theme from '../assets/css/theme';
import {Facility} from '../State/Atom/Facility';
import InquiryChange from '../State/Atom/InquiryChange';
import moment from 'moment';
import 'moment/locale/ko';
import MainContainer from './MainContainer';

const screenWidth = Dimensions.get('window').width;
let exitApp;

export default function Home({navigation}) {
    const facility = useRecoilValue(Facility);
    const setInqueryChange = useSetRecoilState(InquiryChange);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                let timeout;

                if (exitApp === undefined || !exitApp) {
                    ToastAndroid.show('한번 더 누르면 앱을 종료합니다.', ToastAndroid.SHORT);
                    exitApp = true;

                    timeout = setTimeout(() => {
                        exitApp = false;
                    }, 2000);
                } else {
                    clearTimeout(timeout);
                    BackHandler.exitApp(); // 앱 종료
                }

                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );

    useEffect(() => {
        setInqueryChange(true);

        navigation.addListener('beforeRemove', e => {
            e.preventDefault();
        });
    }, []);

    let isReservationTime;
    if (facility !== null) {
        // 입주 예약 관련 기능 시설 정보가 있으면 오늘 날짜가 예약 날짜 사이 인가? 를 체크함
        isReservationTime = checkReservation(facility);
    }

    const onPressCheck = (index, isPossible, navigationName) => {
        if (!isPossible && index === 0) {
            Alert.alert('', '예약 기간이 아닙니다.');
        } else {
            navigation.navigate(navigationName);
        }
    };
    return (
        <>
            <MainContainer HeaderTitle="접수신청" Notice="접수신청 항목을 선택해 주세요">
                <View style={styles.Container}>
                    <Text style={MainButton}>{facility.ft_name}</Text>
                    {menuItem.map((item, index) => {
                        let style = [];
                        if (index !== 1) {
                            if (index === 0 && !isReservationTime) {
                                style = [styles.ButtonText, styles.DisableButton];
                            } else {
                                style = [styles.ButtonText, styles.DefaultButton];
                            }
                        } else {
                            style = [styles.ButtonText, styles.BlueButton];
                        }
                        return (
                            <TouchableOpacity
                                key={item.title}
                                style={[styles.ButtonTouch,style]}
                                onPress={() =>
                                    onPressCheck(index, isReservationTime, item.navigateName)
                                }>
                                <Text style={style}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </MainContainer>
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
    },
    ButtonContainer: {
        flex: 1,
        height: 60,
        width: '100%',
    },
    ButtonTouch:{
        width: screenWidth - 40,
        height: 60,
        justifyContent:'center',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 6,
    },
    ButtonText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: theme.size.sm,
        fontWeight: theme.weight.bold,
    },

    DefaultButton: {
        color: theme.colors.black,
        borderColor: theme.colors.borderWhiteGray,
    },
    DisableButton: {
        color: theme.colors.darkGray,
        borderColor: theme.colors.borderWhiteGray,
    },
    BlueButton: {
        color: theme.colors.blue,
        borderColor: theme.colors.blue,
    },
});
const menuItem = [
    {
        title: '사전점검 방문예약',
        navigateName: 'Check',
    },

    // {
    //     title: '불편사항 접수',
    //     navigateName: 'Complain',
    // },
    {
        title: '나의 접수 현황',
        navigateName: 'Reception',
    },
];

export const checkReservation = facility => {
    // 예약 가능한 날인지 분별하는 메소드

    const Day = moment().format('YYYY-MM-DD');
    const Time = moment().format('HH:mm:ss');
    const now = new Date(Day + 'T' + Time);

    const startDate = new Date(`${facility.ft_check_sdate}T${facility.ft_event_show_stime}:00`);
    const ApiEndDate = new Date(`${facility.ft_check_edate}T${facility.ft_event_show_etime}:00`);

    if (now >= startDate && now <= ApiEndDate) {
        return true;
    }
};
