import {atom} from 'recoil';

export const CheckDate = atom({
    key: 'CheckDate',
    default: {
        selectDate: '',
        selectTime: '',
    },
});
