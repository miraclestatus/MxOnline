
from apps.operations.models import UserFavorite
from django import forms
class UserFavForm(forms.ModelForm):
    class Meta:
        model = UserFavorite
        fields = ["fav_id","fav_type"]