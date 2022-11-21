
const selectFace = document.querySelector('#facechoice');
const selectMove = document.querySelector('#movechoice');
// const selectOpElem = document.querySelector('selectOp');


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

const IM = [
  [1,0,0,0],
  [0,1,0,0],
  [0,0,1,0],
  [0,0,0,1]];


const mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
const transpose = a => a[0].map((x, i) => a.map(y => y[i]));
const reshape = (arr, len) => {
  if (len === 1) return [].concat(...arr);
  const newArr = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  return newArr;
};
const matSection = (arr, sx, ex, sy, ey) => arr.slice(sy, ey).map(i => i.slice(sx, ex))


// R is a value indicating axis rotations, in CSS coords. +/- determines direction
// +/- 1, x axis, +/- 2, y axis, +/- 3, z axis.
// T is a vector, [x, y, z] for translations.
// A is incoming transform matrix, matrix3d, in row format
function rotateCubie(A, R){
  let C = [...A];
  let rowA = 0;
  let rowC = 0;
  let sgn = 0;

  if (R===1){  // Rx
    rowA = 2;
    rowC = 1;
    sgn = 1;
  } else if (R===-1){
    rowA = 2;
    rowC = 1;
    sgn = -1;
  } else if (R===2){
    rowA = 0;
    rowC = 2;
    sgn = 1;
  } else if (R===-2){
    rowA = 0;
    rowC = 2;
    sgn = -1;
  } else if (R===3){
    rowA = 0;
    rowC = 1;
    sgn = 1;
  } else if (R===-3){
    rowA = 0;
    rowC = 1;
    sgn = -1;
  } else {}
  console.log(rowA, rowC, sgn);
  for (let col =0; col < 3; col ++){
    C[rowC*4 + col] = -sgn*A[rowA*4 + col];
    C[rowA*4 + col] = sgn*A[rowC*4 + col];
  }
  // console.log(C[3], A[3]);
  C[3*4 + rowC] = sgn*A[3*4+rowA];
  C[3*4+rowA] = -sgn*A[3*4+rowC]; 
  return C;
}

// T is a vector, [x, y, z] for translations.
// A is incoming transform matrix, matrix3d, in row format
function translateCubie(A, T){
    A[12] = T[0];
    A[13] = T[1];
    A[14] = T[2];
    return A;
}

// function matMult3x3 (a, b){
//   let M = [0,0,0,0,0,0,0,0,0];
//   for (int i = 0; i < 3; i++){
//     for (int j = 0; j < 3; j++){
//       M[i*3+j] += 
//     }
//   }
// }

const matDict = {
  I: [[1,0,0],[0,1,0],[0,0,1]],
  Rz: [[0,1,0],[-1,0,0],[0,0,1]],
  Rzp:[[0,-1,0],[1,0,0],[0,0,1]],
  Rx: [[1, 0, 0], [0,0,1], [0,-1,0]],
  Rxp: [[1,0,0],[0,0,-1],[0,1,0]],
  Ry: [[0,0,-1],[0,1,0],[1,0,0]],
  Ryp: [[0,0,1],[0,1,0],[-1,0,0]]
};


function getMatrixFromString (M){
  if (!M) return IM;
  return (M.split(/[\s,()]+/).slice(1,-1)).map(i=>parseInt(i));
}

function getStringFromMatrix(s){
  // let a = 
  return `matrix3d(${s.flat()})`;
}


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
  cub.style.transform = getStringFromMatrix(IM);
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
  cub.style.transform = `translateX(100px)`;
  cubeSec.appendChild(cub);

  cub = buildCubie('green');
  cub.style.transform = `translateY(100px)`;
  cubeSec.appendChild(cub);

  cub = buildCubie('blue');
  cub.style.transform = `translateZ(100px)`;
  cubeSec.appendChild(cub);
}

{
  let cub = buildCubie('');
  let R = getMatrixFromString(cub.style.transform);
  console.log('R = ', R);
  let C = translateCubie(R, [-100, 100, 0]);
  console.log('C after trans= ', C);

  // cub.style.transform = getStringFromMatrix(C);
  // C = rotateCubie(C, 3);
  // console.log('C after rot = ', C);

  let str = getStringFromMatrix(C);
  console.log(str);
  cub.style.transform = str;
  cub.id = 'focusCubie';
  cubeSec.appendChild(cub);
}

function rotateFocus (rot){
    let cub = document.querySelector('#focusCubie');
    let A = getMatrixFromString(cub.style.transform);
    let R = rotateCubie(A, rot);
    cub.style.transform = getStringFromMatrix(R);

}

slider.oninput = function() {
  output.innerHTML = this.value;
  if (selectFace.value === 'Choose a rotation') {
    return;
  } else {
    let n = document.querySelectorAll(`.${selectFace.value}`);
    n.forEach((i)=>{
      let A = getMatrixFromString(i.style.transform);
      rotateCubie(A, 1);
      let s = getStringFromMatrix(A);
      i.style.transform = s;
    });
  }
}




// const matDict = {
//   I: [[1,0,0],[0,1,0],[0,0,1]],
//   Rz: [[0,1,0],[-1,0,0],[0,0,1]],
//   Rzp:[[0,-1,0],[1,0,0],[0,0,1]],
//   Rx: [[1, 0, 0], [0,0,1], [0,-1,0]],
//   Rxp: [[1,0,0],[0,0,-1],[0,1,0]],
//   Ry: [[0,0,-1],[0,1,0],[1,0,0]],
//   Ryp: [[0,0,1],[0,1,0],[-1,0,0]]
// };