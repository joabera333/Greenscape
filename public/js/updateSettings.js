// axios is loaded globally via CDN in base.pug
import { showAlert } from './alerts.js';

// type is either 'data' or 'password'
export const updateSettings = async (data, type) => {
    try {
        // use relative paths so browser stays on same origin (127.0.0.1 vs localhost)
        const url =
            type === 'password'
                ? '/api/v1/users/updateMyPassword'
                : '/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                `${type === 'password' ? 'Password' : 'Data'} updated successfully!`
            );

            // if user updated profile data and changed the photo, reflect it in the UI
            if (type === 'data' && res.data.data.user.photo) {
                const newPhoto = `/img/users/${res.data.data.user.photo}?t=${Date.now()}`;
                const userImg = document.querySelector('.nav__user-img');
                const formImg = document.querySelector('.form__user-photo');
                if (userImg) userImg.src = newPhoto;
                if (formImg) formImg.src = newPhoto;
            }
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
