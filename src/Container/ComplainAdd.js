import React, {useEffect} from 'react';
import {useSetRecoilState} from 'recoil';

import AddComplain from '../Component/Complain/AddComplain';
import InquiryChange from '../State/Atom/InquiryChange';

export default function ComplainAdd({navigation}) {
    return <AddComplain navigation={navigation}></AddComplain>;
}
