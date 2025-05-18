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
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem("recipes");
    return stored ? JSON.parse(stored) : null;
}

// Load from localStorage or fetch JSON
function Get_all_recipes() {
    const localData = loadFromLocalStorage();
    if (localData) {
        allRecipes = localData;
        create_cards(allRecipes);
    } else {
        fetch('./Java_Script/recipe_data.json')
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
    // Get category containers
    const mainDishContainer = document.querySelector('.main-dish');
    const appetizerContainer = document.querySelector('.appetizer');
    const dessertContainer = document.querySelector('.dessert');

    // Clear old recipe sections (preserve headers)
    mainDishContainer.innerHTML = '<h1 class="course-title">Main Dishes</h1>';
    appetizerContainer.innerHTML = '<h1 class="course-title">Appetizers</h1>';
    dessertContainer.innerHTML = '<h1 class="course-title">Desserts</h1>';

    // Handle empty state
    if (recipes.length === 0) {
        mainDishContainer.innerHTML += `<p>No recipes found for Main Dishes.</p>`;
        appetizerContainer.innerHTML += `<p>No recipes found for Appetizers.</p>`;
        dessertContainer.innerHTML += `<p>No recipes found for Desserts.</p>`;
        return;
    }

    // Loop through recipes and create recipe cards
    recipes.forEach((recipe, index) => {
        const section = document.createElement("section");
        section.className = "recipe";

        // Format ingredients into list items
        const ingredientsList = recipe.ingredients
            .split(',')
            .map(ingredient => `<li>${ingredient.trim()}</li>`)
            .join('');

        // Inner HTML structure of the recipe card
        section.innerHTML = `
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}" style="max-width: 150px; height: auto;">
            <div class="description">
                <h2>${recipe.recipe_name}</h2>
                <p>${recipe.recipe_description}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>${ingredientsList}</ul>
                <p><strong>Course:</strong> ${recipe.course_name}</p>
                <button data-index="${index}" class="remove-btn">Remove</button>
            </div>
        `;

        // Attach event listener to the remove button
        section.querySelector(".remove-btn").addEventListener("click", () => {
            removeRecipe(index);
            create_cards(recipes); // Refresh the cards
        });

        // Append the recipe card to the correct category
        const course = recipe.course_name?.toLowerCase();
        if (course === 'main course') {
            mainDishContainer.appendChild(section);
        } else if (course === 'appetizers') {
            appetizerContainer.appendChild(section);
        } else if (course === 'dessert') {
            dessertContainer.appendChild(section);
        }
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
    Get_all_recipes()
    Search();
});




