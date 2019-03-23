'use strict';

import '../style/index.scss';
import ViewService from './services/view-service';

ViewService.start();
ViewService.goTo(window.location.pathname);