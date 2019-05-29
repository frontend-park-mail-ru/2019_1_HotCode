'use strict';

import Component from '../../baseComponent/index';
import AvatarService from '../../../services/avatar-service';
import ViewService from '../../../services/view-service';

class Row extends Component{

    private positionComponent: Component;
    private usernameComponent: Component;
    private avatarComponent: Component;
    private scoreComponent: Component;

    private idField: number;
    private positionField: number;
    private userID: string;
    private username: string;
    private uuid: string;
    private scoreField: number;

    private static template = require('./row.pug');

    constructor(
        el: HTMLElement,
        position: number,
        id: number,
        userID: string,
        username: string,
        uuid: string,
        score: number,
    ) {
        super(el);

        this.positionField = position;
        this.idField = id;
        this.userID = userID;
        this.username = username;
        this.uuid = uuid;
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
        author: {[key: string]: any},
        score: number,
    ): Row {

        const newRow = Component.Create(
            'div',
            ['match', 'match_theme_content', 'match_theme_row'],
        );

        const userID = author ? author.id : '';
        const username = author ? author.username : '';
        const photo_uuid = author ? author.photo_uuid : '';

        newRow.el.setAttribute('data-id', id.toString());

        newRow.el.innerHTML = Row.template({position, id, username, score});

        return new Row(newRow.el, position, id, userID, username, photo_uuid, score);
    }


    public render(): void {

        this.avatarComponent = new Component(
            this.el.querySelector('.match__item_theme_1 > .match__item__avatar > img')
        );

        if (this.uuid) {

            AvatarService.getAvatar(this.uuid)
                .then((img) => {
                    (this.avatarComponent.el as HTMLImageElement).src = URL.createObjectURL(img);
                    this.avatarComponent.show();
                });
        }

        this.usernameComponent = new Component(
            this.el.querySelector('.match__item__username')
        );

        if (this.userID) {

            this.avatarComponent.addClass('pointer');

            this.avatarComponent.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserBotsView(`id${this.userID}`);
            });

            this.usernameComponent.addClass('pointer');
            this.usernameComponent.addClass('link');

            this.usernameComponent.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserBotsView(`id${this.userID}`);
            });
        }

        this.scoreComponent = new Component(
            this.el.querySelector('.match__item_theme_score')
        );

        this.positionComponent = new Component(
            this.el.querySelector('.match__item_theme_position')
        );
    }
}

export default Row;