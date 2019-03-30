import Page from '../views/pages/page';
import ViewInfo from '../views/viewInfo';

class Router {

    private viewsField: ViewInfo[];

    private preRenderStack: ViewInfo[];
    private postRenderStack: ViewInfo[];

    constructor(views: ViewInfo[] = []) {
        this.viewsField = views;

        this.preRenderStack = [];
        this.postRenderStack = [];
    }

    set views(value: ViewInfo[]) {
        this.viewsField = value;
    }

    public start() {
        window.onpopstate = (event) => {
            console.log('popState');
            this.go(window.location.pathname, true);
        };
    }

    public go(path: string, isPopState = false) {
        console.log('go', path);
        console.log('postStack', this.postRenderStack);

        let newView = this.viewsField.find((view) => view.path === path);

        if (this.postRenderStack.find((view) => view.type === newView.type)) {

            this.postRenderStack
                .slice(this.postRenderStack.findIndex((view) => view.type === newView.type))
                .map((view) => this.clear(view.view));

            this.postRenderStack =
                this.postRenderStack
                    .slice(0, this.postRenderStack.findIndex((view) => view.type === newView.type));
        }

        let defaultView = null;
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
                this.preRenderStack.push(defaultView);
            }

            this.preRenderStack.push(newView);

            defaultView = this.viewsField.find((view) => view.keyName === newView.defaultParent);

            newView = this.getParent(newView);

            if (!newView) {
                this.postRenderStack.map((view) => this.clear(view.view));
                this.postRenderStack = [];
            }
        }


        while (this.preRenderStack.length !== 0) {
            this.draw(this.preRenderStack.pop());
        }

        if (!isPopState) {

            window.history.pushState(
                null,
                (this.postRenderStack[this.postRenderStack.length - 1].view as Page).title,
                path,
            );
        }

        console.log('postStack', this.postRenderStack);
    }

    public popStack(): void {
        this.clear(this.postRenderStack.pop().view);
        this.clear(this.postRenderStack.pop().view);

        window.history.pushState(
            null,
            (this.postRenderStack[this.postRenderStack.length - 1].view as Page).title,
            this.postRenderStack[this.postRenderStack.length - 1].path,
        );
    }

    private getParent(newView: ViewInfo): ViewInfo {

        for (const view of this.viewsField) {

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

    private draw(view: ViewInfo): void {
        view.createView();
        view.view.render();
        console.log('RENDER', view.keyName);
        this.postRenderStack.push(view);
    }

    private clear(view: IRenderable): void {
        console.log('CLEAR');
        view.clear();
    }
}

export default new Router();