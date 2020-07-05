function newContent(num) {
  const name = ['Template', 'Text', 'Image'];
  if(document.querySelector('.tabcontent h3').innerHTML === name[num]) {   
    if(document.querySelector('.tabcontent').style.display  == 'block') { //we need to hide the table
      document.querySelector('.tabcontent').style.display  = 'none';
      document.querySelector('.tabcontent h3').innerHTML = '';
      let elements = document.querySelectorAll('.tabcontent > *');
      elements.forEach(element => {
        element.style.display  = 'none';
      });
    }
    else {
      document.querySelector('.tabcontent').style.visibility  = "block";
      let elements = document.querySelectorAll('.tabcontent > *');
      elements.forEach(element => {
        element.style.visibility  = 'block';
      });
    }
  }
  else {
    document.querySelectorAll('.tabcontent > *').forEach(element => {
        element.style.display  = 'block';
    });
    document.querySelector('.tabcontent').style.display  = "block";
    document.querySelector('.tabcontent h3').innerHTML = name[num];
    if(num === 0)
      document.querySelector('div#save').style.display = 'none';
    else if(num == 2)  {
    document.querySelector('.template').style.display  = "none"; 
    document.querySelector('div#save').style.display = 'block'; 
    let elements = document.querySelectorAll('.word');
    elements.forEach(element => {
      element.style.display  = "none";
    });
    document.querySelector('.image').style.display  = "block";
  }
    else if(num == 1) { 
    document.querySelector('.image').style.display  = "none";  
    document.querySelector('div#save').style.display = 'block';
    document.querySelector('.template').style.display  = "none";  
    let elements = document.querySelectorAll('.word');
    elements.forEach(element => {
      element.style.display  = "block";
    });
  }
  if(num == 0)  {
    console.log("template");
    document.querySelector('.image').style.display  = "none";  
    let elements = document.querySelectorAll('.word');
    elements.forEach(element => {
      element.style.display  = "none";
    });
    document.querySelector('.template').style.display  = "block";
  }
}
}


function updated(type, num, x) {
  num--;
  x--;
  var elements = document.querySelectorAll(`#${type} p`);
  elements.forEach(element => {
    element.classList.remove("active");
  });
  elements[num].classList.add('active');
  parent = document.querySelectorAll(".optionbtn");
  console.log(parent);
  parent[x].innerHTML = elements[num].innerHTML;
}

