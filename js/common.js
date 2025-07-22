/**
 * header
 */
fetch("include/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    // 메뉴 버튼 이벤트
    const menuBtn = document.querySelector(".menu");
    const closeMenuBtn = document.querySelector(".close-btn");
    const menubar = document.querySelector(".menubar");

    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        menubar.classList.add("active");
      });
    }
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener("click", () => {
        menubar.classList.remove("active");
      });
    }

    // 검색 기능
    const $searchInput = $('#searchInput');
    const $searchIcon = $('.search-icon');

    // URL에서 query 값 가져오기
    const params = new URLSearchParams(window.location.search);
    const savedQuery = params.get('query');

    if (savedQuery) {
      $searchInput.val(savedQuery).css('color', '#191919');
      $searchIcon.addClass('active');
      // Font Awesome 아이콘으로 설정 (X 아이콘)
      $searchIcon.html('<i class="fas fa-times"></i>');
    }

    // 검색 아이콘 클릭
    $searchIcon.on('click', function () {
      const query = $searchInput.val().trim();

      if ($(this).hasClass('active')) {
        // 닫기 아이콘 클릭 시 초기화
        $searchInput.val('');
        $(this).removeClass('active');
        // Font Awesome 검색 아이콘으로 변경
        $(this).html('<i class="fas fa-search"></i>');
      } else if (query) {
        // 검색 실행
        window.location.href = `searchpage.html?query=${encodeURIComponent(query)}`;
      }
    });

    // Enter 키로도 검색
    $searchInput.on('keypress', function (e) {
      if (e.which === 13) {
        $searchIcon.click();
      }
    });

    // 예약 버튼 클릭 시 Confirm 창 띄우기
    $('#reserveBtn').on('click', function (e) {
      e.preventDefault();
      $('#confirmModal').addClass('show');
      console.log("확인");
      $('#confirmModal').fadeIn();
    });

    // 확인 버튼 클릭 시 검색 input에 focus
    $('#confirmBtn').on('click', function () {
      $('#confirmModal').fadeOut();  // 모달 닫기
      $('#searchInput').focus();  // 검색 input에 포커스
    });

    // 취소 버튼 클릭 시 모달만 닫고 페이지에 머무르기
    $('#cancelBtn').on('click', function () {
      $('#confirmModal').fadeOut();  // 모달 닫기
      $('#confirmModal').removeClass('show');
    });
  });

/**
 * footer
 */
fetch("include/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

/**
 * ScrollTop
 */
document.addEventListener("DOMContentLoaded", () => {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    const headerBottom = header.offsetTop + header.offsetHeight;
    if (window.scrollY > headerBottom) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(() => {
      scrollTopBtn.classList.remove("show");
    }, 600);
  });
});
