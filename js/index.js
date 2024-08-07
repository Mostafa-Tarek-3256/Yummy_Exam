const openIcon = document.querySelector(".open-icon");
const closeIcon = document.querySelector(".close-icon");
let prev ='';

function upLinks() {
  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}

function open() {
  $(".side-nav").animate({ left: 0 }, 500);
  upLinks();
  $(".open-icon").addClass("d-none");
  $(".close-icon").removeClass("d-none");
}
openIcon.addEventListener("click", open);

function close() {
  $(".side-nav").animate({ left: "-265px" }, 500);

  $(".links li").animate({ top: 300 }, 500);

  $(".open-icon").removeClass("d-none");
  $(".close-icon").addClass("d-none");
}
closeIcon.addEventListener("click", close);



///////////////// start ///////////////

async function initial(){

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${''}`);
    res = await res.json();
  
    if (res.meals != null) {
      displayMeals(res.meals);
    } else {
      console.log("NO");
    }
}

async function begin(fun){
    fun();
}

$(document).ready(function () {
    begin(initial);
})


function hideSearch(){
    searchBox.innerHTML=``;
}

function hideData(){
    databox.innerHTML=``;
}




// when click on search

const searchBox = document.getElementById("search");
const databox = document.getElementById("Data");


function showSearchInputs() {
    hideData();
  searchBox.innerHTML = `
    <div class="row py-5">
        <div class="col-md-6">
            <input id="byName" onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input id="byLetter" onkeyup="searchByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
      </div>
    `;
  close();
}
document.getElementById("searchList").addEventListener("click", showSearchInputs);

async function searchByName(term) {
    prev = term;
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  res = await res.json();

  if (res.meals != null) {
    
    displayMeals(res.meals);
  } else {
    console.log("NO");
  }

}

async function searchByLetter(term){
    prev = term;
    if(term == ""){
        term ="m"
    }
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    res = await res.json();

    if (res.meals != null) {
        
        displayMeals(res.meals);
    } else {
        console.log("NO");
    }
    
}


//////////// display meals ///////////////


function displayMeals(arr){
    let cartona = ``;
    for(let i = 0; i<arr.length; i++){
        cartona += `
        <div class="col-md-3">
        <div onclick="mealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2">
            <img class="w-100" src="${arr[i].strMealThumb}" >
            <div class="layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${arr[i].strMeal}</h3>
            </div>
        </div>
      </div>
        `

    }
    databox.innerHTML = cartona;
}

async function mealDetails(id){
    close();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    res = await res.json();


    let ingredientsCartona=``;
    for(let i = 0; i<=30;i++){
        if(res.meals[0][`strIngredient${i}`]){
            ingredientsCartona += `<li class="alert alert-info m-2 p-1">${res.meals[0][`strMeasure${i}`]} ${res.meals[0][`strIngredient${i}`]}</li>`
        }
    }

    let tags;
    let tagsCartona = '';
    if(res.meals[0].strTags != null){
        tags = res.meals[0].strTags.split(",");
        
        for (let i = 0; i < tags.length; i++) {
            tagsCartona += `
                <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
            `
        }
    }else{
        tags = [];
    }


    databox.innerHTML = `
        <div class="col-md-4">
        <img class="w-100 rounded-3" src="${res.meals[0].strMealThumb}"
            alt="">
        <h2>${res.meals[0].strMeal}</h2>
        <a onclick="searchByName('${''}')" target="_blank" class="btn btn-info">Back</a>
        </div>

        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${res.meals[0].strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${res.meals[0].strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${res.meals[0].strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredientsCartona}
            </ul>

            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tagsCartona}
            </ul>

            <a target="_blank" href="${res.meals[0].strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${res.meals[0].strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    `
}


/////////////// categories ///////////////

document.getElementById("catList").addEventListener("click", getCategories);
async function getCategories() {

    close();
   
    hideSearch();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    res = await res.json();

    if (res != null) {
  
        displayCategories(res.categories);
    } else {
        console.log("NO");
    }
    
;

}

function displayCategories(arr){
    let cartona = ``;
    for(let i = 0; i<arr.length; i++){
        cartona += `
            <div class="col-md-3">
            <div onclick="getThisCategory('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${arr[i].strCategoryThumb}">
                <div class="layer position-absolute text-center text-black p-2">
                    <h3>${arr[i].strCategory}</h3>
                    <p>${arr[i].strCategoryDescription}</p>
                </div>
            </div>
            </div>
        `
    }
    databox.innerHTML=cartona;
}

async function getThisCategory(name){
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
  res = await res.json();
  prev = name;

  displayMeals(res.meals);

  
}


/////////////// Area /////////////// 

document.getElementById("areaList").addEventListener("click", getArea);
async function getArea(){
    
    close();
    hideSearch();
    
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    res = await res.json();
    displayArea(res.meals);
}
function displayArea(arr){
    let cartona=``;
    for(let i = 0; i<arr.length;i++){
        cartona+=`
            <div class="col-md-3">
            <div onclick="getMealsOfArea('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${arr[i].strArea}</h3>
            </div>
            </div>
        `
    }
    databox.innerHTML=cartona;

}

async function getMealsOfArea(name){
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`);
    res = await res.json();
    displayMeals(res.meals);
    
}


/////////////// Ingridents ///////////////

document.getElementById("ingrList").addEventListener("click", getIngridents);
async function getIngridents(){

    close();
    hideSearch();
    
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    res = await res.json();
    displayIng(res.meals.slice(0,24));

    
}
function displayIng(arr){
    let cartona=``;
    for(let i = 0; i<arr.length;i++){
        cartona+=`
            <div class="col-md-3">
            <div onclick="ingrediensMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
            </div>
        `
    }
    databox.innerHTML=cartona;
}

async function ingrediensMeals(name){

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`);
    res = await res.json();
    displayMeals(res.meals);

    
}


/////////////// contact ///////////////

document.getElementById("contList").addEventListener("click", showContact);

function showContact(){
    close();
    hideSearch();
    
    databox.innerHTML=`
        <div class="contact">
        <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input type="text" class="nameInput form-control"
                    placeholder="Enter Your Name">
                <div class="nameAlert alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input type="email" class="emailInput form-control "
                    placeholder="Enter Your Email" >
                <div class="emailAlert alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input type="text" class="phoneInput form-control "
                    placeholder="Enter Your Phone" >
                <div class="phoneAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="contactValidation()" type="number" class="ageInput form-control "
                    placeholder="Enter Your Age" >
                <div class="ageAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="contactValidation()" type="password"
                    class="passwordInput form-control " placeholder="Enter Your Password" >
                <div class="passwordAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="contactValidation()" type="password"
                    class="repasswordInput form-control " placeholder="Repassword">
                <div class="repasswordAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword
                </div>
            </div>
        </div>
        <button disabled="" class="submitBtn btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
    </div>
    `

    let flag1 = false, flag2 = false, flag3 = false, flag4 = false, flag5 = false, flag6 = false;
    $('.nameInput').keyup(function(){
        if(regName.test($('.nameInput').val())){
            flag1 = true;
            $('.nameAlert').addClass('d-none');
        }
        else{
            flag1 = false;
            $('.nameAlert').removeClass('d-none');
        }
        if($('.nameInput').val() == ""){
            flag1 = false;
            $('.nameAlert').addClass('d-none');
        }

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            $('.submitBtn').removeAttr('disabled');
        } else {
            $('.submitBtn').attr('disabled','');
        }
    })
    $('.emailInput').keyup(function(){
        if(regEmail.test($('.emailInput').val())){
            flag2 = true;
            $('.emailAlert').addClass('d-none');
        }
        else{
            flag2 = false;
            $('.emailAlert').removeClass('d-none');
        }
        if($('.emailInput').val() == ""){
            flag1 = false;
            $('.emailAlert').addClass('d-none');
        }

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            $('.submitBtn').removeAttr('disabled');
        } else {
            $('.submitBtn').attr('disabled','');
        }
    })
    $('.phoneInput').keyup(function(){
        if(regPhone.test($('.phoneInput').val())){
            flag3 = true;
            
            $('.phoneAlert').addClass('d-none');
        }
        else{
            flag3 = false;
            $('.phoneAlert').removeClass('d-none');
        }
        if($('.phoneInput').val() == ""){
            flag3 = false;
            $('.phoneAlert').addClass('d-none');
        }

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            $('.submitBtn').removeAttr('disabled');
        } else {
            $('.submitBtn').attr('disabled','');
        }
    })
    $('.ageInput').keyup(function(){
        if(regAge.test($('.ageInput').val())){
            flag4 = true;
            $('.ageAlert').addClass('d-none');
        }
        else{
            flag4 = false;
           ;
            $('.ageAlert').removeClass('d-none');
        }
        if($('.ageInput').val() == ""){
            flag4 = false;
            $('.ageAlert').addClass('d-none');
        }

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            $('.submitBtn').removeAttr('disabled');
        } else {
            $('.submitBtn').attr('disabled','');
        }
    })
    $('.passwordInput').keyup(function(){
        if(regPass.test($('.passwordInput').val())){
            flag5 = true;
            $('.passwordAlert').addClass('d-none');
        }
        else{
            flag5 = false;
            $('.passwordAlert').removeClass('d-none');
        }
        if($('.passwordInput').val() == ""){
            flag5 = false;
            $('.passwordAlert').addClass('d-none');
        }

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            $('.submitBtn').removeAttr('disabled');
        } else {
            $('.submitBtn').attr('disabled','');
        }
    })
    $('.repasswordInput').keyup(function(){
        if($('.repasswordInput').val() == $('.passwordInput').val()){
            flag6 = true;
            console.log(flag6);
            $('.repasswordAlert').addClass('d-none');
        }
        else{
            flag6 = false;
            console.log(flag6);
            $('.repasswordAlert').removeClass('d-none');
        }
        if($('.repasswordInput').val() == ""){
            flag6 = false;
            $('.repasswordAlert').addClass('d-none');
        }

        if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
            $('.submitBtn').removeAttr('disabled');
        } else {
            $('.submitBtn').attr('disabled','');
        }
    })
}


