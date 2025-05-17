from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login,logout
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login
from .models import CustomUser, Recipe, Ingredient, RecipeIngredient
from django.http import HttpResponse, JsonResponse


def home_view(request):
    user = request.user
    context = {
        'user': user,
    }
    return render(request, 'users/index.html', context)

def signup_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)

            # Redirect based on role
            if user.role == 'admin':
                return redirect('admin_profile')  # e.g., profile_page_admin view
            else:
                return redirect('user_profile')  # e.g., profile_page_user view
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'users/signup.html', {'form': form})

def login_view(request):
    error = None

    if request.method == 'POST':
        email = request.POST.get('username')  
        password = request.POST.get('password')

        try:
            # Check if a user with this email exists
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            error = "Email not found. Please sign up first."
            return render(request, 'users/login.html', {'error': error})
        user = authenticate(request, username=user.username, password=password)

        if user is not None:
            login(request, user)

            # Redirect based on role
            if user.role == 'admin':
                return redirect('admin_profile')
            else:
                return redirect('user_profile')
        else:
            error = "Incorrect password. Please try again."
    return render(request, 'users/login.html', {'error': error})


def logout_view(request):
    logout(request)
    return redirect('login')


def admin_profile(request):
    user = request.user
    context = {
        'user': user,
    }
    return render(request, 'users/Profile_Page_Admin.html', context)


def user_profile(request):
    user = request.user
    context = {
        'user': user,
    }
    return render(request, 'users/profile_page_user.html', context)

def recipe_list_view(request):
    user = request.user
    recipes = Recipe.objects.all()
    ingredients = Ingredient.objects.all()
    recipe_ingredients = RecipeIngredient.objects.all()
    favourite_recipes = Recipe.objects.filter(likes=user)
    fav_list = [
        {
            "favBy": [user.username for user in recipe.likes.all()],
            "isFav": user in recipe.likes.all()
        }
        for recipe in recipes
    ]


    if request.method == 'POST':
        recipe_id = request.POST.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        
        # Toggle like/unlike
        if user in recipe.likes.all():
            recipe.likes.remove(user)
        else:
            recipe.likes.add(user)

        recipe.save()

        # Return a JSON response for AJAX requests
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'success',
                'is_favorite': user in recipe.likes.all()
            })
    context = {
        'recipes': recipes,
        'ingredients': ingredients,
        'recipe_ingredients': recipe_ingredients,
        'fav_recipes': favourite_recipes,
        'fav_list': fav_list,
    }

    return render(request, 'users/show_recipes.html', context)

def add_recipe_view(request):
    if request.method == 'POST':
        recipe_name = request.POST.get('recipe_name')
        recipe_description = request.POST.get('recipe_description')
        raw_ingredients = request.POST.get('recipe_ingredients')
        course = request.POST.get('course')
        recipe_image = request.POST.get('recipe_image')
        
        # Create recipe
        recipe = Recipe.objects.create(
            name=recipe_name,
            description=recipe_description,
            course=course,
            image=recipe_image  # Assuming `image` is a URLField or CharField
        )
        
        # Split ingredients by comma and process each one
        for raw in raw_ingredients.split(','):
            raw = raw.strip()
            parts = raw.split()
            
            # Handle the ingredient format
            if len(parts) >= 3:
                # Format: "Ingredient Quantity Unit"
                # Join all parts except the last two as the ingredient name
                ingredient_name = ' '.join(parts[:-2])
                quantity = parts[-2]
                metric = parts[-1]
            elif len(parts) == 2:
                # Fall back to original logic if only two parts
                ingredient_name = parts[0]
                quantity = parts[1]
                metric = ""
            else:
                # Handle case with just an ingredient name
                ingredient_name = parts[0] if parts else ""
                quantity = ""
                metric = ""
            
            # Get or create the ingredient
            ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
            
            # Create the recipe ingredient with quantity and metric
            RecipeIngredient.objects.create(
                recipe=recipe, 
                ingredient=ingredient, 
                quantity=quantity,
                unit=metric
            )
        
        return redirect('recipe_list')  # Or wherever your list view is
    
    return render(request, 'users/add_recipe.html')

# Updated recipe deletion views
def remove_page_view(request):
    recipes = Recipe.objects.all()
    return render(request, 'users/Delete_Recipe.html', {'recipes': recipes})

def delete_recipe_view(request, recipe_id):
    if request.method == 'POST' and request.POST.get('_method') == 'DELETE':
        recipe = get_object_or_404(Recipe, id=recipe_id)
        recipe.delete()
        return redirect('remove_page')
    
    return HttpResponse("Method not allowed", status=405)

def delete_all_recipes_view(request):
    if request.method == 'POST' and request.POST.get('_method') == 'DELETE':
        Recipe.objects.all().delete()
        return redirect('remove_page')
    
    return HttpResponse("Method not allowed", status=405)

# Adding only the modified/added functions for clarity

def edit_page_view(request):
    """Display a list of recipes that can be edited"""
    recipes = Recipe.objects.all()
    return render(request, 'users/Show_Edit_Recipes.html', {'recipes': recipes})

def edit_recipe_form_view(request, recipe_id):
    """Display the edit form for a specific recipe"""
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    # Get all recipe ingredients for this recipe
    recipe_ingredients = RecipeIngredient.objects.filter(recipe=recipe)
    
    context = {
        'recipe': recipe,
        'recipe_ingredients': recipe_ingredients
    }
    return render(request, 'users/Edit_Recipe.html', context)

def update_recipe_view(request, recipe_id):
    """Process the edit form submission"""
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    if request.method == 'POST':
        # Update recipe fields
        recipe.name = request.POST.get('recipe_name')
        recipe.description = request.POST.get('recipe_description')
        recipe.course = request.POST.get('course')
        recipe.image = request.POST.get('recipe_image')
        
        # Save the updated recipe
        recipe.save()
        
        # Delete existing recipe ingredients
        RecipeIngredient.objects.filter(recipe=recipe).delete()
        
        # Process and add new ingredients
        raw_ingredients = request.POST.get('recipe_ingredients')
        for raw in raw_ingredients.split(','):
            raw = raw.strip()
            if not raw:  # Skip empty entries
                continue
                
            parts = raw.split()
            
            # Parse ingredient information
            if len(parts) >= 3:
                # Format: "Ingredient Quantity Unit"
                # Join all parts except the last two as the ingredient name
                ingredient_name = ' '.join(parts[:-2])
                quantity = parts[-2]
                metric = parts[-1]
            elif len(parts) == 2:
                # Format: "Ingredient Quantity"
                ingredient_name = parts[0]
                quantity = parts[1]
                metric = ""
            else:
                # Just ingredient name
                ingredient_name = parts[0] if parts else ""
                quantity = ""
                metric = ""
            
            # Get or create the ingredient
            ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
            
            # Create the recipe ingredient relationship
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                quantity=quantity,
                unit=metric
            )
        
        # Redirect to recipe list or show success message
        return redirect('recipe_list')
    
    # If not POST, redirect to the edit form
    return redirect('edit_recipe_form', recipe_id=recipe_id)

def user_page_view(request):
    user = request.user
    recipes = Recipe.objects.all()
    favorite_recipes = Recipe.objects.filter(likes=user)
    recipe_list = [
        {
            "recipe_name": recipe.name,
            "recipe_description": recipe.description,
            "likedBy": [user.username for user in recipe.likes.all()],
            "liked": user in recipe.likes.all()
        }
        for recipe in recipes
    ]
    context = {
        'user': user,
        'recipes': recipe_list,
        'fav_recipes': favorite_recipes,
    }
    return render(request, 'users/user_page.html', context)

def favorite_recipes_view(request):
    user = request.user
    recipes = Recipe.objects.filter(likes=user)

    context = {
        'user': user,
        'recipes': recipes,
    }
    return render(request, 'users/Favourite_page.html', context)

def delete_favorite_view(request, recipe_id):
    user = request.user
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    # Remove the user from the recipe's likes
    if user in recipe.likes.all():
        recipe.likes.remove(user)
    
    # Redirect to the favorite recipes page
    return redirect('favorite_recipes')

def delete_all_favorites_view(request):
    user = request.user
    recipes = Recipe.objects.all()
    
    # Remove the user from all recipes' likes
    for recipe in recipes:
        if user in recipe.likes.all():
            recipe.likes.remove(user)
    
    # Redirect to the favorite recipes page
    return redirect('favorite_recipes')