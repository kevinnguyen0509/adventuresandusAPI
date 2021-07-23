const loadingImage = document.getElementById("loadingScreen");
const bottomContent = document.getElementById("bottom-content");
const cardContainer = document.getElementById("bottom-content");

const addButton = document.getElementById("add-button");
const nextButton = document.getElementById("next-button");
const redoButton = document.getElementById("redo-button");
const infoButton = document.getElementById("info-button-container");
let currentIndex;
let adventuresArray = [];
startLoading();

getAdventures().then((data) => {
  finishLoading();
  adventuresArray = shuffle(data.adventures);
  currentIndex = 0;

  //Creates card deck of 10
  for (let i = 0; i < 200; i++) {
    createCard(adventuresArray, i);
    //createInfoUrl(adventuresArray, currentIndex);
  }
  document.getElementById("card" + currentIndex).classList.remove("hidden");

  //Listeners Start Here for clicks
  addButton.addEventListener("click", function () {
    document
      .getElementById("card" + (currentIndex + 1))
      .classList.remove("hidden");

    let card = document.getElementById("card" + currentIndex);
    rightSwipe(adventuresArray, currentIndex, card);
    createInfoUrl(adventuresArray, currentIndex);
    currentIndex++;
  });

  nextButton.addEventListener("click", function () {
    currentIndex++;
    leftSwipe(adventuresArray, currentIndex);
    createInfoUrl(adventuresArray, currentIndex);
  });

  redoButton.addEventListener("click", function () {
    if (currentIndex == 0) {
      currentIndex = 0;
    } else {
      currentIndex--;
      redoSwipe(adventuresArray, currentIndex);
      createInfoUrl(adventuresArray, currentIndex);
    }
  });
});

/**************Functions*****************/
function rightSwipe(adventuresArray, currentIndex, card) {
  console.log(currentIndex);
  card.classList.add("slideRightAnim");

  //createCard(adventuresArray, currentIndex);
}

function leftSwipe(adventuresArray, currentIndex) {
  //createCard(adventuresArray, currentIndex);
}

function redoSwipe(adventuresArray, currentIndex) {
  //createCard(adventuresArray, currentIndex);
}

async function getAdventures() {
  const api = "/api/v1/adventures";
  const adventuresResponse = await fetch(api);
  const adventuresdata = adventuresResponse.json();
  return adventuresdata;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function finishLoading() {
  loadingImage.style.display = "none";
  bottomContent.style.display = "flex";
}

function startLoading() {
  loadingImage.style.display = "flex";
  bottomContent.style.display = "none";
}

/**************Helper Methods*****************/
function createCard(adventuresArray, currentIndex) {
  cardContainer.insertAdjacentHTML(
    "afterbegin",
    `
  <div class ="bottom-content-container hidden"  id="card${currentIndex}">
  <div class="image-content-container">
      <a href="${adventuresArray[currentIndex].url}" target="_blank">
        <img src="${adventuresArray[currentIndex].image}" class="right-content-image" />
      </a>
  </div>
  <div class="blur-title ">
    <a href="${adventuresArray[currentIndex].url}" target="_blank">
      <h3 class="title">${adventuresArray[currentIndex].title} </h3>
    </a>
      <h5 class="subTitle">${adventuresArray[currentIndex].location}</h5>
  </div>

  
  
  `
  );
}

function createInfoUrl(adventuresArray, currentIndex) {
  infoButton.innerHTML = `
  <a href="${adventuresArray[currentIndex].url}" target="_blank"><i   class="flaticon-information action-buttons" id="info-button"></i> 
  </a>
  `;
}
