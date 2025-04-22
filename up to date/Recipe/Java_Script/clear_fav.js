const recipeContainer = document.querySelector("main");
const para = document.getElementById("no-recipe");
const clearAllButton = document.getElementById("Clear-all");
let allRecipes = [];

// Get signed-in username
function getSignedUsername() {
    return localStorage.getItem('signed_username') || "";
}

// Search function
function Search() {
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const filtered = allRecipes.filter(recipe =>
            recipe.recipe_name.toLowerCase().includes(keyword) ||
            recipe.recipe_description.toLowerCase().includes(keyword)
        );
        create_cards(filtered);
        if (filtered.length === 0) {
            para.textContent = 'Not found';
            para.style.display = "block";
        } else {
            para.style.display = "none";
        }
    });
}

// Fetch and filter recipes
function Get_all_recipes() {
    fetch('./Java_Script/recipes.json')
        .then(response => response.json())
        .then(data => {
            const username = getSignedUsername();
            allRecipes = data.filter(recipe => recipe.likedBy.includes(username));
            create_cards(allRecipes);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            para.textContent = "Failed to load recipes.";
            para.style.display = "block";
        });
}

// Create recipe cards
function create_cards(recipes) {
    document.querySelectorAll("section.recipe").forEach(e => e.remove());

    if (recipes.length === 0) {
        para.textContent = "No favourite recipes available.";
        para.style.display = "block";
        clearAllButton.style.display = "none";
        return;
    }

    para.style.display = "none";
    clearAllButton.style.display = "block";

    recipes.forEach((recipe, index) => {
        const section = document.createElement("section");
        section.className = "recipe";

        section.innerHTML = `
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}" style="max-width: 150px; height: auto;">
            <div class="description">
                <h2>${recipe.recipe_name}</h2>
                <p>${recipe.recipe_description}</p>
                <button type="button" class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;

        // Add remove handler
        section.querySelector(".remove-btn").addEventListener("click", () => {
            removeRecipe(index);
        });

        recipeContainer.insertBefore(section, para);
    });
}

// Remove specific recipe
function removeRecipe(index) {
    if (confirm("Are you sure you want to remove this recipe?")) {
        allRecipes.splice(index, 1);
        create_cards(allRecipes);
        alert("Recipe removed.");
    }
}

// Clear all recipes
clearAllButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to remove all recipes?")) {
        allRecipes = [];
        create_cards(allRecipes);
        alert("All recipes removed.");
    }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    Get_all_recipes();
    Search();
});
