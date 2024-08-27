from rest_framework import generics, permissions
from django.shortcuts import render
from .models import Shortcut
from .serializer import ShortcutSerializer
import logging

logger = logging.getLogger(__name__)

class ShortcutListCreateAPI(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ShortcutSerializer
    logger.info("ShortcutListCreateAPIを呼び出しました。")

    def get_queryset(self):
        return Shortcut.objects.filter(user=self.request.user, deleted=False)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ShortcutUpdateDeleteAPI(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ShortcutSerializer
    logger.info("ShortcutUpdateDeleteAPIを呼び出しました。")

    def get_queryset(self):
        return Shortcut.objects.filter(user=self.request.user, deleted=False)