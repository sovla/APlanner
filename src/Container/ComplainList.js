import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import MainContainer from './MainContainer';
import {RowContainer, Width100} from '../assets/css/component.style';
import theme from '../assets/css/theme';
import FooterButton from '../Component/layout/FooterButton';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import Complains from '../State/Atom/Complains';
import {ComplainIndex} from '../State/Selector/ComplainSelector';
import {API} from '../Api/api';
import {User} from '../State/Atom/User';
import axios from 'axios';
import InquiryChange from '../State/Atom/InquiryChange';
import Inquiry from '../State/Atom/Inquiry';
import DeleteImage from '../State/Atom/DeleteImage';
import Address from '../State/Selector/Address';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../State/Atom/Loading';
import {useIsFocused} from '@react-navigation/core';

const screenWidth = Dimensions.get('window').width;

export default function ComplainList({navigation}) {
    const setComplainIndex = useSetRecoilState(ComplainIndex);
    const [complains, setComplains] = useRecoilState(Complains);
    const setInquiryChange = useSetRecoilState(InquiryChange);
    const [deleteImage, setDeleteImage] = useRecoilState(DeleteImage);

    const user = useRecoilValue(User);
    const inquiry = useRecoilValue(Inquiry);
    const address = useRecoilValue(Address);

    const setIsLoading = useSetRecoilState(Loading);

    const [isLoad, setIsLoad] = useState(false);

    const deleteComplain = async deleteIndex => {
        try {
            setIsLoading(true);
            const formDate = new FormData();
            formDate.append('ct_idx', user.ct_idx);
            formDate.append('dt_idx', complains[deleteIndex].dt_idx);
            const res = await API.post('del_list.php', formDate);
            if (res.data.result === 'true') {
                console.log('삭제완료');
            }

            const result = complains.filter((item, index) => index !== deleteIndex);
            setComplains(result);
        } catch (error) {
            Alert.alert('네트워크 오류', '오류가 발생했습니다.');
        }
        setIsLoading(false);
    };

    const updateClick = index => {
        setComplainIndex(index);
        navigation.navigate('ComplainUpdate');
    };

    const clickPlusButton = () => {
        navigation.navigate('ComplainAdd');
    };
    const clickLoadLocaleData = async () => {
        try {
            setIsLoading(true);
            const localComplainJsonString = await AsyncStorage.getItem('localComplain');
            if (localComplainJsonString.length > 2 && !isLoad) {
                const localComplain = JSON.parse(localComplainJsonString);
                if (complains.length > 0) {
                    const resultArray = complains
                        .map(item => {
                            let result;

                            if (item?.dt_idx) {
                                result = localComplain.find(
                                    localItem => item.dt_idx === localItem?.dt_idx,
                                );
                            } else {
                                result = item;
                            }
                            return result;
                        })
                        .concat(localComplain.filter(item => item?.dt_idx === undefined))
                        .filter(item => item !== undefined);

                    setComplains(resultArray);
                } else {
                    setComplains(JSON.parse(localComplainJsonString));
                }

                Alert.alert('', '데이터 불러오기 성공');
                await AsyncStorage.removeItem('localComplain');
                setIsLoad(true);
            } else if (isLoad) {
                Alert.alert('', '이미 불러온 데이터 입니다.');
            } else {
                Alert.alert('', '데이터가 존재하지 않습니다.');
            }
        } catch (error) {
            return Alert.alert('', '데이터가 존재하지 않습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    const clickImage = async () => {};

    const clickSave = async () => {
        if (complains.length !== 0) {
            try {
                setIsLoading(true);
                for (const item of complains) {
                    const formData = new FormData();
                    let isImageSave = {
                        image1: false,
                        image2: false,
                    };
                    const ServerItem =
                        inquiry.discomfort !== null &&
                        inquiry.discomfort.find(content => content.dt_idx === item.dt_idx);
                    formData.append('ct_idx', user.ct_idx);
                    formData.append('rnt_idx', item.location.idx);
                    formData.append('cgt_idx1', item.detailedWork.idx);
                    formData.append('cgt_idx2', item.type.idx);
                    formData.append('dt_content', item.content);

                    if (
                        (item.image[0].data !== null && item.image[0].data !== undefined) ||
                        (ServerItem?.dt_image2 !== undefined &&
                            ServerItem?.dt_image2 === item.image[0].path &&
                            item.image.length === 2)
                    ) {
                        console.log('create dt_image1');
                        let type = 'image/jpeg';
                        if (
                            ServerItem?.dt_image2 !== undefined &&
                            ServerItem?.dt_image2 === item.image[0].path &&
                            item.image.length === 2
                        ) {
                            formData.append('dt_image1', {
                                name: 'dt_image1',
                                type: type,
                                uri: item.image[1].path,
                            });
                        } else {
                            formData.append('dt_image1', {
                                name: 'dt_image1',
                                type: type,
                                uri: item.image[0].path,
                            });
                        }
                        isImageSave.image1 = true;
                    }

                    if (item.image.length === 2) {
                        if (
                            item.image[1].data !== null &&
                            item.image[1].data !== undefined &&
                            item.image[0].path !==
                                (ServerItem?.dt_image2 !== undefined && ServerItem?.dt_image2)
                        ) {
                            console.log('create dt_image2');
                            const type = 'image/jpeg';
                            formData.append('dt_image2', {
                                name: 'dt_image2',
                                type: type,
                                uri: item.image[1].path,
                            });
                            isImageSave.image2 = true;
                        }
                    }
                    for (const deleteImageItem of deleteImage) {
                        if (
                            (ServerItem?.dt_image1 === deleteImageItem && !isImageSave?.image1) ||
                            (!isImageSave.image1 &&
                                item.image[0] !== undefined &&
                                item.image[0].path === deleteImageItem)
                        ) {
                            console.log('delete dt_image1');
                            formData.append('dt_image1', 'delete');
                        } else if (
                            (ServerItem?.dt_image2 === deleteImageItem && !isImageSave?.image2) ||
                            (!isImageSave.image2 &&
                                item.image[1] !== undefined &&
                                item.image[1].path === deleteImageItem)
                        ) {
                            console.log('delete dt_image2');
                            formData.append('dt_image2', 'delete');
                        }
                    }

                    if (item.dt_idx !== null && item.dt_idx !== undefined) {
                        formData.append('dt_idx', item.dt_idx);
                    }

                    await axios({
                        method: 'post',
                        url: 'https://dmonster1701.cafe24.com/api/discomfort.php',
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }

                setComplains([]);
                setInquiryChange(true);
                setDeleteImage([]);

                navigation.navigate('Home');
            } catch (error) {
                try {
                    console.log('로컬저장');
                    const res = await AsyncStorage.setItem(
                        'localComplain',
                        JSON.stringify(complains),
                    );
                    Alert.alert(
                        '네트워크 오류',
                        '오류로 인해 임시저장 하였습니다. \n추후에 데이터 불러오기를 통하여\n다시 저장 해 주세요.',
                        [
                            {
                                text: 'ok',
                                onPress: () => {
                                    setDeleteImage([]);
                                    setInquiryChange(true);
                                    navigation.navigate('Home');
                                },
                            },
                        ],
                    );
                } catch (error) {}
            }
            setIsLoading(false);
        } else {
            setInquiryChange(true);

            navigation.navigate('Home');
        }
    };
    let complainsReverse = [];
    if (complains) {
        complainsReverse = [...complains].reverse();
    }

    return (
        <>
            <MainContainer
                HeaderTitle="불편사항 접수"
                Notice={address}
                Back={{
                    isBack: true,
                    BackFn: () => navigation.navigate('Home'),
                }}>
                <View style={styles.Container}>
                    <View style={styles.Header}>
                        <TouchableOpacity onPress={clickLoadLocaleData}>
                            <Text style={[styles.Button, styles.WhiteButton]}>
                                임시저장 불러오기
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.PlusButton} onPress={clickPlusButton}>
                            <Text style={styles.PlusButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {[...complains].reverse().map((item, index) => {
                        let uri;
                        for (const itemImage of item.image) {
                            if (itemImage.path) {
                                uri =
                                    itemImage.data !== undefined
                                        ? itemImage.path
                                        : `https://dmonster1701.cafe24.com/images/uploads/${itemImage.path}`;
                                break;
                            }
                        }

                        return (
                            <View key={item.type + index} style={styles.Box}>
                                <View style={[RowContainer, Width100]}>
                                    <Image
                                        source={{
                                            uri: uri,
                                        }}
                                        style={styles.BoxImage}
                                    />
                                    <View style={styles.Flex}>
                                        <View style={[RowContainer, styles.TextBox]}>
                                            <Text style={styles.BoldText}>실명</Text>
                                            <Text style={styles.InText}>
                                                {item.location.rnt_name}
                                            </Text>
                                        </View>
                                        <View style={[RowContainer, styles.TextBox]}>
                                            <Text style={styles.BoldText}>유형</Text>
                                            <Text style={styles.InText}>{item.type.cgt_name}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text numberOfLines={1} style={styles.Contents}>
                                    {item.content}
                                </Text>
                                <View style={[RowContainer, styles.BoxFooter]}>
                                    <TouchableOpacity
                                        style={styles.ButtonTouch}
                                        onPress={() => updateClick(complains.length - index - 1)}>
                                        <Text style={[styles.Button, styles.WhiteButton]}>
                                            수정
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.ButtonTouch}
                                        onPress={() =>
                                            deleteComplain(complains.length - index - 1)
                                        }>
                                        <Text style={[styles.Button, styles.BlueButton]}>삭제</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </MainContainer>
            <FooterButton buttonContent="저장" onPressButton={clickSave} />
        </>
    );
}

const styles = StyleSheet.create({
    Flex: {
        flex: 1,
    },
    Container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    Header: {
        width: '100%',
        height: 65,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    PlusButton: {
        width: 'auto',
        height: 'auto',
    },
    PlusButtonText: {
        fontSize: 26,
        color: theme.colors.blue,
    },
    Box: {
        width: '100%',
        height: 220,
        borderWidth: 1,
        padding: 20,
        paddingTop: 25,
        marginBottom: 15,
        borderColor: theme.colors.borderGray,
        borderRadius: 5,
    },
    BoxImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    TextBox: {
        marginVertical: 5,
    },
    BoldText: {
        fontWeight: theme.weight.bold,
        marginLeft: 20,
        marginRight: 10,
        fontSize: theme.size.sm,
    },
    InText: {
        fontSize: theme.size.sm,
    },
    Contents: {
        fontSize: theme.size.sm,
        marginTop: 15,
        marginBottom: 20,
        fontSize: theme.size.sm,
        fontWeight: theme.weight.normal,
    },
    BoxFooter: {
        width: '100%',
        height: 40,
        justifyContent: 'space-between',
    },
    ButtonTouch: {
        width: '100%',
    },
    Button: {
        fontSize: theme.size.sm,
        width: (screenWidth - 95) / 2,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    BlueButton: {
        backgroundColor: theme.colors.blue,
        color: theme.colors.white,
        borderWidth: 0,
    },
    WhiteButton: {
        backgroundColor: theme.colors.white,
        color: theme.colors.darkGray,
        borderColor: theme.colors.borderGray,
    },
});
