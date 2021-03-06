/**
 *Created by forjie on 2017/12/11
 *
 */
Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };



$(document).ready(function () {

    get_time();
});


function get_time() {
   $('#datetimepicker').datetimepicker({
        minView: "month",//设置只显示到月份
        format: 'yyyy-mm-dd',//显示格式
        language: "zh-CN",  //语言
        autoclose: true,//选完自动关闭
        startDate: new Date(),  //起始日期,是新日期
        todayBtn: true,
        bootcssVer: 3
    });
   $('#datetimepicker').on('changeDate', func);

   var choice_time=new Date();

   foo(choice_time.Format('yyyy-MM-dd')) ;            //请求初始数据,初始化页面
    page_incident();     //页面事件 :点击--没 变颜色, 有 删除颜色,
    booking()

}

//发送ajax请求到后端拿数据,渲染页面  发送日期
function foo(choice_time) {

        $.ajax({
        url:'/book/',
        type:'get',
        data:{
            'choice_time':choice_time
        },
        success:function (data) {
            var ret = data;
            if(ret.status){
                $('#Tbody').html('');
                   $.each(ret.data,function (k,v) {
                var tr =document.createElement('tr');

                $.each(v,function (key,value) {

                    var td =document.createElement('td');

                    $(td).text(value.text);
                    // $.each(value.attrs,function (q,w) {
                    //     $(td).attr(q,w);
                    // });
                    $(td).attr(value.attrs);
                    tr.append(td);
                    $('#Tbody').append(tr)

                })
            });
                dict={
                    add_list:{},
                    del_list:{}
                };
            }
            else{
                $('.err').html(ret.msg)
            }

        }
    })
}

//拿到点击事件的信息.
function page_incident() {
    $('#Tbody').on('click','td[room_id][is_self != "true"]',function () {

        var time_id=$(this).attr('time');
        var room_id=$(this).attr('room_id');

        //减少
        if($(this).hasClass('suc')){
            $(this).removeAttr('class').empty();  //要time,room_id
            if (dict.del_list[room_id]) {
                var del_index=dict.del_list[room_id].indexOf(time_id);
                if (del_index === -1){
                    dict.del_list[room_id].push(time_id);
                }else{
                    dict.del_list[room_id].splice(del_index,1)
                }

            }
            else{
                dict.del_list[room_id]=[time_id];           //{add_list:{room_id:[time_id]}}
            }
        }
        //增加
        else{
            $(this).removeAttr('class');
            $(this).addClass('suc').empty();

            if (dict.add_list[room_id]){
                var add_index=dict.add_list[room_id].indexOf(time_id);
                if (add_index === -1){
                    dict.add_list[room_id].push(time_id)
                }
                else{
                    dict.add_list[room_id].splice(add_index,1)
                }
            }
            else{
                dict.add_list[room_id]=[time_id]
            }
        }

    });

}

dict={
    add_list:{},
    del_list:{}
};
corrent_time=new Date().Format('yyyy-MM-dd');       //这个corrent_time是传到下面的booking函数
function func(ev) {
    var corrent_time=ev.date.Format('yyyy-MM-dd');   //格式化时间,当你的时间插件变化时执行此函数.
        foo(corrent_time)               //这里是当点击的时候,会执行上面的函数,把上面corrent_time传到上面去

}
function booking() {
    $('.c1').click(function () {
    console.log(dict);
    $.ajax({
        url:'/book/',
        type:'POST',
        headers:{"X-CSRFToken":$.cookie('csrftoken')},
        data:{
            key:JSON.stringify(dict),
            corr_time:corrent_time
        },
        success:function (data) {
            var res=data;
            console.log(res)
        }

    })

});

}







