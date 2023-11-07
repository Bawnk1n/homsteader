# Homesteader

Homesteader is an App that utilizes the OpenAI ChatGPT API to help guide users who are interested in building their own garden. It works by first collecting all the necessary information about the space, containers, and plants the user wants to grow, then creating a dynamic plan which includes which plants should go in each container, how many of each plant will fit, and some dynamically generated advice for ensuring a healthy and well maintained garden.

## Distinctiveness and Complexity

Homesteader allows for user created accounts, and a single garden to be saved to the account with variable amounts of 'Plants' and 'Containers' attached to the garden.

The first page you will find after creating an account is the Garden page, which at this point will only be populated by the navbar and a 'Create Garden' button. Clicking this button will take you to the Create Garden page, which is a form designed to collect all the necessary information from the user while also informing them of the benefits and downfalls of certain choices.

At the top of the form there is a dynamic 'grid' where the user can estimate the size of their potential garden in sq ft, and populate it with potential garden containers. This offers users a chance to visualize perhaps for the first time how their potential garden will look. The next part of the form is a mixture of dropdown Select's, and Checkboxes. The information collected here pertains to

- level of gardening experience the user has
- type of climate
- which vegetables, fruits, herbs, flowers or other plants the user would like to grow
- if the garden is for food production or aesthetics

When the user clicks on the 'Make Plan" button, all the info is structured and sent to the ChatGPT API, and each of the users selected containers are filled one by one with the users selected plants that will grow best together, and dynamic information like 'instructions', 'tips' and 'little known facts' are generated for each container and also each plant.

The user is then taken to the Garden Plan page, where they can review the plan the AI gave to them and make adjustments to it. For example, if the user had too many plants and not enough containers, the leftover plants will be displayed at the top of the page, and the user can decide to either abandon those plants, or add new container(s) to accomodate them. If the user makes changes or adds new containers, a 'Revise' button will appear at the top of the container, this will send the container back to the AI to be re organized.

Once the user is content with their plan, they can click the Save Garden button at the bottom of the page to save the garden to their account, and it will now appear on the homescreen or the Garden link on the navbar. If the user decides they are not happy with their garden after the fact, they may click the Delete Garden button at the bottom of the main page to delete their garden and start again.

## Files

- presetPlants.js: a file containing multiple arrays of 'plant' objects, used to populate the Create Garden form.
- data.js: contains an array of objects representing gardening containers, used to populate the Create Garden form.
- apiCalls.js: contains the code for the ChatGPT API calls
- getCookie.js: contains code to retrieve cookies, used for getting the csrf tokens to communicate with the backend
- homesteader_react_app/components: contains all the components for the front end
- homesteader_react_app/assets: contains the css files and images used in the front end

## How To Run

in homesteader_django_app run: python manage.py runserver localhost:8000

in homesteader_react_app run: npm run dev

## Additional Info

Homesteader utilizes a total of 4 different Django Models, plus I created 10 views for it.
