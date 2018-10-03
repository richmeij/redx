import { findProperty } from './redux-util';
import { action } from './redx';

/**
 * Async rendering which can be used Server-Side (e.g. in Express).
 * Assumes use of StartAction and DoneAction to check if all async (data)calls are finished bedore rendering.
 * @param {Object} store Redux Store
 * @param {function} renderFunc Function that does the actual rendering
 * @param {function} logger Logger that assumes the following API: .log(message) .warn(message)
 * @param {number} [maxWaitTime=0] Time to wait before resolving. If set to 0, rendering waits untill all StartActions are met with an equal amount of DoneActions
 */

// REDX Async Server
export const renderWhen = (store, renderFunc, logger, maxWaitTime = 0) => {
    let asyncActions;
    return new Promise((resolve) => {
        let content;
        let resolved = false;

        const checkReady = () => {
            if (!resolved) {
                asyncActions = findProperty(store.getState(), 'redXAsync', '__STARTED__', 0, 1);
                if (asyncActions < 1 && content) {
                    resolved = true;
                    resolve(content);
                }
            }
        };

        store.subscribe(() => {
            checkReady();
        });

        content = renderFunc();
        checkReady();
        setTimeout(() => {
            if (!resolved && maxWaitTime > 0) {
                logger.warn('Possible premature resolve.');
                resolved = true;
                resolve(content);
            }
        }, maxWaitTime); // always resolve after maxWaitTime
    });
};

// START ACTION ENHANCER
export const startAction = (target) => {
    const startAction = action(target);
    startAction.__isRedXStartAction = true;
    return startAction;
};

// DONE ACTION ENHANCER
export const doneAction = (target) => {
    const doneAction = action(target);
    doneAction.__isRedXDoneAction = true;
    return doneAction;
};
