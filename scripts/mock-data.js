const MOCK_VIDEOS = [
  {
    city: 'Белгород',
    description: 'Упаковка сухариков со вкусом чизбургера',
    timeOfDay: 'morning',
    image: './assets/images/1.png',
    video: './assets/videos/1.mp4',
  },
  {
    city: 'Адлер',
    description: 'Чесночные сухарики с сырным соусом',
    timeOfDay: 'afternoon',
    image: './assets/images/2.png',
    video: './assets/videos/2.mp4',
  },
  {
    city: 'Воронеж',
    description: 'Сухарики со вкусом стейка и соусом барбекю',
    timeOfDay: 'night',
    image: './assets/images/3.png',
    video: './assets/videos/3.mp4',
  },
  {
    city: 'Зеленоградск',
    description: 'Сухарики со вкусом шашлыка и кетчупом',
    timeOfDay: 'morning',
    image: './assets/images/4.png',
    video: './assets/videos/4.mp4',
  },
  {
    city: 'Вологда',
    description: 'Сухарики со вкусом сёмги и сыра, с соусом тартар',
    timeOfDay: 'afternoon',
    image: './assets/images/5.png',
    video: './assets/videos/5.mp4',
  },
];

function getMockData(city = '', times = []) {
  const query = city.trim().toLowerCase();
  return MOCK_VIDEOS.filter((item) => {
    const matchesCity = item.city.toLowerCase().includes(query);
    const matchesTime = times.length === 0 || times.includes(item.timeOfDay);
    return matchesCity && matchesTime;
  });
}
