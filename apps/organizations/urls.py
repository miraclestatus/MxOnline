from django.conf.urls import url, include
from apps.organizations.views import OrgView
urlpatterns = [
    url(r'^list/', OrgView.as_view(), name='list'),

]
