const sheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSReVoqrMCiqXPPKhbLQYqqZWfTs7NJBXAxph9Ci4Og6NBcXRz3gRuTMmtLZ8U5YERz3bevBObkqJMe/pub?output=csv";
const response = await fetch(sheets);
const csvText = await response.text();

const sanitizeName = (name) => {
  const accentsMap = new Map([ ['á', 'a'], ['à', 'a'], ['â', 'a'], ['ä', 'a'], ['ã', 'a'], ['å', 'a'], ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'], ['í', 'i'], ['ì', 'i'], ['î', 'i'], ['ï', 'i'], ['ó', 'o'], ['ò', 'o'], ['ô', 'o'], ['ö', 'o'], ['õ', 'o'], ['ø', 'o'], ['ú', 'u'], ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ý', 'y'], ['ÿ', 'y'], ['ñ', 'n'], ['ç', 'c'] ]);
  let sanitized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  sanitized = Array.from(sanitized).map(char => accentsMap.get(char) || char).join('');
  return sanitized.replace(/[^A-Za-z0-9_\-]/g, '_');
};


/**
 * Convertit une chaîne CSV en objet JSON en utilisant ES6
 * @param {string} csvString - La chaîne CSV à convertir
 * @returns {Array} - Tableau d'objets représentant les données CSV
 */
const csvToJson = (csvString) => {
  try {
    const lines = [];
    let currentLine = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
        currentLine += char;
      } else if (char === '\n' && !insideQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue);
      
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        value = value.replace(/\r/g, '');

        if (value.includes('\n')) {
          value = value.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion CSV en JSON:", error);
    return [];
  }
};




// const bgColors = ["red", "blue","gray","green","yellow","purple","orange","pink","brown","black","white"];

const _json = csvToJson(csvText);

// ajoute 6 fois _json dans const json
const json = [..._json,..._json, ..._json, ..._json, ..._json];


const $projets = document.querySelector(".projets");

// parcourir le json et créer les éléments
json.forEach((item) => {
  const div = document.createElement("div");
  div.classList.add("projet");
  $projets.appendChild(div);
  // gsap.set(div,{backgroundColor: e => gsap.utils.random(bgColors)});
  // gsap.from(div, {
  //   x: e=> gsap.utils.random(-1000,1000),
  //   y : e  => gsap.utils.random(-1000,-20),
  //   opacity:0, duration: 0.5 });

  const img = document.createElement("img");
  img.src = `img/${sanitizeName(item.titre)}.jpg`;
  div.appendChild(img);


  const titre = document.createElement("h3");
  titre.textContent = item.titre;
  // div.appendChild(titre);

  const categories = document.createElement("div");
  categories.textContent = item.catégories;
  // div.appendChild(categories);

  const description = document.createElement("p");
  description.textContent = item.description;
  div.appendChild(description);

  div.addEventListener("click", () => {
    const header = document.querySelector("header");
    header.classList.add("fixed");

    const projets = document.querySelector(".projets");
    projets.classList.add("fixed");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    const wrap = document.createElement("div");
    wrap.classList.add("wrap");
    overlay.appendChild(wrap);

    const fiche = document.createElement("div");
    fiche.classList.add("fiche");
    wrap.appendChild(fiche);

    const close = document.createElement("div");
    close.textContent = "×";
    close.classList.add("close");
    overlay.appendChild(close);

    // amélioration de la fermeture de la fiche
    overlay.addEventListener("click", (e) => {
      if (e.target === fiche || fiche.contains(e.target)) return;
      gsap.to(overlay, {opacity: 0, duration: 0.2, onComplete: () => overlay.remove()});
      header.classList.remove("fixed");
      projets.classList.remove("fixed");
    });

    const img = document.createElement("img");
    img.src = `img/${sanitizeName(item.titre)}.jpg`;
    fiche.appendChild(img);

    const titre = document.createElement("h3");
    titre.textContent = item.titre;
    fiche.appendChild(titre);

    const desc = document.createElement("div");
    desc.innerHTML = item.modale;
    fiche.appendChild(desc);

    if(item.images !== "") {
      const images = item.images.split(",");
      const gallery = document.createElement("div");
      gallery.classList.add("gallery");
      images.forEach((image) => {
        const img = document.createElement("img");
        const name = sanitizeName(item.titre);
        img.src = `img/${name}/${image}`;
        gallery.appendChild(img);
      });
      fiche.appendChild(gallery);
    }
  

    // gsap.from(fiche, {opacity: 0, duration: 0.4});
    // gsap.from(overlay, {opacity: 0, duration: 0.4});
  });


});

// base pour le plugin motionPath
gsap.registerPlugin(MotionPathPlugin);
// base pour la position selon le viewport
const w = window.innerWidth;
const h = window.innerHeight;

// question ia :
// je veux le chemin d d'un path en forme d'ellipse avec un rayon de (h-100)/2 et (w-100)/2 (avec quelques modifications)

// const d = "M0.5,550.09V0.8c0,0,88.95-0.67,89.23,0s245.39,229.33,245.39,229.33L580.51,0.8h89.23v549.29l-89.23,0.04V107.46L379.74,301.92v248.21h-89.23V301.92L89.73,107.46v442.67L0.5,550.09z";

const d="M1.7,1.7v637.8h172.9c0,26.3-6.1-471.2,0-464.9c2.1,2.2,223.3,141.4,223.3,141.4l0,323.5H568V316l225.6-141.4v464.9h171.3V1.7H793.5L482.9,190.2L171.9,1.7H1.7z";




// pour la demo
// ajoute le path dans un svg
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    document.body.appendChild(svg);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    // path.setAttribute("stroke", "red");
    path.setAttribute("fill", "none");
    svg.appendChild(path);

    // SVG sur z-index -1
    svg.style.position = "absolute";
    svg.style.top = 10;
    svg.style.left = 10;
    svg.style.zIndex = -1;


    gsap.set(".projet", {
      xPercent: -50, 
      yPercent: -50, 
      transformOrigin: "50% 50%"
     });


let anim = gsap.to('.projet', {
  motionPath: {
    path: d,
    // autoRotate: true,
    // aligne sur le centre, un peu merdique
    // alignOrigin: [0.5, 0.5],
    // align:path,
  },
  duration: 30,
  stagger: {
    each:0.5,
    repeat:-1,
  },
  ease: "none"
});
anim.pause();
anim.play(9*9);


const colorList = [
  'rgb(170, 223, 215)', // Couleur 1
  'rgb(255, 173, 195)',  // Couleur 2
  'rgb(207, 235, 124)', // Couleur 3
  'rgb(251, 249, 152)', // Couleur 4
  'rgb(183, 147, 255)'
];
// Stocker la dernière couleur utilisée
let lastColorIndex = -1;

// Appliquer une couleur aléatoire en arrière-plan de la page sans répétition
let newColorIndex;
do {
  newColorIndex = Math.floor(Math.random() * colorList.length);
} while (newColorIndex === lastColorIndex);

lastColorIndex = newColorIndex;
document.body.style.backgroundColor = colorList[newColorIndex];

// Changer la couleur de fond lorsque la fiche est fermée
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("overlay")) {
    let newColorIndex;
    do {
      newColorIndex = Math.floor(Math.random() * colorList.length);
    } while (newColorIndex === lastColorIndex);

    lastColorIndex = newColorIndex;
    document.body.style.backgroundColor = colorList[newColorIndex];
  }
});