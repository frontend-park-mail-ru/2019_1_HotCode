'use strict';

const staticFiles = [
    '/',
    '/main.js',
    '/style.css',
    '/index.html',
    '/favicon.ico',
    '/img/left-arrow.svg',
    '/img/full-screen.svg',
    '/img/Back.svg',
    '/img/close-icon.svg',
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open('app')
            .then( cache => {
                cache.addAll(staticFiles);
            })
    );
    console.log('install', event);
});

self.addEventListener('fetch', (event: any) => {

    console.log('activate', event);

});