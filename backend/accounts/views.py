from rest_framework import generics, permissions
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .serializers import CustomAuthTokenSerializer, RegisterSerializer, UserSettingSerializer
import logging

logger = logging.getLogger(__name__)

class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        logger.info('LoginViewが呼び出されました')

        try:
            serializer = CustomAuthTokenSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            login(request, user)
            return super(LoginView, self).post(request, format=None)
        except Exception as e:
            logger.error('ログインに失敗しました: %s', e)
            return Response({"error": "ログインに失敗しました。詳細: %s" % e}, status=400)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = serializer.save()
            return Response({
                "user": {
                    "username": user.username,
                    "email": user.email
                }
            })
        except:
            logger.error('登録に失敗しました: %s', e)
            return Response({"error": "登録に失敗しました。詳細: %s" % e}, status=400)

class UserDetailAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
        })

class UserSettingAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = UserSettingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.username = serializer.validated_data.get("username", user.username)
        user.email = serializer.validated_data.get("email", user.email)
        user.save()

        logger.info('ユーザー情報が更新されました: %s %s', user.username, user.email)

        return Response({
            "user": {
                "username": user.username,
                "email": user.email
            }
        })