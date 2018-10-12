/*
* option{
*   DOM : 对应元素
*   animaterTimer 动画过度时间
*   intervalTime 图片切换时间
*   imgList : [img1,img2]
*   aroundBtn 左右按钮
*   bottomBtn 下边按钮
* }
* */
class imgLunbo{
    constructor(DOM,option){
        this.option = $.extend({
            "animaterTimer" : 1000,
            "intervalTime" : 2000,
            "aroundBtn" : false,
            "bottomBtn" : false,
        },option)
        this.DOM = DOM;
        this.init();
        this.timer;
    }
    init () {
        //拼接html
        this.joinDom();
        //绑定事件
        this.bindEvent();
        //定时轮播
        this.interval_img();
    }
    joinDom () {
        let that = this,
            _html = "",
            btn_circleHtml='';
        //左按钮
        if(that.option.aroundBtn){
            _html += `
                <div class="left" >
                    <i class="iconfont icon-07jiantouxiangzuofill"></i>
                </div>
            `;
        }
        //主体图片部分
        _html += `<div class="content"><ul class="imgList">`;
        $.each(that.option.imgList,(i,v)=>{
            if(i == that.option.imgList.length-1){
                _html += `<li class="prev"><img src="${v}" alt=""></li>`;
            }else if(i == 0){
                _html += `<li class="now"><img src="${v}" alt=""></li>`;
            }else if(i == 1){
                _html += `<li class="next"><img src="${v}" alt=""></li>`;
            }else{
                _html += `<li><img src="${v}" alt=""></li>`;
            }
            // btn_circleHtml += `<li class="${i==0?'active':''}" data-img="${v}"></li>`
        })
        _html +=`</ul><ul class="btn_circle">${btn_circleHtml}</ul></div>`;
        //右按钮
        if(that.option.aroundBtn){
            _html += `
                <div class="right">
                <i class="iconfont icon-07jiantouxiangyoufill"></i>
            </div>
            `;
        }
        $(that.DOM).html(_html);
    }
    bindEvent(){
        let that = this;
        //初始化popover
        $(".btn_circle li").each((i,v)=>{
            $(v).popover({
                trigger:'hover', //触发方式
                placement:'top',
                html: true, // 为true的话，data-content里就能放html代码了
                content:`<div class="thumbnail">
                        <img src="${$(v).attr('data-img')}" alt="">
                    </div>`,//这里可以直接写字符串，也可以 是一个函数，该函数返回一个字符串；
            })
        })
        //左右移动
        $(".left,.right").click(function(){
            eval(`that.to${$(this).attr("class")}()`);
        })
        //点击下边圆球
        $(".btn_circle li").click(function(){
            that.start($(".imgList li").eq($(this).index()));
        })
        //绑定对应点击事件 点击图片
        $(".imgList li").on({
            'click':function(){
                console.log('qqqqq')
                that.start($(this));
            },
            'mouseenter':function(){
                clearInterval(that.timer)
            },
            'mouseleave':function(){
                that.interval_img();
            },
        })
        $(".btn_circle li").on({
            'click' : function(){
                clearInterval(that.timer)
                that.start($(".imgList li").eq($(this).index()));
                that.interval_img();
            }
        })
    }
    interval_img(){
        let that = this;
        that.timer = setInterval(()=>{
            that.start(that.nextDom($('.now')));
        },that.option.intervalTime)
    }
    start($dom){
        let num = $dom.index();
        //图片状态改变
        if(!$dom.hasClass("now")){
            $dom.parent().children('.now,.next,.prev').removeClass("now next prev");
            //对应元素添加class
            this.prevDom($dom).addClass("prev");
            $dom.addClass("now");
            this.nextDom($dom).addClass("next");
        }
        //圆点状态改变
        if(!$(".btn_circle li").eq(num).hasClass("active")){
            $(".btn_circle li").eq(num).addClass('active').siblings(".active").removeClass('active');
        }
    }
    prevDom($dom){
        //获取上一个元素
        if($dom.index() == 0) return $dom.parent().children(":last-child");
        return $dom.prev();
    }
    nextDom($dom){
        //获取下一个元素
        if($dom.index() == $dom.siblings().length) return $dom.parent().children(":first-child")
        return $dom.next();
    }
    toleft(){
        this.start(this.prevDom($(".now")))
    }
    toright(){
        this.start(this.nextDom($(".now")))
    }
}
function slideShow(option){
    return this.each(function(){
        let $this = $(this),
            slideData = $this.data("slideData");
        if(!slideData){
            $this.data("slideData",(slideData = new imgLunbo(this,option)))
        }
        //调用对应事件
        if(typeof option == 'string'){
            slideData[option] && slideData[option].apply(slideData);
        }
    })
}
$.fn.slideShow = slideShow;
//禁止图片的拖动
$("img").on("mousedown",(e)=>{
    e.preventDefault();
})

