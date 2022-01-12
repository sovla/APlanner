import {atom} from 'recoil';

const Inquiry = atom({
    key: 'Inquiry',
    default: {
        check: {
            idx: undefined,
            ct_idx: undefined,
            chk_wdate: undefined,
            chk_wtime: undefined,
            chk_status: undefined,
            chk_sdate: undefined,
            chk_idx: undefined,
        },
        move: {
            idx: undefined,
            ct_idx: undefined,
            mvt_wdate: undefined,
            mvt_wtime: undefined,
            mvt_sdate: undefined,
            mvt_status: undefined,
            mt_idx: undefined,
        },
        discomfort: [
            {
                idx: undefined,
                ct_idx: undefined,
                dt_name: undefined,
                dt_detail: undefined,
                dt_kind: undefined,
                dt_content: undefined,
                dt_wdate: undefined,
                dt_image1: undefined,
                dt_image2: undefined,
                dt_idx: undefined,
            },
        ],
    },
});

export default Inquiry;
