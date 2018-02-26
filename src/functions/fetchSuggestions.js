import { backendUrl } from '../config/config';

export function fetchSuggestions(value) {
    return new Promise((resolve, reject) => {
        let route = backendUrl + "suggest/" + value;
        fetch(route)
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log("Got response as: ", responseJson);
                resolve(responseJson.message);
            })
            .catch((err) => {
                console.log("Got error while fetching suggestions: ", err);
                reject(err);
            })
    })

}
