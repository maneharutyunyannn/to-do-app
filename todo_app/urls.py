from django.urls import path
from .views import (
    TaskListView,
    TaskDetailView,
    UserRegisterView,
    LoginView,
    LogoutView,
    IndexView,
    AddTodoView,
    CompleteTaskView,
    EditTaskView
)

urlpatterns = [
    path('tasks/<int:pk>/complete/', CompleteTaskView.as_view(), name='complete_task'),
    path('tasks/<int:pk>/edit/', EditTaskView.as_view(), name='edit_task'),  
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),  
    path('tasks/', TaskListView.as_view(), name='task_list'),
    path('register/', UserRegisterView.as_view(), name='user_register'), 
    path('login/', LoginView.as_view(), name='login'),  
    path('logout/', LogoutView.as_view(), name='logout'),
    path('add/', AddTodoView.as_view(), name='add_todo'),
    path('', IndexView.as_view(), name='index'),  
]
