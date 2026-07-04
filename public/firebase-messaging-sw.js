// public/firebase-messaging-sw.js
// Service workers cannot use ES modules or process.env — everything here
// must be plain JS with hardcoded values, loaded via importScripts.

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBHwUOXU9BJrk3H00Q3RBDsUGw20RpXEGc",
    authDomain: "pushnotification-adminchats.firebaseapp.com",
    projectId: "pushnotification-adminchats",
    storageBucket: "pushnotification-adminchats.firebasestorage.app",
    messagingSenderId: "819443902431",
    appId: "1:819443902431:web:7c06d2401deb1fa1ae866a",
    measurementId: "G-C15XPN1N2M"
});

const messaging = firebase.messaging();

// Handle background messages (app closed or tab not focused)
messaging.onBackgroundMessage((payload) => {
    console.log("Background message received:", payload);

    const notificationTitle = payload.notification?.title || "New Message";
    const notificationOptions = {
        body: payload.notification?.body || "You have a new message",
        icon: "/favicon.ico",
        data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to focus/open the app
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow("/");
        })
    );
});