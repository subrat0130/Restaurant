$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#button-navbar").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#navbarSupportedContent").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#button-navbar").click(function (event) {
    $(event.target).focus();
  });
});



(function (global) {

var dc = {};

var homeHtml = "Snippet/home-snippet.html"; //for home page 3 icons menu , specail,map;



var allCategoriesUrl="https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "Snippet/categories-title-snippet.html";  
var categoryHtml = "Snippet/category-snippet.html";//inside menu category page lunch,appetizers etc;



var menuItemUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category="; 
var  menuItemsTitleHtml = "Snippet/menu-items-title.html";     //inside lunch menu items ;
var menuItemsHtml = "Snippet/menu-item.html";


// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);     //to inserrt the made html after all the pertaion to designated 
  targetElem.innerHTML = html;                            ///place by selector id eg . #main-content
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

insertProperty= function(string,propName,propValue){
  var propToReplace="{{"+propName+"}}"; //to identify which is yo be replaced
  string= string.replace(new RegExp(propToReplace,"g"),propValue);  //replacing all the occurene of purticular item in this case propName by porpValue
                                                //with helpp of g all occurence is done

  return string;

}

//// *********************** not working 
// var switchMenuToActive = function () {
//   // Remove 'active' from home button
//   var classes = document.querySelector("#one").className;
//   classes = classes.replace(new RegExp("list-group-item  group-item-dark", "g"), "");
  
//   document.querySelector("#one").className = classes;

//   // Add 'active' to menu button if not already there
//   classes = document.querySelector("#one").className;
//   if (classes.indexOf("list-group-item  group-item-dark") == -1) {
//     classes += " list-group-item  group-item-dark";
//     document.querySelector("#one").className = classes;
//   }
// };


// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view

//show loading gif
showLoading("#main-content");

//sending ajax requuest
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
}); 


dc.loadMenuCategories=function(){
  showLoading('#main-content');
  $ajaxUtils.sendGetRequest(allCategoriesUrl,
    buildAndShowCategoriesHTML);

};



dc.loadMenuItems = function(categoryShort){  //categoryshort came from the html snippet fucntion $dc.loadMenuItems('{{short-name}}');

showLoading("#main-content");
$ajaxUtils.sendGetRequest(
   menuItemUrl+categoryShort,
  buildAndShowMenuItemsHtml);  //its going to be json so its true by default

};


function buildAndShowCategoriesHTML(categories){
  $ajaxUtils.sendGetRequest(categoriesTitleHtml,
    function(categoriesTitleHtml){
      
      $ajaxUtils.sendGetRequest(categoryHtml,
        function(categoryHtml){
            //switchMenuToActive();
          var categoriesViewHtml= 
                 buildCategoriesViewHtml(categories,
                                  categoriesTitleHtml,
                                  categoryHtml);

          insertHtml("#main-content",categoriesViewHtml);
        },false);

    },false );
}
//false because we dont want to ajax utilities to process both of our html snippet as json

function buildCategoriesViewHtml(categories,
                  categoriesTitleHtml,categoryHtml){

    var finalHtml=categoriesTitleHtml;
    finalHtml+="<section class='row'>";
    //loop over categories
    for (var i = 0; i < categories.length; i++) {
      var html=categoryHtml; //copy of value
      var name=""+categories[i].name;
      var short_name = categories[i].short_name;

      html =insertProperty(html,"name",name);
      html =insertProperty(html,"short_name",short_name);
      finalHtml+=html;

    }

    finalHtml+="</section>";
    return finalHtml;

}


function buildAndShowMenuItemsHtml (categoryMenuItems){ //json is going to be processed 
                                                        //and its an object that is going to be returned

$ajaxUtils.sendGetRequest(
  menuItemsTitleHtml,
  function(menuItemsTitleHtml){
    $ajaxUtils.sendGetRequest(
      menuItemsHtml,
      function(menuItemsHtml){
         //switchMenuToActive();
        var menuItemsViewHtml=
        buildMenuItemsViewHtml (categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemsHtml);
        insertHtml("#main-content",menuItemsViewHtml);
      },
      false);
  },
  false);

}


function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemsHtml){

menuItemsTitleHtml=insertProperty(menuItemsTitleHtml,
                  "name",categoryMenuItems.category.name);

menuItemsTitleHtml=insertProperty(menuItemsTitleHtml,"special_instructions",
                categoryMenuItems.category.special_instructions);

var finalHtml=menuItemsTitleHtml;
finalHtml+= "<section class='row'>";

//loop over menu items
var menuItems = categoryMenuItems.menu_items;
var catShortName = categoryMenuItems.category.short_name;

for (var i = 0; i < menuItems.length; i++) {
      
      ///insert menu items values
      var html=menuItemsHtml;
      html=insertProperty(html,"short_name",menuItems[i].short_name);

      html = insertProperty(html,"catShortName",catShortName);

      html = insertItemPrice(html,"price_small",menuItems[i].price_small);

      html = insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);

      html = insertItemPrice(html,"price_large",menuItems[i].price_large);

      html = insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);

      html = insertProperty(html,"name",menuItems[i].name);

      html = insertProperty(html,"description",menuItems[i].description);

      if (i%2!=0) {
        html+= 
        "<div class= 'clearfix  d-none d-md-block d-lg-block'></div>";

      }

      finalHtml+=html;
}

finalHtml+="</section>";

return finalHtml;

}


function insertItemPrice (html,pricePropName,priceValue){

//if not specified replace with empty string 
if(!priceValue){
  return insertProperty(html,pricePropName,"");
}

priceValue = "$"+priceValue.toFixed(2);
html = insertProperty(html,pricePropName,priceValue);
return html;

}


function insertItemPortionName(html,portionPropName,portionValue){
  if(!portionValue){
    return insertProperty(html,portionPropName,"");
  }
  portionValue= "("+portionValue + ")";
  html = insertProperty(html,portionPropName,portionValue);
  return html;
}



global.$dc = dc;

})(window);