 // Getion des couleurs aléatoires
 const colorList = [
  'rgb(170, 223, 215)', // Couleur 1
  'rgb(255, 173, 195)',  // Couleur 2
  'rgb(207, 235, 124)', // Couleur 3
  'rgb(251, 249, 152)', // Couleur 4
  'rgb(183, 147, 255)'
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
const leftColumn = document.querySelector('.sticky');
leftColumn.style.backgroundColor = randomColor;

// Appliquer la couleur transparente à un élément séparé, si nécessaire
const separateTransparentElement = document.querySelector('.header');
separateTransparentElement.style.backgroundColor = transparentColor;