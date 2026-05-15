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

        return () => {
            const listeners = this.events.get(event);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
        };
    }

    emit(event, data) {
        const listeners = this.events.get(event);
        if (!listeners || listeners.length === 0) {
            if (event === 'error') {
                throw new Error(data);
            }
            return;
        }

        for (const listener of listeners) {
            try {
                listener(data);
            } catch (err) {
                const errorListeners = this.events.get('error');

                if (errorListeners && errorListeners.length > 0) {
                    for (const errorListener of errorListeners) {
                        try {
                            errorListener(err);
                        } catch (e) {
                            console.error('Error listener failed:', e);
                        }
                    }
                } else {
                    console.error('Listener error:', err);
                }
            }
        }
    }
}