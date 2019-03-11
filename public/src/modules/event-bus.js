'use strict';

function getIdGenerator() {
    let lastId = 0;

    return function getNextUniqueId() {
        lastId += 1;
        return lastId;
    }
}

class EventBus {
    constructor() {
        this.subscriptions = {};
        this.getNextUniqueId = getIdGenerator();
    }


    subscribe(eventType, callback) {
        const id = this.getNextUniqueId();

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

    publish(eventType, arg) {
        if(!this.subscriptions[eventType])
            return;

        Object.keys(this.subscriptions[eventType])
            .forEach(key => this.subscriptions[eventType][key](arg));
    }
}

export default new EventBus();