'use strict';

import Component from "../../../components/baseComponent/index";
import Tabbar from "../../../components/tabbar/tabbar";
import User from "../../../models/user";
import AnotherUser from "../../../models/anotherUser";
import Layer from '../layer';
import ViewService from '../../../services/view-service';
import EventBus from '../../../modules/event-bus';
import {events} from '../../../modules/utils/events';
import AvatarService from '../../../services/avatar-service';
import Checkbox from '../../../components/checkbox/checkbox';
import Button from '../../../components/button/button';
import Modal from '../../../components/modal/modal';
import PhotoLoader from '../../../components/photoLoader/photoLoader';
import UserService from '../../../services/user-service';

class ProfileMenuLayer extends Layer {

    private static template = require('./profileMenuLayer.pug');

    private optionsTabbar: Tabbar;
    private navMenuButton: Checkbox;
    private backButton: Button;

    private chooseAvatarButton: Checkbox;
    private chooseAvatarModal: Modal;
    private avatarLoader: PhotoLoader;

    private isMe: boolean;
    private idOfAnotherUser: string;

    private onUsernameChange: {[key: string]: () => void};
    private onAvatarChange: {[key: string]: () => void};
    private onUserIDChange: {[key: string]: () => void};
    private hideMenu: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent);
    }

    public render(param: string[]): void {

        this.renderTmpl(ProfileMenuLayer.template);

        const navMenu = new Component(this.parent.el.querySelector('.container_theme_game-menu'));
        const logoPanel = new Component(this.parent.el.querySelector('.menu__item_theme_logo'));
        const titlePanel = new Component(this.parent.el.querySelector('.menu__item_theme_title'));
        const optionsPanel = new Component(this.parent.el.querySelector('.menu__item_theme_options'));
        const backPanel = new Component(this.parent.el.querySelector('.menu__item_theme_back'));
        const menuAnimHide = new Component(this.parent.el.querySelector('#menuHide'));
        const menuAnimShow = new Component(this.parent.el.querySelector('#menuShow'));
        const footer = new Component(document.querySelector('.footer'));
        const header = new Component(document.querySelector('.header'));

        this.navMenuButton = new Checkbox(this.parent.el.querySelector('#menuNavBar'),
            () => {

                logoPanel.el.style.transform = 'translateX(0)';
                titlePanel.el.style.transform = 'translateX(0)';
                optionsPanel.el.style.transform = 'translateX(0)';
                backPanel.el.style.transform = 'translateX(0)';

                navMenu.el.style.pointerEvents = 'none';

                logoPanel.el.style.animation = 'hideMenu 1.2s ease 0.6s forwards';
                titlePanel.el.style.animation = 'hideMenu 1.1s ease 0.3s forwards';
                optionsPanel.el.style.animation = 'hideMenu 1s ease forwards';
                backPanel.el.style.animation = 'hideMenu 1.1s ease 0.3s forwards';

                header.el.style.left = '';
                footer.el.style.paddingLeft = '';
                (menuAnimHide.el as any).beginElement();
            },
            () => {

                logoPanel.el.style.transform = 'translateX(-180%)';
                titlePanel.el.style.transform = 'translateX(-180%)';
                optionsPanel.el.style.transform = 'translateX(-180%)';
                backPanel.el.style.transform = 'translateX(-180%)';

                navMenu.el.style.pointerEvents = 'auto';

                logoPanel.el.style.animation = 'showMenu 1.2s ease forwards';
                titlePanel.el.style.animation = 'showMenu 1.1s ease 0.3s forwards';
                optionsPanel.el.style.animation = 'showMenu 1s ease 0.6s forwards';
                backPanel.el.style.animation = 'showMenu 1.1s ease 0.3s forwards';

                header.el.style.left = 'calc(2.5vw + 325px + 4.34%)';
                footer.el.style.paddingLeft = 'calc(2.5vw + 325px + 4.34%)';
                (menuAnimShow.el as any).beginElement();
            });
        this.navMenuButton.onChange();

        this.hideMenu = EventBus.subscribe(events.onHideMenu, () => {

            if (!this.navMenuButton.isChecked()) {

                this.navMenuButton.emitCheck();
            }
        });

        this.navMenuButton.emitCancel();



        this.onUsernameChange = EventBus.subscribe(events.onUsernameChange, () => {

            this.handleUsernameChande(User.username);
        });

        this.onAvatarChange = EventBus.subscribe(events.onAvatarChange, () => {

            this.handleAvatarChande(User.avatar);
        });

        this.onUserIDChange = EventBus.subscribe(events.onUserIDChange, () => {

            this.handleUserIdChande();
        });

        this.onUsernameChange = EventBus.subscribe(events.onAnotherUsernameChange, () => {

            this.handleUsernameChande(AnotherUser.username);
        });

        this.onAvatarChange = EventBus.subscribe(events.onAnotherAvatarChange, () => {

            this.handleAnotherAvatarChande(AnotherUser.avatar);
        });

        this.onUserIDChange = EventBus.subscribe(events.onAnotherUserIDChange, () => {

            this.handleAnotherUserIdChande();
        });


        this.checkOnMe(param[0]);

        this.backButton = new Button(this.parent.el.querySelector('#menuBackButton'),
            () => {
                ViewService.goToMainView();
            });

        this.backButton.onClick();
    }

    private checkOnMe(id: string): void {
        this.isMe = id === 'me';

        if (!this.isMe) {

            this.idOfAnotherUser = id.match(/^id([\d]+)$/i)[1];

            let onUserId: {[key: string]: () => void};

            UserService.getUser(this.idOfAnotherUser)
                .then((resp) => {

                    onUserId = EventBus.subscribe(events.onUserIDChange, () => {

                        onUserId.unsubscribe();
                        if (User.id === AnotherUser.id) {
                            this.isMe = true;
                            this.renderMe();
                            return;
                        }
                        this.renderOtherUser();
                    });

                    if (User.id) {
                        onUserId.unsubscribe();

                        if (User.id === AnotherUser.id) {
                            this.isMe = true;
                            this.renderMe();
                            return;
                        }
                        this.renderOtherUser();

                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            return;
        }

        this.renderMe();
    }

    private renderMe(): void {

        if (User.username) {

            this.handleUsernameChande(User.username);
        }

        if (User.avatar) {

            this.handleAvatarChande(User.avatar);
        }

        if (User.id) {

            this.handleUserIdChande();
        }
    }

    private renderOtherUser(): void {

        if (AnotherUser.username) {

            this.handleUsernameChande(AnotherUser.username);
        }

        if (AnotherUser.avatar) {

            this.handleAnotherAvatarChande(AnotherUser.avatar);
        }

        if (AnotherUser.id) {

            this.handleAnotherUserIdChande();
        }
    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.hideMenu.unsubscribe();
        this.onUsernameChange.unsubscribe();
        this.onAvatarChange.unsubscribe();
        this.onUserIDChange.unsubscribe();

        const footer = new Component(document.querySelector('.footer'));
        const header = new Component(document.querySelector('.header'));
        header.el.style.left = '';
        footer.el.style.paddingLeft = '';

        this.optionsTabbar = null;
        this.navMenuButton = null;
        this.backButton = null;
        this.idOfAnotherUser = null;
        AnotherUser.clearData();
    }

    private handleUsernameChande = (username: string) => {

        new Component(this.parent.el.querySelector('.menu__item__title'))
            .setText(username);
    };

    private handleAvatarChande = (avatarUUID: string) => {

        const avatar = new Component(this.parent.el.querySelector('.menu__item__logo_theme_avatar'));
        avatar.addClass('pointer');
        avatar.el.setAttribute('for', 'choose-avatar');

        const loadAvatar = Component.Create('input', ['hidden'], {
            id: 'choose-avatar',
            type: 'checkbox',
        });

        avatar.append(loadAvatar);

        const loadButton = Component.Create('div', ['menu__item__logo__edit', 'pointer']);
        loadButton.setText('Load avatar');

        avatar.append(loadButton);

        this.chooseAvatarModal = new Modal(
            this.parent.el.querySelector('.modal__window_theme_settings'),
            'choose-avatar',
        );

        this.avatarLoader = new PhotoLoader(Component.Create().el);
        this.chooseAvatarModal.content = this.avatarLoader;

        this.chooseAvatarButton = new Checkbox(this.parent.el.querySelector('#choose-avatar'),
            () => {
                this.chooseAvatarModal.render();
            },
            () => {
                this.chooseAvatarModal.clear();
            },
        );
        this.chooseAvatarButton.onChange();

        this.onUsernameChange = EventBus.subscribe(events.onUsernameChange, () => {

            this.handleUsernameChande(User.username);
        });

        if (avatarUUID) {

            const image = new Component(this.parent.el.querySelector('.menu__item__img'));
            const spiner = new Component(this.parent.el.querySelector('.carousel__item__spinner'));

            spiner.show();
            AvatarService.getAvatar(avatarUUID)
                .then((img) => {
                    (image.el as HTMLImageElement).src = URL.createObjectURL(img);
                    image.show();
                })
                .finally(() => {
                    spiner.hide();
                });
        }
    };

    private handleAnotherAvatarChande = (avatar: string) => {

        if (avatar) {

            const image = new Component(this.parent.el.querySelector('.menu__item__img'));
            const spiner = new Component(this.parent.el.querySelector('.carousel__item__spinner'));

            spiner.show();
            AvatarService.getAvatar(avatar)
                .then((img) => {
                    (image.el as HTMLImageElement).src = URL.createObjectURL(img);
                    image.show();
                })
                .finally(() => {
                    spiner.hide();
                });
        }
    };

    private handleUserIdChande = () => {

        const profileOption = new Component(this.parent.el.querySelector('.menu__item__option_theme_profile'));
        profileOption.show();

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            profileOption0: () => {
                ViewService.goToProfileView();
            },
            profileOption1: () => {
                ViewService.goToUserBotsView();
            },
            profileOption2: () => {
                return;
            },
        });

        this.optionsTabbar.onChange();
    };

    private handleAnotherUserIdChande = () => {

        const profileOption = new Component(this.parent.el.querySelector('.menu__item__option_theme_profile'));
        profileOption.hide();

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            profileOption0: () => {
                if (this.isMe && this.idOfAnotherUser) {

                    ViewService.goToProfileView(`id${this.idOfAnotherUser}`);

                } else {

                    return;
                }
            },
            profileOption1: () => {

                ViewService.goToUserBotsView(`id${this.idOfAnotherUser}`);
            },
            profileOption2: () => {
                return;
            },
        });

        this.optionsTabbar.onChange();
    };
}

export default ProfileMenuLayer;