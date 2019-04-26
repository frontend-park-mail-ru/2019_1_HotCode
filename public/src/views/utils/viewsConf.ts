import LiderboardPage from '../pages/gameMenuPages/liderboardPage/liderboardPage';
import Component from '../../components/baseComponent/index';
import BaseLayer from '../layers/baseLayer/baseLayer';
import DescriptionPage from '../pages/gameMenuPages/descriptionPage/descriptionPage';
import ContainerLayer from '../layers/containerLayer/containerLayer';
import PopUpLayer from '../layers/popUpLayer/popUpLayer';
import ViewInfo from '../viewInfo';
import RootLayer from '../layers/rootLayer/rootLayer';
import SettingsPage from '../pages/settingsPage/settingsPage';
import SigninPage from '../pages/authorizationPages/signinPage/signinPage';
import {viewPaths, viewRegs} from '../../services/utils/paths';
import MainPage from '../pages/mainPage/mainPage';
import SignupPage from '../pages/authorizationPages/signupPage/signupPage';
import StartPage from '../pages/startPage/startPage';
import GameMenuLayer from '../layers/gameMenuLayer/gameMenuLayer';
import GamePage from '../pages/gameMenuPages/gamePage/gamePage';

export const views = [
    new ViewInfo(
        'rootLayer',
        () => new RootLayer(),
        'root',
        null,
        [
            'containerLayer',
        ],
    ),
    new ViewInfo(
        'containerLayer',
        () => new ContainerLayer(Component.getBy('.scrollable__content')),
        'container',
        null,
        [
            'baseLayer',
        ],
    ),
    // new ViewInfo(
    //     'optionsLayer',
    //     () => new OptionsLayer(Component.getBy('.root')),
    //     'options',
    //     null,
    //     [
    //         'baseLayer'
    //     ]
    // ),
    new ViewInfo(
        'baseLayer',
        () => new BaseLayer(Component.getBy('.root')),
        'base',
        null,
        [
            'startPage',
            'mainPage',
            'settingsPage',
            'gameMenuLayer',
            'popUpLayer',
        ],
    ),
    new ViewInfo(
        'popUpLayer',
        () => new PopUpLayer(Component.getBy('.modal__window')),
        'popup',
        null,
        [
            'signinPage',
            'signupPage',
        ],
        'mainPage',
    ),
    new ViewInfo(
        'startPage',
        () => new StartPage(Component.getBy('.base-container_theme_main')),
        'mainContainer',
        viewRegs.startViewPath,
    ),
    new ViewInfo(
        'mainPage',
        () => new MainPage(Component.getBy('.base-container_theme_main')),
        'mainContainer',
        viewRegs.mainViewPath,
    ),
    new ViewInfo(
        'settingsPage',
        () => new SettingsPage(Component.getBy('.base-container_theme_main')),
        'mainContainer',
        viewRegs.settingsViewPath,
    ),
    new ViewInfo(
        'gameMenuLayer',
        () => new GameMenuLayer(Component.getBy('.base-container_theme_main')),
        'mainContainer',
        null,
        [
            'descriptionPage',
            'liderboardPage',
            'gamePage',
        ],
    ),
    new ViewInfo(
        'signinPage',
        () => new SigninPage(Component.getBy('.modal-content')),
        'modalWindow',
        viewRegs.loginViewPath,
    ),
    new ViewInfo(
        'signupPage',
        () => new SignupPage(Component.getBy('.modal-content')),
        'modalWindow',
        viewRegs.signupViewPath,
    ),
    new ViewInfo(
        'descriptionPage',
        () => new DescriptionPage(Component.getBy('.game-menu__content')),
        'gameContainer',
        viewRegs.descriptionViewPath,
    ),
    new ViewInfo(
        'liderboardPage',
        () => new LiderboardPage(Component.getBy('.game-menu__content')),
        'gameContainer',
        viewRegs.liderboardViewPath,
    ),
    new ViewInfo(
        'gamePage',
        () => new GamePage(Component.getBy('.game-menu__content')),
        'gameContainer',
        viewRegs.gameViewPath,
    ),
];