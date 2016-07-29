# DragS
框选+拖拽，实现多元素拖拽的插件

## 快速上手
### 引入文件
```html
<script type="text/javascript" src="dragS.js"></script>
```
### JS
一句代码即可完成
```javascript
$(".container").dragS();
```
.container为所有操作的父容器，默认将其全部直接子元素设置为可拖拽的容器，
这些子元素的子元素（好绕口）为可拖拽和可框选的元素

更个性化的配置项如下
```javascript
$(".mainBody").dragS({
        player: ".exampleBox", //可以拖出元素也可以接受元素的容器
        giver: ".leftTable", //只可以拖出元素的容器
        receiver: ".rightTable", //只可以接受元素的容器
        mode: "normal", //normal,strict两种模式（还未实现）
        dragElement: ".table",
        noDragElement: ".tableHeader",
    });
```
### player
可以拖出元素也可以接受元素的容器，默认值为null,默认元素为父容器的所有子元素，会获得dragGiver,dragReceiver两个类名
### giver
可以拖出元素但不可以接受元素的容器，默认值为null,默认没有元素，如果设置了且player未设置，则父容器的所有子元素将不会被设置为player。会获得dragGiver这个类名
### receiver
可以接受元素但不可以拖出元素的容器，默认值为null,默认没有元素，如果设置了且player未设置，则父容器的所有子元素将不会被设置为player。会获得dragReceiver这个类名
### mode
框选模式 normal strict两种
normal,只要框框到元素的一部分就会被选中
strict 只有框将元素完全包括才会被选中
### dragElement
设置可选择元素的类名，默认值为null,默认为player和giver的所有子元素
### noDragElement
设置不可选择元素的类名，默认值为null,无默认元素
### chooseElement
选中元素时的回调函数，参数为该元素的jquery对象，可以给元素设置css样式，设置选中后触发的函数
### cancelChoose
取消选中元素时的回调函数，参数为该元素的jquery对象，可以给元素设置css样式，设置选中后触发的函数
## 方法
通过方法，可以改变dragS内部的状态，dragS的方法列表如下
###直接调用的方法
-initArea

典型调用方法的例子如下：

    $.fn.dragS.initArea();

### initArea
重新绑定player,giver,receiver对应的类，通常用于通过js增加了一个容器，或者ajax之后增加了容器，执行一次，保证新增加的容器可以被拖拽


###jQuery对象方法

### chosenDragElement
### removeChosenDragElement
这两个方法可以使用在需要手动选择或者取消选择的".dragElement"元素上
比如要点击一个checkBox，实现元素全选和取消全选
```javascript
$("#selectAll").on('click', function(event) {
    if ($(this).prop("checked") == true) {
        $(".dragGiver .dragElement").chosenDragElement();
    } else {
        $(".dragGiver .dragElement").removeChosenElement();
    }
});
```
