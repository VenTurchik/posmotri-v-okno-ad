const preloaderWaitingTime = 1200;
const cardsPerPage = 5;

const cardsList = document.querySelector('.content__list');
const cardsContainer = document.querySelector('.content__list-container');
const videoContainer = document.querySelector('.result__video-container');
const videoElement = document.querySelector('.result__video');
const form = document.querySelector('.search-form');

const cardTemplate = document.querySelector('.cards-list-item-template');
const preloaderTemplate = document.querySelector('.preloader-template');
const errorTemplate = document.querySelector('.error-template');
const moreButtonTemplate = document.querySelector('.more-button-template');

let videoRequest;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const filters = new FormData(form);
  showResults(getMockData(filters.get('city'), filters.getAll('time')));
});

showResults(getMockData());

function showResults(videos) {
  cardsContainer.querySelector('.more-button')?.remove();
  cardsList.replaceChildren(...videos.slice(0, cardsPerPage).map(createCard));
  cardsContainer.scrollTop = 0;

  if (videos.length === 0) {
    videoRequest?.abort();
    videoElement.removeAttribute('src');
    videoElement.removeAttribute('poster');
    videoElement.load();
    removePreloader(videoContainer);
    removePreloader(cardsContainer);
    showError('Нет подходящих видео =(');
    return;
  }

  showPreloader(cardsContainer);
  selectVideo(videos[0], cardsList.querySelector('.content__card-link'));
  if (videos.length > cardsPerPage) showMoreButton(videos);
}

function showMoreButton(videos) {
  const button = moreButtonTemplate.content.firstElementChild.cloneNode(true);
  let shown = cardsPerPage;

  button.addEventListener('click', () => {
    const page = videos.slice(shown, shown + cardsPerPage);
    cardsList.append(...page.map(createCard));
    shown += page.length;

    if (shown === videos.length) button.remove();
  });

  cardsContainer.append(button);
}

function createCard(video) {
  const node = cardTemplate.content.cloneNode(true);
  const link = node.querySelector('.content__card-link');
  const thumbnail = node.querySelector('.content__video-card-thumbnail');

  node.querySelector('.content__video-card-title').textContent = video.city;
  node.querySelector('.content__video-card-description').textContent = video.description;
  thumbnail.src = video.image;
  thumbnail.alt = video.description;

  link.addEventListener('click', (event) => {
    event.preventDefault();
    selectVideo(video, link);
  });

  return node;
}

async function selectVideo(video, link) {
  videoRequest?.abort();
  const request = new AbortController();
  videoRequest = request;

  cardsList.querySelector('.content__card-link_current')
    ?.classList.remove('content__card-link_current');
  link.classList.add('content__card-link_current');
  videoContainer.querySelector('.error')?.remove();
  showPreloader(videoContainer);

  const ready = waitForVideo(request.signal);
  videoElement.poster = video.image;
  videoElement.src = video.video;
  const [loaded] = await Promise.all([
    ready,
    new Promise((resolve) => setTimeout(resolve, preloaderWaitingTime)),
  ]);

  if (request.signal.aborted) return;
  request.abort();

  removePreloader(videoContainer);
  removePreloader(cardsContainer);

  if (!loaded) showError('Ошибка загрузки видео :(');
}

function waitForVideo(signal) {
  return new Promise((resolve) => {
    videoElement.addEventListener('loadeddata', () => resolve(true), { signal });
    videoElement.addEventListener('error', () => resolve(false), { signal });
    signal.addEventListener('abort', () => resolve(false), { once: true });
  });
}

function showPreloader(container) {
  if (!container.querySelector('.preloader')) {
    container.append(preloaderTemplate.content.cloneNode(true));
  }
}

function removePreloader(container) {
  container.querySelector('.preloader')?.remove();
}

function showError(message) {
  videoContainer.querySelector('.error')?.remove();
  const node = errorTemplate.content.cloneNode(true);
  node.querySelector('.error__title').textContent = message;
  videoContainer.append(node);
}
