let notifButton = document.getElementById('notifButton');
let notificationPanel = document.getElementById('notifs');
let notifications = {};
const location1 = window.location.href.slice(0, 51);

//Toggling Notification Button on click
notifButton.addEventListener('click', ()=> {
  if(notificationPanel.style.height == '0px') notificationPanel.style.height ='fit-content';
  else notificationPanel.style.height ='0px';
});

//Get the data with fetch
const fetchData = async () => {
  let res = await fetch(`${location1}/notifications`);
  if(res.ok) { //200 RESPONSE
    notifications = (await res.json()).notifications;
    document.querySelector('.topnav > a#notif-icon span#red-info').style.display = 'inline';
    document.querySelector('.topnav > a#notif-icon span#red-info').innerHTML = `${notifications.length}`;
    let str = '';
    notifications.forEach( notification => {
      str += `<div class="notifications"><span>${notification}</span> <i class="fas fa-times closeNotifs"></i></div>`;
    });
    document.querySelector('.topnav a#notif-icon span#notifs').innerHTML = str;
  }
  else {
    document.querySelector('.topnav > a#notif-icon span#red-info').style.display = 'none';
    document.querySelector('.topnav a#notif-icon span#notifs').innerHTML =  `<div class="notifications"><span>No New Notification</span></div>`;
  }
  return;
};

//Deleting it when you click close button
const closeButtonListener = async () => {
  document.querySelectorAll('.topnav a#notif-icon span#notifs div.notifications > i.closeNotifs').forEach(closebtn => {
    closebtn.addEventListener('click', async () => {
      const notifMsg = (closebtn.parentNode).childNodes[0].textContent;
      let res = await fetch(`${location1}/notifications`, 
      {
        method : 'DELETE',
        headers : {
          'Content-type' : 'application/json'
        },
        body : JSON.stringify({msg : notifMsg}),
      });
      await res.text();
      notif();
    });
  });
  return;
};

const notif = async () => {
  if((window.location.href).length > 50) {
    //Fetch the data
    let res = await fetchData();
    res = await closeButtonListener();
  }
};

notif();

//Add the data to list





