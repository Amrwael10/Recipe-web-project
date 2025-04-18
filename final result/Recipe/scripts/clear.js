const removeButtons = document.querySelectorAll("section.recipe button");

    removeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const recipe = button.closest("section.recipe");
            if (recipe) {
                if (confirm("Are you sure you want to remove this recipe?")) {
                    recipe.remove();
                    alert("Recipe removed successfully.");
                }                
            }
        });
    });

    const clearAllButton = document.getElementById("Clear-all");
    clearAllButton.addEventListener("click", function () {
        const allRecipes = document.querySelectorAll("section.recipe");
        if (confirm("Are you sure you want to remove all recipes?")) {
            allRecipes.forEach(recipe => {
                recipe.remove();
            });
            alert("Recipes removed successfully.");
        }
    });
