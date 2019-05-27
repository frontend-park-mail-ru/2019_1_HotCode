'use strict';

import '../style/bem/style.scss';
import ViewService from './services/view-service';
import ChatBlock from './components/chatBlock/chatBlock';

if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {

                console.log('ServiceWorker registration', registration);

            }).catch((err) => {

                console.log('ServiceWorker error: ' + err);

            });
    });
}

ViewService.start();
ViewService.goTo(window.location.pathname);