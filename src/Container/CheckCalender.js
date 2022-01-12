import React, {useEffect} from 'react';
import {Alert} from 'react-native';

import {useRecoilState, useRecoilValue} from 'recoil';
import {Facility} from '../State/Atom/Facility';
import {CheckDate} from '../State/Atom/CheckDate';
import CalendarComponent from '../Component/Reservation/CalendarComponent';
import Inquiry from '../State/Atom/Inquiry';

export default function CheckCalender({navigation}) {
    const facility = useRecoilValue(Facility);
    const [checkDate, setCheckDate] = useRecoilState(CheckDate);
    const inquiry = useRecoilValue(Inquiry);

    const onClickNext = () => {
        const selectDate = new Date(checkDate.selectDate);
        const startDate = new Date(facility.ft_event_sdate);
        const endDate = new Date(facility.ft_event_edate);
        if (selectDate < startDate || selectDate > endDate) {
            const message = '행사 날짜 안에서 선택해주세요';
            Alert.alert(message);
        }
        if (checkDate.selectDate !== '') {
            navigation.navigate('CheckTime');
        } else {
            const message = '날짜를 선택해주세요';
            Alert.alert(message);
        }
    };

    return (
        <CalendarComponent
            navigation={navigation}
            setCheckDate={setCheckDate}
            STARTDATE={facility.ft_event_sdate}
            ENDDATE={facility.ft_event_edate}
            onClickNext={onClickNext}
        />
    );
}
