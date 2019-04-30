'use strict';

class ViewInfo {

    private keyNameField: string;
    private viewConstructorField: () => IRenderable;
    private typeField: string;
    private regField: RegExp;
    private pathField: string;
    private childrenViewField: string[];
    private defaultParentField: string;
    private defaultPathField: string;

    private viewField: IRenderable;

    constructor(keyName: string,
                viewConstructor: () => IRenderable,
                type: string,
                reg?: RegExp,
                childrenView?: string[],
                defaultView?: string,
                defaultPath?: string,
                ) {

        this.keyNameField = keyName;
        this.viewConstructorField = viewConstructor;
        this.typeField = type;
        this.regField = reg;
        this.childrenViewField = childrenView;
        this.defaultParentField = defaultView;
        this.defaultPathField = defaultPath;
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

    get reg(): RegExp {
        return this.regField;
    }

    get path(): string {
        return this.pathField;
    }

    set path(value: string) {
        this.pathField = value;
    }

    get childrenView(): string[] {
        return this.childrenViewField;
    }

    get defaultParent(): string {
        return this.defaultParentField;
    }

    get defaultPath(): string {
        return this.defaultPathField;
    }

    get view(): IRenderable {
        return this.viewField;
    }

    public createView(): void {
        this.viewField = this.viewConstructor();
    }
}

export default ViewInfo;