import React, {useEffect} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import theme from '../../assets/css/theme';
import FooterButton from '../layout/FooterButton';
import Modal from '../Check/Modal';
import SelectReferenceText from '../Check/SelectReferenceText';
import SelectTime from '../Check/SelectTime';
import {BackFn} from '../../utils/BackFunction';
import MainContainer from '../../Container/MainContainer';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {Facility} from '../../State/Atom/Facility';
import {User} from '../../State/Atom/User';
import InquiryChange from '../../State/Atom/InquiryChange';

export default function ReservationTime({
    navigation,
    checkDate,
    setCheckDate,

    checkAPI,
    isVisible,
    array,
    guideMessage,
}) {
    const user = useRecoilValue(User);
    const setInquiryChange = useSetRecoilState(InquiryChange);
    const clickButton = item => {
        const now = new Date();
        if (new Date(checkDate.selectDate) < now) {
            if (
                item.substr(0, 2) * 60 + parseInt(item.substr(3, 2)) <
                now.getHours() * 60 + now.getMinutes()
            ) {
                return Alert.alert('', '지난 시간은 선택하지 못합니다.');
            }
        }

        setCheckDate({...checkDate, selectTime: item});
    };

    const saveButtonClick = () => {
        if (checkDate.selectTime && checkDate.selectTime !== '') {
            checkAPI(checkDate.selectDate, checkDate.selectTime, user.ct_idx);
        } else {
            const message = '시간을 선택해 주세요';
            Alert.alert(message);
        }
    };

    const clickButtonComplete = () => {
        setInquiryChange(true);
        setCheckDate({
            selectDate: '',
            selectTime: '',
        });
        navigation.navigate('Home');
    };
    const selectDate = checkDate.selectDate;
    return (
        <>
            <MainContainer
                HeaderTitle="사전점검 방문예약"
                Notice="방문 시간을 선택해 주세요"
                Back={BackFn(navigation)}>
                <ScrollView>
                    <View style={styles.Container}>
                        <Text style={styles.MainText}>{selectDate}</Text>
                        <SelectTime
                            data={array}
                            clickButton={clickButton}
                            selectItem={checkDate.selectTime}></SelectTime>
                        <SelectReferenceText
                            leftColor={theme.colors.blue}
                            rightColor={theme.colors.gray}
                            leftContent="선택가능"
                            rightContent="선택불가"
                            depscription={guideMessage}
                        />
                    </View>
                </ScrollView>

                <Modal
                    isVisible={isVisible}
                    clickButtonComplete={clickButtonComplete}
                    textArray={`${checkDate?.selectDate} ${checkDate?.selectTime}\n 예약이 접수되었습니다.\n자세한 접수내역은 문자로\n안내드리겠습니다.`}
                />
                <FooterButton onPressButton={saveButtonClick} buttonContent="저장" />
            </MainContainer>
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
    },
    MainText: {
        fontSize: theme.size.base,
        fontWeight: theme.weight.smbold,
        marginVertical: 30,
    },
});
