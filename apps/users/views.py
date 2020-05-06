from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponse, HttpResponseRedirect
from apps.users.form import LoginForm
from django.contrib.auth import authenticate, login
from django.urls import reverse

from apps.users.models import UserProfile
# Create your views here.
class LoginView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'login.html')

    def post(self, request, *args, **kwargs):
        """
        用户登录验证
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # 实例化 LoginForm
        
        login_form = LoginForm(request.POST)
        if login_form.is_valid():

            # 用于通过用户名和密码查询用户是否存在
            user_name = login_form.cleaned_data["username"]
            password = login_form.cleaned_data["password"]
            user = authenticate(username=user_name, password=password)
        # 判断user对象是否存在
            if user is not None:
            # 不为空， z证明查询到了用户
                login(request, user)
            # 重定向到网站首页
                return HttpResponseRedirect(reverse("index"))
            else:
            # 未查询到用户，要求重新登录,仍然返回login界面
                return render(request, 'login.html',{"msg":"用户名密码错误", "login_form":login_form})
        else:
            return render(request, "login.html", {"login_form":login_form})
