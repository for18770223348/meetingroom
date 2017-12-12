/**
 *Created by forjie on 2017/12/11
 */

$(document).ready(function () {
     foo() ;

});
function foo() {

        $.ajax({
        url:'/book/',
        type:'get',
        data:{
            'choice_time':'2017-12-12'
        },
        success:function (data) {
            var ret = data;

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
    })
}

