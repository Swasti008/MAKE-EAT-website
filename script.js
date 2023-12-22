// function for getting the input
function getInput() {
    let inputDish = document.getElementsByClassName("inputDish")[0].value;//taken indexing to avoid the same class problem.
    return inputDish;
}
// function for fectching the random dish data and appending the data to the second section
function random() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            // console.log(response)
            receiveData(response, createAndappend);
        })
        .catch((error) => {
            console.log("Sorry some error occurred", error);
        });
}
//called the random function
random()
//created currentMeal variable for storing the data for the dish(it is useful for the dynamic popup for both procedure and ingredients.)
let currentMeal = null;

//helping function to append the data for random dish.
function receiveData(data, callback) {
    currentMeal = data.meals[0];
    callback("h1", "dishName2", data.meals[0].strMeal, true)
    callback("img", "image-wrapper2", data.meals[0].strMealThumb, true)
    callback("img", "image-wrapper", data.meals[0].strMealThumb, true)
    callback("h1", "dishName", data.meals[0].strMeal, true)
    callback("h3", "steps", "Ingredients", true)
    callback("p", "steps", Ingredients(data.meals[0]), true)
}
// createAndappend function is creating tags and appending to the parent element as parameter and the condition is to check if the parent is present in html or not.
function createAndappend(tag, parentElement, content, condition) {
    let parent;
    parent = parentElement;
    if (condition) {
        parent = document.querySelector(`.${parentElement}`);
    }

    let tagname = document.createElement(tag);
    tagname.setAttribute("class", "element");

    if (tag === "img") {
        let image = new Image();
        image.onload = function () {
            tagname.src = content;
        };
        image.src = content;
    } else {
        tagname.innerText = content;
    }

    parent.appendChild(tagname);
}

// function to fetch the dishes for the inputDish and appending the data 
function inputAndShow(inputDish) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${inputDish}`)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            // console.log(response);
            // console.log(response.meals[0].strMeal);
            // console.log(response.meals[0].strMealThumb);
            searchedDishesAppend(response, createAndappend);
        })
        .catch((error) => {
            console.log("Sorry some error occurred", error);
        });

}
//helping function to append the search results for the input
function searchedDishesAppend(data, callback) {
    let parentContainer = document.querySelector('.box-if-searched');
    let result = document.querySelector('.result');
    result.innerHTML = '';
    parentContainer.innerHTML = " ";
    // if the length of the data.meals is greater than 1 than it will append,
    if (data.meals && data.meals.length > 1) {
        result.innerHTML += `<h1>Your search results for ${getInput()}</h1>`;
        data.meals.forEach(element => {
            let eachDiv = document.createElement("div");
            eachDiv.setAttribute("class", "search-dish");

            callback("img", eachDiv, element.strMealThumb);
            callback("h1", eachDiv, element.strMeal);

            parentContainer.appendChild(eachDiv);
        });
        // if not it will print a message that result not found.
    } else {
        result.innerHTML = `<h1>Result not found for ${getInput()}</h1>`;
    }
}
//functionality for search
let searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function () {
    const inputDish = getInput();
    inputAndShow(inputDish);
});
//for showing the modal by checking if it is procedure or ingredients.
function showModal(element, dataType) {
    if (dataType === 'procedure') {
        document.querySelector(".instruct").innerHTML = `<h3>RECIPIE</h3> ${currentMeal.strInstructions}`;
    } else if (dataType === 'ingredients') {
        document.querySelector(".instruct").innerHTML = `<h3>INGREDIENTS</h3> ${Ingredients(currentMeal)}`;
    }
    document.getElementById(element).style.display = "block";
}

// click event listener for procedure button in modal.
document.getElementById("procedure-btn").addEventListener("click", function () {
    showModal('procedureModal', 'procedure');
});

//click event listener for ingredients button in modal.
document.getElementById("ingredients-btn").addEventListener("click", function () {
    showModal('procedureModal', 'ingredients');
});


//for closing the popup and this function is called in html as onclick on close button.
function hideModal(element) {
    document.getElementById(element).style.display = "none";
}

//function to add ingredients.
function Ingredients(meals) {
    let allIngredients = '';
    for (let i = 1; i <= 20; i++) {
        const element = meals[`strIngredient${i}`];
        const quantity = meals[`strMeasure${i}`];
        if (element && quantity) {
            allIngredients += `${quantity} ${element} \n`;
        }
        else {
            break;
        }
    }
    return allIngredients;
}


