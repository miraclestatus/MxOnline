from django.conf.urls import url

from apps.operations.views import AddFavView,CommentView

urlpatterns = [
    url(r'^fav/$', AddFavView.as_view(), name='fav'),
    url(r'^comment/$', CommentView.as_view(), name='comment'),


]
