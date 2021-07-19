// ********* select items ******
const alert = document.querySelector(".alert")
const form = document.querySelector(".grocery-form")
const grocery = document.getElementById("grocery")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")

// -----------------------------------------------------------------------------------

// ********* edit option ******
let editElement;
let editFlag = false;
let editId = "";

// -----------------------------------------------------------------------------------

// ********* event listeners ******

//submit form
form.addEventListener("submit", addItem)

//clear all itenms
clearBtn.addEventListener("click", clearallitems)

//load items
window.addEventListener("DOMContentLoaded", setupitems);
// -----------------------------------------------------------------------------------

// ********* functions ******

//add item function
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value && !editFlag) {
     
        createlistitem(id, value);
        displayAlert("item added", "success");

        //show container
        container.classList.add("show-container");

        //add to local storage
        addtolocalstorage(id,value);
        //setbacktodefault
        setbacktodefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = grocery.value;
        displayAlert("Value Changed", "success");
        editlocalstorage(editId, value);
        setbacktodefault();
    }
    else {
        displayAlert('please enter value', "danger");
    }
}

// -----------------------------------------------------------------------------------

//clear all items function
function clearallitems(){
    const items = document.querySelectorAll(".grocery-item")
    if(items.length >0){
        items.forEach(function(item){
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "success");
    setbacktodefault();
    localStorage.removeItem('list');
}

// -----------------------------------------------------------------------------------

//delete btn function 
function deleteitem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);

    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setbacktodefault();

    //removefromlocalstorage
    removefromlocalstorage(id);
}

// -----------------------------------------------------------------------------------

//edit btn function 
function edititem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag= true;
    editId= element.dataset.id;
    submitBtn.textContent = "edit";
}

// -----------------------------------------------------------------------------------

//set back to default functopn
function setbacktodefault(){
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit"
}

// -----------------------------------------------------------------------------------

//display alert function
function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)


    //remove alert
    setTimeout(function () {
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    }, 1000);
}

// -----------------------------------------------------------------------------------

// ********* local storage ******

//add to loacal storage
function addtolocalstorage(id, value){
   const grocery = {id, value};
   let items = getlocalstorage();
   items.push(grocery);
   localStorage.setItem("list", JSON.stringify(items));
}

// -----------------------------------------------------------------------------------

function removefromlocalstorage(id){
    let items = getlocalstorage();
   items = items.filter(function(item){
       if(item.id !== id){
           return item;
       }
   })
   localStorage.setItem("list", JSON.stringify(items));
}

// -----------------------------------------------------------------------------------

function editlocalstorage(editId, value){
 let items = getlocalstorage();
 items = items.map(function(item){
     if(item.id === editId){
         item.value= value;
     }
     return item;
 })
 localStorage.setItem("list", JSON.stringify(items));
}
// -----------------------------------------------------------------------------------

function getlocalstorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
// ********* setup items ******

// -----------------------------------------------------------------------------------
function setupitems(){
    let items = getlocalstorage();
    if(items.length >0){
        items.forEach(function(item){
            createlistitem(item.id, item.value);
        })
        container.classList.add("show-container")
    }
}
// -----------------------------------------------------------------------------------

 function createlistitem(id, value){
    const element = document.createElement('article');
    element.classList.add("grocery-item");
    //add id
    const attribute = document.createAttribute("data-id");
    attribute.value = id;
    element.setAttributeNode(attribute);

    element.innerHTML = ` <p class="item">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
        <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>`

    //selecting btns
    const deleteBtn = element.querySelector(".delete-btn")
    const editBtn = element.querySelector(".edit-btn")

    //add event listenenr
    deleteBtn.addEventListener("click", deleteitem);
    editBtn.addEventListener("click", edititem);

    //append child
    list.appendChild(element)
 }