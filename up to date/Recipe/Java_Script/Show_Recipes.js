let allRecipes = []; // Store all fetched recipes

function renderRecipes(recipes, currentUser) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear previous content

    recipes.forEach((recipe) => {
        const recipeSection = document.createElement('section');
        recipeSection.classList.add('recipe');

        const userHasLiked = recipe.likedBy && recipe.likedBy.includes(currentUser);

        recipeSection.innerHTML = `
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}" style="max-width: 150px;">
            <div class="description">
                <h2>${recipe.recipe_name}</h2>
                <button class="fav" title="Add to favorites">
                    <i class="${userHasLiked ? 'fas' : 'far'} fa-heart" style="${userHasLiked ? 'color:red;' : ''}"></i>
                </button>
                <p>${recipe.recipe_description}</p>
            </div>
        `;

        const heartIcon = recipeSection.querySelector('.fav i');

        // Toggle heart style visually
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
            recipe.recipe.toLowerCase().includes(keyword) ||
            recipe.description.toLowerCase().includes(keyword)
        );

        renderRecipes(filtered, currentUser);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem('signed_username');
    console.log(currentUser);

    fetch('./Java_Script/recipes.json')
        .then(response => response.json())
        .then(recipes => {
            allRecipes = recipes;
            renderRecipes(allRecipes, currentUser);
            Search(currentUser);
        })
        .catch(error => console.error('Error loading the JSON file:', error));
});
