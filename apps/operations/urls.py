from django.conf.urls import url

from apps.operations.views import AddFavView

urlpatterns = [
    url(r'^fav/$', AddFavView.as_view(), name='fav'),

]
