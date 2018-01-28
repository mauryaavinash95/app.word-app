import localforage from 'localforage'

export function getCredentials() {
    return new Promise((resolve, reject) => {
        localforage.getItem("credentials")
            .then((credentials) => {
                if (credentials) {
                    // console.log("Credentials: ", credentials);
                    resolve(credentials);
                } else {
                    // console.log("No credentials found");
                    reject();
                }
            })
            .catch((err) => {
                console.log("Err: ", err);
                reject("Error found");
            })
    })
}

export function setCredentials(credentials) {
    return new Promise((resolve, reject) => {
        localforage.setItem("credentials", credentials)
            .then((credentials) => {
                resolve();
            })
            .catch((err) => {
                console.log("Err: ", err);
                reject("Error found");
            })
    })
}
