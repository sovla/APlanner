import {atom} from 'recoil';

const ModalState = atom({
    key: 'ModalState',
    default: {
        isOpen: false,
        text: '',
        onPress: () => {},
        buttonContent: '',
    },
});

export default ModalState;
