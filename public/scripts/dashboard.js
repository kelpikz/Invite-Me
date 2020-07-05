document.getElementById('newInvite').href = `${window.location.href.slice(0,51)}/invitation/new`;

let eventTimer = document.getElementById('myEventClock');
let attendingTimer = document.getElementById('myAttendingClock');
let deadlineEvent, deadlineAttending;
if(document.querySelector('div#event')){
  deadlineEvent = new Date(document.querySelector('div#event').dataset.time);
  document.querySelector('div.EventClock > div#myEventClock > a')
    .href = `${window.location.href.slice(0,51)}/invitation/${document.querySelector('div.EventClock > div#myEventClock > a').dataset.link}`;
}
if (document.querySelector('div#attending')){
  deadlineAttending = new Date(document.querySelector('div#attending').dataset.time);
  document.querySelector('div.EventClock > div#myAttendingClock > a')
  .href = `${window.location.href.slice(0,51)}/invitation/${document.querySelector('div.EventClock > div#myAttendingClock > a').dataset.link}`;
}

if(document.querySelector('div#event'))
  setInterval(() => {
    const now = new Date().getTime();
    const differnce =deadlineEvent.getTime() - now;
    const days = Math.floor(differnce / (1000 * 60 * 60 * 24));
    const hours = Math.floor((differnce % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((differnce % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differnce % (1000 * 60)) / 1000);
    document.querySelector('div#event span.days').innerHTML = days.toString();
    document.querySelector('div#event span.hours').innerHTML = hours.toString();
    document.querySelector('div#event span.minutes').innerHTML = minutes.toString();
    document.querySelector('div#event span.seconds').innerHTML = seconds.toString();
}, 1000);
if (document.querySelector('div#attending'))
  setInterval(() => {
    const now = new Date().getTime();
    const differnce =deadlineAttending.getTime() - now;
    const days = Math.floor(differnce / (1000 * 60 * 60 * 24));
    const hours = Math.floor((differnce % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((differnce % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differnce % (1000 * 60)) / 1000);
    document.querySelector('div#attending span.days').innerHTML = days.toString();
    document.querySelector('div#attending span.hours').innerHTML = hours.toString();
    document.querySelector('div#attending span.minutes').innerHTML = minutes.toString();
    document.querySelector('div#attending span.seconds').innerHTML = seconds.toString();
}, 1000);

document.querySelector('#searchInvite  #inviteId').addEventListener('input', () => {
  let input = document.querySelector('#searchInvite #inviteId').value;
  input = `${window.location.href.slice(0,51)}/invitation/${input}`;
  document.querySelector('#searchInvite > #submitSearch').href = input;
});

let clockMovers = document.querySelectorAll('div.EventClock > #clockMover > i');
clockMovers.forEach(clockMover => {
  clockMover.addEventListener('click',() => {
    eventTimer.hidden = !eventTimer.hidden;
    attendingTimer.hidden = !attendingTimer.hidden;
  });
});

let createInvite = document.getElementById('invite');
let searchInvite = document.getElementById('searchInvite');
let inviteCreator = document.querySelectorAll('div#bar2 > #clockMover > i');
inviteCreator.forEach(clockMover => {
  clockMover.addEventListener('click',() => {
    createInvite.hidden = !createInvite.hidden;
    if(createInvite.style.height === '0px'){
      createInvite.style.height = '100%';
      createInvite.style.width = '100%';
    }
    else  {
      createInvite.style.height = '0';
      createInvite.style.width = '0';
    }
    document.getElementById('newInvite').hidden = !document.getElementById('newInvite').hidden;
    searchInvite.hidden = !searchInvite.hidden;
  });
});