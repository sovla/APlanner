import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';

import AddComplain from '../Component/Complain/AddComplain';

export default function Complain({navigation}) {
    return <AddComplain navigation={navigation}></AddComplain>;
}
