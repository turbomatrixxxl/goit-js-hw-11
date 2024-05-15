// import { Notiflix } from 'notiflix';
// import axios from 'axios';
// Notiflix.Notify.success('Sol lucet omnibus');

const form = document.querySelector('#search-form');
// console.log(form);

const input = document.querySelector('input');
// console.log(input);

const searchBtn = document.querySelector('button');
searchBtn.disabled = true;
// console.log(searchBtn);

searchBtn.addEventListener('click', ev => {
  ev.preventDefault();
});

form.addEventListener('input', ev => {
  ev.preventDefault();

  searchBtn.disabled = false;
  console.log(input.value);
});
