import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    Alert,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    BackHandler,
    Platform,
    Modal,
    Dimensions,
    ScrollView,
} from 'react-native';

import theme from '../assets/css/theme';
import FooterButton from '../Component/layout/FooterButton';
import {BackFn} from '../utils/BackFunction';
import MainContainer from './MainContainer';
import {MainButton} from '../assets/css/component.style';

import {API, LoginAPI} from '../Api/api';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {User} from '../State/Atom/User';
import {Facility} from '../State/Atom/Facility';
import ChangeFacility from '../State/Atom/ChangeFacility';
import Loading from '../State/Atom/Loading';
import LoginModal from '../Component/Login/LoginModal';
import {useFocusEffect} from '@react-navigation/core';
import {Picker} from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

let exitApp;
const screenWidth = Dimensions.get('window').width;
export default function Login({navigation}) {
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setDisplay(false));
        Keyboard.addListener('keyboardDidHide', () => setDisplay(true));
    }, []);

    const [dong, setDong] = useState('');
    const [hosu, setHosu] = useState('');
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');
    const [selectFacilityNum, setSelectFacilityNum] = useState('');
    const [facilityList, setFacilityList] = useState([]); // 시설리스트
    const [isModal, setIsModal] = useState(false);
    const [user, setUser] = useRecoilState(User);
    const [loading,setLoading] = useState(false);

    const [facility, setFacility] = useRecoilState(Facility);

    const [display, setDisplay] = useState(true);
    const [modalStep, setModalStep] = useState(0);
    const setIsLoading = useSetRecoilState(Loading);

    const setChangeFacility = useSetRecoilState(ChangeFacility);
    const onPressBackArray = () => {
        setModalStep(0);
    };
    const onPressLogin = async () => {
        if (dong === '' || hosu === '' || name === '' || tel === '') {
            Alert.alert('', '공백 없이 입력해 주세요.');
        } else {
            try {
                setIsLoading(true);
                if (Platform.OS === 'android') {
                    if (facility?.ft_idx === undefined) {
                        setChangeFacility(true);
                        setIsLoading(false);
                        Alert.alert('', '시설 정보를 가져오고 있습니다. 다시 시도 해 주세요.');
                        return null;
                    }
                } else {
                    
                    if (facility?.idx !== selectFacilityNum) {
                        if (selectFacilityNum === '') {
                            setChangeFacility(true);
                            setIsLoading(false);
                            Alert.alert('', '아파트를 선택해주세요.');
                            return null;
                        } else {
                            const formData = new FormData();
                            formData.append('ft_idx', selectFacilityNum);
                            console.log(formData, 'select_facility.');
                            await API.post('select_facility.php', formData)
                                .then(res =>
                                    res.data.result ? setFacility(res.data.data) : console.log(res),
                                )
                                .catch(err => console.log(err));
                        }
                    }
                }
                const result = await LoginAPI(
                    dong,
                    hosu,
                    name,
                    tel,
                    Platform.OS === 'android' ? facility?.ft_idx : selectFacilityNum,
                );

                if (result.data.result === 'true') {
                    setUser(result.data.data);
                    setIsLoading(false);
                    navigation.navigate('Home');
                } else {
                    setIsLoading(false);
                    Alert.alert('', result.data.msg);
                }
            } catch (error) {
                setIsLoading(false);
                console.log(error);
                Alert.alert('', '네트워크 오류 발생');
            }
        }
    };

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
        
        setLoading(true)
        API.post('select_facility_list.php')
            .then(res => res?.data?.result === 'true' && res.data.data)
            .then(data => setFacilityList(data)).finally(()=>setLoading(false));
            
    }, []);
    return (
        <>
            <MainContainer
                HeaderTitle="로그인"
                Notice="고객님의 정보를 입력해 주세요"
                Back={BackFn(navigation)}>
                    <View style={styles.Container}>
                        {Platform.OS === 'android' ? (
                            <Text style={MainButton} onPress={onPressLogin}>
                                {facility.ft_name}
                            </Text>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setIsModal(prev => !prev)}
                                    style={[styles.Input, styles.PickerContainer]}>
                                    {selectFacilityNum ? (
                                        <Text style={styles.ValueText}>
                                            {
                                                facilityList.find(
                                                    item => item.ft_idx === selectFacilityNum,
                                                ).ft_name
                                            }
                                        </Text>
                                    ) : (
                                        <Text style={styles.PlaceholderText}>
                                            아파트를 선택해주세요.
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}

                        <View>
                            <View style={styles.InputContainer}>
                                <TextInput
                                    style={[styles.Input, styles.BetweenInput]}
                                    onChangeText={setDong}
                                    value={dong}
                                    placeholder="동"
                                    placeholderTextColor={theme.colors.textGray}
                                />
                                <TextInput
                                    style={[
                                        styles.Input,
                                        styles.BetweenInput,
                                        styles.BetweenLastInput,
                                    ]}
                                    onChangeText={setHosu}
                                    value={hosu}
                                    placeholder="호수"
                                    placeholderTextColor={theme.colors.textGray}
                                />
                            </View>
                            <View style={styles.InputContainer}>
                                <TextInput
                                    style={[styles.Input, styles.RowInput]}
                                    onChangeText={setName}
                                    value={name}
                                    placeholder="이름"
                                    placeholderTextColor={theme.colors.textGray}
                                />
                            </View>
                            <View style={styles.InputContainer}>
                                <TextInput
                                    style={[styles.Input, styles.RowInput]}
                                    onChangeText={setTel}
                                    value={tel}
                                    placeholder="전화번호"
                                    placeholderTextColor={theme.colors.textGray}
                                />
                            </View>
                        </View>
                        <Text style={styles.SubText}>*개인정보필수 입력 확인 동의</Text>

                        <TouchableOpacity onPress={() => setModalStep(1)}>
                            <Text style={styles.UnderlineText}>자세히보기</Text>
                        </TouchableOpacity>
                        <LoginModal
                            isVisible={modalStep === 1}
                            text={facility.terms?.st_agree1}
                            text1={facility.terms?.st_agree2}
                            clickButtonComplete={() => setModalStep(0)}
                            onPressBackArray={onPressBackArray}
                        />
                    </View>

                <FooterButton
                    display={display}
                    buttonContent="로그인"
                    onPressButton={onPressLogin}
                    isTop
                />
                <Spinner visible={loading} />
                <Modal visible={isModal} presentationStyle="overFullScreen" transparent={true}>
                    <View
                        onResponderEnd={() => setIsModal(false)}
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}>
                        <View
                            style={{
                                borderColor: theme.colors.borderGray,
                                borderWidth: 1,
                                margin: 20,
                                borderRadius: 15,
                                backgroundColor: 'white',
                            }}>
                            <Picker
                                onValueChange={setSelectFacilityNum}
                                selectedValue={selectFacilityNum}
                                itemStyle={{fontSize: 16}}
                                mode="dialog"
                                dropdownIconColor={theme.colors.blue}
                                dropdownIconRippleColor={theme.colors.blue}
                                itemStyle={{fontSize: 16}}>
                                <Picker.Item
                                    label={'아파트를 선택해주세요.'}
                                    value=""
                                    color={theme.colors.textGray}
                                />
                                {facilityList.map(item => (
                                    <Picker.Item
                                        key={item}
                                        label={item.ft_name}
                                        value={item.ft_idx}
                                        // color={item.ft_idx }
                                        style={styles.Picker}
                                    />
                                ))}
                            </Picker>
                            <View style={{position: 'absolute', bottom: -80}}>
                                <TouchableOpacity
                                    style={styles.ButtonTouch}
                                    onPress={() => setIsModal(false)}>
                                    <Text style={styles.ButtonText}>선택</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </MainContainer>
        </>
    );
}
const styles = StyleSheet.create({
    PickerContainer: {
        marginTop: 15,
        marginBottom: 15,
        width: '90%',
        height: 50,
        borderColor: theme.colors.borderWhiteGray,
        backgroundColor: theme.colors.gray,
        justifyContent: 'center',
        borderRadius: 3,
        borderWidth: 1,
    },
    Container: {
        flex: 1,

        alignItems: 'center',
    },
    InputContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    Input: {
        flex: 1,
        height: 50,
        maxHeight: 50,
        fontSize: theme.size.sm,
        color: theme.colors.black,
        borderWidth: 1,
        borderColor: theme.colors.borderGray,
        backgroundColor: theme.colors.gray,
        includeFontPadding: false,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    RowInput: {
        marginHorizontal: 20,
        marginTop: 15,
    },
    BetweenInput: {
        marginLeft: 20,
    },
    BetweenLastInput: {
        marginRight: 20,
    },

    SubText: {
        marginTop: 40,
        fontSize: theme.size.xs,
        color: theme.colors.darkGray,
    },
    UnderlineText: {
        marginTop: 4,
        fontSize: theme.size.xxs,
        color: theme.colors.black,
        textDecorationLine: 'underline',
    },
    LoginButton: {
        position: 'absolute',
        bottom: 0,
    },
    LoginBox: {
        position: 'relative',
    },
    ButtonTouch: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: screenWidth - 40,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.blue,
    },
    ButtonText: {
        color: theme.colors.white,
        fontSize: theme.size.base,
    },
    PlaceholderText: {
        color: theme.colors.textGray,
    },
    ValueText: {
        color: theme.colors.black,
    },
});
