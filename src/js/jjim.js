const btnClearAll = document.querySelector('#btn-clear-all');
const btnDelete = document.querySelector('.btn-delete');
const btnReserve = document.querySelector('.btn-reserve');
const cardsContainer = document.querySelector('.cards');
const totalPriceElem = document.querySelector('.total-price strong');
const modal = document.getElementById('modalWrap');
const closeBtn = document.getElementById('modalCloseBtn');
const btnNext = document.querySelector('.btn-next');

// 전체삭제
btnClearAll.addEventListener('click', () => {
  if (confirm('찜 목록을 모두 삭제하시겠습니까?')) {
    cardsContainer.innerHTML = '';
    updateTotalPrice();
    localStorage.removeItem('jjimCards');
  }
});

// 선택삭제
btnDelete.addEventListener('click', () => {
  const checkedBoxes = cardsContainer.querySelectorAll('.checkbox input[type="checkbox"]:checked');
  if (checkedBoxes.length === 0) {
    alert('삭제할 항목을 선택해주세요.');
    return;
  }
  if (confirm('선택한 찜 목록을 삭제하시겠습니까?')) {
    checkedBoxes.forEach(cb => {
      const card = cb.closest('.card');
      if (card) card.remove();
    });
    updateTotalPrice();
    saveCardsToLocalStorage();
  }
});

// 체크박스 변경 시 총 가격 업데이트
cardsContainer.addEventListener('change', (e) => {
  if (e.target.matches('.checkbox input[type="checkbox"]')) {
    updateTotalPrice();
  }
});

function updateTotalPrice() {
  let total = 0;

  document.querySelectorAll('.card').forEach(card => {
    const checkbox = card.querySelector('.checkbox input[type="checkbox"]');

    if (checkbox && checkbox.checked) {
      // 🔥 모든 방 가격을 선택해서 합산
      const priceSpans = card.querySelectorAll('.price span');
      priceSpans.forEach(span => {
        const price = Number(span.textContent.replace(/[^\d]/g, '')) || 0;
        total += price;
      });
    }
  });

  totalPriceElem.textContent = total.toLocaleString();
}

// 예약 버튼 클릭 시 localStorage 저장 + 모달 표시
btnReserve.addEventListener('click', () => {
  const selectedData = [];
  const checkedBoxes = cardsContainer.querySelectorAll('.checkbox input[type="checkbox"]:checked');

  if (checkedBoxes.length === 0) {
    alert('예약할 항목을 선택해주세요.');
    return;
  }

  checkedBoxes.forEach(cb => {
    const card = cb.closest('.card');
    const title = card.querySelector('.title')?.textContent || '';
    const room = card.querySelector('.room-top')?.textContent || '';
    const price = card.querySelector('.price span')?.textContent || '';
    selectedData.push({ title, room, price });
  });

  localStorage.setItem('reservedCards', JSON.stringify(selectedData));

  // 모달 열기
  if (modal) {
    // 불러온 데이터로 모달 내용 세팅
    if (selectedData.length > 0) {
      const tagBoxes = modal.querySelector('.tag-boxes');
      const roomInput = modal.querySelector('#roomInput');

      // 첫 번째 카드 데이터만 표시 (필요시 확장 가능)
      tagBoxes.querySelector('span:first-child').textContent = selectedData[0].title || '';
      if (roomInput) {
        roomInput.value = selectedData[0].room || '';
        roomInput.setAttribute('readonly', 'readonly');
      }
    }

    modal.style.display = 'block';
  }
});

// 모달 닫기
closeBtn?.addEventListener('click', () => {
  modal.style.display = 'none';
});

// 카드 저장/불러오기
function saveCardsToLocalStorage() {
  const cards = [];
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('.title')?.textContent || '';
    const priceText = card.querySelector('.price span')?.textContent || '';
    cards.push({ title, price: priceText });
  });
  localStorage.setItem('jjimCards', JSON.stringify(cards));
}

let num = 0;

function loadCardsFromLocalStorage() {
  const cards = JSON.parse(localStorage.getItem('jjimCards') || '[]');
  cardsContainer.innerHTML = '';
  let num = 0;

  if (cards.length === 0) {
    cardsContainer.innerHTML = `<span class="none-data">찜한 항목이 없습니다.</span>`;
    return;
  }

  cards.forEach(({ image, title, location, rooms }) => {
    num++;
    let roomSection = '';

    if (Array.isArray(rooms) && rooms.length > 1) {
      //  여러 방일 경우 slick 슬라이더로
      const roomSlides = rooms.map(room => `
        <div class="room-slide">
          <div class="room-info">
            <img src="${room.roomImage || 'image/default.webp'}" alt="룸 이미지" />
            <div class="room-details">
              <div class="room-top">${room.roomType}</div>
              <div class="room-middle">공유라운지+셀프키친</div>
              <div class="room-bottom">👥 ${room.limit} <br /> 🛏️ ${room.beds}</div>
            </div>
            <div class="price">
              <div class="original-price"><del>${room.originalPrice}</del></div>
              <div class="discount-price"><span>${room.discountPrice}</span></div>
            </div>
          </div>
        </div>

      `).join('');

      roomSection = `<div class="room-slider">${roomSlides}</div>`;
    } else if (Array.isArray(rooms) && rooms.length === 1) {
      // 방이 하나일 경우 슬릭 없이 단독 출력
      const room = rooms[0];
      roomSection = `
        <div class="room-slide">
          <div class="room-info">
            <img src="${room.roomImage || 'image/default.webp'}" alt="룸 이미지" />
            <div class="room-details">
              <div class="room-top">${room.roomType}</div>
              <div class="room-middle">공유라운지+셀프키친</div>
              <div class="room-bottom">👥 ${room.limit} <br /> 🛏️ ${room.beds}</div>
            </div>
          </div>
          <div class="price">
            <div class="original-price"><del>${room.originalPrice}</del></div>
            <div class="discount-price"><span>${room.discountPrice}</span></div>
          </div>
        </div>
      `;
    } else {
      roomSection = `<div class="no-room">등록된 방 정보가 없습니다.</div>`;
    }

    const cardHtml = `
      <div class="card">
        <div class="main-image-wrapper">
          <div class="checkbox">
            <input type="checkbox" id="card${num}" />
          </div>
          <img src="${image}" alt="${title}" class="main" />
        </div>
        <div class="card-content">
          <div class="title">${title}</div>
          <div class="location">${location}</div>
          ${roomSection}
        </div>
      </div>
    `;

    cardsContainer.insertAdjacentHTML('beforeend', cardHtml);
  });

  $('.room-slider').not('.slick-initialized').slick({
    slidesToShow: 1,
    arrows: true,
    dots: false,
    infinite: false,
    adaptiveHeight: true
  });

  updateTotalPrice?.();
}
// 초기 실행
loadCardsFromLocalStorage();
updateTotalPrice();

// flatpickr 달력 설정
const stayDateInput = document.getElementById('stayDateInput');
const icon = document.querySelector('.date-picker-icon');

if (stayDateInput) {
  const fp = flatpickr(stayDateInput, {
    mode: 'range',
    dateFormat: 'Y.m.d',
    locale: 'ko',
    minDate: 'today',
    allowInput: false,
    onClose(selectedDates, dateStr, instance) {
      if (selectedDates.length === 2) {
        stayDateInput.value =
          instance.formatDate(selectedDates[0], 'Y.m.d') + ' - ' +
          instance.formatDate(selectedDates[1], 'Y.m.d');
      } else {
        stayDateInput.value = '';
      }
    }
  });

  icon?.addEventListener('click', () => fp.open());
  icon?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fp.open();
    }
  });
}

// 비밀번호 확인 검증
const pwInput = document.getElementById('passwordInput');
const pwConfirm = document.getElementById('passwordConfirmInput');

const validatePasswords = () => {
  if (!pwConfirm.value) {
    pwConfirm.classList.remove('valid', 'invalid');
    return;
  }
  if (pwInput.value === pwConfirm.value) {
    pwConfirm.classList.add('valid');
    pwConfirm.classList.remove('invalid');
  } else {
    pwConfirm.classList.add('invalid');
    pwConfirm.classList.remove('valid');
  }
};

pwInput?.addEventListener('input', validatePasswords);
pwConfirm?.addEventListener('input', validatePasswords);


// 모달 다음 버튼 클릭 시
btnNext?.addEventListener('click', () => {
  // 모달 input들
  const nameInput = document.getElementById('nameInput');
  const ageInput = document.getElementById('ageInput');
  const guestCountInput = document.getElementById('guestCountInput');
  const stayDateInput = document.getElementById('stayDateInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const passwordConfirmInput = document.getElementById('passwordConfirmInput');

  // 비밀번호 확인 검사
  if (passwordInput.value !== passwordConfirmInput.value) {
    alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  // 체크된 카드 찾기
  const checkedBoxes = document.querySelectorAll('.cards .checkbox input[type="checkbox"]:checked');
  if (checkedBoxes.length === 0) {
    alert('예약할 카드를 선택해주세요.');
    return;
  }

  // 모달 내 .tag-boxes 첫 번째 span 텍스트
  const tagBoxSpan = document.querySelector('.tag-boxes .tag-box');
  const guesthouseTag = tagBoxSpan ? tagBoxSpan.textContent.trim() : '';

  // #roomInput 값
  const roomInput = document.getElementById('roomInput');
  const roomInputVal = roomInput ? roomInput.value.trim() : '';

  const reservationArr = [];

  checkedBoxes.forEach(cb => {
    const card = cb.closest('.card');
    if (!card) return;

    // 카드 내 정보 추출
    const title = card.querySelector('.title')?.textContent.trim() || '';
    const location = card.querySelector('.location')?.textContent.trim() || '';
    const roomTop = card.querySelector('.room-top')?.textContent.trim() || '';
    const roomMiddle = card.querySelector('.room-middle')?.textContent.trim() || '';
    const roomBottom = card.querySelector('.room-bottom')?.textContent.trim() || '';
    const priceOriginal = card.querySelector('.price del')?.textContent.trim() || '';
    const priceDiscount = card.querySelector('.price span')?.textContent.trim() || '';

    // 모달 정보
    const modalData = {
      name: nameInput.value.trim(),
      age: ageInput.value.trim(),
      guestCount: guestCountInput.value.trim(),
      stayDate: stayDateInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      guesthouseTag,  // 추가
      roomInputVal    // 추가
    };

    // 카드 정보 + 모달 정보 합침
    const reservationObj = {
      card: {
        title,
        location,
        roomTop,
        roomMiddle,
        roomBottom,
        priceOriginal,
        priceDiscount,
      },
      user: modalData
    };

    reservationArr.push(reservationObj);
  });

  alert('예약 정보가 저장되었습니다.');
  localStorage.setItem('reservations', JSON.stringify(reservationArr));

  // 1. 예약 모달 숨김
  modal.style.display = 'none';

  // 2. 카드 결제 모달을 비동기로 로드
  fetch("cardmodal.html")
    .then(res => {
      if (!res.ok) throw new Error("파일 불러오기 실패");
      return res.text();
    })
    .then(html => {
      const cardModal = document.getElementById("cardModal");
      cardModal.innerHTML = html;
      cardModal.style.display = "flex";

      // 내부 모달 열기
      const inner = cardModal.querySelector(".card-payment-modal");
      if (inner) inner.style.display = "block";
      const script = document.createElement("script");
      script.src = "js/cardmodal.js";
      script.onload = () => {
        initCardModalJS();
      };

      document.body.appendChild(script);
    })
    .catch(err => {
      alert("카드 결제 모달을 불러오지 못했습니다.");
    });
});