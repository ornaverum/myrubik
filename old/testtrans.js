const cubeSec= document.querySelector('#cube');
const colorArray = ["white", "green", "red", "blue", "orange", "yellow", "pink", "black", "magenta" ];

const ssArray = ['', 'rotateX(90deg)', 'rotateX(-90deg)', 'rotateY(90deg)', 'rotateY(-90deg)', 'rotateY(180deg)'];
const faceArray = ['Up', 'West', 'South', 'East', 'North', 'Down']
const faceOpposites = {Up: 'Down', Down: 'Up', West: 'East', East: 'Westt', South: 'North', North: 'South'};

const sides = ["Up", "Down", "South", "North", "East", "West"];
const colors = ["white", "yellow", "blue", "green", "red", "orange"];
// let rot = ["", "rotateY(180deg)", "rotateX(90deg) rotateY(90deg)", 
//            "rotateX(90deg) rotateY(-90deg)", "rotateX(90deg) rotateY(180deg)", "rotateX(90deg) rotateZ(270deg)"];
const rot = ["translateZ(26px)", "rotate3d(0,1,0,180deg) translateZ(26px)", "rotateX(90deg) translate3d(0px, 0px, 27px)", 
           "rotateX(90deg) rotateY(180deg) translate3d(0px, 0px, 27px)", "rotateX(90deg) rotateY(90deg) translate3d(0px, 0px, 27px)", "rotateX(90deg) rotateY(-90deg) translate3d(0px, 0px, 27px)"];

var slider = document.getElementById("myRange");
var output = document.getElementById("output");
output.innerText = slider.value; // Display the default slider value

let sideProps = Object.assign({}, ...sides.map((x, i)=>(
{[x]:{'Name': x, 'Color':colors[i], 'rotation':rot[i]}}
)));

buildFace = (side, clr) => {
  let face = document.createElement('span');
  face.classList.add('face');
  // face.style.transformOrigin = transOrgFace;
  if (clr)
    face.style.background = clr;
    else
    face.style.background = sideProps[side]['Color'];
  face.style.transform = sideProps[side]['rotation'];
  return face;
};

buildCubie = (clr)=>{
  let cub = document.createElement('div');
  cub.classList.add('cubie');
  sides.forEach((side)=>{
    cub.appendChild(buildFace(side, clr));
  });
  cub.style.transformOrigin = '27px 27px 0px';
  cub.style.transform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
  return cub;
}

{
  let cub = buildCubie('black');
  // cub.style.transform = matrix3d()
  cubeSec.appendChild(cub);
}

{
  let cub = buildCubie('red');
  // cub.style.transform = matrix3d()
  cub.style.transform += `translateX(100px) ` ;
  cubeSec.appendChild(cub);

  cub = buildCubie('green');
  cub.style.transform = `translateY(100px)`;
  cubeSec.appendChild(cub);

  cub = buildCubie('blue');
  cub.style.transform = `translateZ(100px)`;
  cubeSec.appendChild(cub);
}

{
cub = buildCubie('');
cub.style.transform = `translateX(-100px)`;
cubeSec.appendChild(cub);
}
