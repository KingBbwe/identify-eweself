/* Haptics for The Chronicles of Auld Ewe.
   Android and most browsers: the Vibration API (navigator.vibrate).
   iPhone: Safari has no Vibration API. On iOS 18 and later, toggling a native switch control (<input type="checkbox" switch>)
   plays the system haptic tick, so we toggle a hidden one. Older iOS has no web haptics at all; this then does nothing. */
(function (root) {
    'use strict';
    var tap = null;
    function hiddenSwitch() {
        if (tap || typeof document === 'undefined' || !document.body) return tap;
        var label = document.createElement('label'), input = document.createElement('input');
        label.id = 'hapticTap'; label.setAttribute('aria-hidden', 'true');
        label.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
        input.type = 'checkbox'; input.setAttribute('switch', ''); input.tabIndex = -1;
        label.appendChild(input); document.body.appendChild(label);
        tap = label; return tap;
    }
    // pattern: a duration in ms or a [buzz, pause, buzz, ...] array, as for navigator.vibrate.
    function haptic(pattern) {
        try { if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function' && navigator.vibrate(pattern)) return 'vibrate'; } catch (e) {}
        var t = hiddenSwitch(); if (!t) return 'none';
        var pulses = Array.isArray(pattern) ? Math.ceil(pattern.length / 2) : 1, at = 0;
        for (var k = 0; k < pulses; k++) {
            (function (delay) { if (delay === 0) t.click(); else setTimeout(function () { t.click(); }, delay); })(at);
            at += Array.isArray(pattern) ? (pattern[2 * k] || 0) + (pattern[2 * k + 1] || 0) + 40 : 0;
        }
        return 'switch';
    }
    root.AuldEweHaptic = haptic;
})(typeof window !== 'undefined' ? window : this);
