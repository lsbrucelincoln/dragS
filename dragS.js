(function($, window, undefined) {
    if (typeof $ === 'undefined') {
        throw new Error('dragS\'s script requires jQuery');
    }
    var dragS = null;
    var d = {
        player: null, //可以拖出元素也可以接受元素
        giver: null,
        receiver: null,
        mode: "normal", //normal,strict两种模式
        dragElement: null,
        noDragElement: null,
        chooseElement: function($this) {},
        cancelChoose: function($this) {}
    };

    function init(option) {
        var o = $.extend(true, {}, d, option);
        var that = this;
        that.o = o;
        that.isDrag = false;
        that.hasChosen = false;
        that.setJqueryFunction();
        that.initArea();
        that.insertSelection();
        that.initBind();
    }
    function writeElementPlace() {
        var leftList = [];
        $(".dragElement").each(function(index, el) {
            leftList[index] = {};
            leftList[index].y1 = $(el).offset().top;
            leftList[index].y2 = $(el).offset().top + $(el).height();
            leftList[index].x1 = $(el).offset().left;
            leftList[index].x2 = $(el).offset().left + $(el).width();
        });
        return leftList;
    }
    function DragS($this, option) {
        this.$this = $this;
        init.call(this, option);
    }
    $.extend(DragS.prototype, {
        // 设置jquery拓展方法
        setJqueryFunction: function() {
            var that = this;
            $.fn.extend({
                chosenDragElement: function(option) {
                    this.addClass('chosenDragElement');
                    that.o.chooseElement(this);
                },
                removeChosenElement: function(option) {
                    this.removeClass('chosenDragElement');
                    that.o.cancelChoose(this);
                }
            })
        },
        // 初始化绑定事件
        initBind: function() {
            var that = this;
            var $this = that.$this;
            var oldX, oldY;
            $this.on('mousedown', function(e) {
                console.log(that.startMove);
                if (!that.startMove) {
                    $(".dragGiver .dragElement").removeChosenElement();
                    that.hasChosen = false;
                }
                that.startMove = false;
                console.log('down');
                oldX = e.clientX;
                oldY = e.clientY;
                $(".dragSelection").css({
                    left: oldX,
                    top: oldY + $("body").scrollTop()
                }).css('border', '1px solid #000');
                that.isDrag = true;
            });
            $this.on('mousemove', function(e) {
                if (!that.isDrag) return false;
                if (!that.hasChosen) {
                    $(".dragSelection").show().css({
                        width: Math.abs(e.clientX - oldX),
                        height: Math.abs(e.clientY - oldY)
                    });
                    if (e.clientY - oldY < 0 && e.clientX - oldX > 0) {
                        $(".dragSelection").css({
                            left: oldX,
                            top: e.clientY + $("body").scrollTop()
                        });
                    }
                    if (e.clientX - oldX < 0 && e.clientY - oldY > 0) {
                        $(".dragSelection").css({
                            left: e.clientX,
                            top: oldY + $("body").scrollTop()
                        });
                    }
                    if (e.clientX - oldX < 0 && e.clientY - oldY < 0) {
                        $(".dragSelection").css({
                            left: e.clientX,
                            top: e.clientY + $("body").scrollTop()
                        });
                    }
                    if (e.clientX - oldX > 0 && e.clientY - oldY > 0) {
                        $(".dragSelection").css({
                            left: oldX,
                            top: oldY + $("body").scrollTop()
                        });
                    }
                }
            });
            $this.on('mouseup', function(e) {
                if (!that.isDrag) return false;
                // if (hasChosen) return false;
                console.log('up');
                that.isDrag = false;
                $(".dragSelection").hide().css({
                    width: Math.abs(e.clientX - oldX),
                    height: Math.abs(e.clientY - oldY)
                });
                // console.log(that.leftList);
                for (var i = 0; i < that.leftList.length; i++) {
                    if (that.leftList[i].y1 > parseInt($(".dragSelection").css('top')) && that.leftList[i].y2 < parseInt($(".dragSelection").css('top')) + parseInt($(".dragSelection").css('height'))) {
                        if (that.leftList[i].x1 < parseInt($(".dragSelection").css('left')) + parseInt($(".dragSelection").css('width')) && that.leftList[i].x2 > parseInt($(".dragSelection").css('left'))) {
                            $(".dragElement").eq(i).chosenDragElement();
                        }
                    }
                }
                if ($(".dragGiver .chosenDragElement").length > 0) {
                    that.hasChosen = true;
                }
            });
            // 点击选中
            $this.on('click', '.dragGiver .dragElement', function(event) {
                console.log('click');
                event.stopPropagation();
                if ($(this).hasClass('chosenDragElement')) {
                    $(this).removeChosenElement();
                    that.startMove = false;
                } else {
                    $(this).chosenDragElement();
                    that.hasChosen = true;
                    // that.startMove=true;
                }
            });
            //移动已选择元素，禁止拖选框事件 
            $this.on('mousedown', '.dragElement ', function(e) {
                that.startMove = true;
                console.log(that.startMove);
            });
            // html5 drag方法
            var eleDrag;
            $this.on('dragstart', ".dragGiver", function(e) {
                var target = $(e.target).clone().empty();
                target.append($(e.target).find('.chosenDragElement').clone());
                console.log(target[0]);
                e.dataTransfer = e.originalEvent.dataTransfer;
                console.log(e.dataTransfer);
                e.dataTransfer.setData('text', target[0].innerHTML);
                e.dataTransfer.setDragImage(target[0], 0, 0);
                return true;
            });
            $this.on('dragend', " .dragGiver", function(e) {
                return true;
            });
            $this.on('dragover', ".dragReceiver", function(e) {
                e.preventDefault();
                $(".selection").hide();
            });
            $this.on('drop', ".dragReceiver", function(e) {
                console.log('test');
                $(this).append($(".dragGiver").children(".chosenDragElement"));
                that.hasChosen = false;
                that.isDrag = false;
                that.leftList = writeElementPlace();
                $(".dragGiver .dragElement").removeChosenElement();
            });
        },
        // 插入框选框
        insertSelection: function() {
            var that = this;
            var $this = that.$this;
            var selection = $("<div class='dragSelection'>");
            selection.css({
                position: 'absolute',
                display: 'none'
            });
            $this.append(selection);
        },
        initArea: function() {
            var that = this;
            var $this = that.$this;
            var o = that.o;
            console.log(o);
            that.leftList = [];
            if (!o.player && !o.giver && !o.giver) {
                $this.children().each(function(index, el) {
                    if (!$(el).hasClass('dragGiver') && !$(el).hasClass('dragReceiver')) {
                        $(el).addClass('dragGiver dragReceiver').attr('draggable', 'true');
                    }
                });
            } else {
                if (o.player) {
                    $(o.player).each(function(index, el) {
                        if (!$(el).hasClass('dragGiver') && !$(el).hasClass('dragReceiver')) {
                            $(el).addClass('dragGiver dragReceiver').attr('draggable', 'true');
                        }
                    });
                }
                if (o.giver) {
                    $(o.giver).each(function(index, el) {
                        if (!$(el).hasClass('dragGiver')) {
                            $(el).addClass('dragGiver').attr('draggable', 'true');
                        }
                    });
                }
                if (o.receiver) {
                    $(o.receiver).each(function(index, el) {
                        if (!$(el).hasClass('dragReceiver')) {
                            $(el).addClass('dragReceiver').attr('draggable', 'true');
                        }
                    });
                }
            }
            if (o.dragElement) {
                $(o.dragElement).each(function(index, el) {
                    if (!$(el).hasClass('dragElement')) {
                        $(el).addClass('dragElement');
                    }
                });
            } else {
                $(".dragGiver").children().each(function(index, el) {
                    if (!$(el).hasClass('dragElement')) {
                        $(el).addClass('dragElement');
                    }
                });
            }
            console.log(o.noDragElement);
            if (o.noDragElement) {
                $(".dragGiver").children(o.noDragElement).removeClass('dragElement');
            }
            that.leftList = writeElementPlace();
        },
    })
    $.fn.dragS = function(option) {
        if (!dragS) {
            dragS = new DragS($(this), option);
        }
        return this;
    };
    $.fn.dragS.version = '0.1.0';
    // 暴露方法
    $.each(["initArea"], function(index, val) {
        $.fn.dragS[val] = function() {
            if (!dragS) {
                return 0;
            }
            return dragS[val].apply(dragS, [].slice.call(arguments, 0));
        }
    });
})(jQuery, window)
