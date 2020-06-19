//*FUNCTION TO CHECK ELEMENT EDIT PROPERTY
export function doubleClick(x,y,element) {
  if(element.type == 'Image') if((x > (element.x1.dx+15)) && (x < (element.x2.dx-15)) && (y > (element.y1.dy+15)) && (y < (element.y2.dy-15))) element.edit = !element.edit;
  if(element.type == 'Text') if((x > (element.x1.dx+5)) && (x < (element.x2.dx-5)) && (y > (element.y1.dy+5)) && (y < (element.y2.dy-5))) element.edit = !element.edit;
  return;
}

//TODO ONLY WORKS FOR THE LAST ELEMENT OF THE LIST, NEED TO CORRECT IT.
//*DETERMINING THE CURSOR
export function mouseIcon(x, y, element) {
  if(element.type !=='Template') {
    let icon = 'conetext-menu';
  if(element.edit){  
    if((y > (element.y1.dy-10)) && (y < (element.y1.dy+10)))  icon = 'row-resize';
    if((y > (element.y2.dy-10)) && (y < (element.y2.dy+10)))  icon = 'row-resize';
    if((x > (element.x1.dx-10)) && (x < (element.x1.dx+10)))  icon = 'col-resize';
    if((x > (element.x2.dx-10)) && (x < (element.x2.dx+10)))  icon = 'col-resize';
    
    if((x > (element.x1.dx-10)) && (x < (element.x1.dx+10)) && (y > (element.y2.dy-10)) && (y < (element.y2.dy+10)))  icon = 'ne-resize';
    if((x > (element.x1.dx-10)) && (x < (element.x1.dx+10)) && (y > (element.y1.dy-10)) && (y < (element.y1.dy+10)))  icon = 'se-resize';
    if((x > (element.x2.dx-10)) && (x < (element.x2.dx+10)) && (y > (element.y1.dy-10)) && (y < (element.y1.dy+10)))  icon = 'ne-resize';
    if((x > (element.x2.dx-10)) && (x < (element.x2.dx+10)) && (y > (element.y2.dy-10)) && (y < (element.y2.dy+10)))  icon = 'se-resize';
    
    if((x > (element.x1.dx+15)) && (x < (element.x2.dx-15)) && (y > (element.y1.dy+15)) && (y < (element.y2.dy-15))) icon = 'move';
    if((x < (element.x1.dx- 5)) || (x > (element.x2.dx+ 5)) || (y < (element.y1.dy- 5)) || (y > (element.y2.dy+ 5))) icon = 'context-menu';
  }
  else  icon = 'context-menu';
  return icon;
  } 
  return 'context-menu';
}

//*STOPS EDITING WHEN MOUSE IS RELEASED
export function mouseup(element) {
  if(element.type !=='Template') element.x1.toggle = element.x2.toggle = element.y1.toggle = element.y2.toggle = element.inside = false;
}

//*STARTS EDITING WEHEN MOUSE IT PRESSED
export function mousedown(x, y, element) {
  if(element.type !=='Template') {
    if((y > (element.y1.dy-10)) && (y < (element.y1.dy+10)))  element.y1.toggle = true;
  if((y > (element.y2.dy-10)) && (y < (element.y2.dy+10)))  element.y2.toggle = true;
  if((x > (element.x1.dx-10)) && (x < (element.x1.dx+10)))  element.x1.toggle = true;
  if((x > (element.x2.dx-10)) && (x < (element.x2.dx+10)))  element.x2.toggle = true;
  if((x > (element.x1.dx+15)) && (x < (element.x2.dx-15)) &&  (y > (element.y1.dy+15)) && (y < (element.y2.dy-15))) element.inside = true; element.insidex = x; element.insidey= y;
  }return;
}

//*MOVING THE ELEMENT WHILE EDITING
export function mousemove(x, y, element) {
  if(element.type !== 'Template') {
    if(element.edit)  {  
    if(element.x1.toggle) element.x1.dx = x;
    if(element.x2.toggle) element.x2.dx = x;
    if(element.y1.toggle) element.y1.dy = y;
    if(element.y2.toggle) element.y2.dy = y;
    if(element.inside){
      element.x1.dx+=(x - element.insidex);
      element.x2.dx+=(x - element.insidex);
      element.y1.dy+=(y - element.insidey);
      element.y2.dy+=(y - element.insidey);
      element.insidex = x; element.insidey= y;
    }
  } }return;
}

//* CREATES A MY ELEMENT
export function createMenu(element) {
  console.log(element);
  let menu = document.querySelector('.vertical-menu');
  let item = document.createElement('a');
  let node = document.createTextNode(element.type + ' ' + element.id);
  item.appendChild(node);
  menu.appendChild(item);
}
  
//* DELETES THE ELEMENT WHEN WE DOUBLE CLICK ON IT
export function deleteMenu(elements) {
  const nodes = document.querySelectorAll(".vertical-menu > *");
  nodes.forEach(node => {
    node.addEventListener('dblclick', () =>{
      let type = node.innerHTML;
      let id = Number(type[type.length - 1]);
      type = type.slice(0, type.indexOf(' '));
      elements.forEach(element => {
        console.log("delete");
        if(element.type == type && element.id == id) {
          let index = null;
          for(let i = 0; i < elements.length; i++) {
            if(JSON.stringify(elements[i]) == JSON.stringify(element))  index = i;
          }
          console.log(index);
          elements.splice(index, 1);
          node.remove();
        }
    });
  });
  });
}


//* ENABLING EDIT WHEN CLICKED ON MY ELEMENT
export function myElements(element) {
  const nodes = document.querySelectorAll(".vertical-menu > *");
  nodes.forEach(node =>{
    node.addEventListener('click', () => {
      let type = node.innerHTML;
      let id = Number(type[type.length - 1]);
      type = type.slice(0, type.indexOf(' '));
      console.log(type + ' ' + id);
      if(element.type != 'Template' && element.type == type && element.id == id) element.edit = !element.edit;
    });
  });
}

//* CREATE AN OBJECT WHICH WILL SENT AS BODY
export function invitePost(forms, elements) {
  let obj = {};
  obj.title = forms.elements[0].value;
  obj.description = forms.elements[1].value;
  obj.time = new Date(forms.elements[2].value);
  obj.food = Number(forms.elements[3].value);
  obj.duration = Number(forms.elements[4].value);
  obj.deadline = Number(forms.elements[5].value);
  obj.people = Number(forms.elements[6].value);
  obj.private = {};
  if(!forms.elements[7].checked) obj.private.private = false;
  else {
    obj.private.private = true;
    obj.private.year = Number(forms.elements[8].value);
    obj.private.dept = forms.elements[9].value;
  }
  obj.elements = elements;
  return obj;
}