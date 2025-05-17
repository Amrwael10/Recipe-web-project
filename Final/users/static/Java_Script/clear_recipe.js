document.addEventListener("DOMContentLoaded", () => {
    const removeButtons = document.querySelectorAll('.remove-btn');
    const clearAllButton = document.getElementById('Clear-all');
    const recipesContainer = document.getElementById('recipes-container');
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

    // Get CSRF token - fixed method
    function getCSRFToken() {
        // Try to get token from the cookie first (Django default)
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];
            
        if (cookieValue) return cookieValue;
        
        // As fallback, look for the token in any form on the page
        const tokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
        return tokenInput ? tokenInput.value : '';
    }

    // Handle single recipe deletion
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!confirm("Are you sure you want to delete this recipe?")) return;
            
            const recipeId = this.getAttribute('data-index');
            
            // Create a form dynamically to submit POST request
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/delete-recipe/${recipeId}/`;
            
            // Add Django CSRF token - improved method
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = getCSRFToken();
            form.appendChild(csrfInput);
            
            // Add method override (for DELETE)
            const hiddenMethod = document.createElement('input');
            hiddenMethod.type = 'hidden';
            hiddenMethod.name = '_method';
            hiddenMethod.value = 'DELETE';
            form.appendChild(hiddenMethod);
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        });
    });

    // Handle clear all recipes
    if (clearAllButton) {
        clearAllButton.addEventListener('click', function() {
            if (!confirm("Are you sure you want to delete ALL recipes?")) return;
            
            // Create a form for deleting all recipes
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/delete-all-recipes/';
            
            // Add Django CSRF token - improved method
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = getCSRFToken();
            form.appendChild(csrfInput);
            
            // Add method override
            const hiddenMethod = document.createElement('input');
            hiddenMethod.type = 'hidden';
            hiddenMethod.name = '_method';
            hiddenMethod.value = 'DELETE';
            form.appendChild(hiddenMethod);
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        });
    }
});