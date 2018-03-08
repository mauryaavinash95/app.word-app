import { backendUrl } from '../config/config';
import { getCredentials } from './credentials';

// Checking out Push notification part
export function notification() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        // console.log("There is notification object present in the window. Asking for permissions");
        Notification.requestPermission((result) => {
            if (result !== "granted") {
                console.log("Notification Choice not granted");
            } else {
                // displayNotification();
                configurePushSub();
            }
        })
    }
}

function configurePushSub() {
    var reg;
    navigator.serviceWorker.ready
        .then((swreg) => {
            reg = swreg;
            return swreg.pushManager.getSubscription()
        })
        .then((subscription) => {
            if (subscription === null) {
                // Create new subscription
                console.log("Configuring new subscription");
                let vapidPublicKey = "BKaMb5qfFGSWSKl0DPVXn5pN6xVTgzfK8qiX9Q1WvZxQtwtgHRcCxADPNtvlvtrmTdojoIItbydTn689kvf_vtk";
                let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                return reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPublicKey
                })
            } else {
                console.log("Push Registration already stored");
                return null;
            }
        })
        .then((newsubscription) => {
            // console.log("In then call of newSubscription: ", newsubscription);
            // if (newsubscription)
            return sendNewSubscription(newsubscription);
        })
        .then((res) => {
            if (res && res.ok) {
                displayNotification()
            }
        })
        .catch((err) => {
            console.log("Got error: ", err);
        })
}

function displayNotification() {
    console.log("In display notification function");
    if ('serviceWorker' in navigator) {
        var options = {
            body: "Registration successful",
            icon: '/icons/app-logo-128x128.png',
            dir: "rtl",
            lang: 'en-US',
            vibrate: [100, 50, 200],
            badge: '/icons/app-logo-128x128.png',
            tag: "Some-unique-confirmation-tag",
            renotify: true,
            actions: [
                {
                    action: 'confirm',
                    title: 'Got it',
                    icon: '/icons/app-logo-128x128.png'
                },
                {
                    action: 'cancel',
                    title: 'Cancel',
                    icon: '/icons/app-logo-128x128.png'
                }
            ],
            data: {
                url: "/"
            }
        }

        navigator.serviceWorker.ready
            .then((swreg) => {
                swreg.showNotification("Successfully subscribed", options);
            })
    }
}


function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function sendNewSubscription(newsubscription) {
    return new Promise((resolve, reject) => {
        if (newsubscription) {
            getCredentials()
                .then((credentials) => {
                    let route = backendUrl + "newsubscription";
                    let body = {
                        userId: credentials.userId,
                        token: credentials.token,
                        subscriptiondata: newsubscription
                    }
                    let options = {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: new Headers({
                            'Content-Type': 'application/json',
                            "Accept": "application/json",
                        }),
                    };
                    return fetch(route, options)
                })
                .then((response) => {
                    console.log("Response recieved is: ", response);
                    resolve(response);
                })
                .catch((err) => {
                    console.log("Got error: ", err);
                    reject(err);
                })
        } else {
            reject("No subscription details found");
        }
    })

}