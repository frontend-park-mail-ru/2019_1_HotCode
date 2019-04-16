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


ViewService.start();
ViewService.goTo(window.location.pathname);