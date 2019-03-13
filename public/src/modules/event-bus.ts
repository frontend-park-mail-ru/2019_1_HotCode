'use strict';

class EventBus {

    private subscriptions: {[key: string]: {[key: number]: (param?: any) => any} };
    private getNextUniqueId: () => number;

    constructor() {
        this.subscriptions = {};
        this.getNextUniqueId = this.getIdGenerator();
    }

    public subscribe(eventType: string, callback: (param?: any) => any): {[key: string]: () => void} {
        const id: number = this.getNextUniqueId();

        if (!this.subscriptions[eventType]) {
            this.subscriptions[eventType] = {};
        }

        this.subscriptions[eventType][id] = callback;

        return {
            unsubscribe: () => {

                delete this.subscriptions[eventType][id];

                if(Object.keys(this.subscriptions[eventType]).length === 0) {
                    delete this.subscriptions[eventType];
                }
            }
        }
    }

    public publish(eventType: string, arg?: any): void {
        if(!this.subscriptions[eventType])
            return;

        (Object.keys(this.subscriptions[eventType]))
            .forEach(key => this.subscriptions[eventType][+key](arg));
    }


    private getIdGenerator(): () => number {
        let lastId = 0;

        return function getNextUniqueId(): number {
            lastId += 1;
            return lastId;
        }
    }
}

export default new EventBus();