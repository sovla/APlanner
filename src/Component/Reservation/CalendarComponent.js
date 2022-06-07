import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View, Image, Text, Dimensions, ScrollView} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Center} from '../../assets/css/component.style';
import FooterButton from '../layout/FooterButton';
import {BackFn} from '../../utils/BackFunction';
import MainContainer from '../../Container/MainContainer';
import CalendarLocalConfig from '../../utils/CalendarLocalConfig';
import theme from '../../assets/css/theme';
import SelectReferenceText from '../Check/SelectReferenceText';
import {useRecoilValue} from 'recoil';
import {Facility} from '../../State/Atom/Facility';
import Inquiry from '../../State/Atom/Inquiry';
import LeftArrow from '../../assets/images/left.png';
import RightArrow from '../../assets/images/right.png';

const screenWidth = Dimensions.get('window').width;

export default function CalendarComponent({
    navigation,
    setCheckDate,
    STARTDATE,
    ENDDATE,
    onClickNext,
}) {
    const [markedDates, setMarkedDates] = useState({});
    const facility = useRecoilValue(Facility);
    const inquiry = useRecoilValue(Inquiry);
    useEffect(() => {
        InitDates();
    }, []);

    const getTimeJoneDay = item => {
        const Day = new Date(item);
        return parseInt(Day.getTime() / 1000 / 60 / 60 / 24);
    };

    const InitDates = () => {
        const DateList = GetDateRange(new Date(STARTDATE), new Date(ENDDATE));
        let obj = DateList.reduce(
            (c, v) =>
                Object.assign(c, {
                    [v]: {color: '#BAE7FF', textColor: 'black', height: 10},
                }),
            {},
        );

        for (const item in obj) {
            if (new Date(item).getDay() === 0) {
                obj[item].startingDay = true;
            } else if (new Date(item).getDay() === 6) {
                obj[item].endingDay = true;
            }
        }
        obj[STARTDATE].startingDay = true;
        obj[ENDDATE].endingDay = true;
        setMarkedDates(obj);
    };

    const changeDate = day => {
        const markedKey = Object.keys(markedDates);

        const result = markedKey.filter(item => item === day.dateString);
        if (result.length === 0) {
            // 행사 날짜 여부
            return Alert.alert('', '행사 날짜가 아닙니다.');
        }
        if (getTimeJoneDay(day.dateString) < getTimeJoneDay(new Date())) {
            // 전날 체크 여부
            return Alert.alert('', '이전 날은 선택 불가능합니다.');
        }
        if (facility.im_date?.length > 0) {
            // im_date 라고 불가능 가능 여부 를 지정 해주는 날짜
            for (const impossibleDate of facility.im_date) {
                if (
                    `20${impossibleDate}` === day.dateString &&
                    day.dateString !== inquiry?.check?.chk_wdate
                ) {
                    return Alert.alert('', '더이상 예약이 불가능한 날입니다.');
                }
            }
        }

        InitDates();
        setMarkedDates(prev => {
            const props = prev[day.dateString];
            const result = Object.assign(prev, {
                [day.dateString]: {
                    ...props,
                    selected: true,
                    textColor: 'white',
                },
            });

            return result;
        });

        if (!result) return null;

        setCheckDate({selectDate: day.dateString});
    };
    const currentDate = new Date() < new Date(STARTDATE) ? new Date(STARTDATE) : new Date();
    return (
        <>
            <MainContainer
                HeaderTitle="사전점검 방문예약"
                Notice="방문 날짜를 선택해 주세요"
                Back={BackFn(navigation)}>
                <ScrollView>
                    <View style={styles.Container}>
                        <Calendar
                            current={currentDate}
                            onDayPress={day => changeDate(day)}
                            markingType={'period'}
                            hideExtraDays={true}
                            markedDates={markedDates}
                            renderArrow={direction =>
                                direction === 'left' ? <LeftIcon /> : <RightIcon />
                            }
                            dayComponent={({date, state, marking}) => {
                                const RedDay = new Date(date.dateString).getDay() === 0;
                                const BlueDay = new Date(date.dateString).getDay() === 6;
                                let color;
                                if (marking?.selected) {
                                    color = 'white';
                                } else if (RedDay) {
                                    color = 'red';
                                } else if (BlueDay) {
                                    color = 'blue';
                                } else {
                                    color = 'black';
                                }
                                return (
                                    <View
                                        style={{
                                            height: 30,
                                            width: (screenWidth - 47) / 7,
                                            backgroundColor: marking?.color
                                                ? marking.color
                                                : 'white',
                                            borderTopLeftRadius: marking?.startingDay ? 100 : 0,
                                            borderBottomLeftRadius: marking?.startingDay ? 100 : 0,
                                            borderTopRightRadius: marking?.endingDay ? 100 : 0,
                                            borderBottomRightRadius: marking?.endingDay ? 100 : 0,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                backgroundColor: marking?.selected
                                                    ? '#0060EE'
                                                    : null,
                                                borderRadius: 1000,
                                                width: 30,
                                                height: 30,
                                                justifyContent: 'center',
                                            }}>
                                            <Text
                                                onPress={() => changeDate(date)}
                                                style={{
                                                    textAlignVertical: 'center',
                                                    textAlign: 'center',
                                                    color: color,
                                                    fontSize: 16,
                                                }}>
                                                {date.day}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            }}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#b6c1cd',
                                todayTextColor: 'black',
                                dayTextColor: '#2d4150',
                                arrowColor: theme.colors.black,
                                monthTextColor: 'black',
                                indicatorColor: 'blue',

                                textDayFontWeight: '300',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '300',
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 16,
                            }}></Calendar>

                        <View style={Center}>
                            <SelectReferenceText
                                leftColor={theme.colors.blue}
                                rightColor="#BAE7FF"
                                leftContent="선택날짜"
                                rightContent="행사날짜"
                                depscription={[]}
                            />
                        </View>
                    </View>
                </ScrollView>
                <FooterButton onPressButton={onClickNext} buttonContent="다음" />
            </MainContainer>
        </>
    );
}

const styles = StyleSheet.create({
    Container: {
        marginHorizontal: 20,
    },
});

const GetDateRange = (startDate, endDate) => {
    const dateMove = startDate;
    let strDate = startDate.toISOString().slice(0, 10);
    const listDate = [];

    if (startDate == endDate) {
        return strDate;
    } else {
        while (startDate <= endDate) {
            strDate = dateMove.toISOString().slice(0, 10);
            listDate.push(strDate);

            dateMove.setDate(dateMove.getDate() + 1);
        }

        return listDate;
    }
};

const LeftIcon = () => {
    return <Image source={LeftArrow} />;
};
const RightIcon = () => {
    return <Image source={RightArrow} />;
};
