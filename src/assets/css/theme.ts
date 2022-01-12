const font = {
    size: {
        xxs: 12,
        xs: 14,
        sm: 16,
        base: 18,
    },
    family: {
        base: 'Noto Sans CJK KR, Regular',
    },
    weight: {
        normal: '400',
        smBold: '600',
        bold: '700',
        lgBold: 'bold',
    },
    lineHeight: {
        sm: 20,
        lg: 25,
    },
};
const color = {
    blue: '#0060EE',
    sky: '#BAE7FF',
    gray: '#F4F6F9',
    textGray: '#AAAAAA',
    whiteGray: '#8F97A2',
    darkGray: '#717272',
    borderGray: '#E0E4EB',
    borderWhiteGray: '#DDE2EB',
    borderContentGray: '#E2E2E2',
    black: '#222222',
    white: '#FFFFFF',
    dim: 'rgba(0,0,0,0.7)',
};
const theme = {
    ...font,
    colors: {
        ...color,
    },
};

export default theme;
