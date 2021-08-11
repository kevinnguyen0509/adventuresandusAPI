const loadingImage = document.getElementById("loadingScreen");
const bottomContent = document.getElementById("bottom-content");
const cardContainer = document.getElementById("bottom-content");
const recentlyAdded = document.getElementById("recentlyAddedContainer");
const addButton = document.getElementById("add-button");
const nextButton = document.getElementById("next-button");
const redoButton = document.getElementById("redo-button");
const infoButton = document.getElementById("info-button-container");

const allAdventures = document.getElementById("allAdventures");
const resturantLink = document.getElementById("Restaurants");
const homedecor = document.getElementById("homedecor");
const daytrips = document.getElementById("daytrips");
const cooking = document.getElementById("cooking");
const hiking = document.getElementById("hiking");

const searchButton = document.getElementById("search_icon");
const searchOne = document.getElementById("search_one");
const searchTwo = document.getElementById("search_two");
const rightSwipeText = document.getElementById(
  "swipeFeedBackMessageContainerRight"
);

const leftSwipeText = document.getElementById(
  "swipeFeedBackMessageContainerLeft"
);

const centerSwipeText = document.getElementById(
  "swipeFeedBackMessageContainerCenter"
);
let currentIndex = 0;
let maxIndex = 10;
let tempEndDeck = maxIndex;
let adventuresArray = [];
startLoading();

getAdventures("adventures").then((data) => {
  finishLoading(rightSwipeText);
  adventuresArray = shuffle(data.adventures);

  //Creates card deck of 10
  createInitialDeck(adventuresArray);

  //Listeners Start Here for clicks
  addButton.addEventListener("click", function () {
    showFeedMessage(rightSwipeText);
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
        <a href="${adventuresArray[currentIndex].url}" target="_blank">
        <img src="${adventuresArray[currentIndex].image}" class="recently-added-image"></a></div>`
      );
      rightSwipe(adventuresArray, currentIndex, card);
      createInfoUrl(adventuresArray, currentIndex);

      currentIndex++;
    }
  });

  redoButton.addEventListener("click", function () {
    showFeedMessage(centerSwipeText);
    if (currentIndex == 0) {
      currentIndex = 0;
      //console.log(currentIndex);
    } else {
      currentIndex--;
      document
        .getElementById("card" + (currentIndex + 1))
        .classList.add("hidden");

      createRedoCard(adventuresArray, currentIndex);
      createInfoUrl(adventuresArray, currentIndex - 1);

      document.getElementById("card" + currentIndex).classList.remove("hidden");
    }
  });

  nextButton.addEventListener("click", function () {
    showFeedMessage(leftSwipeText);

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

  /******************KeyBoard bindings******************** */
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == "39") {
      //Right Swipe
      showFeedMessage(rightSwipeText);
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
          <a href="${adventuresArray[currentIndex].url}" target="_blank">
          <img src="${adventuresArray[currentIndex].image}" class="recently-added-image"></a></div>`
        );
        rightSwipe(adventuresArray, currentIndex, card);
        createInfoUrl(adventuresArray, currentIndex);

        currentIndex++;
      }
    } else if (e.keyCode == "37") {
      //Left
      showFeedMessage(leftSwipeText);

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
    } else if (e.keyCode == "40") {
      //Redo
      showFeedMessage(centerSwipeText);
      if (currentIndex == 0) {
        currentIndex = 0;
        //console.log(currentIndex);
      } else {
        currentIndex--;
        document
          .getElementById("card" + (currentIndex + 1))
          .classList.add("hidden");

        createRedoCard(adventuresArray, currentIndex);
        createInfoUrl(adventuresArray, currentIndex - 1);

        document
          .getElementById("card" + currentIndex)
          .classList.remove("hidden");
      }
    }
  }); //End KeyBindings

  /**************Links clicked listener ****************/
  allAdventures.addEventListener("click", function () {
    startLoading();
    changeActive(allAdventures);
    getAdventures("adventures").then((data) => {
      finishLoading();
      currentIndex = 0;
      maxIndex = 10;
      adventuresArray = [];
      adventuresArray = shuffle(data.adventures);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
    });
  });

  resturantLink.addEventListener("click", function () {
    startLoading();
    changeActive(resturantLink);
    getAdventures("adventures/restaurants").then((data) => {
      finishLoading();
      currentIndex = 0;
      maxIndex = 10;
      adventuresArray = [];
      adventuresArray = shuffle(data.adventures);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
    });
  });

  homedecor.addEventListener("click", function () {
    startLoading();
    changeActive(homedecor);
    getAdventures("adventures/homedecor").then((data) => {
      finishLoading();
      currentIndex = 0;
      maxIndex = 10;
      adventuresArray = [];
      adventuresArray = shuffle(data.adventures);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
    });
  });

  daytrips.addEventListener("click", function () {
    startLoading();
    changeActive(daytrips);
    getAdventures("adventures/daytrips").then((data) => {
      finishLoading();
      currentIndex = 0;
      maxIndex = 10;
      adventuresArray = [];
      adventuresArray = shuffle(data.adventures);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
    });
  });

  cooking.addEventListener("click", function () {
    startLoading();
    changeActive(cooking);
    getAdventures("adventures/cooking").then((data) => {
      finishLoading();
      currentIndex = 0;
      maxIndex = 10;
      adventuresArray = [];
      adventuresArray = shuffle(data.adventures);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
    });
  });

  hiking.addEventListener("click", function () {
    startLoading();
    changeActive(hiking);
    getAdventures("adventures/hiking").then((data) => {
      finishLoading();
      currentIndex = 0;
      maxIndex = 10;
      adventuresArray = [];
      adventuresArray = shuffle(data.adventures);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
    });
  });

  /***************Search bar functions********************/
  searchButton.addEventListener("click", function () {
    startLoading();
    let searchContentArray = searchOne.value.split(" ");
    let searchQuery = "";
    let location = searchTwo.value;
    for (let i = 0; i < searchContentArray.length; i++) {
      searchQuery = searchQuery + "-" + searchContentArray[i];
    }
    searchQuery = searchQuery.substring(1);
    getSearch(searchQuery, location).then((data) => {
      adventuresArray = [];
      adventuresArray = shuffle(data.data);
      var cardsDeck = document.querySelectorAll(".bottom-content-container");
      for (let i = 0; i < cardsDeck.length; i++) {
        cardsDeck[i].remove();
      }
      createInitialDeck(adventuresArray);
      finishLoading();
    });
  });
}); //End Async Function for getting cards

/**************Functions*****************/
function changeActive(currentActive) {
  var liLinks = document.querySelectorAll(".Categories");
  for (let i = 0; i < liLinks.length; i++) {
    liLinks[i].classList.remove("active");
  }

  currentActive.classList.add("active");
}
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

async function getAdventures(address) {
  const api = "/api/v1/" + address;
  const adventuresResponse = await fetch(api);
  const adventuresdata = adventuresResponse.json();
  return adventuresdata;
}

async function getSearch(searchQuery, location = "") {
  const api = `/api/v1/adventures/search?search=${searchQuery}&location=${location}`;
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

function createRedoCard(adventuresArray, currentIndex) {
  cardContainer.insertAdjacentHTML(
    "beforeEnd",
    `
  <div class ="bottom-content-container slideUpAnim"  id="card${currentIndex}">
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

function showFeedMessage(feedBackContainer) {
  feedBackContainer.classList.add("fadeIn");
  setTimeout(function () {
    feedBackContainer.classList.remove("fadeIn");
  }, 750);
}
