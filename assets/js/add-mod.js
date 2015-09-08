'use strict';

var addCounter = 1;
'use strict';

function Accordion(o) {
    'use strict';
    var _ = this;
    if (o.target) {
        _.id = addCounter++;
        _.w = o.target;
        _.o = o;
    }

    _.isTab = function (el) {
        return el.hasAttribute('role') && el.getAttribute('role') === 'tab';
    };

    _.isTabPanel = function (el) {
        return el.hasAttribute('role') && el.getAttribute('role') === 'tabpanel';
    };

    _.handleUserEvent = function (e) {
        e = e ? e : arguments[0];

        var t = e.target || e.srcElement,
            kc = e.keyCode;

        if (_.isTab(t) && (e.type === 'click' || e.type === 'keydown' && (kc === 13 || kc === 32))) {

            if (_.o.single) _.closeAll(t);

            _.toggle(t);
        }
        if (e.type === "keydown") {
            if (e.ctrlKey === true) {
                // if user press ctrl + up arrow
                if (e.keyCode === 38) {
                    _.getTab(e).focus();
                }

                // if user press ctrl + page up
                if (e.keyCode === 33) {
                    _.move2(_.current(_.getTab(e)) - 1);
                }
                // if user press ctrl + page down
                if (e.keyCode === 34) {
                    _.move2(_.current(_.getTab(e)) + 1);
                }
            }
            if (_.isTab(t)) {
                if (e.keyCode === 37 || e.keyCode === 38) {
                    _.move2(_.current(t) - 1);
                }
                if (e.keyCode === 39 || e.keyCode === 40) {
                    _.move2(_.current(t) + 1);
                }
                // end
                if (e.keyCode === 36) _.move2(0);
                if (e.keyCode === 35) _.move2(_.btns.length - 1);
            }
        }
        e.stopPropagation();
    };

    _.closeAll = function (t) {
        for (var i = 0; i < _.btns.length; i++) {
            if (_.btns[i] !== t) _.close(i);
        }
    };

    _.close = function (i) {
        var b = _.btns[i],
            p = _.panels[i];
        b.setAttribute('aria-selected', false);
        b.setAttribute('aria-expanded', false);
        p.setAttribute('aria-hidden', true);
    };

    _.getTab = function (e) {
        var cc = e.target;
        if (_.isTab(cc)) {
            return cc;
        }
        while (!_.isTabPanel(cc)) {
            cc = cc.parentElement;
        }
        console.log(_.w);
        return _.w.querySelector("#" + cc.getAttribute('aria-labelledby'));
    };

    _.current = function (c) {
        var l = _.btns,
            i,
            ci;
        for (i = 0; i < l.length; i++) {
            if (l[i] === c) {
                ci = i;
            }
        }
        return ci;
    };

    _.move2 = function (i) {
        if (i < 0) i = _.btns.length - 1;else if (i >= _.btns.length) i = 0;
        _.btns[i].focus();
    };

    _.toggle = function (t) {
        var s = t.getAttribute('aria-expanded');
        s = s == 'false' ? true : false;

        t.setAttribute('aria-expanded', s);
        t.setAttribute('aria-selected', s);
        t.nextElementSibling.setAttribute('aria-hidden', !s);
    };

    _.setup = function (w) {
        var p, b, i;

        w.setAttribute('role', 'tablist');
        w.setAttribute('aria-multiselectable', true);

        _.btns = w.querySelectorAll('[role=tab]');
        _.panels = w.querySelectorAll('[role=tabpanel]');

        if (_.btns.length !== _.panels.length) {
            throw 'accordion module : numbers of control tabs and panels dont match';
        } else {
            for (i = 0; i < _.btns.length; i++) {
                b = _.btns[i];
                p = _.panels[i];
                b.id = 'a' + _.id + '-tab' + (i + 1);
                p.setAttribute('aria-labelledby', b.id);
                b.setAttribute('tabindex', 0);
                b.setAttribute('aria-expanded', _.o.open);
                b.setAttribute('aria-selected', _.o.open);
                p.setAttribute('aria-hidden', !_.o.open);
            };
        };

        w.addEventListener('click', _.handleUserEvent);
        w.addEventListener('keydown', _.handleUserEvent);
    };

    (function () {
        _.o.open = _.o.open || false;
        _.setup(_.o.target);
    })();
}

function pageLoaded() {
    new Accordion({
        target: document.querySelector('[data-widget=accordion]'),
        single: true
    });
};

document.addEventListener('Load', pageLoaded());
//# sourceMappingURL=add-mod.js.map
