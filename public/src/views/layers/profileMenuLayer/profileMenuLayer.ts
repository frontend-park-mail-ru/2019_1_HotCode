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
import Alert from '../../../components/alert/alert';
import Message from '../../../utils/message';

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
    private idOfUser: string;
    private countOfRenderMenu: number;
    private countOfRenderAvatar: number;

    private onUpdateId: {[key: string]: () => void};
    private onUsernameChange: {[key: string]: () => void};
    private onAvatarChange: {[key: string]: () => void};
    private onAvatarRender: {[key: string]: () => void};
    private onUserIDChange: {[key: string]: () => void};
    private onUserIDChange2: {[key: string]: () => void};
    private onUserIDRender: {[key: string]: () => void};
    private onAnotherUserUsernameChange: {[key: string]: () => void};
    private onAnotherUserAvatarChange: {[key: string]: () => void};
    private onAnotherUserUserIDChange: {[key: string]: () => void};
    private hideMenu: {[key: string]: () => void};

    constructor(parent: Component) {
        super(parent);

        this.countOfRenderAvatar = 0;
        this.countOfRenderMenu = 0;
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

        this.update();
        this.checkOnMe(param[0]);

        this.backButton = new Button(this.parent.el.querySelector('#menuBackButton'),
            () => {
                ViewService.goToMainView();
            });

        this.backButton.onClick();
    }

    private checkOnMe(id: string): void {
        this.isMe = id === 'me';
        this.idOfAnotherUser = null;

        AnotherUser.clearData();

        if (this.onUserIDChange) {
            this.onUserIDChange.unsubscribe();
            this.onUserIDChange = null;
        }

        if (this.onAnotherUserUsernameChange) {
            this.onAnotherUserUsernameChange.unsubscribe();
            this.onAnotherUserUsernameChange = null;
        }

        if (this.onAnotherUserAvatarChange) {
            this.onAnotherUserAvatarChange.unsubscribe();
            this.onAnotherUserAvatarChange = null;
        }

        if (this.onAnotherUserUserIDChange) {
            this.onAnotherUserUserIDChange.unsubscribe();
            this.onAnotherUserUserIDChange = null;
        }

        if (!this.isMe) {

            this.idOfAnotherUser = id.match(/^id([\d]+)$/i)[1];

            this.renderOtherUser();

            UserService.getUser(this.idOfAnotherUser)
                .then((resp) => {

                    this.onUserIDChange = EventBus.subscribe(events.onUserIDChange, () => {

                        if (User.id === AnotherUser.id) {
                            this.renderMe();
                            EventBus.publish(events.onUserIDRender);
                            EventBus.publish(events.onAvatarRender);
                            return;
                        }
                    });

                    if (User.id) {

                        if (User.id === AnotherUser.id) {
                            this.renderMe();
                            EventBus.publish(events.onUserIDRender);
                            EventBus.publish(events.onAvatarRender);
                            return;
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            return;
        }

        this.renderMe();
        UserService.me(1)
            .catch((e) => {
                if (e.status === 401) {

                    EventBus.publish(events.openSignIn, '');
                    Alert.alert(Message.accessError(), true);
                }
            });
    }

    private renderMe(): void {

        AnotherUser.clearData();

        if (User.id) {
            this.idOfUser = User.id.toString();
        }

        if (this.onAnotherUserUsernameChange) {
            this.onAnotherUserUsernameChange.unsubscribe();
            this.onAnotherUserUsernameChange = null;
        }

        if (this.onAnotherUserAvatarChange) {
            this.onAnotherUserAvatarChange.unsubscribe();
            this.onAnotherUserAvatarChange = null;
        }

        if (this.onAnotherUserUserIDChange) {
            this.onAnotherUserUserIDChange.unsubscribe();
            this.onAnotherUserUserIDChange = null;
        }

        if (this.onUserIDChange) {
            this.onUserIDChange.unsubscribe();
            this.onUserIDChange = null;
        }

        this.onUserIDChange2 = EventBus.subscribe(events.onUserIDChange, () => {

            if (User.id) {
                this.idOfUser = User.id.toString();
            }

            if (!User.id) {
                if (this.idOfAnotherUser && this.idOfAnotherUser === this.idOfUser) {
                    this.checkOnMe(`id${this.idOfUser}`);
                } else {
                    ViewService.goToUserBotsView(`id${this.idOfUser}`);
                }
            }
        });


        this.onUsernameChange = EventBus.subscribe(events.onUsernameChange, () => {

            if (User.username) {

                this.handleUsernameChande(User.username);
            }
        });

        if (User.username) {

            this.handleUsernameChande(User.username);
        }

        this.onAvatarChange = EventBus.subscribe(events.onAvatarChange, () => {

            if (User.avatar) {

                this.handleAvatarChande(User.avatar);
            }
        });

        if (User.avatar) {

            this.handleAvatarChande(User.avatar);
        }



        this.onAvatarRender = EventBus.subscribe(events.onAvatarRender, () => {

            if (this.countOfRenderAvatar < 1) {

                this.handleAvatarRender();
                this.countOfRenderAvatar++;
            }
        });

        this.onUserIDRender = EventBus.subscribe(events.onUserIDRender, () => {

            if (this.countOfRenderMenu < 1) {

                this.handleUserIdChande();
                this.countOfRenderMenu++;
            }
        });

    }

    private renderOtherUser(): void {

        if (this.onUsernameChange) {
            this.onUsernameChange.unsubscribe();
            this.onUsernameChange = null;
        }


        if (this.onAvatarChange) {
            this.onAvatarChange.unsubscribe();
            this.onAvatarChange = null;
        }

        if (this.onAvatarRender) {
            this.onAvatarRender.unsubscribe();
            this.onAvatarRender = null;
        }

        if (this.onUserIDRender) {
            this.onUserIDRender.unsubscribe();
            this.onUserIDRender = null;
        }

        if (this.onUserIDChange2) {

            this.onUserIDChange2.unsubscribe();
            this.onUserIDChange2 = null;
        }


        this.countOfRenderMenu = 0;
        this.countOfRenderAvatar = 0;

        this.onAnotherUserUsernameChange = EventBus.subscribe(events.onAnotherUsernameChange, () => {

            this.handleUsernameChande(AnotherUser.username);
        });

        this.onAnotherUserAvatarChange = EventBus.subscribe(events.onAnotherAvatarChange, () => {

            this.handleAnotherAvatarChande(AnotherUser.avatar);
        });

        this.onAnotherUserUserIDChange = EventBus.subscribe(events.onAnotherUserIDChange, () => {

            this.handleAnotherUserIdChande();
        });

    }

    public clear(): void {
        this.parent.el.innerHTML = '';

        this.hideMenu.unsubscribe();

        if (this.onUsernameChange) {
            this.onUsernameChange.unsubscribe();
        }
        if (this.onAvatarChange) {
            this.onAvatarChange.unsubscribe();
        }
        if (this.onUserIDChange) {
            this.onUserIDChange.unsubscribe();
        }
        if (this.onUserIDChange2) {
            this.onUserIDChange2.unsubscribe();
        }
        if (this.onAvatarRender) {
            this.onAvatarRender.unsubscribe();
        }
        if (this.onUserIDRender) {
            this.onUserIDRender.unsubscribe();
        }

        this.onUpdateId.unsubscribe();

        if (this.onAnotherUserUsernameChange) {
            this.onAnotherUserUsernameChange.unsubscribe();
        }

        if (this.onAnotherUserAvatarChange) {
            this.onAnotherUserAvatarChange.unsubscribe();
        }

        if (this.onAnotherUserUserIDChange) {
            this.onAnotherUserUserIDChange.unsubscribe();
        }

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

    public update(): void {

        this.onUpdateId = EventBus.subscribe(events.onChangeSlug1, (newSlug) => {
            this.checkOnMe(newSlug);
        });
    }

    private handleUsernameChande = (username: string) => {

        new Component(this.parent.el.querySelector('.menu__item__title'))
            .setText(username);
    };

    private handleAvatarChande = (avatarUUID: string) => {

        if (avatarUUID) {

            const image = new Component(this.parent.el.querySelector('.menu__item__img'));
            const spiner = new Component(this.parent.el.querySelector('.carousel__item__spinner'));

            image.show();
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

    private handleAvatarRender = () => {

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
    };

    private handleAnotherAvatarChande = (avatarUUID: string) => {
        const avatar = new Component(this.parent.el.querySelector('.menu__item__logo_theme_avatar'));

        if (avatar.el) {
            avatar.removeClass('pointer');
            avatar.el.removeAttribute('for');
        }

        const loadAvatar = new Component(this.parent.el.querySelector('#choose-avatar'));

        if (loadAvatar.el) {
            loadAvatar.el.parentElement.removeChild(loadAvatar.el);
        }

        const loadButton = new Component(this.parent.el.querySelector('.menu__item__logo__edit'));

        if (loadButton.el) {
            loadButton.el.parentElement.removeChild(loadButton.el);
        }

        this.chooseAvatarModal = null;

        this.avatarLoader = null;

        if (this.chooseAvatarButton) {
            this.chooseAvatarButton.stop();
        }
        this.chooseAvatarButton = null;


        if (avatarUUID) {

            const image = new Component(this.parent.el.querySelector('.menu__item__img'));
            const spiner = new Component(this.parent.el.querySelector('.carousel__item__spinner'));

            image.show();
            spiner.show();
            AvatarService.getAvatar(avatarUUID)
                .then((img) => {
                    (image.el as HTMLImageElement).src = URL.createObjectURL(img);
                    image.show();
                })
                .finally(() => {
                    spiner.hide();
                });
        } else {
            const image = new Component(this.parent.el.querySelector('.menu__item__img'));
            image.hide();
        }
    };

    private handleUserIdChande = () => {

        const profileOption = new Component(this.parent.el.querySelector('.menu__item__option_theme_profile'));
        profileOption.show();

        if (this.optionsTabbar) {
            this.optionsTabbar.stop();
        }

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            profileOption0: () => {
                if (this.idOfAnotherUser) {

                    ViewService.goToProfileView(`id${this.idOfAnotherUser}`);

                } else {

                    ViewService.goToProfileView();
                }
            },
            profileOption1: () => {
                if (this.idOfAnotherUser) {

                    ViewService.goToUserBotsView(`id${this.idOfAnotherUser}`);

                } else {

                    ViewService.goToUserBotsView();
                }
            },
            profileOption2: () => {
                return;
            },
            profileOption3: () => {
                if (this.idOfAnotherUser) {

                    ViewService.goToUserMatchesView(`id${this.idOfAnotherUser}`);

                } else {

                    ViewService.goToUserMatchesView();
                }
            },
        });

        this.optionsTabbar.onChange();
    };

    private handleAnotherUserIdChande = () => {

        const profileOption = new Component(this.parent.el.querySelector('.menu__item__option_theme_profile'));
        profileOption.hide();

        if (this.optionsTabbar) {
            this.optionsTabbar.stop();
        }

        this.optionsTabbar = new Tabbar(this.parent.el.querySelector('.options__check'), {
            profileOption0: () => {
                return;
            },
            profileOption1: () => {
                ViewService.goToUserBotsView(`id${this.idOfAnotherUser}`);
            },
            profileOption2: () => {
                return;
            },
            profileOption3: () => {
                ViewService.goToUserMatchesView(`id${this.idOfAnotherUser}`);
            },
        });

        this.optionsTabbar.onChange();
    };
}

export default ProfileMenuLayer;