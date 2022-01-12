import React from 'react';
import {Alert} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import CalendarComponent from '../Component/Reservation/CalendarComponent';
import {CheckDate} from '../State/Atom/CheckDate';
import {Facility} from '../State/Atom/Facility';

export default function MoveIn({navigation}) {
    const facility = useRecoilValue(Facility);
    const [checkDate, setCheckDate] = useRecoilState(CheckDate);

    const onClickNext = () => {
        if (checkDate.selectDate !== '') {
            navigation.navigate('CheckTime');
        } else {
            Alert.alert((message = '날짜를 선택해주세요'));
        }
    };

    return (
        <CalendarComponent
            navigation={navigation}
            setCheckDate={setCheckDate}
            STARTDATE={facility.ft_res_sdate}
            ENDDATE={facility.ft_res_edate}
            onClickNext={onClickNext}
        />
    );
}
