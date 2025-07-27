const reviewData = [
    {
        user: "eljsdfiu...",
        date: "2025.06.01",
        rating: 4.5,
        text: "방이 깨끗하고 넓어요! 직원 응대도 친절하고 훌륭해요! 다음에도 이 게스트 하우스 오고싶네요!",
        image: "image/client01.png"
    },
    {
        user: "beautyand...",
        date: "2025.05.12",
        rating: 5,
        text: "우와! 친구들과 파티를 너무 재밌게 즐겼어요. 1박 2일로 예약했는데, 겨울에 또 올게요~",
        image: "image/client02.png"
    },
    {
        user: "chocolove...",
        date: "2025.06.01",
        rating: 4,
        text: "조식도 너무 맛있고 위치도 좋아요. 강추!",
        image: "image/client03.png"
    },
    {
        user: "eljsdfiu...",
        date: "2025.06.01",
        rating: 4.5,
        text: "방이 깨끗하고 넓어요! 직원 응대도 친절하고 훌륭해요! 다음에도 이 게스트 하우스 오고싶네요!",
        image: "image/client01.png"
    },
    {
        user: "beautyand...",
        date: "2025.05.12",
        rating: 5,
        text: "우와! 친구들과 파티를 너무 재밌게 즐겼어요. 1박 2일로 예약했는데, 겨울에 또 올게요~",
        image: "image/client02.png"
    },
    {
        user: "chocolove...",
        date: "2025.06.01",
        rating: 4,
        text: "조식도 너무 맛있고 위치도 좋아요. 강추!",
        image: "image/client03.png"
    },
];

// 별점 렌더 함수
function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += '<span class="star full">★</span>';
        } else if (i - rating < 1) {
            html += '<span class="star half">★</span>';
        } else {
            html += '<span class="star empty">☆</span>';
        }
    }
    return html;
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const title = params.get("title");
    const image = params.get("image");
    const locationText = params.get("location");
    const originalPrice = params.get("originalPrice");
    const discountPrice = params.get("discountPrice");

    const titleEl = document.getElementById("detail-title");
    const imageEl = document.getElementById("detail-image");
    const locationEl = document.getElementById("detail-location");


    if (titleEl && title) {
        titleEl.textContent = decodeURIComponent(title);
    }

    if (imageEl && image) {
        imageEl.src = decodeURIComponent(image);
    }

    if (locationEl && locationText) {
        const decodedLocation = decodeURIComponent(locationText);
        const textNodes = Array.from(locationEl.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
        textNodes.forEach(node => locationEl.removeChild(node));
        locationEl.appendChild(document.createTextNode(decodedLocation));
    }

    const baseOriginal = parseInt(originalPrice?.replace(/[^0-9]/g, "") || "0", 10);
    const baseDiscount = parseInt(discountPrice?.replace(/[^0-9]/g, "") || "0", 10);

    const formatPrice = (num) => num.toLocaleString("ko-KR");

    document.querySelectorAll(".room-category").forEach((categoryEl, categoryIndex) => {
        const priceGap = categoryIndex * 10000;

        categoryEl.querySelectorAll(".room-card").forEach(card => {
            const originalEl = card.querySelector(".original-price");
            const discountEl = card.querySelector(".discount-price");

            if (baseDiscount == 0) {
                originalEl.textContent = " ";
                discountEl.textContent = "예약이 마감되었습니다.";
                $(card).find('.reserve-btn')
                    .prop('disabled', true)
                    .text('예약 마감')
                    .addClass('disabled-btn');
                return;
            }

            if (originalEl && discountEl) {
                const finalOriginal = baseOriginal + priceGap;
                const finalDiscount = baseDiscount + priceGap;

                originalEl.textContent = formatPrice(finalOriginal);
                discountEl.textContent = formatPrice(finalDiscount);
            }
        });
    });

    $(document).ready(function () {
        $('.image-slider').slick({
            dots: true,
            arrows: true,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            rows: 1,
        });
    });

    const container = $('.review-slider');
    container.empty();

    reviewData.forEach(review => {
        const cardHtml = `
        <div class="review-card">
          <div class="review-user">${review.user}</div>
          <div class="review-date">${review.date}</div>
          <div class="review-stars">${renderStars(review.rating)}</div>
          <div class="review-text">${review.text}</div>
          <img class="review-thumb" src="${review.image}" alt="리뷰 썸네일" />
        </div>
      `;
        container.append(cardHtml);
    });

    container.slick({
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: false,
        arrows: true,
        dots: false,
    });


    $(document).on('click', '.heart-btn', function (e) {
        const heartImg = $(this).find('.heart-img');
        heartImg.toggleClass('heart-active');

        const isActive = heartImg.hasClass('heart-active');
        heartImg.attr('src', isActive ? "image/heart_sel.webp" : "image/heart_non.webp");

        const roomcard = $(this).closest('.room-card');
        const title = $('#detail-title').text().trim();
        const image = $('#detail-image').attr('src');
        const location = $('#detail-location').text().trim();
        const roomType = roomcard.find('.room-title').text().trim();
        const roomImage = roomcard.find('.room-img').attr('src');
        const originalPrice = roomcard.find('.original-price').text().trim();
        const discountPrice = roomcard.find('.discount-price').text().trim();
        const limit = roomcard.find('.room-limit').text().trim();
        const beds = roomcard.find('.room-bed').text().trim();

        let jjimCards = JSON.parse(localStorage.getItem('jjimCards') || '[]');
        const existing = jjimCards.find(item => item.title === title);

        const roomObj = { roomImage, roomType, originalPrice, discountPrice, limit, beds };

        if (existing) {
            existing.rooms = existing.rooms || [];

            // 동일한 방이 있는지 체크
            const isRoomExists = existing.rooms.some(
                room => room.roomType === roomObj.roomType && room.originalPrice === roomObj.originalPrice
            );

            if (isRoomExists) {
                // 해당 방만 제거
                existing.rooms = existing.rooms.filter(
                    room => !(room.roomType === roomObj.roomType && room.originalPrice === roomObj.originalPrice)
                );

                // 모든 방이 제거되었으면 게스트하우스도 제거
                if (existing.rooms.length === 0) {
                    jjimCards = jjimCards.filter(item => item.title !== title);
                }
            } else {
                // 방 추가
                existing.rooms.push(roomObj);
            }
        } else {
            // 게스트하우스 자체가 처음이면 새로 추가
            jjimCards.push({
                title,
                image,
                location,
                rooms: [roomObj]
            });
        }

        localStorage.setItem('jjimCards', JSON.stringify(jjimCards));
    });
    restoreHeartButtonsForDetail();

    const modal = document.getElementById('modalWrap');
    const closeBtn = document.getElementById('modalCloseBtn');
    const stayDateInput = document.getElementById('stayDateInput');
    const icon = document.querySelector('.date-picker-icon');
    const btnNext = document.querySelector('.btn-next');

    $('.reserve-btn').on('click', function (e) {
        const card = $(this).closest('.room-card');
        const title = card.find('.room-title').text().trim();
        const room = title; // 또는 다른 로직으로 room명 지정

        const selectedData = [{ title, room }];

        localStorage.setItem('reservedCards', JSON.stringify(selectedData));

        if (modal) {
            const tagBoxes = modal.querySelector('.tag-boxes');
            const roomInput = modal.querySelector('#roomInput');

            if (selectedData.length > 0) {
                if (tagBoxes) tagBoxes.querySelector('span:first-child').textContent = selectedData[0].title;
                if (roomInput) {
                    roomInput.value = selectedData[0].room;
                    roomInput.setAttribute('readonly', 'readonly');
                }
            }

            modal.style.display = 'block';
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

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

    btnNext?.addEventListener('click', function (e) {
        // 모달 input들
        const nameInput = document.getElementById('nameInput');
        const ageInput = document.getElementById('ageInput');
        const guestCountInput = document.getElementById('guestCountInput');
        const stayDateInput = document.getElementById('stayDateInput');
        const emailInput = document.getElementById('emailInput');
        const passwordInput = document.getElementById('passwordInput');
        const passwordConfirmInput = document.getElementById('passwordConfirmInput');

        const reservationArr = [];

        // 비밀번호 확인 검사
        if (passwordInput.value !== passwordConfirmInput.value) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        // 모달 내 .tag-boxes 첫 번째 span 텍스트
        const tagBoxSpan = document.querySelector('.tag-boxes .tag-box');
        const guesthouseTag = tagBoxSpan ? tagBoxSpan.textContent.trim() : '';

        // #roomInput 값
        const roomInput = document.getElementById('roomInput');
        const roomInputVal = roomInput ? roomInput.value.trim() : '';

        const card = Array.from(document.querySelectorAll('.room-card')).find(cardEl => {
            return cardEl.querySelector('.room-title')?.textContent.trim() === roomInputVal;
        });

        if (!card) {
            alert('선택한 객실 정보를 찾을 수 없습니다.');
            return;
        }


        const title = document.querySelector('.place-name')?.textContent.trim() || '';
        const location = card.querySelector('.location-text')?.textContent.trim() || '';
        const roomTop = card.querySelector('.room-title')?.textContent.trim() || '';
        const roomMiddle = card.querySelector('.room-desc')?.textContent.trim() || '';
        const roomBottom = card.querySelector('.room-meta')?.textContent.trim() || '';
        const priceOriginal = card.querySelector('.original-price')?.textContent.trim() || '';
        const priceDiscount = card.querySelector('.discount-price')?.textContent.trim() || '';

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

        localStorage.setItem('reservations', JSON.stringify(reservationArr));

        alert('예약 정보가 저장되었습니다.');
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
});

function restoreHeartButtonsForDetail() {
    const jjimCards = JSON.parse(localStorage.getItem('jjimCards') || '[]');
    const currentTitle = $('#detail-title').text().trim();

    const guesthouse = jjimCards.find(item => item.title === currentTitle);
    if (!guesthouse || !guesthouse.rooms) return;

    $('.room-card').each(function () {
        const roomTitle = $(this).find('.room-title').text().trim();
        const originalPrice = $(this).find('.original-price').text().trim();
        const heartImg = $(this).find('.heart-img');

        const isRoomJjimmed = guesthouse.rooms.some(
            room => room.roomType === roomTitle && room.originalPrice === originalPrice
        );

        if (isRoomJjimmed) {
            heartImg.addClass('heart-active');
            heartImg.attr('src', 'image/heart_sel.webp');
        } else {
            heartImg.removeClass('heart-active');
            heartImg.attr('src', 'image/heart_non.webp');
        }
    });
}

function restoreHeartButtonsForDetail() {
    const jjimCards = JSON.parse(localStorage.getItem('jjimCards') || '[]');
    const currentTitle = $('#detail-title').text().trim();
    const guesthouse = jjimCards.find(item => item.title === currentTitle);
    if (!guesthouse || !guesthouse.rooms) return;

    $('.room-card').each(function () {
        const roomType = $(this).find('.room-title').text().trim();
        const originalPrice = $(this).find('.original-price').text().trim();
        const heartImg = $(this).find('.heart-img');

        const isRoomJjimmed = guesthouse.rooms.some(
            room => room.roomType === roomType && room.originalPrice === originalPrice
        );

        if (isRoomJjimmed) {
            heartImg.addClass('heart-active');
            heartImg.attr('src', 'image/heart_sel.webp');
        } else {
            heartImg.removeClass('heart-active');
            heartImg.attr('src', 'image/heart_non.webp');
        }
    });
}
