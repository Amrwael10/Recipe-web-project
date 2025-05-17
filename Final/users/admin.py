from django.contrib import admin

# Register your models here.
from .models import Recipe, Ingredient, RecipeIngredient, CustomUser
# from django.contrib.auth.admin import UserAdmin

admin.site.register(CustomUser)
admin.site.register(Recipe)
admin.site.register(RecipeIngredient)
admin.site.register(Ingredient)
