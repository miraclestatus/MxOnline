
from django import forms
class AddAskForm(forms.ModelForm):
    mobile = forms.CharField(max_length=11, min_length=11, required=True)
    class Meta:
        pass
