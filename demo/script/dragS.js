jQuery(document).ready(function($) {
    var leftList = [];
    // 获得列表中个元素位置（左上和右下）
    $(".tableRow").each(function(index, el) {
        // console.log($(el).offset().left);
        // console.log($(el).offset().left+$(el).width());
        leftList[index] = {};
        leftList[index].y1 = $(el).offset().top;
        leftList[index].y2 = $(el).offset().top + $(el).height();
        leftList[index].x1 = $(el).offset().left;
        leftList[index].x2 = $(el).offset().left + $(el).width();
    });
    var oldX, oldY;
    // 是否拖出选取框flag
    var isDrag = false;
    // 是否有元素选中flag
    var hasChosen = false;
    // 是否拖动选中元素flag
    var startMove = false;
    // 生成拖选框
    $(".mainBody").on('mousedown', function(e) {
        console.log('down');
        oldX = e.clientX;
        oldY = e.clientY;
        $(".selection").css({
            left: oldX,
            top: oldY + $("body").scrollTop()
        }).addClass('selectionBorder');
        isDrag = true;
    });
    $(".mainBody").on('mousemove', function(e) {
        if (startMove) return false;
        if (!isDrag) return false;
        if (!hasChosen) {
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
        if (startMove) return false;
        if (!isDrag) return false;
        // if (hasChosen) return false;
        console.log('up');
        isDrag = false;
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
            hasChosen = true;
        }
    });
    // 点击选中
    $(".mainBody").on('click', '.leftTable .tableRow', function(event) {
        console.log('click');
        event.stopPropagation();
        $(this).addClass('chosenRow');
        $(this).find('input').prop('checked', true);
    });

    //移动已选择元素，禁止拖选框事件 
    $(".mainBody").on('mousemove', '.leftTable .chosenRow', function(e) {
        if (!startMove) return false;
        startMove = false;
        e.preventDefault();
    });
    // 点击checkbox
    $(".mainBody").on('click', '.tableRow input', function(event) {
        event.stopPropagation();
        if ($(this).prop("checked") == true) {
            $(this).parents(".tableRow").addClass('chosenRow');
        } else {
            $(this).parents(".tableRow").removeClass('chosenRow');
        }
    });
    // html5 drag方法
    var eleDrag;
    $(".mainBody").on('dragstart',".leftTable" ,function(e) {
        var target = $(e.target).clone().empty();
        target.append($(e.target).find('.chosenRow').clone());
        console.log(target[0]);
        e.dataTransfer = e.originalEvent.dataTransfer
        console.log(e.dataTransfer);
        e.dataTransfer.setData('text', target[0].innerHTML);
        e.dataTransfer.setDragImage(target[0], 0, 0);
        return true;
    });
    $(".mainBody").on('dragend'," .leftTable", function(e) {
        return true;
    });
    $(".mainBody").on('dragover',".rightTable", function(e) {
        e.preventDefault();
        $(".selection").hide();
    });
    $(".mainBody").on('drop',".rightTable", function(e) {
        console.log('test');
        $(this).append($(".leftTable").children(".chosenRow"));
        hasChosen = false;
        isDrag = false;
    });
    // 点击全选
    $("#selectAll").on('click', function(event) {
        if ($(this).prop("checked") == true) {
            $(".leftTable .tableRow").find('input').prop("checked", true);
            $(".leftTable .tableRow").addClass('chosenRow');
        }else{
            $(".leftTable .tableRow").find('input').prop("checked", false);
            $(".leftTable .tableRow").removeClass('chosenRow');
        }
    });
    // 右侧点击返回
    $(".rightBox").on('click', '.chosenRow input', function(event) {
    	$(".leftTable").append($(this).parents(".tableRow"));
    });
    // 点击新增组
    $(".addGroup").on('click',  function(event) {
    	event.preventDefault();
    	$(this).before('<div class="groupBox"><p class="groupName">小组名称<input type="text" value="名称"></p><div class="rightTable"><div class="tableHeader"><div class="studyNum">学号</div><span class="studentName">名称</span></div></div></div>');
    });
});
