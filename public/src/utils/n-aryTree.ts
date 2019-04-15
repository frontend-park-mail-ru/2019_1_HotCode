'use strict';

class NTree<T> {
    private root: TreeNode<T>;

    constructor(data: T) {
        this.root = new TreeNode<T>(data);
    }

    public insertAfter(data: T, parent: T): void {
        const parentNode = this.findNode(parent);

        parentNode.children.push(new TreeNode(data));
    }

    public delete(data?: T): void {
        if (!data || data === this.root.data) {
            this.root = null;
            return;
        }

        let node = this.findParent(data);

        console.log(node);
        node.children = node.children.filter(child => child.data !== data);
        console.log(node);
    }

    private findNode(data: T, node = this.root): TreeNode<T> {
        if (node.data === data) {
            return node;
        }
        for (let child of node.children) {

            let result = this.findNode(data, child);

            if (result) {
                return result;
            }
        }
        return null;
    }

    private findParent(data: T, node = this.root): TreeNode<T> {
        if (node.data === data) {
            return node;
        }
        for (let child of node.children) {

            let result = this.findNode(data, child);

            if (result) {
                return child;
            }
        }
        return null;
    }

    public getParent(data: T): T {
        return this.findParent(data).data;
    }

    public print(node = this.root, deap = 0): void {

        if(node) {
            console.log(deap, node.data);
            for (let child of node.children) {

                this.print(child, deap + 1);
            }
        }
    }
}

class TreeNode<T> {
    private _data: T;
    private _children: TreeNode<T>[];

    constructor(data: T,
                children: TreeNode<T>[] = []) {
        this._data = data;
        this._children = children;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    get children(): TreeNode<T>[] {
        return this._children;
    }

    set children(value: TreeNode<T>[]) {
        this._children = value;
    }


}

export default NTree;