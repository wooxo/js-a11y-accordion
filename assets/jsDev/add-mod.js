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
    _.btns = [];
    _.panels = [];

    _.animTimer = function () {
        this.classList.remove('isAnimated');
        var st = this.getAttribute('aria-hidden') === 'true' ? true : false;
        this.setAttribute('aria-hidden', !st);
        this.classList.remove('isOpen');
        this.removeEventListener(_.o.anim, _.animTimer, true);
    };

    _.animEvent = function () {
        var e,
            el = document.createElement('fakeelement'),
            events = {
            'animation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'MozAnimation': 'animationend',
            'WebkitTransition': 'webkitAnimationEnd'
        };

        for (e in events) {
            if (el.style[e] !== undefined) {
                return events[e];
            }
        }
    };

    _.isTab = function (el) {
        return (el.hasAttribute('role') && el.getAttribute('role') === 'tab');
    }

    _.isTabPanel = function (el) {
        return (el.hasAttribute('role') && el.getAttribute('role') === 'tabpanel');
    }

    _.handleUserEvent = function (e) {
        e = e ? e : arguments[0];

        var t = e.target || e.srcElement,
            kc = e.keyCode,
            em = e.currentTarget;
        if(em == document && _.o.closeOut){
            _.closeAll();
            e.stopPropagation();
        }
        if (_.isTab(t) &&
            (e.type === 'click' || (e.type === 'keydown' && (kc === 13 || kc === 32)))) {

            _.closeAll(t);
            _.toggle(_.current(t));
        }
        if (e.type === "keydown") {
        if (e.ctrlKey === true) {
            if (kc === 38) {
                _.getTab(e).focus();
            }
            if (kc === 33) {
                _.move2(_.current(_.getTab(e)) - 1);
            }
            if (kc === 34) {
                _.move2(_.current(_.getTab(e)) + 1);
            }
        }
        if (_.isTab(t)) {
            if (kc === 37 || kc === 38) {
                _.move2(_.current(t) - 1);
            }
            if (kc === 39 || kc === 40) {
                _.move2(_.current(t) + 1);
            }
            if (kc === 36) _.move2(0);
            if (kc === 35) _.move2(_.btns.length - 1);
        }
    }

        e.stopPropagation();
    };

    _.closeAll = function (t) {
        for (var i = 0; i < _.btns.length; i++) {

            if (_.btns[i] !== t && !_.o.multi ) _.close(i);
        }
    }
    _.open = function(i){
        var b = _.btns[i],
            p = _.panels[i];
        if(p.classList.contains('isAnimated') !== true && b.hasAttribute('aria-expanded') && b.getAttribute('aria-expanded') === "false"){
            b.classList.add('isOpen');
            p.classList.add('isOpen');
            b.setAttribute('aria-selected', true);
            b.setAttribute('aria-expanded', true);
            p.setAttribute('aria-hidden', false);
        }
    }
    _.close = function (i) {
        var b = _.btns[i],
            p = _.panels[i];
        if(b && b.getAttribute('aria-expanded') === "true"){
            b.setAttribute('aria-selected', false);
            b.setAttribute('aria-expanded', false);
            b.classList.remove('isOpen');
            if (_.o.anim) {
                p.classList.add('isAnimated');
                p.addEventListener(_.o.anim, _.animTimer, true);
            } else {
                p.setAttribute('aria-hidden', true);
                p.classList.remove('isOpen');
            }
        }
    }

    _.getTab = function (e) {
        var cc = e.target;
        if (_.isTab(cc)) {
            return cc;
        }
        while (!_.isTabPanel(cc)) {
            cc = cc.parentElement;
        }
        return _.w.getElementById(cc.getAttribute('aria-labelledby'));
    };

    _.current = function (c) {
        var l = _.btns,
            i, ci;
        for (i = 0; i < l.length; i++) {
            if (l[i] === c) {
                ci = i;
            }
        }
        return ci;
    }

    _.move2 = function (i) {
        if (i < 0) i = _.btns.length - 1;
        else if (i >= _.btns.length) i = 0;
        _.btns[i].focus();
    };

    _.toggle = function (i) {
        var btn = _.btns[i];

        if( btn && btn.getAttribute('aria-expanded') !== 'true') {
            _.open(i);
        } else {
            _.close(i);
        }
    };

    _.setup = function (w) {
        var p, b, i, els = w.children;

        document.addEventListener('click', _.handleUserEvent);
        document.addEventListener('keydown', _.handleUserEvent);

        w.setAttribute('role', 'tablist');

        w.setAttribute('aria-multiselectable', _.o.multi);

        for( i = 0; i < els.length; i++ ){
            if (_.isTab(els[i])) _.btns.push(els[i]);
            if (_.isTabPanel(els[i])) _.panels.push(els[i]);
        };

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
        _.o.multi = _.o.multi || false;
        _.o.anim = _.o.anim ? _.animEvent() : false;
        _.setup(_.o.target);
    })();
}
