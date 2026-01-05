 // Getion des couleurs aléatoires
 const colorList2 = [
  'rgb(170, 223, 215)', // Couleur 1
  'rgb(255, 173, 195)',  // Couleur 2
  'rgb(207, 235, 124)', // Couleur 3
  'rgb(251, 249, 152)', // Couleur 4
  'rgb(183, 147, 255)'
];

const colorList = [
  'rgb(210, 216, 204)', // Couleur 1
  'rgb(232, 223, 214)',  // Couleur 2
  'rgb(229, 221, 232)', // Couleur 3
  'rgb(239, 238, 221)', // Couleur 4
  'rgb(216, 227, 230)'
];

// Fonction pour choisir une couleur différente de la dernière utilisée
function getRandomColorWithoutLast() {
    let lastColor = localStorage.getItem('lastUsedColor');
    let filteredColors = colorList.filter(color => color !== lastColor);
    const randomIndex = Math.floor(Math.random() * filteredColors.length);
    const chosenColor = filteredColors[randomIndex];
    localStorage.setItem('lastUsedColor', chosenColor);
    return chosenColor;
}

// Sélection de la couleur aléatoire
const randomColor = getRandomColorWithoutLast();
const transparentColor = `rgba(${randomColor.slice(4, -1)}, 0.5)`; // Opacité 50%

// Appliquer la couleur à la colonne de gauche
const leftColumn = document.querySelector('.description');
leftColumn.style.backgroundColor = randomColor;

// test pour la largeur pour le footer
const mq = window.matchMedia('(min-width: 701px)');
const footer = document.querySelector('footer');

function updateFooterColor(e) {
  if (!footer) return;

  if (e.matches) {
    // écran > 700px
    footer.style.backgroundColor = randomColor;
  } else {
    // écran ≤ 700px
    footer.style.backgroundColor = '';
  }
}
// au chargement
updateFooterColor(mq);

// quand on resize
mq.addEventListener('change', updateFooterColor);

// const bas = document.querySelector('footer');
// bas.style.backgroundColor = randomColor;

// Appliquer la couleur transparente à un élément séparé, si nécessaire
const separateTransparentElement = document.querySelector('.header');
separateTransparentElement.style.backgroundColor = transparentColor;


//scroll

const header = document.querySelector('.header');
const basGrand = document.querySelector('.bas-grand');

let lastScroll = 0;
let headerOffset = 0;
let maxOffset = header.offsetHeight;

const mediaQuery = window.matchMedia('(max-width: 700px)');

function handleScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const delta = currentScroll - lastScroll;

  headerOffset += delta;

  if (headerOffset < 0) headerOffset = 0;
  if (headerOffset > maxOffset) headerOffset = maxOffset;

  header.style.transform = `translateY(-${headerOffset}px)`;
  basGrand.style.transform = `translateY(-${headerOffset}px)`;

  lastScroll = currentScroll;
}

function enableScrollEffect() {
  lastScroll = window.pageYOffset;
  window.addEventListener('scroll', handleScroll);
}

function disableScrollEffect() {
  window.removeEventListener('scroll', handleScroll);
  header.style.transform = 'translateY(0)';
  basGrand.style.transform = 'translateY(0)';
  headerOffset = 0;
}

// Activation initiale
if (mediaQuery.matches) enableScrollEffect();

// Écoute les changements de taille
mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    enableScrollEffect();
  } else {
    disableScrollEffect();
  }
});
