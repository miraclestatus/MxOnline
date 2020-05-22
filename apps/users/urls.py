from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from apps.organizations.views import OrgView, AddAsk, TeacherListView, TeacherDeatailView
from apps.users.views import UserInfoView

urlpatterns = [
    url(r'^info/$', UserInfoView.as_view(), name='info'),
    # url(r'^mycourse/$', MyCourseView.as_view(), name='mycourse'),
    url(r'^mycourse/$', login_required(TemplateView.as_view(template_name='usercenter-mycourse.html'),login_url = '/login/'), {"current_page":"mycourse" },name='mycourse'),


]
