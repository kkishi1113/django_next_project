from django.contrib.auth import authenticate    #type: ignore
from django.contrib.auth.models import User #type: ignore
from rest_framework import serializers  #type: ignore

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
