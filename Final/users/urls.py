from django import views
from django.urls import path
from .views import admin_profile, signup_view, login_view, user_profile
from users import views as user_views

urlpatterns = [
    path('', user_views.home_view, name='home'),
    path('signup/', signup_view, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', user_views.logout_view, name='logout'),
    path('admin-profile/', admin_profile, name='admin_profile'),
    path('user-profile/', user_profile, name='user_profile'),
    path('recipes/', user_views.recipe_list_view, name='recipe_list'),
    path('favorite-recipes/', user_views.favorite_recipes_view, name='favorite_recipes'),
    path('delete-fav/<int:recipe_id>/', user_views.delete_favorite_view, name='delete_favorite'),
    path('delete-all-fav/', user_views.delete_all_favorites_view, name='delete_all_favorite'),
    path('add-recipe/', user_views.add_recipe_view, name='add_recipe'),
    path('remove-recipe/', user_views.remove_page_view, name='remove_page'),
    path('delete-recipe/<int:recipe_id>/', user_views.delete_recipe_view, name='delete_recipe'),
    path('delete-all-recipes/', user_views.delete_all_recipes_view, name='delete_all_recipes'),
    path('edit-recipe/', user_views.edit_page_view, name='edit_page'),
    path('edit-recipe/<int:recipe_id>/', user_views.edit_recipe_form_view, name='edit_recipe_form'),
    path('update-recipe/<int:recipe_id>/', user_views.update_recipe_view, name='edit_recipe'),
    path('user-page/', user_views.user_page_view, name='user_page'),
]