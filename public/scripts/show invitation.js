let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');                  
let context = canvas.getContext('2d');
let elements = [];
const deadline = new Date(document.getElementById('countdown').dataset.time);

function goBack() {
  window.history.back();
}

function copyurlClick() {
  console.log('you clicked a button');
  let copyText = document.getElementById("urlCopyLink");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  
  let tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied: " + copyText.value;
}

function clipboard() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}

//*CANVAS
function getElements() {
  elements = JSON.parse(document.getElementById('element').innerHTML);
  document.getElementById('element').remove();
  creation();
}

function creation() {
  elements.forEach(element => {
    if(element.type == 'Image' || element.type == 'Template') {
      element.img = new Image();
      element.img.src = element.src;
    }else if( element.type === 'Text') {
      element.size = (element.y2.dy - element.y1.dy) *1.43*canvas.getBoundingClientRect().height;
    }
  });
  drawElements();
}

function drawElements() {
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
  const w = canvas.width;
  const h = canvas.height;
  elements.forEach(element => {
    switch (element.type) {
      case 'Text' :
        element.size = (element.y2.dy - element.y1.dy) *1.43*h;
        context.font = `${element.size}px ${element.font}`;
        context.fillStyle= element.color;
        context.fillText(element.text, (element.x1.dx*w), (element.y2.dy*h), ((element.x2.dx-element.x1.dx)*w));
        break;
      default :
        context.drawImage(element.img, (element.x1.dx*w), (element.y1.dy*h), ((element.x2.dx-element.x1.dx)*w), ((element.y2.dy-element.y1.dy)*h));
        break;
    }
  });
  window.requestAnimationFrame(drawElements);
}

getElements();

//*CLOCK
setInterval(() => {
  const now = new Date().getTime();
  const differnce =deadline.getTime() - now;
  const days = Math.floor(differnce / (1000 * 60 * 60 * 24));
  const hours = Math.floor((differnce % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((differnce % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((differnce % (1000 * 60)) / 1000);
  document.querySelector('#countdown > #days > span').innerHTML = days.toString();
  document.querySelector('#countdown > #hours > span').innerHTML = hours.toString();
  document.querySelector('#countdown > #min > span').innerHTML = minutes.toString();
  document.querySelector('#countdown > #sec > span').innerHTML = seconds.toString();
}, 1000);



async function putResponse(res) {
  try {
    const putStatment =await fetch(`${location.href}`,
      {
        method : 'PUT',
        headers : {
          'Accept' : 'application/json' ,   // Tells the type of content the client can understand
          'Content-type' : 'application/json'  // What kind of data we are sending through the body
        },
        body : JSON.stringify({response : res})
      });
    putStatement = await putStatment.text();
    if(res === 'accept')
      location.reload();
    else {
      document.querySelector('div.response').innerHTML = '<h3>Thank You for your response. If you change your mind. Visit the invite again.</h3>';
    }
    } catch (err) {
    console.log(err);   
  }
}

document.querySelector('.response > #accept').addEventListener("click", () => putResponse('accept'));
document.querySelector('.response > #decline').addEventListener("click", () => putResponse('decline'));
