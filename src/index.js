import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
axios.defaults.headers.common["x-api-key"] =
    'live_4UXiNWVEu2YnzCthXThxZN4YgxeLDEc8dSfXnBpotrRMu0Nl1GrczRGfa8xuHOjv';

let searchQuery;
const imagesPerPage = 40;
let page;
let lightbox;
let imageCounter = 0;

const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');
const searchForm = document.querySelector('#search-form');

moreBtn.style.display = 'none';

function galleryDisplay(data) {
    const galleryArr = data.hits;
    if (galleryArr.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    } 
    if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    imageCounter += imagesPerPage;
  if (imageCounter >= data.totalHits) {
    moreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      "Were sorry, but you've reached the end of search results"
    );
  } else {
    moreBtn.style.display = 'block';
    }
    
    const markup = galleryArr
        .map(elem => `<div class="photo-card">
        <a href=${elem.largeImageURL}>
  <img src=${elem.webformatURL} alt="${elem.tags}" width="300px" height="200px" loading="lazy" />
  </a>
  <div class="info">  
    <p class="info-item">
      <b><span class="simple-span">Likes</span> ${elem.likes}</b>
    </p>
    <p class="info-item">    
      <b><span class="simple-span">Views</span> ${elem.views}</b>
    </p>
    <p class="info-item">
      <b><span class="simple-span">Comments</span> ${elem.comments}</b>
    </p>
    <p class="info-item">
      <b><span class="simple-span">Downloads</span> ${elem.downloads}</b>
    </p>
  </div>
</div>`)
        .join('');
    gallery.insertAdjacentHTML('beforeend', markup);

    if (page === 1) {
        lightbox = new simpleLightbox('.gallery a');
    } else {
        lightbox.refresh();
        const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
        });
    }
}

async function fetchImages(currentPage) {
    const url = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
        key: '43680485-d2c13a63d690cef752ef6eeaf',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: currentPage,
        per_page: imagesPerPage,
    })
    moreBtn.style.display = 'none';
    try {
      const response = await fetch(`${url}?${params.toString()}`);
      const photos = await response.json();
      galleryDisplay(photos);
    } catch (error) {
        Notiflix.Notify.failure(error);
    }    
}

function submitHandler(event) {
    event.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    imageCounter = 0;
    searchQuery = searchForm.searchQuery.value;
    fetchImages(page);
}

function clickHandler() {
    fetchImages(++page);
}
    
searchForm.addEventListener('submit', submitHandler);
moreBtn.addEventListener('click', clickHandler);