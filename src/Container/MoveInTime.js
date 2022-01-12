import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {MoveInDate} from '../State/Atom/MoveInDate';
import {Facility} from '../State/Atom/Facility';
import {API, insertFormData} from '../Api/api';
import {User} from '../State/Atom/User';
import ReservationTime from '../Component/Reservation/ReservationTime';

export default function MoveInTime({navigation}) {
    const [isVisible, setIsVisible] = useState(false);
    const [checkDate, setCheckDate] = useRecoilState(MoveInDate);
    const [array, setArray] = useState([]);

    const user = useRecoilValue(User);
    const facility = useRecoilValue(Facility);

    useEffect(() => {
        arrayGetToApi(checkDate.selectDate, user.ct_idx, facility.ft_idx);
    }, []);

    const arrayGetToApi = async (date, loginIdx, facilityIdx) => {
        const formData = insertFormData(
            [date, loginIdx, facilityIdx],
            ['chk_wdate', 'ct_idx', 'ft_idx'],
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
    };

    const checkAPI = async (date, time, idx) => {
        const formData = insertFormData([date, time, idx], ['chk_wdate', 'chk_wtime', 'ct_idx']);
        await API.post('reservation.php', formData).then(res =>
            res.data.result ? setIsVisible(true) : Alert.alert((message = '오류')),
        );
    };

    return (
        <ReservationTime
            navigation={navigation}
            checkDate={checkDate}
            setCheckDate={setCheckDate}
            arrayGetToApi={arrayGetToApi}
            checkAPI={checkAPI}
            isVisible={isVisible}
            array={array}
            guideMessage={facility.ft_res_guide}
        />
    );
}
