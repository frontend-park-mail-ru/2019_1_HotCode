'use strict';

class ViewInfo {

    private keyNameField: string;
    private viewConstructorField: () => IRenderable;
    private typeField: string;
    private pathField: string;
    private childrenViewField: string[];
    private defaultParentField: string;

    private viewField: IRenderable;

    constructor(keyName: string,
                viewConstructor: () => IRenderable,
                type: string,
                path?: string,
                childrenView?: string[],
                defaultView?: string) {

        this.keyNameField = keyName;
        this.viewConstructorField = viewConstructor;
        this.typeField = type;
        this.pathField = path;
        this.childrenViewField = childrenView;
        this.defaultParentField = defaultView;
    }


    get keyName(): string {
        return this.keyNameField;
    }

    get viewConstructor(): () => IRenderable {
        return this.viewConstructorField;
    }

    get type(): string {
        return this.typeField;
    }

    get path(): string {
        return this.pathField;
    }

    get childrenView(): string[] {
        return this.childrenViewField;
    }

    get defaultParent(): string {
        return this.defaultParentField;
    }

    get view(): IRenderable {
        return this.viewField;
    }

    public createView(): void {
        this.viewField = this.viewConstructor();
    }
}

export default ViewInfo;