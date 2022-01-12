import {atom, selector} from 'recoil';
import Complains from '../Atom/Complains';

export const ComplainIndex = atom({key: 'ComplainIndex', default: undefined});

export const ComplainSelector = selector({
    key: 'ComplainSelector',
    get: ({get}) => {
        const ComplainList = get(Complains);
        const Index = get(ComplainIndex);
        return ComplainList[Index];
    },
});
