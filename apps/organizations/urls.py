from django.conf.urls import url
from apps.organizations.views import OrgView, AddAsk
urlpatterns = [
    url(r'^list/$', OrgView.as_view(), name='list'),
    url(r'^add_ask/$', AddAsk.as_view(), name='add_ask'),

]
