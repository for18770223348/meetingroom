from django.shortcuts import render,HttpResponse,redirect

# Create your views here.
from app01 import models
from app01.static.forms import Loginform
from django.http import JsonResponse
import datetime


def login(request):

    if request.method=='GET':
      form = Loginform()

      return render(request,'login.html',{'form':form})
    else:
        form=Loginform(request.POST)
        if form.is_valid():
            val=form.cleaned_data.pop('val')
            user_obj=models.User.objects.filter(**form.cleaned_data).first()         #这里如果是auth模块的话,要先用MD5加密再比较

            if user_obj:
                request.session['name']=form.cleaned_data['name']
                request.session['id']=user_obj.id
                if val:
                    request.session.set_expiry(60 * 60 * 24 * 30)
                return redirect('/index/')

            else:
                form.add_error('password','账号密码错误')
                return redirect('/login/')
        return redirect('/login/')





def index(request):
    '''
    :param request:
    :return:
    页面:
    '''


    all_time=models.Result.choice_time
    # room=models.BoardRoom.objects.all()

    #前端发送数据,要我有几个room ,他创建,并且发送一行多少个时间段  time:1,room_id:1
    #前端显示的时候:实例化tr,在实例化td,取data里的title,然后tr append(td),在Tbody.append(tr)
    #[{'text':''}{'text':''}]



    return render(request,'index.html',{'all_time':all_time})

def book(request):

    #做时间上的比对
    tm=datetime.datetime.now().date()  #现在时间                  #取到的时间格式是2011-11-12
    choice_time=request.GET.get('choice_time')
    choice_time=datetime.datetime.strptime(choice_time,'%Y-%m-%d').date()  #从数据库拿出来的时间
    if choice_time<tm:
        raise Exception('选择的日期不能小于当前日期')


    #整理数据格式,以便下面判断,为的是更快的找到数据,加快电脑运行速度
    res_dict={}
    res_list=models.Result.objects.filter(day=choice_time)

    print(request.session['name'])
    for res in res_list:

        if res.room_id not in res_dict:
            res_dict[res.room_id]={
                res.time:{'user_id':res.user_id,'username':res.user.name}  #res.user.name是跨表查询
            }
        else:
            res_dict[res.room_id][res.time]={'user_id':res.user_id,'username':res.user.name}

    response={'status':True,'msg':None,'data':None}


    try:
        out_lst=[]
        room_list=models.BoardRoom.objects.all()
        all_time = models.Result.choice_time
        user_list=models.User.objects.all()


        for room in room_list:      #遍历room,弄出tr
            lst=[]
            lst.append({'text':room.title,'attrs':''})
            for time_num in all_time:       #遍历时间段 弄出td

                if room.id in res_dict and time_num[0] in res_dict[room.id]:
                    if res_dict[room.id][time_num[0]]['username']==request.session['name']:
                        lst.append({'text':res_dict[room.id][time_num[0]]['username'],'attrs':{'class':'chonsen','room_id':room.id,'time':time_num[0]}})
                    else:
                        lst.append({'text': res_dict[room.id][time_num[0]]['username'],
                                    'attrs': {'class': 'chonsen', 'room_id': room.id, 'time': time_num[0],
                                              'is_self':'true'}})
                else:
                    lst.append({'text':'','attrs':{'class':'','room_id':room.id,'time':time_num[0]}})


            #     lst.append({'text': '','attrs':''})
            #     for i in user_list:             #判断用户名
            #         res_obj=models.Result.objects.filter(time=time_num[0], room=room, user=i).first()
            #         if  res_obj:
            #
            #             lst[-1]={'text':i.name,'attrs':{'class':'chonsen','room_id':room.id,'time':time_num[0]}}
            #             # print(lst[-1])

            out_lst.append(lst)
        response['data']=out_lst
        print(out_lst)
    except Exception as e:
        response['status']=False
        response['msg']=str(e)

    return JsonResponse(response)


