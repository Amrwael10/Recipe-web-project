document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipe-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("recipe-name").value.trim();
        const description = document.getElementById("recipe-description").value.trim();;
        const image = document.getElementById("recipe-image").value.trim();
        const ingredients = document.getElementById("recipe-ingredients").value.trim();
        const courseRadio = document.querySelector("input[name='course']:checked");

        if (!name || !description || !image || !ingredients || !courseRadio) {
            alert("Please fill in all fields and select a course.");
            return;
        }

        const newRecipe = {
            recipe_name: name,
            recipe_description: description,
            recipe_image: image,
            ingredients: ingredients,  // stored as a flat string
            course_name: courseRadio.value,  // main course, appetizer, or dessert
            likedBy: []
        };

        const stored = localStorage.getItem("recipes");
        const recipes = stored ? JSON.parse(stored) : [];

        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));

        alert(`Recipe "${newRecipe.recipe_name}" has been added successfully!`);

        form.reset();
    });
});