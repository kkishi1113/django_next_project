from rest_framework import generics, permissions
# from .models import Note
# from .serializers import NoteSerializer
from .models import Todo
from .serializers import TodoSerializer
import logging

logger = logging.getLogger(__name__)

class TodoListCreateAPI(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TodoSerializer
    logger.info("TodoListCreateAPIを呼び出しました")

    def get_queryset(self):
        # logger.info("get_querysetを呼び出しました")
        return Todo.objects.filter(user=self.request.user, deleted=False)

    def perform_create(self, serializer):
        # logger.info("perform_createを呼び出しました")
        serializer.save(user=self.request.user)

class TodoUpdateDeleteAPI(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
    logger.info("TodoUpdateDeleteAPIを呼び出しました")

    def get_queryset(self):
        # logger.info("get_querysetを呼び出しました")
        return Todo.objects.filter(user=self.request.user)





# class NoteListCreate(generics.ListCreateAPIView):
#     queryset = Note.objects.all()
#     serializer_class = NoteSerializer
