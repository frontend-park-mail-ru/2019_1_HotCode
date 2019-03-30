'use strict';

import Component from "../../../components/baseComponent/index";
import Page from '../page';
import ViewService from '../../../services/view-service';

class StartPage extends Page {

    private static template = require('./startPage.pug');

    constructor(parent: Component) {
        super(parent, 'Welcome - WarScript');
    }

    public render(): void {
        super.render();
        this.renderTmpl(StartPage.template);

        document.addEventListener('click', this.clickCallback);
        document.addEventListener('keydown', this.clickCallback);
    }

    public clear(): void {
        this.parent.el.innerHTML = '';
        document.removeEventListener('click', this.clickCallback);
        document.removeEventListener('keydown', this.clickCallback);
        console.log('start CLEAR');
    }

    private clickCallback = () => {
        ViewService.goToMainView();
    }
}

export default StartPage;