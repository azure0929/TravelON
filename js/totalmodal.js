function populateCheckModal() {
  const confirmBody = document.getElementById('checkModalBody');
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

  if (!confirmBody || reservations.length === 0) return;

  const r = reservations[0];
  const u = r.user;
  const c = r.card;

  // 날짜 범위에서 숙박일 수 계산
  let stayPeriod = '';
  let nights = '';
  if (u.stayDate.includes(' - ')) {
    const [start, end] = u.stayDate.split(' - ');
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    stayPeriod = `${start} - ${end}`;
    nights = `${diff}일`;
  }

  const displayPrice = Number(c.priceDiscount.replace(/[^\d]/g, '')).toLocaleString();

  confirmBody.innerHTML = `
    <p>고객명: ${u.name}</p>
    <p>나이: ${u.age}</p>
    <p>이메일: ${u.email}</p>
    <p>게스트하우스명: ${u.guesthouseTag}, ${u.roomInputVal}</p>
    <p>예약일: ${new Date().toISOString().split('T')[0]}</p>
    <p>숙박예정일: ${stayPeriod}</p>
    <p>숙박기간: ${nights}</p>
    <p>결제: ${u.cardCompany}</p>
    <p>결제한 금액: ${displayPrice}원</p>
  `;

  document.querySelector('.btn-check-yes')?.addEventListener('click', () => {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const reservation = reservations[0];

    const newClient = {
      name: reservation.user.name,
      email: reservation.user.email,
      age: Number(reservation.user.age),
      region: '서울', // UI에서 받을 수 있다면 그 값으로
      guesthouse: reservation.card.title,
      roomType: reservation.card.roomTop,
      guesthouseType: reservation.user.guesthouseTag,
      checkin: reservation.user.stayDate.split(' - ')[0],
      checkout: reservation.user.stayDate.split(' - ')[1],
      nights: getNightCount(reservation.user.stayDate),
      people: Number(reservation.user.guestCount)
    };

    // 기존 clients 불러오기
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));

    alert("예약 정보가 client.json 형식으로 저장되었습니다.");
    document.getElementById('checkModal').style.display = 'none';
  });

  function getNightCount(range) {
    if (!range.includes(' - ')) return 0;
    const [start, end] = range.split(' - ');
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  }
}