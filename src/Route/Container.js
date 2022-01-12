import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import Login from '../Container/Login';
import Home from '../Container/Home';
import Complain from '../Container/Complain';
import Check from '../Container/Check';
import MoveIn from '../Container/MoveIn';
import Reception from '../Container/Reception';
import theme from '../assets/css/theme';
import CheckCalender from '../Container/CheckCalender';
import CheckTime from '../Container/CheckTime';
import ComplainList from '../Container/ComplainList';
import ComplainUpdate from '../Container/ComplainUpdate';
import MoveInTime from '../Container/MoveInTime';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {API} from '../Api/api';
import {Facility} from '../State/Atom/Facility';
import ComplainAdd from '../Container/ComplainAdd';
import {User} from '../State/Atom/User';
import InquiryChange from '../State/Atom/InquiryChange';
import Complains from '../State/Atom/Complains';
import Inquiry from '../State/Atom/Inquiry';
import {Alert} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ChangeFacility from '../State/Atom/ChangeFacility';
import Loading from '../State/Atom/Loading';

const Stack = createNativeStackNavigator();

const Container = ({initialUrl}) => {
    const [facility, setFacility] = useRecoilState(Facility);
    const [inquiryChange, setInqueryChange] = useRecoilState(InquiryChange);
    const [inquiry, setInquiry] = useRecoilState(Inquiry);
    const [changeFacility, setChangeFacility] = useRecoilState(ChangeFacility);

    const user = useRecoilValue(User);
    const setComplain = useSetRecoilState(Complains);
    const setIsLoading = useSetRecoilState(Loading);

    const getFacilityAPI = async ft_idx => {
        // 시설정보
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('ft_idx', ft_idx);

            const res = await API.post('select_facility.php', formData)
                .then(res => (res.data.result ? setFacility(res.data.data) : console.log(res)))
                .catch(err => console.log(err));
        } catch (error) {
            Alert.alert('네트워크 오류', '현장 정보를 가져오지 못하였습니다.');
        }
        setIsLoading(false);
    };
    const getInquiryAPI = async ct_idx => {
        // 나의 접수 목록
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('ct_idx', ct_idx);
            await API.post('my_list.php', formData, {timeout: 10000}).then(res =>
                res.data.result === 'true' ? setInquiry(res.data.data) : console.log(res.data),
            );
        } catch (err) {
            console.log(err, 'getInquiryAPI');
        }
        setIsLoading(false);
    };
    useEffect(() => {
        if (initialUrl !== undefined) {
            getFacilityAPI(initialUrl);
            setChangeFacility(false);
        }
    }, [initialUrl, changeFacility]);

    useEffect(() => {
        if (user.ct_idx && inquiryChange) {
            console.log('change Inquiry');
            // setComplain([]);
            getInquiryAPI(user.ct_idx);
            setInqueryChange(false);
        }
    }, [user, inquiryChange]);
    useEffect(() => {
        setIsLoading(true);
        if (
            inquiry.discomfort !== undefined &&
            inquiry.discomfort !== null &&
            inquiry.discomfort.length > 0 &&
            inquiry?.discomfort[0]?.ct_idx !== undefined
        ) {
            setComplain(
                inquiry.discomfort.map(item => {
                    const object = {
                        dt_idx: item.dt_idx,
                        location: {
                            idx: item.rnt_idx,
                            rnt_name: item.dt_name,
                        },
                        detailedWork: {
                            idx: item.cgt_idx1,
                            cgt_name: item.dt_detail,
                            cgt_depth: '1',
                            cgt_parentIdx: '',
                        },
                        type: {
                            idx: item.cgt_idx2,
                            cgt_name: item.dt_kind,
                            cgt_depth: '2',
                            cgt_parentIdx: item.cgt_idx1,
                        },
                        content: item.dt_content,
                    };
                    let image = [];

                    item.dt_image1 !== '' && image.push({path: item.dt_image1});
                    item.dt_image2 !== '' && image.push({path: item.dt_image2});
                    const result = {
                        ...object,
                        image,
                    };
                    return result;
                }),
            );
        }
        setIsLoading(false);
    }, [inquiry]);

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />

                {/* 메뉴아이템 */}
                <Stack.Screen name="Check" component={Check} />
                <Stack.Screen name="CheckCalender" component={CheckCalender} />
                <Stack.Screen name="CheckTime" component={CheckTime} />

                {/* 불편사항 */}
                <Stack.Screen name="Complain" component={Complain} />
                <Stack.Screen name="ComplainList" component={ComplainList} />
                <Stack.Screen name="ComplainUpdate" component={ComplainUpdate} />
                <Stack.Screen name="ComplainAdd" component={ComplainAdd} />
                {/* 이사 */}
                <Stack.Screen name="MoveIn" component={MoveIn} />
                <Stack.Screen name="MoveInTime" component={MoveInTime} />
                {/* 접수내역 */}
                <Stack.Screen name="Reception" component={Reception} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Container;
