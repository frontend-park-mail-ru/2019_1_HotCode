'use strict';

import '../style/bem/style.scss';
import ViewService from './services/view-service';

// if (navigator.serviceWorker) {
//     navigator.serviceWorker.register(
//         'worker.js',
//         {scope: '/'},
//     ).then((registration) => {
//
//         console.log('ServiceWorker registration', registration);
//
//     }).catch((err) => {
//
//         console.log('ServiceWorker error: ' + err);
//     });
// }

const str = "/game/pong";
const param = "?limit=2&offset=1";

console.log( str.match( /^\/game\/([\d\w-_]+)$/i ) );
const reg = str.match( /^\/game\/([\d\w-_]+)$/i );
console.log(reg[1]);
console.log( param.match( /offset=([\d]+)/i ) );
console.log( param.match( /limit=([\d]+)/i ) );
// console.log( str.match( /\/game\//i ) );
console.log(window.location.pathname);


ViewService.start();
ViewService.goTo(window.location.pathname);