import {atom} from 'recoil';

export const User = atom({
    key: 'User',
    default: {
        idx: undefined,
        ft_idx: undefined,
        ct_type: undefined,
        ct_dong: undefined,
        ct_hosu: undefined,
        ct_line: undefined,
        ct_name: undefined,
        ct_id: undefined,
        ct_hp: undefined,
        ct_wdate: undefined,
        ct_idx: undefined,
        ct_line: undefined,
    },
});
