let container = document.querySelector('.recipe-list .content');
let allRecipes = [];
function Get_all_recipes() {
    fetch('./Java_Script/recipe_data.json')
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            create_cards(allRecipes);
        })
        .catch(error => console.error("Error Cannot download Recipes", error));
}
function create_cards(recipes) {
    container.innerHTML = ""; 

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

function Search() {
    const searchInput = document.querySelector('.search_form input');

    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === "") {
            create_cards(allRecipes); 
        } else {
            const filtered = allRecipes.filter(recipe =>
                recipe.recipe_name.toLowerCase().includes(keyword) ||
                recipe.recipe_description.toLowerCase().includes(keyword)
            );

            if (filtered.length > 0) {
                create_cards(filtered);
            } else {
                container.innerHTML = '<p>Not found</p>';
            }
        }
    });
}

window.addEventListener('load', () => {
    Get_all_recipes();  
    Search();   
});
