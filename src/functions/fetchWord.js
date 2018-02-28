import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';

export function fetchWord(word, flag = 1) {
    return new Promise((resolve, reject) => {
        getCredentials()
            .then((credentials) => {
                let route = backendUrl + "find";
                let body = {
                    userId: credentials.userId,
                    token: credentials.token,
                    word: word,
                    save: flag
                }
                let options = {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                }
                fetch(route, options)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve(responseJson);
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


