from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

class CustomAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    attrs['user'] = user
                else:
                    raise serializers.ValidationError('例外エラー: Incorrect credentials')
            except User.DoesNotExist:
                raise serializers.ValidationError('例外エラー: User with this email does not exist')
        else:
            raise serializers.ValidationError('例外エラー: Must include "email" and "password".')

        return attrs

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user

class UserSettingSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=5 ,max_length=30, required=False)
    email = serializers.EmailField(required=False)