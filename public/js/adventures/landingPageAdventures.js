const loadingImage = document.getElementById("loadingScreen");
const bottomContent = document.getElementById("bottom-content");
const cardContainer = document.getElementById("bottom-content");
const recentlyAdded = document.getElementById("recentlyAddedContainer");
const addButton = document.getElementById("add-button");
const nextButton = document.getElementById("next-button");
const redoButton = document.getElementById("redo-button");
const infoButton = document.getElementById("info-button-container");
let currentIndex = 0;
let maxIndex = 10;
let tempEndDeck = maxIndex;
let adventuresArray = [];
startLoading();

getAdventures().then((data) => {
  finishLoading();
  adventuresArray = shuffle(data.adventures);

  //Creates card deck of 10
  createInitialDeck(adventuresArray);

  //Listeners Start Here for clicks
  addButton.addEventListener("click", function () {
    if (currentIndex == maxIndex - 1) {
      recentlyAdded.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="recently-added-img-container">
        <img src="${adventuresArray[currentIndex].image}" class="recently-added-image"></div>`
      );

      maxIndex = maxIndex + 100;

      //Creates new deck
      for (let i = currentIndex + 1; i < maxIndex; i++) {
        createCard(adventuresArray, i);
      }

      document
        .getElementById("card" + (currentIndex + 1))
        .classList.remove("hidden");

      //Tells program it's the end of the deck and swipes the last card away
      let endingcard = document.getElementById("card" + currentIndex);
      rightSwipe(adventuresArray, currentIndex, endingcard);

      currentIndex++; //Next item in deck
    } else {
      document
        .getElementById("card" + (currentIndex + 1))
        .classList.remove("hidden");

      let card = document.getElementById("card" + currentIndex);
      recentlyAdded.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="recently-added-img-container">
        <img src="${adventuresArray[currentIndex].image}" class="recently-added-image"></div>`
      );
      rightSwipe(adventuresArray, currentIndex, card);
      createInfoUrl(adventuresArray, currentIndex);

      currentIndex++;
    }
  });

  nextButton.addEventListener("click", function () {
    //If it's the last card in the deck grab more from memory
    if (currentIndex == maxIndex - 1) {
      maxIndex = maxIndex + 100;

      //Creates new deck
      for (let i = currentIndex + 1; i < maxIndex; i++) {
        createCard(adventuresArray, i);
      }

      document
        .getElementById("card" + (currentIndex + 1))
        .classList.remove("hidden");

      //Tells program it's the end of the deck and swipes the last card away
      let endingcard = document.getElementById("card" + currentIndex);
      rightSwipe(adventuresArray, currentIndex, endingcard);

      currentIndex++; //Next item in deck
    } else {
      document
        .getElementById("card" + (currentIndex + 1))
        .classList.remove("hidden");

      let card = document.getElementById("card" + currentIndex);
      leftSwipe(adventuresArray, currentIndex, card);
      createInfoUrl(adventuresArray, currentIndex);

      currentIndex++;
    }
  });

  redoButton.addEventListener("click", function () {
    if (currentIndex == 0) {
      currentIndex = 0;
      console.log(currentIndex);
    } else {
      currentIndex--;
      redoSwipe(adventuresArray, currentIndex);
      createInfoUrl(adventuresArray, currentIndex);
    }
  });
});

/**************Functions*****************/
function rightSwipe(adventuresArray, currentIndex, card) {
  if (currentIndex === tempEndDeck - 1) {
    card.classList.add("slideRightAnim");

    //Wait for animation
    removeCard(card, 500);
    tempEndDeck = maxIndex; //Reset the card number thats at the end of the current card deck
  } else {
    card.classList.add("slideRightAnim");
    setTimeout(function () {
      card.remove();
    }, 500);
  }
}

function leftSwipe(adventuresArray, currentIndex, card) {
  if (currentIndex === tempEndDeck - 1) {
    card.classList.add("slideLeftAnim");
    //Wait for animation
    removeCard(card, 500);
    tempEndDeck = maxIndex; //Reset the card number thats at the end of the current card deck
  } else {
    card.classList.add("slideLeftAnim");
    setTimeout(function () {
      card.remove();
    }, 500);
  }
}

function redoSwipe(adventuresArray, currentIndex) {}

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
      <h5 class="subTitle">Location: ${adventuresArray[currentIndex].location}</h5>
  </div>

  
  
  `
  );
}

function createInfoUrl(adventuresArray, currentIndex) {
  infoButton.innerHTML = `
  <a href="${
    adventuresArray[currentIndex + 1].url
  }" target="_blank"><i   class="flaticon-information action-buttons" id="info-button"></i> 
  </a>
  `;
}

function createInitialDeck(adventuresArray) {
  for (let i = 0; i < maxIndex; i++) {
    createCard(adventuresArray, i);
  }

  document.getElementById("card" + currentIndex).classList.remove("hidden");
  createInfoUrl(adventuresArray, currentIndex - 1);
}

function removeCard(card, timeInMIliseconds) {
  setTimeout(function () {
    card.remove();
  }, timeInMIliseconds);
}
