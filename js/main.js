document.addEventListener("DOMContentLoaded", () => {
  const eventSwiper = new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: 30,
    centeredSlides: false,
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    autoplay: {
      delay: 3000,
    },
  });

  const weeklysaleSwiper = new Swiper(".weeklysaleSwiper", {
    loop: true,
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 30,
    centeredSlides: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 3000,
    },
  });

  const weeklyrecommendSwiper = new Swiper(".weeklyrecommendSwiper", {
    loop: true,
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 30,
    centeredSlides: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 3000,
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab");
  const listContainer = document.querySelector(".popularlists");

  const popularData = {
    seoul: [
      {
        image: "image/popular01.webp",
        title: "남산타워",
        description: "서울의 대표적인 명소<br>가족/친구/연인과 함께",
      },
      {
        image: "image/popular02.webp",
        title: "경복궁",
        description: "서울의 대표적인 명소<br>가족/친구/연인과 함께",
      },
      {
        image: "image/popular03.webp",
        title: "한강",
        description: "서울의 대표적인 명소<br>가족/친구/연인과 함께",
      },
    ],
    busan: [
      {
        image: "image/busan01.webp",
        title: "해운대 해수욕장",
        description: "부산의 인기 해변<br>시원한 바다와 야경",
      },
      {
        image: "image/busan02.webp",
        title: "광안대교",
        description: "야경이 아름다운 대교<br>부산의 랜드마크",
      },
      {
        image: "image/busan03.webp",
        title: "감천문화마을",
        description: "알록달록한 마을 풍경<br>산책하며 힐링",
      },
    ],
    incheon: [
      {
        image: "image/incheon01.webp",
        title: "차이나타운",
        description: "한국 유일의 차이나타운<br>맛과 볼거리 가득",
      },
      {
        image: "image/incheon02.webp",
        title: "송도 센트럴파크",
        description: "도심 속 자연 공간<br>야경 명소",
      },
      {
        image: "image/incheon03.webp",
        title: "월미도",
        description: "놀이공원과 바다 산책<br>인천의 대표 관광지",
      },
    ],
  };

  function renderList(city) {
    const items = popularData[city] || [];
    listContainer.innerHTML = items
      .map(
        (item) => `
        <li class="list">
          <div class="photo">
            <a href="#none">
              <img src="${item.image}" alt="${item.title}" loading="lazy" />
            </a>
          </div>
          <div class="info">
            <span>${item.title}</span>
            <p>${item.description}</p>
          </div>
        </li>
      `
      )
      .join("");
  }

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      // active 클래스 처리
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      const city = tab.dataset.city;
      renderList(city);
    });
  });

  // 초기 로딩 시 서울 데이터로 렌더링
  renderList("seoul");
})