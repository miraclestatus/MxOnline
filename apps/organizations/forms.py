from apps.operations.models import UserAsk
from django import forms
class AddAskForm(forms.ModelForm):
    mobile = forms.CharField(max_length=11, min_length=11, required=True)
    class Meta:
        model = UserAsk
        fields = ["name", "mobile", "course_name"]

