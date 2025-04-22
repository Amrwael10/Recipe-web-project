let container = document.querySelector('.recipe-list .content');
let favoriteContainer = document.querySelectorAll('.recipe-list .content')[1]; // Select the second content div
let allRecipes = [];
const signedUsername = localStorage.getItem('signed_username'); // Get the signed_username

function Get_all_recipes() {
    fetch('./Java_Script/recipes.json')
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            create_cards(allRecipes, container); // First div (all recipes)
            create_favorite_cards(allRecipes, favoriteContainer); // Second div (favorite recipes)
        })
        .catch(error => console.error("Error Cannot download Recipes", error));
}

function create_cards(recipes, container) {
    container.innerHTML = ""; // Clear the container

    recipes.forEach((item, i) => {
        let card = document.createElement('div');
        card.className = 'recipe-card';

        let inner = document.createElement('div');
        inner.className = 'inner';

        let title = document.createElement('a');
        title.href = "#";
        title.textContent = item.recipe_name;

        let description = document.createElement('p');
        description.textContent = item.recipe_description;

        inner.appendChild(title);
        inner.appendChild(description);
        card.appendChild(inner);
        container.appendChild(card);

        setTimeout(() => {
            card.classList.add('show');
        }, 50 * i);
    });
}

function create_favorite_cards(recipes, container) {
    container.innerHTML = ""; // Clear the container for favorites

    const favoriteRecipes = recipes.filter(recipe =>
        recipe.likedBy && recipe.likedBy.includes(signedUsername) // Filter based on signed_username
    );

    favoriteRecipes.forEach((item, i) => {
        let card = document.createElement('div');
        card.className = 'recipe-card';

        let inner = document.createElement('div');
        inner.className = 'inner';

        let title = document.createElement('a');
        title.href = "#";
        title.textContent = item.recipe_name;

        let description = document.createElement('p');
        description.textContent = item.recipe_description;

        inner.appendChild(title);
        inner.appendChild(description);
        card.appendChild(inner);
        container.appendChild(card);

        setTimeout(() => {
            card.classList.add('show');
        }, 50 * i);
    });

    if (favoriteRecipes.length === 0) {
        container.innerHTML = '<p>No favorite recipes found.</p>';
    }
}

function Search() {
    const searchInput = document.querySelector('.search_form input');

    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === "") {
            create_cards(allRecipes, container); // Re-show all recipes
            create_favorite_cards(allRecipes, favoriteContainer); // Re-show favorite recipes
        } else {
            const filtered = allRecipes.filter(recipe =>
                recipe.recipe_name.toLowerCase().includes(keyword) ||
                recipe.recipe_description.toLowerCase().includes(keyword)
            );

            create_cards(filtered, container); // Display filtered recipes
            create_favorite_cards(filtered, favoriteContainer); // Display filtered favorites
        }
    });
}

window.addEventListener('load', () => {
    Get_all_recipes();  
    Search();   
});
