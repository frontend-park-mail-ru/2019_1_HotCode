'use strict';

import Component from '../../baseComponent/index';
import AvatarService from '../../../services/avatar-service';
import ViewService from '../../../services/view-service';

class Row2 extends Component{

    private positionComponent: Component;
    private usernameComponent: Component;
    private verifyComponent: Component;
    private scoreComponent: Component;

    private idField: number;
    private positionField: number;
    private game: string;
    private isVerify: boolean;
    private scoreField: number;

    private static template = require('./row2.pug');

    constructor(
        el: HTMLElement,
        position: number,
        id: number,
        game: string,
        isVerify: boolean,
        score: number,
    ) {
        super(el);

        this.positionField = position;
        this.idField = id;
        this.game = game;
        this.isVerify = isVerify;
        this.scoreField = score;

        this.render();
    }

    get id(): number {
        return this.idField;
    }

    get score(): number {
        return this.scoreField;
    }

    set score(value: number) {
        this.scoreField = value;
        this.scoreComponent.setText(value.toString());
    }

    get position(): number {
        return this.positionField;
    }

    set position(value: number) {
        this.positionField = value;
        this.positionComponent.setText(value.toString());
    }

    public static CreateRow(
        position: number,
        id: number,
        game: string,
        isverify: boolean,
        score: number,
    ): Row2 {

        const newRow = Component.Create(
            'div',
            ['match', 'match_theme_content', 'match_theme_row2'],
        );


        newRow.el.setAttribute('data-id', id.toString());

        newRow.el.innerHTML = Row2.template({position, id, score, game});

        return new Row2(newRow.el, position, id, game, isverify, score);
    }


    public render(): void {


        this.usernameComponent = new Component(
            this.el.querySelector('.match__item__username')
        );

        this.scoreComponent = new Component(
            this.el.querySelector('.match__item_theme_score')
        );

        this.positionComponent = new Component(
            this.el.querySelector('.match__item_theme_position')
        );

        this.verifyComponent = new Component(
            this.el.querySelector('.match__item_theme_verify')
        );

        if (this.isVerify) {

            this.verifyComponent.setText('Yes');
            this.verifyComponent.addClass('match__item_theme_win');

        } else {

            this.verifyComponent.setText('No');
            this.verifyComponent.addClass('match__item_theme_los');

        }
    }
}

export default Row2;