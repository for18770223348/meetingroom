# encoding:utf-8
# Author:forjie
# Date:2017/12/11
from django.forms import Form
from django.forms import widgets
from django.forms import fields


class Loginform(Form):
    name=fields.CharField(required=True,error_messages={'required':'不能为空'},widget=widgets.TextInput(attrs={
        'placeholder': '用户名','class':'username'
    }))
    password=fields.CharField(required=True,error_messages={'required':'不能为空'},widget=widgets.PasswordInput(attrs={
        'placeholder': '密码', 'class':'password'
    }))
    val=fields.BooleanField(required=False,widget=widgets.CheckboxInput(attrs={'value':1}))  #这个是设置一周免费登录

