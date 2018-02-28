import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';
import localforage from 'localforage';

export function fetchCacheFavorites() {
    return new Promise((resolve, reject) => {
        localforage.getItem('favorites')
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.log('Got some error: ', err);
                reject(err);
            })
    });
}
export function fetchFavorites() {
    return new Promise((resolve, reject) => {
        getCredentials()
            .then(credentials => {
                // console.log("GetCredentials: ", credentials);
                let route = backendUrl + "favorites";
                let body = credentials
                let options = {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                }
                fetch(route, options)
                    .then((result) => result.json())
                    .then((responseJson) => {
                        // console.log("Got response as : ", responseJson);
                        if (responseJson.code === 200) {
                            localforage.setItem('favorites', responseJson);
                            resolve(responseJson)
                        } else {
                            reject();
                        }
                    })
                    .catch((err) => {
                        console.log("Error: ", err);
                    })
            })

    });
}