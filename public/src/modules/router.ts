import Page from '../views/pages/page';
import ViewInfo from '../views/viewInfo';
import {views} from '../views/utils/viewsConf';

class Router {

    private views: ViewInfo[];

    private preRenderStack: ViewInfo[];
    private postRenderStack: ViewInfo[];

    constructor() {
        this.views = views;

        this.preRenderStack = [];
        this.postRenderStack = [];
    }

    public start() {
        window.onpopstate = (event) => {
            console.log('popState');
            this.go(window.location.pathname, true, event.state.slug);
        };
    }

    public go(path: string, isPopState = false, slug?: string) {
        console.log('go', path);
        console.log('postStack', this.postRenderStack);

        let newView = this.views.find((view) => path.match(view.reg) !== null);
        newView.path = path;

        if (this.postRenderStack.length > 0 &&
            path === this.postRenderStack[this.postRenderStack.length - 1].path) {

            isPopState = true;
        }

        if (this.postRenderStack.find((view) => view.type === newView.type)) {

            this.postRenderStack
                .slice(this.postRenderStack.findIndex((view) => view.type === newView.type))
                .map((view) => this.clear(view.view));

            this.postRenderStack =
                this.postRenderStack
                    .slice(0, this.postRenderStack.findIndex((view) => view.type === newView.type));
        }

        let defaultView = null;
        let defaultPath = null;
        while (newView) {

            if (this.postRenderStack.find((view) => view.keyName === newView.keyName)) {

                if (!defaultView) {

                    this.postRenderStack
                        .slice(this.postRenderStack.findIndex((view) => view.keyName === newView.keyName) + 1)
                        .map((view) => this.clear(view.view));

                    this.postRenderStack =
                        this.postRenderStack
                            .slice(0, this.postRenderStack.findIndex((view) => view.keyName === newView.keyName) + 1);
                }

                break;
            }

            if (defaultView) {
                defaultView.path = defaultPath;
                this.preRenderStack.push(defaultView);
            }

            this.preRenderStack.push(newView);

            defaultView = this.views.find((view) => view.keyName === newView.defaultParent);

            if (defaultView) {
                defaultPath = newView.defaultPath;
            }

            newView = this.getParent(newView);

            if (!newView) {
                this.postRenderStack.map((view) => this.clear(view.view));
                this.postRenderStack = [];
            }
        }


        while (this.preRenderStack.length !== 0) {
            this.draw(this.preRenderStack.pop(), slug);
        }

        if (!isPopState) {

            window.history.pushState(
                {slug},
                (this.postRenderStack[this.postRenderStack.length - 1].view as Page).title,
                path,
            );
        }

        console.log('postStack', this.postRenderStack);
    }

    public popStack(deep: number): void {

        for (let i = 0; i < deep; i++)
            this.clear(this.postRenderStack.pop().view);

        (this.postRenderStack[this.postRenderStack.length - 1].view as Page).setTitle();
        window.history.pushState(
            null,
            (this.postRenderStack[this.postRenderStack.length - 1].view as Page).title,
            this.postRenderStack[this.postRenderStack.length - 1].path,
        );
    }

    private getParent(newView: ViewInfo): ViewInfo {

        for (const view of this.views) {

            if (view.childrenView) {
                const curChild = view.childrenView.find((child) => {

                    return child === newView.keyName;
                });

                if (curChild) {
                    return view;
                }
            }
        }
    }

    private draw(view: ViewInfo, slug: string): void {
        view.createView();
        view.view.render(slug);
        console.log('RENDER', view.keyName);
        this.postRenderStack.push(view);
    }

    private clear(view: IRenderable): void {
        console.log('CLEAR');
        view.clear();
    }
}

export default new Router();