function initCardModalJS() {
  const cardInputs = document.querySelectorAll('.card-input');
  const submitBtn = document.getElementById('submitCard');

  // 자동 이동
  cardInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
      if (input.value.length === 4 && idx < cardInputs.length - 1) {
        cardInputs[idx + 1].focus();
      }
    });
  });

  // 카드 제출 버튼
  submitBtn?.addEventListener('click', () => {
    const cardCompany = document.getElementById('cardCompanySelect')?.value || '';

    // ✅ 카드 번호 4칸 합치기
    let cardNumber = '';
    cardInputs.forEach(input => {
      cardNumber += input.value.trim();
    });

    // 확인용 콘솔
    console.log('카드사:', cardCompany);
    console.log('카드번호:', cardNumber);  // 여기에 잘 나와야 함

    if (!cardNumber || cardNumber.length < 16) {
      alert('카드번호를 정확히 입력해주세요.');
      return;
    }

    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

    if (reservations.length > 0) {
      reservations[0].user.cardCompany = cardCompany;
      reservations[0].user.cardNumber = cardNumber;

      localStorage.setItem('reservations', JSON.stringify(reservations));
    }



    document.getElementById('cardModal').style.display = 'none';

    fetch("totalmodal.html")
      .then(res => {
        if (!res.ok) throw new Error("파일 불러오기 실패");
        return res.text();
      })
      .then(html => {

        const existingModal = document.getElementById('checkModal');
        if (existingModal) existingModal.remove();
        
        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = html;
        document.body.appendChild(modalWrapper);

        const checkModal = document.getElementById('checkModal');
        if (checkModal) {
          checkModal.style.display = 'flex';
        } else {
          console.warn('checkModal이 DOM에 없습니다.');
        }

        const script = document.createElement("script");
        script.src = "js/totalmodal.js";
        script.onload = () => {
          if (typeof populateCheckModal === 'function') {
            populateCheckModal();
          } else {
            console.warn("populateCheckModal 함수 없음");
          }
        };
        document.body.appendChild(script);
      })
      .catch(err => {
        console.error(err);
        alert("예약 확인 모달을 불러오지 못했습니다.");
      });
  });

  // 닫기 버튼
  document.getElementById('cardModalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('cardModal').style.display = 'none';
  });

  // 기존 유저 정보 반영
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  if (reservations.length > 0) {
    const nameInput = document.getElementById('payerName');
    const emailInput = document.getElementById('payerEmail');

    nameInput.value = reservations[0].user.name || '';
    nameInput.setAttribute('readonly', true);

    emailInput.value = reservations[0].user.email || '';
    emailInput.setAttribute('readonly', true);
  }
}
