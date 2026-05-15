'use strict';

export class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    subscribe(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(listener);

        return() => {
            const listeners = this.events.get(event);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
        }
    }
    emit(event, data) {
        const listeners = this.events.get(event);
        if (listeners === undefined) {
            return;
        }
        if (event === 'error' && listeners.length === 0) {
            throw new Error(data);
        }
        for (const listener of listeners) {
            try {
                listener(data);
            } catch (err) {
                console.error('Listener error:', err);
            }
        }
    }
}