'use strict';

class ViewInfo {

    private _keyName: string;
    private _viewConstructor: () => IRenderable;
    private _type: string;
    private _path: string;
    private _childrenView: string[];
    private _defaultParent: string;

    private _view: IRenderable;

    constructor(keyName: string,
                viewConstructor: () => IRenderable,
                type: string,
                path?: string,
                childrenView?: string[],
                defaultView?: string
                ) {
        this._keyName = keyName;
        this._viewConstructor = viewConstructor;
        this._type = type;
        this._path = path;
        this._childrenView = childrenView;
        this._defaultParent = defaultView;
    }


    get keyName(): string {
        return this._keyName;
    }

    get viewConstructor(): () => IRenderable {
        return this._viewConstructor;
    }

    get type(): string {
        return this._type;
    }

    get path(): string {
        return this._path;
    }

    get childrenView(): string[] {
        return this._childrenView;
    }

    get defaultParent(): string {
        return this._defaultParent;
    }

    get view(): IRenderable {
        return this._view;
    }

    public createView(): void {
        this._view = this.viewConstructor();
    }
}

export default ViewInfo;