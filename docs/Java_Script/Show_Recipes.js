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
    recipesContainer.innerHTML = ''; // Clear previous content

    recipes.forEach((recipe) => {
        const recipeSection = document.createElement('section');
        recipeSection.classList.add('recipe');

        const userHasLiked = recipe.likedBy && recipe.likedBy.includes(currentUser);

        recipeSection.innerHTML = `
            <img src="${recipe.recipe_image || recipe.image}" alt="${recipe.recipe_name || recipe.recipe}" style="max-width: 150px;">
            <div class="description">
                <h2>${recipe.recipe_name || recipe.recipe}</h2>
                <button class="fav" title="Add to favorites">
                    <i class="${userHasLiked ? 'fas' : 'far'} fa-heart" style="${userHasLiked ? 'color:red;' : ''}"></i>
                </button>
                <p>${recipe.recipe_description || recipe.description}</p>
            </div>
        `;

        const heartIcon = recipeSection.querySelector('.fav i');

        heartIcon.addEventListener('click', function () {
            const isSolid = heartIcon.classList.contains('fas');
            heartIcon.classList.toggle("fas", !isSolid);
            heartIcon.classList.toggle("far", isSolid);
            heartIcon.style.color = !isSolid ? "red" : "";
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
