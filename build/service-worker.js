importScripts('static/js/localforage.js');

const CACHE_VERSION = "v1.1";
const CACHE_STATIC_NAME = "static-" + CACHE_VERSION;
const CACHE_DYNAMIC_NAME = "dynamic-" + CACHE_VERSION;
const STATIC_FILES = [
    "/",
    "/index.html",
    "/static/css/main.6de6320f.css",
    "/static/css/main.6de6320f.css.map",
    "/statc/js/main.8d71f33b.js",
    "/statc/js/main.8d71f33b.js.map",
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
                                        return cache.match("/offline.html");
                                    })
                            })
                    }
                })
        );
    }
});


function find(clonedEvent) {
    cacheBackend();
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

function cacheBackend() {
    // event.waitUntil(
    //     caches.open(CACHE_STATIC_NAME)
    //         .then((cache) => {
    //             console.log("[Service Worker] Caching Dynamic Recent, Home and Favorite APIS: " + CACHE_VERSION);
    //             cache.addAll(DYNAMIC_FILES);
    //         })
    // )
}


function isInArray(str, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
            return true;
        }
    } return false;
}