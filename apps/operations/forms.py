
from apps.operations.models import UserFavorite, CourseComments
from django import forms
class UserFavForm(forms.ModelForm):
    class Meta:
        model = UserFavorite
        fields = ["fav_id","fav_type"]
class CommentForm(forms.ModelForm):
    class Meta:
        model = CourseComments
        fields = ["course", "comments"]