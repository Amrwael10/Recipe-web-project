const removeButtons = document.querySelectorAll("section.recipe button");
const allRecipes = document.querySelectorAll("section.recipe");
para = document.getElementById("no-recipe");


removeButtons.forEach(button => {
    button.addEventListener("click", function () {
        const recipe = button.closest("section.recipe");
        if (recipe) {
            if (confirm("Are you sure you want to remove this recipe?")) {
                recipe.remove();
                alert("Recipe removed successfully.");
                if (document.querySelectorAll("section.recipe").length === 0) {
                    para.textContent = "No favourite recipes available.";
                    para.style.display = "block";
                    search = document.getElementsByTagName("form")[0];
                    search.style.display = "none";
                    btn = document.getElementById("Clear-all");
                    btn.style.display = "none";
                }
            }                
        }
    });
});

const clearAllButton = document.getElementById("Clear-all");
clearAllButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to remove all recipes?")) {
        allRecipes.forEach(recipe => {
            recipe.remove();
        });
        alert("Recipes removed successfully.");
        para.textContent = "No favourite recipes available.";
        para.style.display = "block";
        search = document.getElementsByTagName("form")[0];
        search.style.display = "none";
        btn = document.getElementById("Clear-all");
        btn.style.display = "none";
        }
});


