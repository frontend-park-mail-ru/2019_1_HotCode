'use strict';

import Component from '../baseComponent/index';
import AvatarService from '../../services/avatar-service';
import ViewService from '../../services/view-service';
import EventBus from '../../modules/event-bus';
import {events} from '../../modules/utils/events';

class MatchShort extends Component{

    private static template = require('./matchShort.pug');

    private username1Component: Component;
    private avatar1Component: Component;
    private username2Component: Component;
    private avatar2Component: Component;
    private diff1Component: Component;
    private diff2Component: Component;

    private id: number;
    private game_slug: string;
    private userID1: string;
    private username1: string;
    private uuid1: string;
    private bot1: number;
    private userID2: string;
    private username2: string;
    private uuid2: string;
    private bot2: number;
    private result: number;
    private diff1: number;
    private diff2: number;

    constructor(
            el: HTMLElement,
            id: number,
            game_slug: string,
            userID1: string,
            username1: string,
            uuid1: string,
            bot1: number,
            userID2: string,
            username2: string,
            uuid2: string,
            bot2: number,
            result: number,
            diff1: number,
            diff2: number,
        ) {
        super(el);

        this.id = id;
        this.game_slug = game_slug;
        this.userID1 = userID1;
        this.username1 = username1;
        this.uuid1 = uuid1;
        this.bot1 = bot1;
        this.userID2 = userID2;
        this.username2 = username2;
        this.uuid2 = uuid2;
        this.bot2 = bot2;
        this.result = result;
        this.diff1 = diff1;
        this.diff2 = diff2;

        this.render();
    }

    public static CreateMatch(
        id: number,
        game_slug: string,
        author1: {[key: string]: string},
        bot1: number,
        author2: {[key: string]: string},
        bot2: number,
        result: number,
        diff1: number,
        diff2: number,
        withAnim = false,
    ): MatchShort {

        const newMatch = Component.Create(
            'div',
            ['match', 'match_theme_content', 'pointer'],
        );

        if (withAnim) {
            newMatch.addClass('match_theme_anim');
        }

        newMatch.el.setAttribute('data-id', id.toString());

        const userId1 = author1 ? author1.id : '';
        const username1 = author1 ? author1.username : '';
        const photo_uuid1 = author1 ? author1.photo_uuid : '';
        const userId2 = author2 ? author2.id : '';
        const username2 = author2 ? author2.username : 'Verification';
        const photo_uuid2 = author2 ? author2.photo_uuid : '';

        newMatch.el.innerHTML = MatchShort.template();

        return new MatchShort(
            newMatch.el,
            id,
            game_slug,
            userId1,
            username1,
            photo_uuid1,
            bot1,
            userId2,
            username2,
            photo_uuid2,
            bot2,
            result,
            diff1,
            diff2,
        );
    }

    public render(): void {

        this.on('click', (e) => {

            EventBus.publish(events.onClickOnNotTab, true);
            ViewService.goToGameMatchView(
                this.game_slug,
                this.id.toString(),
            );
        });

        this.avatar1Component = new Component(
            this.el.querySelector('.match__item_theme_1 > .match__item__avatar > img')
        );

        if (this.uuid1) {

            AvatarService.getAvatar(this.uuid1)
                .then((img) => {
                    (this.avatar1Component.el as HTMLImageElement).src = URL.createObjectURL(img);
                    this.avatar1Component.show();
                });
        }

        this.avatar2Component = new Component(
            this.el.querySelector('.match__item_theme_2 > .match__item__avatar > img')
        );

        if (this.uuid2) {

            AvatarService.getAvatar(this.uuid2)
                .then((img) => {
                    (this.avatar2Component.el as HTMLImageElement).src = URL.createObjectURL(img);
                    this.avatar2Component.show();
                });
        }

        this.username1Component = new Component(
            this.el.querySelector('.match__item_theme_1 > .match__item__username')
        );

        this.username1Component.setText(this.username1 + (this.bot1 ? ` (${this.bot1})`: ''));

        this.username2Component = new Component(
            this.el.querySelector('.match__item_theme_2 > .match__item__username')
        );

        this.username2Component.setText(this.username2 + (this.bot2 ? ` (${this.bot2})`: ''));


        if (this.userID1) {

            this.avatar1Component.addClass('pointer');

            this.avatar1Component.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserMatchesView(`id${this.userID1}`);
            });

            this.username1Component.addClass('pointer');
            this.username1Component.addClass('link');

            this.username1Component.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserMatchesView(`id${this.userID1}`);
            });
        }

        if (this.userID2) {

            this.avatar2Component.addClass('pointer');

            this.avatar2Component.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserMatchesView(`id${this.userID2}`);
            });

            this.username2Component.addClass('pointer');
            this.username2Component.addClass('link');

            this.username2Component.on('click', (e) => {

                e.preventDefault();
                e.stopPropagation();
                ViewService.goToUserMatchesView(`id${this.userID2}`);
            });
        }

        this.diff1Component = new Component(
            this.el.querySelector('.match__item_theme_diff-1')
        );

        this.diff2Component = new Component(
            this.el.querySelector('.match__item_theme_diff-2')
        );

        this.diff1Component.setText(this.diff1 < 0 ? `- ${Math.abs(this.diff1)}` : `+ ${this.diff1}`);

        this.diff2Component.setText(this.diff2 < 0 ? `- ${Math.abs(this.diff2)}` : `+ ${this.diff2}`);

        if (this.result === 1) {

            this.username1Component.addClass('match__item_theme_win');
            this.username2Component.addClass('match__item_theme_los');

            this.diff1Component.addClass('match__item_theme_win');
            this.diff2Component.addClass('match__item_theme_los');

        } else if (this.result === 2) {

            this.username1Component.addClass('match__item_theme_los');
            this.username2Component.addClass('match__item_theme_win');

            this.diff1Component.addClass('match__item_theme_los');
            this.diff2Component.addClass('match__item_theme_win');
        }
    }
}

export default MatchShort;