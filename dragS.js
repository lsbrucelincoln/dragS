(function($, window, undefined) {
    if (typeof $ === 'undefined') {
        throw new Error('dragS\'s script requires jQuery');
    }
    var dragS = null;
    var d = {
        container: ".mainBody",
    };

    function init(option) {
        var o = $.extend(true, {}, d, option);
        var that = this;
        that.o = o;
        that.isDrag = false;
        that.hasChosen = false;
        that.startMove = false;
        that.initBind();
    }

    function DragS($this, option) {
        this.$this = $this;
        init.call(this, option);
    }
    $.extend(DragS.prototype, {
        initBind: function() {
            var that = this;
            var $this = that.$this;
            $this.on('mousedown', function(e) {
                console.log('down');
                oldX = e.clientX;
                oldY = e.clientY;
                $(".selection").css({
                    left: oldX,
                    top: oldY + $("body").scrollTop()
                }).addClass('selectionBorder');
                that.isDrag = true;
            });
            $this.on('mousemove', function(e) {
                if (that.startMove) return false;
                if (!that.isDrag) return false;
                if (!that.hasChosen) {
                    $(".selection").show().css({
                        width: Math.abs(e.clientX - oldX),
                        height: Math.abs(e.clientY - oldY)
                    });
                    if (e.clientY - oldY < 0 && e.clientX - oldX > 0) {
                        $(".selection").css({
                            left: oldX,
                            top: e.clientY + $("body").scrollTop()
                        });
                    }
                    if (e.clientX - oldX < 0 && e.clientY - oldY > 0) {
                        $(".selection").css({
                            left: e.clientX,
                            top: oldY + $("body").scrollTop()
                        });
                    }
                    if (e.clientX - oldX < 0 && e.clientY - oldY < 0) {
                        $(".selection").css({
                            left: e.clientX,
                            top: e.clientY + $("body").scrollTop()
                        });
                    }
                }
            });
            $(".mainBody").on('mouseup', function(e) {
                if (that.startMove) return false;
                if (!that.isDrag) return false;
                // if (hasChosen) return false;
                console.log('up');
                that.isDrag = false;
                $(".selection").hide().css({
                    width: Math.abs(e.clientX - oldX),
                    height: Math.abs(e.clientY - oldY)
                });
                for (var i = 0; i < leftList.length; i++) {
                    if (leftList[i].y1 > parseInt($(".selection").css('top')) && leftList[i].y2 < parseInt($(".selection").css('top')) + parseInt($(".selection").css('height'))) {
                        if (leftList[i].x1 < parseInt($(".selection").css('left')) + parseInt($(".selection").css('width')) && leftList[i].x2 > parseInt($(".selection").css('left'))) {
                            $(".tableRow").eq(i).addClass('chosenRow');
                            $(".tableRow").eq(i).find('input').prop('checked', true);
                        }
                    }
                }
                if ($(".leftTable .chosenRow").length > 0) {
                    that.hasChosen = true;
                }
            });

        }
    })
    $.fn.dragS = function(option) {
        if (!dragS) {
            dragS = new DragS($(this), option);
        }
        return this;
    };
    $.fn.dragS.version = '0.0.1';

})(jQuery, window)
