from rest_framework import serializers
# from .models import Note
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'text', 'created_at', 'updated_at', 'deleted']






# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ['id', 'name', 'email', 'phone', 'address', 'note']
