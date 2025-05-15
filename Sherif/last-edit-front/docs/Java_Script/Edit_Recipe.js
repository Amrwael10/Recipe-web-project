document.addEventListener('DOMContentLoaded', () => {
    const recipeIndex = localStorage.getItem('edit_recipe_index');
    if (recipeIndex === null) {
        alert('No recipe selected for editing.');
        window.location.href = 'Show_Edit_Recipes.html';
        return;
    }

    const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = allRecipes[recipeIndex];

    if (!recipe) {
        alert('Recipe not found.');
        window.location.href = 'Show_Edit_Recipes.html';
        return;
    }

    // Populate form fields
    document.getElementById('recipe-name').value = recipe.recipe_name || '';
    document.getElementById('recipe-description').value = recipe.recipe_description || '';
    document.getElementById('recipe-image').value = recipe.recipe_image || '';
    document.getElementById('recipe-ingredients').value = recipe.ingredients || '';

    // Set the course type radio button
    if (recipe.course_name) {
        const courseRadio = document.querySelector(`input[name='course'][value='${recipe.course_name}']`);
        if (courseRadio) {
            courseRadio.checked = true;
        }
    }

    // Handle form submission
    const form = document.getElementById('recipe-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const updatedRecipe = {
            ...recipe,
            recipe_name: document.getElementById('recipe-name').value,
            recipe_description: document.getElementById('recipe-description').value,
            recipe_image: document.getElementById('recipe-image').value,
            ingredients: document.getElementById('recipe-ingredients').value,
            course_name: document.querySelector("input[name='course']:checked")?.value || recipe.course_name
        };

        allRecipes[recipeIndex] = updatedRecipe;
        localStorage.setItem('recipes', JSON.stringify(allRecipes));

        alert('Recipe updated successfully!');
        window.location.href = 'Show_Edit_Recipes.html';
    });
});
