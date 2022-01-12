import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {API} from '../Api/api';
import theme from '../assets/css/theme';

import FooterButton from '../Component/layout/FooterButton';
import ReceptionBox from '../Component/Reception/ReceptionBox';
import {Facility} from '../State/Atom/Facility';
import Inquiry from '../State/Atom/Inquiry';
import InquiryChange from '../State/Atom/InquiryChange';
import {User} from '../State/Atom/User';
import Address from '../State/Selector/Address';
import {BackFn} from '../utils/BackFunction';
import {checkReservation} from './Home';
import MainContainer from './MainContainer';

export default function Reception({navigation}) {
    const address = useRecoilValue(Address);
    const facility = useRecoilValue(Facility);
    const inquiry = useRecoilValue(Inquiry);
    const user = useRecoilValue(User);

    const [isLocalData, setIsLocalData] = useState(false);
    const [inquiryChange, setInquiryChange] = useRecoilState(InquiryChange);

    let isReservationTime;

    if (facility) {
        // 입주 예약 관련 기능 시설 정보가 있으면 오늘 날짜가 예약 날짜 사이 인가? 를 체크함
        isReservationTime = checkReservation(facility);
    }
    useEffect(() => {
        if (!inquiryChange) {
            getLocaleComplain();
        }
    }, []);
    const getLocaleComplain = async () => {
        try {
            const localComplainJsonString = await AsyncStorage.getItem('localComplain');
            if (localComplainJsonString.length > 2) {
                setIsLocalData(true);
            }
        } catch (error) {}
    };
    const checkContent =
        inquiry.check !== null
            ? [
                  {
                      title: '입주정보',
                      content: `${user.ct_dong}동 ${user.ct_hosu}호`,
                  },
                  {
                      title: '예약날짜',
                      content: inquiry.check.chk_wdate,
                  },
                  {
                      title: '예약시간',
                      content: inquiry.check.chk_wtime,
                  },
              ]
            : null;
    const moveInContent = null;

    const complainContent =
        inquiry?.discomfort !== null &&
        inquiry?.discomfort !== undefined &&
        inquiry?.discomfort?.length > 0
            ? [
                  {
                      title: '입주정보',
                      content: `${user.ct_dong}동 ${user.ct_hosu}호`,
                  },
                  {
                      title: '내용',
                      content:
                          inquiry.discomfort?.length > 1
                              ? `${inquiry?.discomfort[0]?.dt_name} 외 ${
                                    inquiry.discomfort.length - 1
                                }건`
                              : inquiry?.discomfort[0]?.dt_name,
                  },
              ]
            : null;

    const deleteCheck = type => {
        Alert.alert('', '정말로 삭제하시겠습니까?', [
            {
                text: 'cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'ok', onPress: () => deleteCheckAPI(type)},
        ]);
    };
    const deleteCheckAPI = async type => {
        try {
            const formData = new FormData();
            formData.append('ct_idx', user.ct_idx);
            if (type === 0) {
                formData.append('chk_idx', inquiry.check.chk_idx);
            } else {
                formData.append('act', 'del_all');
            }
            const res = await API.post('del_list.php', formData);
            res.data.result === 'true' ? console.log('삭제완료') : console.log(res.data);
            setInquiryChange(true);
        } catch (error) {
            return Alert.alert('네트워크 오류', '오류가 발생했습니다.');
        }
    };

    return (
        <>
            <MainContainer HeaderTitle="나의 접수 현황" Notice={address} Back={BackFn(navigation)}>
                <View style={styles.Container}>
                    {inquiry.check !== null && checkContent !== null && (
                        <ReceptionBox
                            title="입주자 사전 점검"
                            contentArray={checkContent}
                            leftButtonPress={() => {
                                isReservationTime
                                    ? navigation.navigate('Check')
                                    : Alert.alert('', '예약 기간이 아닙니다.');
                            }}
                            rightButtonPress={() => deleteCheck(0)}
                        />
                    )}
                    {inquiry.move !== null && moveInContent !== null && (
                        <ReceptionBox
                            title="입주자 이사예약"
                            contentArray={moveInContent}
                            leftButtonPress={() => navigation.navigate('MoveIn')}
                        />
                    )}
                    {inquiry.discomfort !== null && complainContent !== null && (
                        <ReceptionBox
                            title="불편사항접수"
                            contentArray={complainContent}
                            leftButtonPress={() => deleteCheck(1)}
                            rightButtonPress={() => navigation.navigate('ComplainList')}
                            leftButtonContent="삭제"
                            rightButtonContent="자세히보기"
                        />
                    )}
                    {inquiry.check === null &&
                        checkContent === null &&
                        inquiry?.discomfort.length === 0 &&
                        complainContent === null &&
                        isLocalData === false && (
                            <Text style={styles.NoneText}>접수내역이 존재하지 않습니다.</Text>
                        )}
                    {isLocalData && complainContent === null && (
                        <ReceptionBox
                            title="불편사항접수 임시저장"
                            contentArray={[
                                {
                                    title: '입주정보',
                                    content: `${user.ct_dong}동 ${user.ct_hosu}호`,
                                },
                                {
                                    title: '내용',
                                    content: '임시저장',
                                },
                            ]}
                            rightButtonPress={() => navigation.navigate('ComplainList')}
                            leftButtonPress={() => navigation.navigate('ComplainList')}
                            rightButtonContent="자세히보기"
                        />
                    )}
                </View>
                <FooterButton
                onPressButton={() => navigation.navigate('Home')}
                buttonContent="메인으로"
            />
            </MainContainer>
            
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        paddingBottom: 70,
    },
    NoneText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: theme.size.base,
    },
});
