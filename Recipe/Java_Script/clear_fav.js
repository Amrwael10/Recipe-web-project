let allRecipes = [];

const recipeContainer = document.querySelector("main");
const para = document.getElementById("no-recipe");
const clearAllButton = document.getElementById("Clear-all");

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
                create_cards([]); // Clear the cards if no match found
                document.querySelector("form").style.display = "block";
                para.textContent = 'Not found';
                para.style.display = "block";
            }
        }
    });
}

function saveToLocalStorage(recipes) {
    localStorage.setItem("fav_recipes", JSON.stringify(recipes));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem("fav_recipes");
    return stored ? JSON.parse(stored) : null;
}

// Load from localStorage or fetch JSON
function Get_all_recipes() {
    const localData = loadFromLocalStorage();
    if (localData) {
        allRecipes = localData;
        create_cards(allRecipes);
    } else {
        fetch('./Java_Script/fav_recipe_data.json')
            .then(response => response.json())
            .then(data => {
                allRecipes = data;
                saveToLocalStorage(allRecipes); // Save fetched data to localStorage
                create_cards(allRecipes);
            })
            .catch(error => {
                console.error("Error: Cannot download Recipes", error);
                para.textContent = "Failed to load recipes.";
                para.style.display = "block";
            });
    }
}

// Create recipe cards
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
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}" style="max-width: 150px; height: auto;"">
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

// Remove individual recipe
function removeRecipe(index) {
    if (confirm("Are you sure you want to remove this recipe?")) {
        allRecipes.splice(index, 1);
        saveToLocalStorage(allRecipes);
        create_cards(allRecipes);
        alert("Recipe removed successfully.");
    }
}

// Clear all recipes
clearAllButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to remove all recipes?")) {
        allRecipes = [];
        saveToLocalStorage(allRecipes);
        create_cards(allRecipes);
        alert("All recipes removed.");
    }
});

// Load on page ready
document.addEventListener("DOMContentLoaded", () => {
    Get_all_recipes();  
    Search();   
}
)





