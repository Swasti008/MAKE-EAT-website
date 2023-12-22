function getInput(){
    let inputDish = document.getElementsByClassName("inputDish")[0].value;
console.log("Input Dish:", inputDish);
    return inputDish;
}

function random() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response)
            receiveData(response,createAndappend);
        })
        .catch((error) => {
            console.log("Sorry some error occurred", error);
        });
}
random()

let currentMeal = null;

function receiveData(data, callback) {
    currentMeal = data.meals[0];
    callback("h1","dishName2",data.meals[0].strMeal,true)
    callback("img","image-wrapper2",data.meals[0].strMealThumb,true)
    callback("img","image-wrapper",data.meals[0].strMealThumb,true)  
    callback("h1","dishName",data.meals[0].strMeal,true)
    callback("h3","steps","Ingredients",true)
   callback("p","steps",Ingredients(data.meals[0]),true)
}
let i = 0; 

function createAndappend(tag, parentElement, content,condition) {
    let parent;

    parent = parentElement
    if(condition){
        parent = document.querySelector(`.${parentElement}`);
    }

    let tagname = document.createElement(tag);
    tagname.setAttribute("class", "element");

    if (tag === "img") {
        let image = new Image();
        image.onload = function() {
            tagname.src = content;
        };
        image.src = content;
    } else {
        tagname.innerText = content;
    }
    console.log(parent)
    console.log(tagname)
    parent.appendChild(tagname);
}


function inputAndShow(inputDish){
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${inputDish}`)
.then((response) => {
    return response.json();
})
.then((response) => {
    console.log(response);
    // console.log(response.meals[0].strMeal);
    // console.log(response.meals[0].strMealThumb);
    searchedDishesAppend(response,createAndappend);
})
.catch((error) => {
    console.log("Sorry some error occurred", error);
});

}

function searchedDishesAppend(data, callback) {
    let parentContainer = document.querySelector('.box-if-searched');
    let result =document.querySelector('.result');
    
    if (!parentContainer) {
        console.error("Parent container not found");
        return;
    }
    result.innerHTML = '';
    parentContainer.innerHTML= " ";

    if (data.meals && data.meals.length > 1) {
       result.innerHTML += `<h1>Your search results for ${getInput()}</h1>`;
        data.meals.forEach(element => {
            let eachDiv = document.createElement("div");
            eachDiv.setAttribute("class", "search-dish");

            callback("img", eachDiv, element.strMealThumb);
            callback("h1", eachDiv, element.strMeal);

            parentContainer.appendChild(eachDiv);
        });
    } else {
        result.innerHTML = `<h1>Result not found for ${getInput()}</h1>`;
    }
}




let searchButton=document.getElementById("search-button");
searchButton.addEventListener("click", function () {
    const  inputDish= getInput();
    inputAndShow(inputDish);
});


//popup
function hideModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}


  //INGREDIENTS
  const Ingredients = (meals) => {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const item = meals[`strIngredient${i}`];
        const measure = meals[`strMeasure${i}`];
        if (item && measure) {
            ingredients += `${measure} ${item}\n`;
        } else {
            break;
        }
    }
    return ingredients;
}


function showModal(modalId, dataType) {
    if (dataType === 'procedure') {
        // Append procedure details to the modal
        document.querySelector(".instruct").innerHTML = `<h3>RECIPIE</h3> ${currentMeal.strInstructions}`;
    } else if (dataType === 'ingredients') {
        // Append ingredients details to the modal
        document.querySelector(".instruct").innerHTML = `<h3>INGREDIENTS</h3> ${Ingredients(currentMeal)}`;
    }
    document.getElementById(modalId).style.display = "block";
}


document.getElementById("procedure-btn").addEventListener("click", function() {
    showModal('procedureModal', 'procedure');
});

document.getElementById("ingredients-btn").addEventListener("click", function() {
    showModal('procedureModal', 'ingredients');
});
