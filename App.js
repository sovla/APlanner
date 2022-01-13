import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Container from './src/Route/Container';
import {RecoilRoot} from 'recoil';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Linking,
    Text,
    View,
    Share,
    Platform,
} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
    const [url, setUrl] = useState(null);
    const [processing, setProcessing] = useState(true);
    console.log(url, 'url');
    useMount(() => {
        const getUrlAsync = async () => {
            // Get the deep link used to open the app
            const initialUrl = await Linking.getInitialURL();

            // The setTimeout is just for testing purpose
            setTimeout(() => {
                setUrl(initialUrl);
                setProcessing(false);
            }, 10);
        };

        getUrlAsync();
    });
    return {url, processing};
};

export default function App() {
    const {url: initialUrl, processing} = useInitialURL();
    const [facilityNum, setFacilityNum] = useState();
    const [isRender, setIsRender] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        isLoading &&
            setTimeout(() => {
                setIsRender(true);
            }, 1500);
    }, [isLoading]);

    useEffect(() => {
        if (initialUrl) {
            setFacilityNum(decodeURIComponent(initialUrl?.toString())?.split('ft_idx=')[1]);
        }

        setTimeout(() => {
            SplashScreen.hide();
            setIsLoading(true);
        }, 1000);
    }, [processing]);

    useEffect(() => {
        
        Platform.OS==="android" && dynamicLinks_handle();
    }, []);

    const dynamicLinks_handle = async () => {
        setTimeout(() => {
            dynamicLinks().onLink(({url}) => {
                const data = decodeURIComponent(url?.toString())?.split('ft_idx=')[1];
                if (data) {
                    setFacilityNum(data);
                }
            });
        }, 500);
    };

    const urlEmptyAccess = () => {
        Alert.alert('오류', '시설 정보가 존재하지 않습니다.', [
            {
                text: 'ok',
                onPress: () => {
                    if (!facilityNum) BackHandler.exitApp();
                },
            },
        ]);
        // isRender && setTimeout(() => BackHandler.exitApp(), 1500);
    };

    if (Platform.OS === 'android') {
        return (
            isRender && (
                <RecoilRoot>
                    {!processing && facilityNum && <Container initialUrl={facilityNum} />}

                    {!processing && <View></View>}
                    {!facilityNum && urlEmptyAccess()}
                </RecoilRoot>
            )
        );
    } else {
        return (
            <RecoilRoot>
                <Container />
            </RecoilRoot>
        );
    }
}
