let elementsData = document.querySelectorAll('#container > p.elements');
let allCanvas = document.querySelectorAll('#container > .invite > .canvas');

let allElements = [];
let context = [];


elementsData.forEach(elementData => {
  allElements.push(JSON.parse(elementData.innerHTML));
  elementData.remove();
});

allCanvas.forEach(canvas => {
  context.push(canvas.getContext('2d'));
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
});

//Initialize the elemeents
allElements.forEach(elements => {
  elements.forEach(element => {
    if(element.type === 'Image' || element.type === 'Template') {
      element.img = new Image();
      element.img.src = element.src;
    }else if( element.type === 'Text') {
      element.size = (element.y2.dy - element.y1.dy) *1.43*allCanvas[0].height;
    }
  });
});

//Drawing the elements
let draw = () =>  {
  allElements.forEach((elements, index)=>{
  const w = allCanvas[index].width;
  const h = allCanvas[index].height;
  elements.forEach(element => {
    switch (element.type) {
      case 'Text' :
        context[index].font = `${element.size}px ${element.font}`;
        context[index].fillStyle= element.color;
        context[index].fillText(element.text, (element.x1.dx*w), (element.y2.dy*h), ((element.x2.dx-element.x1.dx)*w));
        break;
      default :
        context[index].drawImage(element.img, (element.x1.dx*w), (element.y1.dy*h), ((element.x2.dx-element.x1.dx)*w), ((element.y2.dy-element.y1.dy)*h));
        break;
      }
    });
  });
  window.requestAnimationFrame(draw);
  };

if(document.querySelector('#searchInvite  #inviteId'))  {
  document.querySelector('#searchInvite  #inviteId').addEventListener('input', () => {
  let input = document.querySelector('#searchInvite #inviteId').value;
  input = `invitation/${input}`;
  document.querySelector('#searchInvite > #submitSearch').href = input;
  });
}

window.setTimeout(() => {
  draw();
}, 1000);