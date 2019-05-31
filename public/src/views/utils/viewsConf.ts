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
import MatchesPage from '../pages/gameMenuPages/matchesPage/matchesPage';
import MatchPage from '../pages/gameMenuPages/matchPage/matchPage';
import ProfileMenuLayer from '../layers/profileMenuLayer/profileMenuLayer';
import ProfilePage from '../pages/profileMenuPages/profilePage/profilePage';
import UserBotsPage from '../pages/profileMenuPages/userBotsPage/userBotsPage';
import UserMatchesPage from '../pages/profileMenuPages/userMatchesPage/userMatchesPage';

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
        () => new ContainerLayer(Component.getBy('.root')),
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
            'profileMenuLayer',
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
        '/'
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
    // new ViewInfo(
    //     'settingsPage',
    //     () => new SettingsPage(Component.getBy('.base-container_theme_main')),
    //     'mainContainer',
    //     viewRegs.settingsViewPath,
    // ),
    new ViewInfo(
        'profileMenuLayer',
        () => new ProfileMenuLayer(Component.getBy('.base-container_theme_main')),
        'mainContainer',
        null,
        [
            'profilePage',
            'userBotsPage',
            'userMatchesPage',
        ],
    ),
    new ViewInfo(
        'profilePage',
        () => new ProfilePage(Component.getBy('.game-menu__content')),
        'profileContainer',
        viewRegs.profileViewPath,
    ),
    new ViewInfo(
        'userBotsPage',
        () => new UserBotsPage(Component.getBy('.game-menu__content')),
        'profileContainer',
        viewRegs.userBotsViewPath,
    ),
    new ViewInfo(
        'userMatchesPage',
        () => new UserMatchesPage(Component.getBy('.game-menu__content')),
        'profileContainer',
        viewRegs.userMatchesViewPath,
    ),
    new ViewInfo(
        'gameMenuLayer',
        () => new GameMenuLayer(Component.getBy('.base-container_theme_main')),
        'mainContainer',
        null,
        [
            'descriptionPage',
            'liderboardPage',
            'matchesPage',
            'matchPage',
            'gamePage',
        ],
    ),
    new ViewInfo(
        'signinPage',
        () => new SigninPage(Component.getBy('.container_theme_modal')),
        'modalWindow',
        viewRegs.loginViewPath,
    ),
    new ViewInfo(
        'signupPage',
        () => new SignupPage(Component.getBy('.container_theme_modal')),
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
        'matchesPage',
        () => new MatchesPage(Component.getBy('.game-menu__content')),
        'gameContainer',
        viewRegs.matchesViewPath,
    ),
    new ViewInfo(
        'matchPage',
        () => new MatchPage(Component.getBy('.game-menu__content')),
        'gameContainer',
        viewRegs.matchViewPath,
    ),
    new ViewInfo(
        'gamePage',
        () => new GamePage(Component.getBy('.game-menu__content')),
        'gameContainer',
        viewRegs.gameViewPath,
    ),
];