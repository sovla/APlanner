import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {CheckDate} from '../State/Atom/CheckDate';
import {Facility} from '../State/Atom/Facility';
import {API, insertFormData} from '../Api/api';
import {User} from '../State/Atom/User';
import ReservationTime from '../Component/Reservation/ReservationTime';
import Loading from '../State/Atom/Loading';

export default function CheckTime({navigation}) {
    const [isVisible, setIsVisible] = useState(false);
    const [checkDate, setCheckDate] = useRecoilState(CheckDate);
    const [array, setArray] = useState([]);

    const user = useRecoilValue(User);
    const facility = useRecoilValue(Facility);
    const setIsLoading = useSetRecoilState(Loading);
    useEffect(() => {
        arrayGetToApi(checkDate.selectDate, user.ct_idx, facility.ft_idx, user.ct_line);
    }, []);

    const arrayGetToApi = async (date, loginIdx, facilityIdx, ctLine) => {
        try {
            console.log('arrayGetToApi');
            setIsLoading(true);
            const formData = insertFormData(
                [date, loginIdx, facilityIdx, ctLine],
                ['chk_wdate', 'ct_idx', 'ft_idx', 'ct_line'],
            );
            await API.post('select_time.php', formData).then(res => {
                let result = [];
                for (const [key, value] of Object.entries(res.data)) {
                    result.push({
                        time: key,
                        isPossible: value,
                    });
                }
                setArray(result);
            });
        } catch (error) {
            setCheckDate({});
            return Alert.alert('네트워크 오류', '네트워크 오류로 인해 접수가 불가능 합니다.', [
                {
                    text: 'ok',
                    onPress: () => navigation.navigate('Home'),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const checkAPI = async (date, time, idx) => {
        try {
            console.log('CheckAPI', date, time, idx);
            const formData = insertFormData(
                [date, time, idx],
                ['chk_wdate', 'chk_wtime', 'ct_idx'],
            );
            const res = await API.post('check_res.php', formData);

            if (res.data.result === 'true') {
                console.log('resData:::', res.data);
                setIsVisible(true);
            } else {
                console.log('resData:::', res);
                Alert.alert('', '오류');
            }
        } catch (error) {
            console.log('error', error);
        }
    };
    const guideTime = () => {
        let time = parseInt(facility.ft_check_etime.substr(0, 2));
        if (facility.ft_check_etime.length > 3) {
            time = facility.ft_check_etime.substr(3, 1) !== '0' ? time + 1 : time;
        }
        if (time > 12) {
            return `오후 ${time - 12}시`;
        } else {
            return `오전 ${time}시`;
        }
    };
    const guideMessage = [
        `*방문예약은 ${facility.ft_check_term}분 간격 이며`,
        `행사 마감은 ${guideTime()} 입니다.`,
    ];
    return (
        <ReservationTime
            navigation={navigation}
            checkDate={checkDate}
            setCheckDate={setCheckDate}
            arrayGetToApi={arrayGetToApi}
            checkAPI={checkAPI}
            isVisible={isVisible}
            array={array}
            guideMessage={guideMessage}
        />
    );
}
