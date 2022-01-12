import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {MainButton} from '../assets/css/component.style';
import theme from '../assets/css/theme';
import FooterButton from '../Component/layout/FooterButton';
import ChangeFacility from '../State/Atom/ChangeFacility';
import {CheckDate} from '../State/Atom/CheckDate';
import {Facility} from '../State/Atom/Facility';
import {BackFn} from '../utils/BackFunction';
import MainContainer from './MainContainer';

export default function Check({navigation}) {
    const setChangeFacility = useSetRecoilState(ChangeFacility);
    const facility = useRecoilValue(Facility);
    const setCheckDate = useSetRecoilState(CheckDate);
    useEffect(() => {
        setChangeFacility(true);
        setCheckDate({
            selectDate: '',
            selectTime: '',
        });
    }, []);
    console.log(facility);
    return (
        <>
            <MainContainer
                HeaderTitle="사전점검 방문예약"
                Notice="예약기간이 지나면 예약이 불가능 합니다"
                Back={BackFn(navigation)}>
                <View style={styles.Container}>
                    <Text style={[MainButton, styles.MainText]}>{facility?.ft_name}</Text>
                    <TermComponent
                        title="예약기간"
                        startDate={facility.ft_check_sdate}
                        endDate={facility.ft_check_edate}
                    />

                    <TermComponent
                        title="행사기간"
                        startDate={facility.ft_event_sdate}
                        endDate={facility.ft_event_edate}
                    />
                </View>
                <Text style={styles.SubLastText}>{facility.ft_check_guide}</Text>
                <FooterButton
                buttonContent="다음"
                onPressButton={() => navigation.navigate('CheckCalender')}></FooterButton>
            </MainContainer>

       
        </>
    );
}

const TermComponent = ({title, startDate, endDate}) => {
    const DateToText = args => {
        return args.replace('-', '년').replace('-', '월') + '일';
    };
    const startText = DateToText(startDate);
    const endText = DateToText(endDate);
    return (
        <View style={styles.TermContainer}>
            <View style={styles.RowContainer}>
                <View style={styles.MiddleDot}></View>
                <Text style={styles.TermTitleText}>{title}</Text>
                <View style={styles.MiddleDot}></View>
            </View>
            <Text style={styles.TermDateText}>
                {startText}&nbsp;&nbsp;~&nbsp;&nbsp;{endText}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        flex: 1,
    },

    MainText: {
        marginTop: 30,
        marginBottom: 30,
    },

    SubLastText: {
        marginBottom: 30,
        fontSize: theme.size.xs,
        color: theme.colors.whiteGray,
        textAlign: 'center',
    },
    RowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TermContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    MiddleDot: {
        borderWidth: 4,
        borderRadius: 100,
        width: 5,
        height: 5,
        marginHorizontal: 10,
        fontSize: theme.size.sm,
        borderColor: theme.colors.blue,
    },
    TermTitleText: {
        fontWeight: theme.weight.bold,
        fontSize: theme.size.sm,
    },
    TermDateText: {
        marginTop: 5,
        fontSize: theme.size.sm,
        fontWeight: theme.weight.normal,
    },
});
