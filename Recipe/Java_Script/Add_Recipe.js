document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipe-form");
    const successMsg = document.getElementById("success-msg");
    const preview = document.getElementById("recipe-preview");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("recipe-name").value.trim();
        const description = document.getElementById("recipe-description").value.trim();
        const image = document.getElementById("recipe-image").value.trim();

        if (!name || !description || !image) {
            alert("Please fill in all fields.");
            return;
        }

        const newRecipe = {
            recipe_name: name,
            recipe_description: description,
            recipe_image: image,
            likedBy: [] // if you want to support likes later
        };

        // Get existing recipes
        const stored = localStorage.getItem("recipes");
        const recipes = stored ? JSON.parse(stored) : [];

        // Add new recipe
        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        alert(`Recipe ${newRecipe.recipe_name} has been added successfully!.`);

        // Reset form
        form.reset();

    });
});
