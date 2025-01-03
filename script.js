const search_button = document.getElementById("button");
const search_input = document.getElementById("input");
const search_result = document.querySelector(".search-results");
const modal = document.querySelector(".modal");
let ingredients = document.querySelector(".modal-ingredients");
let cards;
AOS.init();

// Fetch recipe API
const fetchRecipe = async () => {
  search_result.innerHTML = "";
  try {
    const response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${search_input.value}`, {});
    const result = await response.json();
    return result.meals;
  } catch (err) {
    console.log("Error", err);
  }
};
// Create results element
const createElements = card => {
  const card_div = document.createElement("div");
  const card_thumb_parent = document.createElement("div");
  const card_text_parent = document.createElement("div");
  const card_title = document.createElement("h3");
  const card_thumb = document.createElement("img");
  const card_category = document.createElement("p");

  card_div.dataset.aos = "fade-up";
  card_div.dataset.aosDuration = 500;

  card_div.classList.add("card");
  card_div.setAttribute("id", card.idMeal);
  card_title.innerHTML = card.strMeal;
  card_thumb_parent.classList.add("thumbnail");
  card_thumb.src = card.strMealThumb;
  card_category.classList.add("type");
  card_category.innerHTML = card.strCategory;
  card_text_parent.classList.add("text-parent");

  setTimeout(() => {
    search_result.appendChild(card_div).append(card_thumb_parent, card_text_parent);
    card_thumb_parent.appendChild(card_thumb);
    card_text_parent.append(card_title, card_category);
  }, 100);
};

// Show search results
const searchResult = async event => {
  event.preventDefault();
  cards = await fetchRecipe();
  const result_message = document.getElementById("result-msg");
  const background = document.querySelector(".bg");

  if (cards == null) {
    result_message.innerText = "No results";
    background.style.display = "block";
    return;
  }

  if (!search_input.value) {
    result_message.innerText = "Please enter a meal";
    background.style.display = "block";
    return;
  }

  background.style.display = "none";
  result_message.innerText = cards.length + " results for " + search_input.value;
  result_message.style.color = "black";

  cards.forEach(card => {
    createElements(card);
  });
};

// Open modal
const handleOpenModal = async event => {
  event.preventDefault();
  const card_event = event.target.closest(".card");
  const card_id = card_event.id;

  const card = cards.find(card => card.idMeal === card_id);

  const hover_box = document.createElement("div");
  const thumb = document.querySelector(".modal-thumb");
  const title = document.querySelector(".modal-title");
  const instructions = document.querySelector(".modal-instructions");

  hover_box.classList.add("hover-box");
  thumb.src = card.strMealThumb;
  title.innerText = card.strMeal;
  instructions.innerText = card.strInstructions;

  ingredients = document.querySelector(".modal-ingredients");
  ingredients.appendChild(hover_box);

  for (const [key, value] of Object.entries(card)) {
    const img_container = document.querySelector(".ingredients-image-container");
    const ingredients_list = document.querySelector("ul");
    const ingredient_item = document.createElement("li");

    if (key.startsWith("strIngredient") && value) {
      const img = document.createElement("img");
      img.src = `https://themealdb.com/images/ingredients/${card[key]}.png`;
      img.alt = card[key];

      ingredient_item.innerHTML = card[key];

      const measureKey = key.replace("strIngredient", "strMeasure");
      if (card[measureKey]) {
        img.dataset.measure = card[measureKey];
        ingredient_item.innerHTML += " - " + card[measureKey];
      }

      ingredients.append(img_container, ingredients_list);
      img_container.appendChild(img);
      ingredients_list.appendChild(ingredient_item);
    }
  }

  setTimeout(() => {
    modal.style.display = "flex";
  }, 50);

  document.body.style.overflow = "hidden";
};

// Close modal
const closeModal = event => {
  event.preventDefault();
  const close_button = document.querySelector(".modal-close");
  if (event.target == close_button || event.target == modal) {
    console.log(event.target);
    ingredients.childNodes.forEach(child => {
      child.innerHTML = "";
    });

    modal.style.display = "none";
    document.body.style.overflow = "visible";
  }
};

search_button.addEventListener("click", searchResult);
search_result.addEventListener("click", handleOpenModal);
modal.addEventListener("click", closeModal);

ingredients = document.querySelector(".modal-ingredients");
const handleHoverBox = event => {
  const target = event.target;
  const hover_box = document.querySelector(".hover-box");

  console.log(hover_box.innerText);
  if (hover_box.classList.contains("active") || target.dataset.measure == undefined) {
    hover_box.classList.remove("active");
    return;
  }

  setTimeout(() => {
    hover_box.style.display = "block";
  }, 50);

  hover_box.classList.add("active");
  hover_box.innerHTML = target.alt + "<br> " + "<span>" + target.dataset.measure + "<span/>";

  const rect = ingredients.getBoundingClientRect();
  const offsetX = 20;
  const offsetY = 20;
  const mouseX = event.clientX - rect.left - offsetX;
  const mouseY = event.clientY - rect.top + offsetY;

  hover_box.style.top = mouseY + "px";
  hover_box.style.left = mouseX + "px";

  console.log("top: " + mouseY, "left: " + mouseX);
};

ingredients.addEventListener("mouseover", handleHoverBox);
ingredients.addEventListener("mouseout", handleHoverBox);
