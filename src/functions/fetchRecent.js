import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';

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


