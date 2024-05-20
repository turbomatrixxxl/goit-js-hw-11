import Notiflix from 'notiflix';
import axios from 'axios';
var _ = require('lodash');
// Descris în documentație
import SimpleLightbox from 'simplelightbox';
// Import suplimentar de stil
import 'simplelightbox/dist/simple-lightbox.min.css';

// import infinite-scroll from 'infinite-scroll';

const form = document.querySelector('#search-form');
// console.log(form);

const input = document.querySelector('input');
// console.log(input);

const galleryContainer = document.querySelector('.gallery');
// console.log(galleryContainer);

const searchBtn = document.querySelector('button');
searchBtn.disabled = true;
input.addEventListener('input', () => {
  searchBtn.disabled = false;
});

const loader = document.querySelector('.loader');
loader.style.visibility = 'hidden';
// console.log(loader);

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.disabled = true;
loadMoreBtn.style.visibility = 'hidden';

function renderImages(result) {
  // console.log(result);
  const cardImg = document.createElement('div');
  cardImg.setAttribute('class', 'photo-card');
  // console.log(cardImg);

  const link = document.createElement('a');
  link.setAttribute('href', `${result.largeImageURL}`);

  const img = document.createElement('img');
  img.setAttribute('src', `${result.previewURL}`);
  img.setAttribute('alt', `${result.tags}`);
  img.setAttribute('loading', `lazy`);
  img.setAttribute('loading', `lazy`);
  // console.log(img);

  link.append(img);

  const infoContainer = document.createElement('div');
  infoContainer.setAttribute('class', 'info');
  // console.log(infoContainer);

  const infoLikes = document.createElement('p');
  infoLikes.setAttribute('class', 'info-item');
  const infoLikesTitle = document.createElement('b');
  infoLikesTitle.textContent = 'Likes';
  const infoLikesRes = document.createElement('span');
  infoLikesRes.textContent = `${result.likes}`;
  infoLikes.append(infoLikesTitle, infoLikesRes);

  const infoWiews = document.createElement('p');
  infoWiews.setAttribute('class', 'info-item');
  const infoWiewsTitle = document.createElement('b');
  infoWiewsTitle.textContent = 'Views';
  const infoWiewsRes = document.createElement('span');
  infoWiewsRes.textContent = `${result.views}`;
  infoWiews.append(infoWiewsTitle, infoWiewsRes);

  const infoComments = document.createElement('p');
  infoComments.setAttribute('class', 'info-item');
  const infoCommentsTitle = document.createElement('b');
  infoCommentsTitle.textContent = 'Comments';
  const infoCommentsRes = document.createElement('span');
  infoCommentsRes.textContent = `${result.comments}`;
  infoComments.append(infoCommentsTitle, infoCommentsRes);

  const infoDownloads = document.createElement('p');
  infoDownloads.setAttribute('class', 'info-item');
  const infoDownloadsTitle = document.createElement('b');
  infoDownloadsTitle.textContent = 'Downloads';
  const infoDownloadsRes = document.createElement('span');
  infoDownloadsRes.textContent = `${result.downloads}`;
  infoDownloads.append(infoDownloadsTitle, infoDownloadsRes);

  infoContainer.append(infoLikes, infoWiews, infoComments, infoDownloads);
  cardImg.append(link, infoContainer);
  galleryContainer.append(cardImg);
}

let page = 1;
let perPageItems = 40;
let searchText = null;

const API_URL_BASE = 'https://pixabay.com/api/';
const apiKey = '43897826-0f8632ff14c61d7f409caf77c';

searchBtn.addEventListener('click', ev => {
  ev.preventDefault();
  searchBtn.disabled = true;

  galleryContainer.innerHTML = null;
  // console.log(galleryContainer);

  searchText = input.value.replace(/ /g, '+');
  // console.log(searchText);

  const axiosOptions = {
    params: {
      key: apiKey,
      q: searchText,
      image_type: 'photo',
      page: page,
      per_page: perPageItems,
      orientation: 'horizontal',
      safesearch: true,
    },
  };

  async function fetchGaleryImages() {
    const result = await axios.get(`${API_URL_BASE}`, axiosOptions);
    try {
      if (result.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        // loadMoreBtn.disabled = true;
        // loadMoreBtn.style.visibility = 'hidden';
        loader.style.visibility = 'hidden';
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${result.data.totalHits} images.`
        );
        const allImages = result.data.hits;
        allImages.map(img => {
          renderImages(img);
        });
        // loadMoreBtn.style.visibility = 'visible';
        // loadMoreBtn.disabled = false;
        loader.style.visibility = 'visible';
        console.log(result.data.totalHits);
        console.log(allImages);
        console.log(galleryContainer);
        // getting the gallery"link" array by  selector
        const link = document.querySelectorAll('a');
        // console.log(link.length);
        // getting each link and adding click event on each link
        link.forEach(element => {
          const elementImage = element.querySelector('img');
          // console.log(elementImage.src);
          // console.log(element.href);
          element.addEventListener('click', ev => {
            //   preventing link natural action
            ev.preventDefault();
            // changing the src image path on click event
            elementImage.src = element.href;
            // setting the modal window gallery using the SimpleLightbox library and adding "alt" caption title on bottom with 250 ms delay
            let gallery = new SimpleLightbox(`.gallery a`, {
              captionsData: 'alt',
              captionDelay: 250,
            });
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchGaleryImages();
});

// loadMoreBtn.addEventListener('click', ev => {
//   page++;
//   galleryContainer.innerHTML = null;

//   const axiosOptions = {
//     params: {
//       key: apiKey,
//       q: searchText,
//       image_type: 'photo',
//       page: page,
//       per_page: perPageItems,
//       orientation: 'horizontal',
//       safesearch: true,
//     },
//   };

//   function fetchGaleryImages() {
//     axios
//       .get(`${API_URL_BASE}`, axiosOptions)
//       .then(result => {
//         const allImages = result.data.hits;
//         allImages.map(img => {
//           renderImages(img);
//         });
//         loadMoreBtn.style.visibility = 'visible';
//         loadMoreBtn.disabled = false;

//         // console.log(allImages);
//         if (allImages.length === 0) {
//           Notiflix.Notify.info(
//             "We're sorry, but you've reached the end of search results."
//           );
//           loadMoreBtn.style.visibility = 'hidden';
//           loadMoreBtn.disabled = true;
//         }
//         // getting the gallery"link" array by  selector
//         const link = document.querySelectorAll('a');
//         // console.log(link.length);

//         // getting each link and adding click event on each link
//         link.forEach(element => {
//           const elementImage = element.querySelector('img');
//           // console.log(elementImage.src);
//           // console.log(element.href);

//           element.addEventListener('click', ev => {
//             //   preventing link natural action
//             ev.preventDefault();

//             // changing the src image path on click event
//             elementImage.src = element.href;

//             // setting the modal window gallery using the SimpleLightbox library and adding "alt" caption title on bottom with 250 ms delay
//             let gallery = new SimpleLightbox(`.gallery a`, {
//               captionsData: 'alt',
//               captionDelay: 250,
//             });
//           });
//         });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
//   fetchGaleryImages();
// });

window.addEventListener(
  'scroll',
  _.debounce(() => {
    const scrolledTo = window.scrollY + window.innerHeight;

    const isReachBottom = document.body.scrollHeight <= scrolledTo;

    if (isReachBottom) {
      page++;
      galleryContainer.innerHTML = null;

      const axiosOptions = {
        params: {
          key: apiKey,
          q: searchText,
          image_type: 'photo',
          page: page,
          per_page: perPageItems,
          orientation: 'horizontal',
          safesearch: true,
        },
      };

      const fetchGaleryImages = async () => {
        return await axios.get(`${API_URL_BASE}`, axiosOptions);
      };

      fetchGaleryImages()
        .then(result => {
          const allImages = result.data.hits;
          allImages.map(img => {
            renderImages(img);
          });
          // loadMoreBtn.style.visibility = 'visible';
          // loadMoreBtn.disabled = false;
          loader.style.visibility = 'visible';

          // console.log(allImages);
          if (allImages.length === 0) {
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
            // loadMoreBtn.style.visibility = 'hidden';
            // loadMoreBtn.disabled = true;
            loader.style.visibility = 'hidden';
          }
          // getting the gallery"link" array by  selector
          const link = document.querySelectorAll('a');
          // console.log(link.length);

          // getting each link and adding click event on each link
          link.forEach(element => {
            const elementImage = element.querySelector('img');
            // console.log(elementImage.src);
            // console.log(element.href);

            element.addEventListener('click', ev => {
              //   preventing link natural action
              ev.preventDefault();

              // changing the src image path on click event
              elementImage.src = element.href;

              // setting the modal window gallery using the SimpleLightbox library and adding "alt" caption title on bottom with 250 ms delay
              let gallery = new SimpleLightbox(`.gallery a`, {
                captionsData: 'alt',
                captionDelay: 250,
              });
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, 300)
);
