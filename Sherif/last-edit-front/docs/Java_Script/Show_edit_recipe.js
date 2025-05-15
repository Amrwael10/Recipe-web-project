let allRecipes = [];

function loadFromLocalStorage() {
    const stored = localStorage.getItem("recipes");
    return stored ? JSON.parse(stored) : null;
}

function saveToLocalStorage(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

function renderRecipes(recipes, currentUser) {
    // Get category containers
    const mainDishContainer = document.querySelector('.main-dish');
    const appetizerContainer = document.querySelector('.appetizer');
    const dessertContainer = document.querySelector('.dessert');

    // Clear old recipe sections but preserve headers
    mainDishContainer.innerHTML = '<h1 class="course-title">Main Dishes</h1>';
    appetizerContainer.innerHTML = '<h1 class="course-title">Appetizers</h1>';
    dessertContainer.innerHTML = '<h1 class="course-title">Desserts</h1>';

    // Handle the case where there are no recipes
    if (!recipes.length) {
        mainDishContainer.innerHTML += `<p>No recipes found for Main Dishes.</p>`;
        appetizerContainer.innerHTML += `<p>No recipes found for Appetizers.</p>`;
        dessertContainer.innerHTML += `<p>No recipes found for Desserts.</p>`;
        return;
    }

    // Loop through recipes and create recipe cards
    recipes.forEach((recipe, index) => {
        const recipeSection = document.createElement('section');
        recipeSection.classList.add('recipe');

        const ingredientsList = recipe.ingredients
            .split(',')
            .map(ingredient => `<li>${ingredient.trim()}</li>`)
            .join('');

        recipeSection.innerHTML = `
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}" style="max-width: 150px;">
            <div class="description">
                <h2>${recipe.recipe_name}</h2>
                <p>${recipe.recipe_description}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>${ingredientsList}</ul>
                <button class="edit-btn" data-index="${index}">
                    Edit
                </button>
            </div>
        `;

        // Add edit button functionality
        const editButton = recipeSection.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            localStorage.setItem('edit_recipe_index', index);
            window.location.href = 'Edit_Recipe.html';
        });

        // Append to the correct category container
        const course = recipe.course_name?.toLowerCase();
        if (course === 'main course') {
            mainDishContainer.appendChild(recipeSection);
        } else if (course === 'appetizers') {
            appetizerContainer.appendChild(recipeSection);
        } else if (course === 'dessert') {
            dessertContainer.appendChild(recipeSection);
        }
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
