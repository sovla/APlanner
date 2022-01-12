import axios from 'axios';

export const API = axios.create({
    baseURL: 'https://dmonster1701.cafe24.com/api/',
    timeout: 10000,
    timeoutErrorMessage: '시간초과',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    processData: false,
    contentType: false,
    mimeType: 'multipart/form-data',
});
export const insertFormData = (value, key) => {
    const result = new FormData();
    for (const index in key) {
        if (key[index] !== undefined) {
            result.append(key[index], value[index]);
        }
    }

    return result;
};

export const LoginAPI = async (...args) => {
    let result;
    const formData = insertFormData(args, ['ct_dong', 'ct_hosu', 'ct_name', 'ct_hp', 'ft_idx']);
    await API.post('member_login.php', formData)
        .then(response => {
            result = response;
        })
        .catch(err => {
            console.log(err);
        });
    return result;
};
