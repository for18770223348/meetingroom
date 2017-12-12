/**
 *Created by forjie on 2017/12/11
 */

$(document).ready(function () {
     foo() ;            //请求初始数据,初始化页面
    page_incident();     //页面事件 :点击--没 变颜色, 有 删除颜色,
    get_time();
});

//发送ajax请求到后端拿数据,渲染页面  发送日期
function foo() {

        $.ajax({
        url:'/book/',
        type:'get',
        data:{
            'choice_time':'2017-12-12'
        },
        success:function (data) {
            var ret = data;
            if(ret.status){
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
            })
            }
            else{
                $('.err').html(ret.msg)
            }

        }
    })
}

dict={
    add_list:{},
    del_list:{}
};


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
            }
            else{
                dict.add_list[room_id]=[time_id]
            }
        }

    });

}

function get_time() {
   $('#datetimepicker').datetimepicker({
        minView: "month",//设置只显示到月份
        format: 'yyyy-mm-dd',//显示格式
        autoclose: true,//选完自动关闭
        todayBtn: true,
    });
   $('#datetimepicker').on('changeDate', function(ev){
    alert(4324)
});

}




