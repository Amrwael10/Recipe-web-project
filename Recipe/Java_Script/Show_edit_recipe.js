let allRecipes = [];

function loadFromLocalStorage() {
    const stored = localStorage.getItem("recipes");
    return stored ? JSON.parse(stored) : null;
}

function saveToLocalStorage(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

function renderRecipes(recipes, currentUser) {
    const recipesContainer = document.getElementById('recipes-container');
    const noRecipeMessage = document.getElementById('no-recipe');
    recipesContainer.innerHTML = ''; 

    if (!recipes.length) {
        if (noRecipeMessage) {
            noRecipeMessage.style.display = 'block';
            noRecipeMessage.textContent = 'No recipes found!';
        }
        return;
    } else if (noRecipeMessage) {
        noRecipeMessage.style.display = 'none';
    }

    recipes.forEach((recipe, index) => {
        const recipeSection = document.createElement('section');
        recipeSection.classList.add('recipe');

        recipeSection.innerHTML = `
            <img src="${recipe.recipe_image || recipe.image}" alt="${recipe.recipe_name || recipe.recipe}" style="max-width: 150px;">
            <div class="description">
                <h2>${recipe.recipe_name || recipe.recipe}</h2>
                <button class="edit-btn" data-index="${index}">
                    Edit
                </button>
                <p>${recipe.recipe_description || recipe.description}</p>
            </div>
        `;

        const editButton = recipeSection.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            localStorage.setItem('edit_recipe_index', index);
            window.location.href = 'Edit_Recipe.html';
        });

        recipesContainer.appendChild(recipeSection);
    });
}

function Search(currentUser) {
    const searchInput = document.querySelector('input[type="search"]');

    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim().toLowerCase();

        const filtered = allRecipes.filter(recipe =>
            (recipe.recipe_name || recipe.recipe).toLowerCase().includes(keyword) ||
            (recipe.recipe_description || recipe.description).toLowerCase().includes(keyword)
        );

        renderRecipes(filtered, currentUser);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem('signed_username');
    console.log(currentUser);

    const storedRecipes = localStorage.getItem("recipes");

    if (storedRecipes) {
        allRecipes = JSON.parse(storedRecipes);
        renderRecipes(allRecipes, currentUser);
        Search(currentUser);
    } else {
        fetch('./Java_Script/recipes.json')
            .then(response => response.json())
            .then(recipes => {
                allRecipes = recipes;
                saveToLocalStorage(allRecipes);
                renderRecipes(allRecipes, currentUser);
                Search(currentUser);
            })
            .catch(error => console.error('Error loading the JSON file:', error));
    }
});
