import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';

export function setSave(word, isSaved) {
    // console.log("In setSave function: ", word, isSaved);
    return new Promise((resolve, reject) => {
        getCredentials()
            .then((credentials) => {
                let route = backendUrl + "save";
                let body = {
                    userId: credentials.userId,
                    token: credentials.token,
                    word,
                    isSaved
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
                        // console.log("Response from save route recieved");
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