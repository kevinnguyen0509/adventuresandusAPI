const loadingImage = document.getElementById("loadingScreen");
const bottomContent = document.getElementById("bottom-content");
let adventuresArray = [];

startLoading();
getAdventures().then((data) => {
  finishLoading();

  adventuresArray = shuffle(data.adventures);
  console.log(data.adventures[0]);
});

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
  bottomContent.style.display = "inline-flex";
}

function startLoading() {
  loadingImage.style.display = "inline-flex";
  bottomContent.style.display = "none";
}
