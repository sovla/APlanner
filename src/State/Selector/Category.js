import {DefaultValue, selector} from 'recoil';
import {Facility} from '../Atom/Facility';

export const Category = selector({
    key: 'Category',
    get: ({get}) => {
        const facility = get(Facility);
        const result = facility.category.map(item => {
            const inResult = {
                cgt_name: item.cgt_name,
                cgt_parentIdx: item.cgt_parentIdx,
                idx: item.idx,
                cgt_depth: item.cgt_depth,
            };
            return inResult;
        });
        return result;
    },
});

export const RoomName = selector({
    key: 'RoomName',
    get: ({get}) => {
        const facility = get(Facility);
        const result = facility.room_name.map(item => {
            const inResult = {
                rnt_name: item?.rnt_name,
                idx: item?.idx,
                rnt_depth: item?.rnt_depth,
                rnt_parentidx: item?.rnt_parentidx,
            };
            return inResult;
        });
        return result;
    },
});
