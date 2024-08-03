from rest_framework import serializers   #type: ignore
from .models import Shortcut

class ShortcutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shortcut
        fields = ['id', 'title', 'url', 'created_at', 'updated_at', 'deleted']