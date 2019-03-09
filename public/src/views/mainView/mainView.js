'use strict';

import Component from "../../components/baseComponent";

const mainTmpl = require('./mainView.pug');

class MainView {
    constructor() {
        this.parent = new Component(document.querySelector('div.container'));
    }

    render() {
        this.parent.el.innerHTML = mainTmpl();
    }
}

export default MainView;