import {selector} from 'recoil';
import {User} from '../Atom/User';

const Address = selector({
    key: 'Address',
    get: ({get}) => {
        const user = get(User);
        const result = `${user.ct_dong}동 ${user.ct_hosu}호(${user.ct_type})`;

        return result;
    },
});

export default Address;
