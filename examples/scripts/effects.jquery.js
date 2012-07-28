jQuery.extend(jQuery.easing, {
    easeOutQuad: function (x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
});

$.fn.zoomIn = function (duration, callback) {
    duration = duration || 1000;
    callback = callback || function () {};
    $(this).each(function (i, e) {
        var $e = $(e);

        $e.css('display', 'block');
        var pos = $e.data('original-position') || $e.position();
        pos.width = $e.data('original-width') || $e.width();
        pos.height = $e.data('original-height') || $e.height();

        $e.stop(true).css({
            top: (pos.top + pos.height / 4) + 'px',
            left: (pos.left + pos.width / 4) + 'px',
            width: pos.width / 2 + 'px',
            height: pos.height / 2 + 'px',
            visibility: 'visible'
        }).animate({
            width: pos.width + 'px',
            height: pos.height + 'px',
            top: pos.top + 'px',
            left: pos.left + 'px'
        }, duration, 'easeOutBack', callback);
    });
}
$.fn.zoomOut = function (duration, callback) {
    duration = duration || 1000;
    callback = callback || function () {};
    $(this).each(function (i, e) {
        var $e = $(e);

        pos = $e.data('original-position') || $e.position();
        var width = $e.data('original-width') || $e.width();
        var height = $e.data('original-height') || $e.height();

        if(!$e.data('original-width')){
            $e.data('original-width', $e.width());
            $e.data('original-height', $e.height());
            $e.data('original-position', $e.position());
            $e.data('original-opacity', $e.css('opacity'));
        }

        $e.stop(true).animate({
            top: (pos.top + height / 4) + 'px',
            left: (pos.left + width / 4) + 'px',
            width: width / 2 + 'px',
            height: height / 2 + 'px',
            opacity: 0.0
        }, duration, 'easeOutQuad', function () {
            $(this).css({
                visibility: 'hidden',
                opacity: $e.data('original-opacity') || 1,
                display: 'block',
                top: pos.top,
                left: pos.left,
                width: width + 'px',
                height: height + 'px'
            });
            callback();
        });
    });
};