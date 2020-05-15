from django.conf.urls import url
from apps.organizations.views import OrgView, AddAsk
from apps.courses.views import CourseListView, CourseDetailView, CouersLessonView
urlpatterns = [
    url(r'^list/$', CourseListView.as_view(), name='list'),
    # url(r'^detail/$', CourseDetailView.as_view(), name='detail'),
    url(r'^(?P<course_id>\d+)/$', CourseDetailView.as_view(), name='detail'),
    url(r'^(?P<course_id>\d+)/lesson/$', CouersLessonView.as_view(), name='lesson'),

]
