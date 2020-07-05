let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');                  
let context = canvas.getContext('2d');
import image  from "./element classes/img object.js";
import word from './element classes/text obj.js';
import template from "./element classes/template object.js";
import { doubleClick, mouseIcon, mouseup, mousedown, mousemove, createMenu, deleteMenu, myElements, invitePost} from "./edit methods.js";


/*
! PRIORITY 2 
TODO    > MAKE INTERCHANGING OF ELEMENTS POSSIBLE //? USE [arr[2], arr[1]] = [arr[1], arr[2]] 
TODO    > ADDING IMAGES TO DATABASE INSTEAD OF USING URLs

*/

//* ---------------------------------------------------PART 1-------------------------------------------------------------


let checkbox = document.querySelector('#private');
let privateEvent = document.querySelector('.privateClass');
checkbox.addEventListener('change', () => {
  if(checkbox.checked) privateEvent.style.display = 'block';
  else privateEvent.style.display = 'none';
});
let ippl = document.querySelector('#people');
let oppl = document.querySelector('#people_output');
oppl.innerHTML = ippl.value;
ippl.addEventListener('input', () => {
  oppl.innerHTML = ippl.value;
});


let form = document.getElementById('newInvite');
let pt1 = document.getElementById('invitept1');
let pt2 = document.getElementById('invitept2');
form.addEventListener('submit', () => { 
  pt1.style.display = 'none';
  pt2.style.display = 'block';
});


//* ---------------------------------------------------PART 2-------------------------------------------------------------

let elements = [];
let imgTag = 1;
let wordTag = 1;
const save = document.querySelector('#save');

const templateSource = [
  "/images/templates/Movie Night Invitation.jpg",
  "/images/templates/Party Invitation.jpg",
  "/images/templates/Funeral Thank You Card.jpg",
  "/images/templates/birthday.jpg"
];


let nodes = document.querySelectorAll('div.invite-template > div');  //! CREATES A NEW TEMPLATE ELEMENT

nodes.forEach((node, i) => {
  node.addEventListener('dblclick',() => {
    elements.push(new template(templateSource[i], canvas.width, canvas.height));
    createMenu(elements[elements.length - 1]);
    deleteMenu(elements);
    myElements(elements[elements.length - 1]);
    document.querySelector('.tabcontent').style.display  = 'none';
    document.querySelector('.tabcontent h3').innerHTML = '';
  });
});

const imageUrlVertifier = (src) => {
  let img = new Image();
  img.onload = () => {
    //Passing it to the create new element
    elements.push(new image(src, imgTag++));
    document.querySelector(`input.optionbtn`).value = '';
    createMenu(elements[elements.length - 1]);
    deleteMenu(elements);
    myElements(elements[elements.length - 1]);
  };
  img.onerror = () => {
    alert('Enter a valid Image Adress');
    document.querySelector(`input.optionbtn`).value = '';
  };
  img.src = src;
};

save.addEventListener('click', () => {
  if((document.querySelector(`.tabcontent h3`)).innerHTML == 'Image') {  //! FOR IMAGE ELEMENT
    let str = (document.querySelector(`#imagesrc`).value);
    console.log('hi');
    imageUrlVertifier(str);
  }
  if((document.querySelector(`.tabcontent h3`)).innerHTML == 'Text') {  //! FOR TEXT ELEMENT
    let text =  document.querySelector(`#word`).value || '❤❤❤';
    let color = document.querySelector(`#color`).value || 'black';
    let size = Number(document.querySelector(`#size`).value) || 30;
    if(size < 30) size = 30;
    let font = (document.querySelector(`#fontvalue`).innerHTML).split('\n')[0];
    console.log('||' + font + '||');
    if(font !== 'Font'){
      console.log('font is not Font');
      font = font[font.length -1];
      switch (font) {
        case '1':
          font = 'first';
          break;
        case '2':
          font = 'second';
          break;
        case '3':
          font = 'third';
          break;
        case '4':
          font = 'fourth';
          break;
        case '5':
          font = 'fifth';
          break;
        case '6':
          font = 'sixth';
          break;
      }
    }
    else font = 'serif';
    console.log(`${size} & ${font}`);
    elements.push(new word(text, size, color, font, wordTag++));
    document.querySelector(`#word`).value = '';
    document.querySelector(`#color`).value = '';
    document.querySelector(`#size`).value = 10;
    document.querySelector(`#word`).innerHtml = 'Font';
    createMenu(elements[elements.length - 1]);
    deleteMenu(elements);
    myElements(elements[elements.length - 1]);
  }
  document.querySelector('.tabcontent').style.display  = 'none';
  document.querySelector('.tabcontent h3').innerHTML = '';
});

//* -------------------------------------------------POST METHORD-----------------------------------------------------------

async function newInvitePost() {
  let form = document.getElementById('newInvite');
  let invite = invitePost(form, elements);
  try {
    const res = await fetch('../invitation', 
      {
        method : 'POST',
        headers : {
          'Accept' : 'application/json' ,   //* Tells the type of content the client can understand
          'Content-type' : 'application/json'  //* What kind of data we are sending through the body
        },
        body : JSON.stringify(invite),
      });
    let id = await res.text();
    id = id.slice(1, (id.length-1));
    console.log(id);
    window.location.replace(`./${id}`);
    
  } catch (error) {
    console.log(error);
  }
}

document.getElementById('createInvite').addEventListener('click', newInvitePost);

//* -----------------------------------------------CANVAS MANIPULATION-----------------------------------------------------------

march();

canvas.addEventListener('dblclick', e=>{

  elements.forEach(element => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    doubleClick(x, y, element, rect.width, rect.height);
  });
} );

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  elements.forEach(element => {
    element.sketch(context, canvas.width, canvas.height);
  });
  
}

function march() {
  if(canvas.getBoundingClientRect().width - canvas.width > 2) {
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
  }
  if(canvas.width > 500) {
    canvas.width = 500;
    canvas.height = 500;
  }
  canvas.addEventListener('mousemove', e =>{
  elements.forEach(element => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousemove(x, y, element, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    });
  });
  draw();
  window.requestAnimationFrame(march);
}

canvas.addEventListener('mousedown', e => {
  elements.forEach(element => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousedown(x, y, element, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
  });
});

canvas.addEventListener('mouseup', e => {
  elements.forEach(element => {
    mouseup(element);
  });
});

canvas.addEventListener('mousemove', e => {
  let icon = '',iconFinal = 'context-menu';
  elements.forEach(element => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    icon = mouseIcon(x, y, element, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    if(icon != 'context-menu') iconFinal = icon;
  });
  document.body.style.cursor = iconFinal;
});
