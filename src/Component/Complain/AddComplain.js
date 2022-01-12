import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    BackHandler,
} from 'react-native';

import theme from '../../assets/css/theme';
import FloorPlan from '../../assets/images/floor_plan.jpg';
import {BackFn} from '../../utils/BackFunction';

import addIcon from '../../assets/images/addIcon.png';
import PickerText from './PickerText';

import ImageCropPicker from 'react-native-image-crop-picker';
import UploadImageBox from './UploadImageBox';
import {RowContainer} from '../../assets/css/component.style';
import FooterButton from '../layout/FooterButton';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import Complains from '../../State/Atom/Complains';
import MainContainer from '../../Container/MainContainer';
import Address from '../../State/Selector/Address';
import {Category, RoomName} from '../../State/Selector/Category';
import {User} from '../../State/Atom/User';
import {useIsFocused} from '@react-navigation/core';
import goBack from '../../utils/goBack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Complain({navigation}) {
    const address = useRecoilValue(Address);
    const focus = useIsFocused();
    const [location, setLocaiton] = useState([]);
    const [detailedWork, setDetailedWork] = useState([]);
    const [type, setType] = useState([]);

    const category = useRecoilValue(Category);
    const roomName = useRecoilValue(RoomName);

    //  입력한 값들
    const [pickLocaiton, setPickLocation] = useState('');
    const [pickDetailedWork, setPickDetailedWork] = useState('');
    const [pickType, setPickType] = useState('');
    const [contents, setContents] = useState('');
    const [images, setImages] = useState([]);
    const user = useRecoilValue(User);

    let image;
    const setComplain = useSetRecoilState(Complains);
    useEffect(() => {
        // if (focus) {
        //     BackHandler.addEventListener('hardwareBackPress', () => goBack(navigation));
        // }
        if (roomName) {
            setLocaiton(roomName.filter(filterItem => filterItem.rnt_depth === '1'));
        }
        if (category) {
            setDetailedWork(category.filter(item => item.cgt_depth === '1'));
        }
        // return () => BackHandler.removeEventListener('hardwareBackPress', () => goBack(navigation));
    }, []);
    useEffect(() => {
        setType(
            roomName.filter(
                filterItem =>
                    filterItem?.rnt_depth === '2' &&
                    pickLocaiton?.idx === filterItem?.rnt_parentidx,
            ),
        );
        setPickType('');
    }, [pickLocaiton]);

    const launchForCarmera = () => {
        if (images.length >= 2) {
            return null;
        }
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true, // 자르기 활성화
            includeBase64: true,
        }).then(images => {
            UploadImage(images);
        });
    };
    const UploadImage = async image => {
        setImages(prev => [...prev, image]);
    };

    const deleteUploadImage = deleteItem => {
        setImages(prev => prev.filter(item => item.path !== deleteItem));
    };

    const clickNext = () => {
        const filterLocation = location.find(item => item.idx === pickLocaiton.idx);
        const filterDetail = detailedWork.find(item => item.idx === pickDetailedWork.idx);
        const filterType = type.find(item => item.idx === pickType.idx);
        let message = '';
        if (pickLocaiton === '') {
            message = '실명을 선택해 주세요';
        } else if (pickDetailedWork === '') {
            message = '세부공종을 선택해 주세요';
        } else if (pickType === '') {
            message = '유형을 선택해 주세요';
        } else if (contents === '') {
            message = '내용을 입력해 주세요';
        } else if (images.length === 0) {
            message = '한개 이상의 사진을 올려 주세요';
        } else if (!filterLocation || !filterDetail || !filterType) {
            message = '잘못된 분류입니다.';
        } else {
            setComplain(prev => [
                ...prev,
                {
                    location: pickLocaiton,
                    detailedWork: pickDetailedWork,
                    type: pickType,
                    content: contents,
                    image: [...images],
                },
            ]);
            navigation.navigate('ComplainList');
        }

        if (message !== '') {
            Alert.alert(message);
        }
    };
    if (user?.ftt_image) {
        image = true;
    }
    return (
        <>
            <SafeAreaView style={{flex:0,backgroundColor:"#000"}} />
            <MainContainer HeaderTitle="불편사항 접수" Notice={address} Back={BackFn(navigation)}>
                <View style={styles.Container}>
                    <View style={styles.ImageBox}>
                        <Image
                            style={styles.Image}
                            source={
                                image
                                    ? {
                                          uri: `https://dmonster1701.cafe24.com/images/uploads/${user?.ftt_image}`,
                                      }
                                    : FloorPlan
                            }
                            resizeMode="center"
                        />
                    </View>
                    <PickerText
                        placeHolder="실명을 선택해 주세요"
                        data={location}
                        setData={setPickLocation}
                        value={pickLocaiton}
                        type={'rnt'}
                    />
                    <PickerText
                        placeHolder="세부공종을 선택해 주세요"
                        data={detailedWork}
                        setData={setPickDetailedWork}
                        value={pickDetailedWork}
                        type={'cgt'}
                    />
                    <PickerText
                        placeHolder="유형을 선택해 주세요"
                        data={type}
                        setData={setPickType}
                        value={pickType}
                        type={'rnt'}
                    />
                    <View>
                        <Text style={styles.ContentsText}>내용</Text>
                        <TextInput
                            style={styles.Contents}
                            value={contents}
                            onChangeText={setContents}
                            placeholder="상세내용을 작성해 주세요"
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>
                    <View>
                        <View style={[RowContainer, styles.ImageBoxView]}>
                            <Text style={styles.ImageText}>사진</Text>
                            <Text style={styles.ImageTextInner}>(최대 2장)</Text>
                        </View>
                        <TouchableOpacity style={styles.UploadImageBox} onPress={launchForCarmera}>
                            <Image source={addIcon}></Image>
                        </TouchableOpacity>
                        <View style={RowContainer}>
                            {images.map((item, index) => (
                                <UploadImageBox
                                    index={index}
                                    key={item.data + index}
                                    length={images.length}
                                    item={item}
                                    deleteFn={deleteUploadImage}
                                />
                            ))}
                        </View>
                    </View>
                </View>
                <FooterButton onPressButton={clickNext} buttonContent="다음" />
            </MainContainer>
            
            <SafeAreaView style={{flex:0,backgroundColor:"#000"}} />
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,

        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    ImageBox: {
        marginTop: 30,
        width: '100%',
        height: 240,
        borderWidth: 1,
        borderColor: theme.colors.borderGray,
        borderRadius: 5,
        paddingHorizontal: '10%',
        paddingVertical: '3%',
    },
    Image: {
        width: '100%',
        height: 220,
    },
    Picker: {
        borderColor: theme.colors.borderWhiteGray,
        backgroundColor: theme.colors.darkGray,
    },
    ContentsText: {
        marginTop: 30,
        fontSize: theme.size.sm,
        fontWeight: theme.weight.smBold,
    },
    Contents: {
        textAlignVertical: 'top',
        height: 200,
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: theme.colors.borderContentGray,
        backgroundColor: theme.colors.gray,
        borderRadius: 5,
        color: theme.colors.black,
        fontSize: theme.size.sm,
        lineHeight: theme.lineHeight.lg,
    },
    UploadImage: {},
    UploadImageBox: {
        marginVertical: 15,
        width: 100,
        height: 100,
        backgroundColor: theme.colors.gray,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageText: {
        fontSize: theme.size.sm,
    },
    ImageTextInner: {
        marginLeft: 5,
        fontSize: theme.size.sm,
        color: theme.colors.darkGray,
    },
    ImageBoxView: {
        marginTop: 30,
    },
});
