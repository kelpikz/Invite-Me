let home = document.querySelector('#navbar > #home');
let newInvite = document.querySelector('#navbar > #new');
let invitations = document.querySelector('#navbar > #invitations');
let events = document.querySelector('#navbar > #events');
let attending = document.querySelector('#navbar > #attending');
let logout = document.querySelector('#navbar > #logout');
let navBar = document.getElementById('navbar');

let size = window.matchMedia("(min-width: 350px)");
if(size.matches)
  logout.innerHTML = 'Log Out <i class="fas fa-sign-in-alt"></i>';
else
  logout.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
window.addEventListener('resize', ()=>{
  if(size.matches)
    logout.innerHTML = 'Log Out <i class="fas fa-sign-in-alt"></i>';
  else
    logout.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
});
  
  let url = window.location.href;
url = url.slice(0, 51);

logout.href = 'http://localhost:3000/user/logout';

home.href = `${url}/`;
newInvite.href = `${url}/invitation/new`;
invitations.href = `${url}/invitations`;
events.href = `${url}/events`;
attending.href = `${url}/attending`;

for(let i = 0; i < 4; i ++) {
  navBar.children[i].classList.remove('active');
}