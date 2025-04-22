let allRecipes = [];
const recipeContainer = document.querySelector("main");
const para = document.getElementById("no-recipe");
const clearAllButton = document.getElementById("Clear-all");
const signedUsername = localStorage.getItem("signed_username");

function Search() {
    const searchInput = document.querySelector('input[type="search"]');
    const container = document.querySelector("main");

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
                create_cards([]);
                document.querySelector("form").style.display = "block";
                para.textContent = 'Not found';
                para.style.display = "block";
            }
        }
    });
}

function saveToLocalStorage(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem("recipes");
    if (!stored) return null;
    
    const allRecipes = JSON.parse(stored);
    // Filter recipes that have current user in likedBy array
    return allRecipes.filter(recipe => 
        recipe.likedBy && recipe.likedBy.includes(signedUsername)
    );
}

function Get_all_recipes() {
    // First try to load from localStorage
    const localData = loadFromLocalStorage();
    
    if (localData) {
        allRecipes = localData;
        create_cards(allRecipes);
    } else {
        // If nothing in localStorage, fetch from JSON
        fetch('./Java_Script/recipes.json')
            .then(response => response.json())
            .then(data => {
                // Save all recipes to localStorage
                saveToLocalStorage(data);
                // Filter to only show recipes liked by current user
                allRecipes = data.filter(recipe => 
                    recipe.likedBy && recipe.likedBy.includes(signedUsername)
                );
                create_cards(allRecipes);
            })
            .catch(error => {
                console.error("Error: Cannot download Recipes", error);
                para.textContent = "Failed to load recipes.";
                para.style.display = "block";
            });
    }
}

function create_cards(recipes) {
    document.querySelectorAll("section.recipe").forEach(e => e.remove());

    if (recipes.length === 0) {
        para.textContent = "No favourite recipes available.";
        para.style.display = "block";
        document.querySelector("form").style.display = "none";
        clearAllButton.style.display = "none";
        return;
    }

    para.style.display = "none";
    document.querySelector("form").style.display = "block";
    clearAllButton.style.display = "block";

    recipes.forEach((recipe, index) => {
        const section = document.createElement("section");
        section.className = "recipe";

        section.innerHTML = `
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}" style="max-width: 150px; height: auto;">
            <div class="description">
                <h2>${recipe.recipe_name}</h2>
                <p>${recipe.recipe_description}</p>
                <button data-index="${index}">Remove</button>
            </div>
        `;

        section.querySelector("button").addEventListener("click", () => removeRecipe(index));
        recipeContainer.insertBefore(section, para);
    });
}

function removeRecipe(index) {
    if (confirm("Are you sure you want to remove this recipe?")) {
        // Get the recipe to be removed
        const recipeToRemove = allRecipes[index];
        
        // Remove user from likedBy array
        if (recipeToRemove.likedBy) {
            recipeToRemove.likedBy = recipeToRemove.likedBy.filter(
                username => username !== signedUsername
            );
        }
        
        // Update the recipe list
        allRecipes.splice(index, 1);
        
        // Get all recipes from localStorage
        const allStoredRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        
        // Update the specific recipe in the stored list
        const updatedRecipes = allStoredRecipes.map(recipe => {
            if (recipe.recipe_name === recipeToRemove.recipe_name) {
                return recipeToRemove;
            }
            return recipe;
        });
        
        // Save back to localStorage
        saveToLocalStorage(updatedRecipes);
        create_cards(allRecipes);
        alert("Recipe removed successfully.");
    }
}

clearAllButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to remove all recipes?")) {
        allRecipes = [];
        saveToLocalStorage(allRecipes);
        create_cards(allRecipes);
        alert("All recipes removed.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (!signedUsername) {
        para.textContent = "Please sign in to view your favorite recipes.";
        para.style.display = "block";
        document.querySelector("form").style.display = "none";
        clearAllButton.style.display = "none";
        return;
    }
    
    Get_all_recipes();  
    Search();   
});