import localforage from 'localforage';

export function logout() {
    return new Promise((resolve, reject) => {
        localforage.clear()
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    })
}