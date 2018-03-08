importScripts('static/js/localforage.js');

const CACHE_VERSION = "v1.1";
const CACHE_STATIC_NAME = "static-" + CACHE_VERSION;
const CACHE_DYNAMIC_NAME = "dynamic-" + CACHE_VERSION;
const STATIC_FILES = [
    "/",
    "/index.html",
    "/static/css/main.6de6320f.css",
    "/static/css/main.6de6320f.css.map",
    "/statc/js/main.af1c505c.js",
    "/statc/js/main.af1c505c.js.map",
    "/static/js/localforage.js",
    "/favicon.ico",
]

const DYNAMIC_FILES = [
    "/home",
    "/recent",
    "/favorites"
]

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then((cache) => {
                console.log("[Service Worker] Precaching App Shell: " + CACHE_VERSION);
                cache.addAll(STATIC_FILES);
            })
    )
});

self.addEventListener('fetch', function (event) {
    if (isInArray(event.request.url, STATIC_FILES)) {
        event.respondWith(
            caches.match(event.request)
        )
    } else if (event.request.url.indexOf("/find") > -1) {
        event.respondWith(find(event));
    } else if (event.request.url.indexOf('/service-worker.js') > -1) {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then((res) => {
                                return caches.open(CACHE_DYNAMIC_NAME)
                                    .then((cache) => {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch((err) => {
                                console.log("In error: ", err);
                                return caches.open(CACHE_STATIC_NAME)
                                    .then((cache) => {
                                        return cache.match("/404.html");
                                    })
                            })
                    }
                })
        );
    }
});


function find(clonedEvent) {
    let c = clonedEvent.request.clone();
    return new Promise((resolve, reject) => {
        c.json().then((requestBody) => {
            let wordToFind = requestBody.word;
            localforage.getItem(wordToFind)
                .then((result) => {
                    if (result) {
                        resolve(new Response(JSON.stringify(result)));
                    } else {
                        fetch(clonedEvent.request)
                            .then(response => response.json())
                            .then((responseJson) => {
                                resolve(new Response(JSON.stringify(responseJson)));
                                localforage.setItem(wordToFind, responseJson);
                            })
                    }
                })
        })
    })
}



function isInArray(str, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
            return true;
        }
    } return false;
}


self.addEventListener('notificationclick', function (event) {
    var notification = event.notification;
    var action = event.action;
    console.log(notification);
    if (action === 'confirm') {
        event.waitUntil(
            clients.matchAll()
                .then(function (clis) {
                    var client = clis.find(function (c) {
                        return c.visibilityState === 'visible';
                    });

                    if (client !== undefined) {
                        // client.navigate(notification.data.url);
                        client.focus();
                    } else {
                        clients.openWindow(notification.data.url);
                    }
                    notification.close();
                })
        );
    } else {
        console.log(action);
        notification.close();
    }
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification was closed', event);
});

self.addEventListener('push', function (event) {
    console.log('Push Notification received', event);
    var data = { title: "Word-App", content: 'Meaning found', openUrl: "/" };
    if (event.data) {
        data = JSON.parse(event.data.text());
    }

    let options = {
        body: data.content,
        icon: '/icons/app-logo-128x128.png',
        dir: "rtl",
        lang: 'en-US',
        vibrate: [100, 50, 200],
        badge: '/icons/app-logo-128x128.png',
        tag: data.title,
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
            url: data.openUrl
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});