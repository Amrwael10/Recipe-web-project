let container = document.querySelector('.recipe-list .content');
let favoriteContainer = document.querySelectorAll('.recipe-list .content')[1]; 
 

function show_cards() {
    container.innerHTML = ""; 
    cards = document.querySelectorAll('.recipe-card');

    cards.forEach((card, i) => {

        setTimeout(() => {
            card.classList.add('show');
        }, 5 * i);
    });

    if (recipes.length === 0) {
        container.innerHTML = '<p>No recipes found.</p>';
    }
}

function show_favorite_cards(recipes, container) {
    container.innerHTML = ""; 

    const favoriteRecipes = recipes.filter(recipe =>
        recipe.likedBy && recipe.likedBy.includes(signedUsername) 
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
            create_cards(allRecipes, container); 
            create_favorite_cards(allRecipes, favoriteContainer); 
        } else {
            const filtered = allRecipes.filter(recipe =>
                recipe.recipe_name.toLowerCase().includes(keyword) ||
                recipe.recipe_description.toLowerCase().includes(keyword)
            );

            create_cards(filtered, container); 
            create_favorite_cards(filtered, favoriteContainer); 
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    show_cards();  
    Search();   
});
