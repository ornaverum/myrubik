const txt = document.querySelector('#testingblock');

var tststr = txt.textContent;
console.log(tststr);

const IM = [
  [1,0,0,0],
  [0,1,0,0],
  [0,0,1,0],
  [0,0,0,1]];

const tstMat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
const dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);

// an = length of column 
const transpose = (a, an) => {
  let c = Array(a.length).fill(0);
  for (let i = 0; i < a.length; i++){
    let row = Math.floor(i/an);
    let col = i%an;
    c[col*an+row] = a[i];
  }
  return c;
}


const getSection = (arr, sy, ey, sx, ex, len) => {
  let section = [];
  for (let i = sy; i < ey+1; i++){
    for (let j = sx; j < ex+1; j++){
      section.push(arr[i*len + j]);
    }
  }
  return section;
}


// For matrix Nmax X Mmax times Mmax X Lmax

// function flatMMult(a, b, len){
//   let c = Array(len*len).fill(0);
//   let [n, m] = [0,0];
//   for (let i = 0; i < len*len; i ++){
//     let row = Math.floor(i/len);
//     let col = i%len;
//     for (let k = 0; k < len; k ++){
//       // console.log(i, row, col, k, row + k, col+len*k);
//       c[i] += a[row*len + k]*b[col+len*k];
//     }
//   }
//   return c;
// }


/*
v = [1, 0, 1]
A = [2, 1, 4, 5, 7, 5, 5, 2, 1]
  = [[2,1 ,4],
    [5, 7, 5], 
    [5, 2, 1]]

v = 1x3
A = 3x3
output 1x3
   need transpose of A, though.
   A*vT
3x3 * 3x1 = 3x1




A has dim am x an
B has dim bm x bn
AB has dim am x bn

A = [2, 1, 5, 7, 5, 2]
  = [[2,1],
    [5, 7], 
    [5, 2]]

3x2
B : 2x4
B = [[6, 5, 4, 2],
    [1, 2, 1, 5]]
B = [6,5,4,2,1,2,1,5]


Result: 3x4
i enumerates A
i = 0, 1, 2, 3, 4, 5
row: i = 0, 1, 2
        3, 4, 5
row = i//am
k runs 0..an
row*

*/




function flatMMult(a, b, am, an, bn){
  let bm = an;
  // console.log(a, b, am, an, bn);
  let c = Array(am*bn).fill(0);

  let [n, m] = [0,0];
  if (bn == 1){
    for (let row = 0; row < am; row++ ){
      for (let col = 0; col < an; col++){
        // console.log(row, col, row*an+col, a[row*am+col], b[row])
        c[row]+=a[row*an+col]*b[row];
      }
    }
    return c;
  }

  for (let row = 0; row < am; row++){
    for (let col = 0; col < bn; col++){
      for (let k = 0; k < an; k++){
        c[row*am+col]+=a[row*am+k]*b[col+bn*k];
      }
    }
  }
  return c;
}


const matDict = {
  I: [1,0,0, 0,1,0,0,0,1],
  Rz: [0,1,0,-1,0,0,0,0,1],
  Rzp:[0,-1,0,1,0,0,0,0,1],
  Rx: [1, 0, 0, 0,0,1 ,0,-1,0],
  Rxp: [1,0,0,0,0,-1,0,1,0],
  Ry: [0,0,-1,0,1,0,1,0,0],
  Ryp: [0,0,1,0,1,0,-1,0,0]
};

function getMatrixFromString (M){
  if (!M) return IM;
  console.log('get str')
  return M.split(/[\s,()]+/).slice(1,-1).map(i=> parseInt(i));
}

function getStringFromMatrix(s){
  // let a = 
  return `matrix3d(${s.flat()})`;
}


let v = [1, 2, 3];
console.log(flatMMult(matDict['Ry'], v, 3, 3, 1));


let m = getMatrixFromString(tststr);
console.log(m)

let R = getSection(m, 0, 2, 0, 2, 3);
let T = getSection(m, 3, 3, 0, 2, 3);
console.log(R);
console.log(T);

let Rt = flatMMult(matDict['Rx'], R, 3, 3, 3);
let Tt = flatMMult(matDict['Rx'], T, 3, 3, 1);

console.log(R.slice(0,3));
m.splice(0, 3, ...Rt.slice(0, 3))
m.splice(4, 7, ...Rt.slice(3, 6))
m.splice(8, 11, ...Rt.slice(7, 9))
m.splice(13, 16, ...Tt);

console.log(m)