/* jshint -W104 */
/* jshint -W119 */
'use strict';
const Saferphore = require('./index');
const assert = (x) => { if (!x) { throw new Error(); } };

const basicTest = () => {
    const sem = Saferphore.create(4);
    const out = [];
    new Array(10).fill().forEach((x,y) => {
        sem.take((returnAfter) => {
            out.push(y);
            setTimeout(returnAfter(() => {
                if (out.length === 10) {
                    if (out.join() !== "0,1,2,3,4,5,6,7,8,9") { throw new Error(); }
                }
            }));
        });
    });
    if (out.join() !== "0,1,2,3") {
        throw new Error(out.join());
    }
};

const doubleCallTest = () => {
    const sem = Saferphore.create(4);
    const catcher = setTimeout(() => {
        throw new Error();
    }, 1000);
    sem.take((returnAfter) => {
        setTimeout(returnAfter(() => {
            setTimeout(() => {
                clearTimeout(catcher);
                try { returnAfter()(); } catch (e) { return; }
                throw new Error();
            });
        }));
    });
};

const doubleCallbackTest = () => {
    const sem = Saferphore.create(4);
    const catcher = setTimeout(() => {
        throw new Error();
    }, 1000);
    sem.take((returnAfter) => {
        let wrapped = returnAfter();
        wrapped();
        try { wrapped(); } catch (e) { clearTimeout(catcher); return; }
        throw new Error();
    });
};

basicTest();
doubleCallTest();
doubleCallbackTest();
