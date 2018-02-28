importScripts('static/js/localforage.js');

const CACHE_VERSION = "v1.1";
const CACHE_STATIC_NAME = "static-" + CACHE_VERSION;
const CACHE_DYNAMIC_NAME = "dynamic-" + CACHE_VERSION;
const STATIC_FILES = [
    "/",
    "/index.html",
    "/static/css/main.6de6320f.css",
    "/static/css/main.6de6320f.css.map",
    "/statc/js/main.c742b5f6.js",
    "/statc/js/main.c742b5f6.js.map",
    "/favicon.ico",
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
    console.log("In fetch of service worker");
    if (isInArray(event.request.url, STATIC_FILES)) {
        console.log("Serving static file");
        event.respondWith(
            caches.match(event.request)
        )
    } else if (event.request.url.indexOf("/find") > -1) {
        event.respondWith(find(event));
    } else {
        console.log("In else condition: ", event.request.url);
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then((res) => {
                                console.log("In last else fetch: ", event.request.url);
                                return caches.open(CACHE_DYNAMIC_NAME)
                                    .then((cache) => {
                                        // console.log("Putting into dynamic cache: ", event.request.url);
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
    let c = clonedEvent.request.clone();
    // let req = new Request(clonedEvent.request);
    // let req1 = new Request(req);
    // let req2 = new Request(c);

    console.log("C is: ", c);
    // console.log("Copied req is: ", req);
    // console.log("Copied req1 is: ", req1);
    // console.log("Copied req2 is: ", req2);

    // console.log("Copied clonedReq is: ", clonedReq);
    return new Promise((resolve, reject) => {
        c.json().then((requestBody) => {
            let wordToFind = requestBody.word;
            console.log("Word to find is: ", wordToFind);
            localforage.getItem(wordToFind)
                .then((result) => {
                    console.log("Localforage gave back: ", result);
                    if (result) {
                        console.log("Got result: ", result);
                        resolve(new Response(result));
                        // event.respondWith(result);
                    } else {
                        console.log("Not got result")
                        fetch(clonedEvent.request)
                            .then((response) => {
                                response.json()
                                    .then((responseJson) => {
                                        resolve(responseJson);
                                        localforage.setItem(wordToFind, responseJson);
                                    })
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