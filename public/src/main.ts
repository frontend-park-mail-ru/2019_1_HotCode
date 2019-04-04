'use strict';

import '../style/bem/style.scss';
import ViewService from './services/view-service';

ViewService.start();
ViewService.goTo(window.location.pathname);