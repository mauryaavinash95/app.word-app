import createHistory from "history/createBrowserHistory"

export default createHistory({
    basename: "/", // The base URL of the app (see below)
    // forceRefresh: true, // Set true to force full page refreshes
})

// export default createBrowserHistory();

