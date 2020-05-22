from django.conf.urls import url
from apps.organizations.views import OrgView, AddAsk, TeacherListView, TeacherDeatailView
from apps.users.views import UserInfoView

urlpatterns = [
    url(r'^info/$', UserInfoView.as_view(), name='info'),

]
