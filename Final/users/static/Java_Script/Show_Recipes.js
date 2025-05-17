document.addEventListener("DOMContentLoaded", () => {
    const noRecipeMessage = document.getElementById('no-recipe');
    
// Set up search functionality
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const keyword = searchInput.value.trim().toLowerCase();
            const recipeCards = document.querySelectorAll('.recipe');
            
            let matchFound = false;
            
            recipeCards.forEach(card => {
                const recipeName = card.querySelector('h2').textContent.toLowerCase();
                
                // Get course - might be in h4
                let recipeCourse = '';
                const courseElement = card.querySelector('h4');
                if (courseElement) {
                    recipeCourse = courseElement.textContent.toLowerCase();
                }
                
                // Get description - first paragraph
                let recipeDescription = '';
                const descriptionElement = card.querySelector('p');
                if (descriptionElement) {
                    recipeDescription = descriptionElement.textContent.toLowerCase();
                }
                
                // Get ingredients - all list items text combined
                let recipeIngredients = '';
                const ingredientsList = card.querySelector('ul');
                if (ingredientsList) {
                    const ingredientItems = ingredientsList.querySelectorAll('li');
                    ingredientItems.forEach(item => {
                        recipeIngredients += item.textContent.toLowerCase() + ' ';
                    });
                }
                
                if (recipeName.includes(keyword) || 
                    recipeDescription.includes(keyword) || 
                    recipeCourse.includes(keyword) || 
                    recipeIngredients.includes(keyword)) {
                    card.style.display = 'flex';
                    matchFound = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Handle no results message
            if (!matchFound && keyword !== '') {
                if (noRecipeMessage) {
                    noRecipeMessage.textContent = 'No recipes found matching your search';
                    noRecipeMessage.style.display = 'block';
                } else {
                    // Create message element if it doesn't exist
                    const newNoRecipeMessage = document.createElement('p');
                    newNoRecipeMessage.id = 'no-recipe';
                    newNoRecipeMessage.textContent = 'No recipes found matching your search';
                    newNoRecipeMessage.style.display = 'block';
                    
                    // Insert after the recipes container
                    if (recipesContainer) {
                        recipesContainer.parentNode.insertBefore(newNoRecipeMessage, recipesContainer.nextSibling);
                    }
                }
            } else if (noRecipeMessage) {
                noRecipeMessage.style.display = 'none';
            }
        });
    }
    const favButtons = document.querySelectorAll('.fav-btn');
            
    favButtons.forEach(button => {
        button.addEventListener('click', function() {
            const form = this.closest('.favorite-form');
            const icon = this.querySelector('i');
            
            // Create a FormData object
            const formData = new FormData(form);
            
            // Send POST request
            fetch(window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok) {
                    // Toggle heart icon
                    if (icon.classList.contains('far')) {
                        icon.classList.replace('far', 'fas');
                        this.title = 'Remove from favorites';
                    } else {
                        icon.classList.replace('fas', 'far');
                        this.title = 'Add to favorites';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});
