import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';
import localforage from 'localforage';

export function fetchCacheRecent() {
    return new Promise((resolve, reject) => {
        localforage.getItem('recent')
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                console.log('Got some error: ', err);
                reject(err);
            })
    });
}

export function fetchRecent() {
    return new Promise((resolve, reject) => {
        getCredentials()
            .then((credentials) => {
                let route = backendUrl + "history";
                let body = {
                    userId: credentials.userId,
                    token: credentials.token,
                }
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
                        if (responseJson.code === 200) {
                            localforage.setItem('recent', responseJson);
                            resolve(responseJson);
                        } else {
                            reject(responseJson);
                        }
                    })
                    .catch((err) => {
                        console.log("Error: ", err);
                        reject(err);
                    })
            })
            .catch((err) => {
                reject("Please login and try again");
            })

    })
}


