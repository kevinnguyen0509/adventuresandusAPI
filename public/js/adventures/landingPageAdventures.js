const loadingImage = document.getElementById("loadingScreen");
const bottomContent = document.getElementById("bottom-content");
const cardContainer = document.getElementById("bottom-content");

const addButton = document.getElementById("add-button");
const nextButton = document.getElementById("next-button");
const redoButton = document.getElementById("redo-button");
const infoButton = document.getElementById("info-button-container");
let currentIndex;
let maxIndex = 5;
let tempEndDeck = maxIndex;
let adventuresArray = [];
startLoading();

getAdventures().then((data) => {
  finishLoading();
  adventuresArray = shuffle(data.adventures);
  currentIndex = 0;

  //Creates card deck of 10
  for (let i = 0; i < maxIndex; i++) {
    createCard(adventuresArray, i);
    //createInfoUrl(adventuresArray, currentIndex);
  }

  document.getElementById("card" + currentIndex).classList.remove("hidden");

  //Listeners Start Here for clicks
  addButton.addEventListener("click", function () {
    console.log("Current Index On Click: " + currentIndex);

    if (currentIndex == maxIndex - 1) {
      maxIndex = maxIndex + 5;

      for (let i = currentIndex + 1; i < maxIndex; i++) {
        createCard(adventuresArray, i);
        //createInfoUrl(adventuresArray, currentIndex);
      }
      console.log("current index after new deck: " + currentIndex);
      document
        .getElementById("card" + (currentIndex + 1))
        .classList.remove("hidden");

      let endingcard = document.getElementById("card" + currentIndex);
      console.log(endingcard);
      rightSwipe(adventuresArray, currentIndex, endingcard);
      //createInfoUrl(adventuresArray, currentIndex);
      currentIndex++;
    } else {
      document
        .getElementById("card" + (currentIndex + 1))
        .classList.remove("hidden");

      let card = document.getElementById("card" + currentIndex);
      rightSwipe(adventuresArray, currentIndex, card);
      createInfoUrl(adventuresArray, currentIndex);
      currentIndex++;
      console.log(currentIndex);
    }
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
  console.log("currentIndex: " + currentIndex, "tempDeck:" + tempEndDeck);
  if (currentIndex === tempEndDeck - 1) {
    console.log(card);

    card.classList.add("slideRightAnim");
    setTimeout(function () {
      card.remove();
    }, 500);
    tempEndDeck = maxIndex;
  } else {
    card.classList.add("slideRightAnim");
    setTimeout(function () {
      card.remove();
    }, 500);
  }

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
