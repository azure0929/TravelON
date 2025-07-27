import React, { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./css/jjim.css";
import "./css/common.css";
import "./css/totalmodal.css";
import "./css/reservemodal.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Jjim() {
  // 상태 관리
  const [cards, setCards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jjimCards")) || [];
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [form, setForm] = useState({
    name: "",
    age: "",
    guestCount: "",
    stayDate: "",
    email: "",
    password: "",
    passwordConfirm: "",
    guesthouseTag: "",
    roomInputVal: "",
  });

  const stayDateInputRef = useRef(null);

  // 카드 불러오기
  useEffect(() => {
    setCards(JSON.parse(localStorage.getItem("jjimCards")) || []);
  }, []);

  // 총 가격 계산
  useEffect(() => {
    let total = 0;
    selected.forEach((idx) => {
      const card = cards[idx];
      if (!card) return;
      if (Array.isArray(card.rooms)) {
        card.rooms.forEach((room) => {
          total +=
            Number((room.discountPrice || "0").replace(/[^\d]/g, "")) || 0;
        });
      }
    });
    setTotalPrice(total);
  }, [selected, cards]);

  // flatpickr 달력
  useEffect(() => {
    if (stayDateInputRef.current) {
      flatpickr(stayDateInputRef.current, {
        mode: "range",
        dateFormat: "Y.m.d",
        locale: "ko",
        minDate: "today",
        allowInput: false,
        onClose(selectedDates, dateStr, instance) {
          if (selectedDates.length === 2) {
            setForm((f) => ({
              ...f,
              stayDate:
                instance.formatDate(selectedDates[0], "Y.m.d") +
                " - " +
                instance.formatDate(selectedDates[1], "Y.m.d"),
            }));
          } else {
            setForm((f) => ({ ...f, stayDate: "" }));
          }
        },
      });
    }
  }, [modalOpen]); // 모달 열릴 때마다 flatpickr 적용

  // 전체삭제
  const handleClearAll = () => {
    if (window.confirm("찜 목록을 모두 삭제하시겠습니까?")) {
      setCards([]);
      setSelected([]);
      localStorage.removeItem("jjimCards");
    }
  };

  // 선택삭제
  const handleDelete = () => {
    if (selected.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }
    if (window.confirm("선택한 찜 목록을 삭제하시겠습니까?")) {
      const newCards = cards.filter((_, idx) => !selected.includes(idx));
      setCards(newCards);
      setSelected([]);
      localStorage.setItem("jjimCards", JSON.stringify(newCards));
    }
  };

  // 카드 체크박스
  const handleSelect = (idx) => {
    setSelected((sel) =>
      sel.includes(idx) ? sel.filter((i) => i !== idx) : [...sel, idx]
    );
  };

  // 예약 버튼
  const handleReserve = () => {
    if (selected.length === 0) {
      alert("예약할 항목을 선택해주세요.");
      return;
    }
    // 첫번째 선택 카드 정보로 모달 세팅
    const card = cards[selected[0]];
    setForm((f) => ({
      ...f,
      guesthouseTag: card?.title || "",
      roomInputVal: card?.rooms?.[0]?.roomType || "",
      // 예약 모달 열 때 기존 입력값 초기화
      name: "",
      age: "",
      guestCount: "",
      stayDate: "",
      email: "",
      password: "",
      passwordConfirm: "",
    }));
    setModalOpen(true);
  };

  // 모달 닫기
  const handleModalClose = () => setModalOpen(false);

  // 비밀번호 확인
  const isPasswordValid =
    form.password && form.password === form.passwordConfirm;

  // 모달 다음 버튼
  const handleModalNext = () => {
    if (!isPasswordValid) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    // 예약 정보 저장
    const reservationArr = selected.map((idx) => {
      const card = cards[idx];
      const room = (card.rooms && card.rooms[0]) || {};
      return {
        card: {
          title: card.title,
          location: card.location,
          roomTop: room.roomType,
          roomMiddle: "공유라운지+셀프키친",
          roomBottom: `👥 ${room.limit} 🛏️ ${room.beds}`,
          priceOriginal: room.originalPrice,
          priceDiscount: room.discountPrice,
        },
        user: { ...form },
      };
    });
    localStorage.setItem("reservations", JSON.stringify(reservationArr));
    alert("예약 정보가 저장되었습니다.");
    setModalOpen(false);
    // TODO: 카드 결제 모달 등 후처리 구현 필요
  };

  // 카드 렌더링
  const renderCard = (card, idx) => (
    <div className="card" key={idx}>
      <div className="main-image-wrapper">
        <div className="checkbox">
          <input
            type="checkbox"
            checked={selected.includes(idx)}
            onChange={() => handleSelect(idx)}
          />
        </div>
        <img src={card.image} alt={card.title} className="main" />
      </div>
      <div className="card-content">
        <div className="title">{card.title}</div>
        <div className="location">{card.location}</div>
        {Array.isArray(card.rooms) && card.rooms.length > 0 ? (
          card.rooms.map((room, i) => (
            <div className="room-slide" key={i}>
              <div className="room-info">
                <img
                  src={room.roomImage || "image/default.webp"}
                  alt="룸 이미지"
                />
                <div className="room-details">
                  <div className="room-top">{room.roomType}</div>
                  <div className="room-middle">공유라운지+셀프키친</div>
                  <div className="room-bottom">
                    👥 {room.limit} <br /> 🛏️ {room.beds}
                  </div>
                </div>
                <div className="price">
                  <div className="original-price">
                    <del>{room.originalPrice}</del>
                  </div>
                  <div className="discount-price">
                    <span>{room.discountPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-room">등록된 방 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div id="wrap">
        <main className="jjin-contents">
          <div className="delete-container d-flex justify-content-end mt-4 pe-3">
            <span style={{ cursor: "pointer" }} onClick={handleClearAll}>
              전체삭제
            </span>
          </div>
          <div className="cards">
            {cards.length === 0 ? (
              <span className="none-data">찜한 항목이 없습니다.</span>
            ) : (
              cards.map(renderCard)
            )}
          </div>
          <div className="booking-container">
            <button className="btn btn-reserve" onClick={handleReserve}>
              예약
            </button>
            <button className="btn btn-delete" onClick={handleDelete}>
              삭제
            </button>
            <div className="total-price">
              총 가격: <strong>{totalPrice.toLocaleString()}</strong>원
            </div>
          </div>
        </main>
        {/* 예약 모달 */}
        {modalOpen && (
          <div className="modal" style={{ display: "block" }}>
            <div
              className="modal-container"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalTitle"
            >
              <div className="modal-header">
                <div className="info-head">
                  <img
                    src="image/modal-reserve.png"
                    alt="예약 아이콘"
                    loading="lazy"
                  />
                  <span id="modalTitle">예약</span>
                </div>
                <button
                  className="modal-close"
                  aria-label="닫기"
                  onClick={handleModalClose}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="nameInput">이름</label>
                  <input
                    type="text"
                    id="nameInput"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="이름을 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label>게스트하우스</label>
                  <div className="tag-boxes">
                    <span className="tag-box">{form.guesthouseTag}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ageInput">나이</label>
                  <input
                    type="number"
                    id="ageInput"
                    value={form.age}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, age: e.target.value }))
                    }
                    placeholder="나이를 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="roomInput">룸</label>
                  <input
                    type="text"
                    id="roomInput"
                    value={form.roomInputVal}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emailInput">이메일</label>
                  <input
                    type="email"
                    id="emailInput"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="이메일을 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stayDateInput">숙박 예정일</label>
                  <div className="date-picker-wrapper">
                    <input
                      type="text"
                      id="stayDateInput"
                      ref={stayDateInputRef}
                      value={form.stayDate}
                      readOnly
                      placeholder="예: 2025.06.01 - 2025.06.04"
                    />
                    {/* 달력 아이콘은 flatpickr에서 자동으로 처리 */}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="passwordInput">비밀번호</label>
                  <input
                    type="password"
                    id="passwordInput"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="비밀번호를 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guestCountInput">인원 수</label>
                  <input
                    type="text"
                    id="guestCountInput"
                    value={form.guestCount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, guestCount: e.target.value }))
                    }
                    placeholder="ex. 3"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordConfirmInput">비밀번호 확인</label>
                  <input
                    type="password"
                    id="passwordConfirmInput"
                    value={form.passwordConfirm}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        passwordConfirm: e.target.value,
                      }))
                    }
                    placeholder="비밀번호를 다시 입력하세요."
                    className={
                      form.passwordConfirm
                        ? isPasswordValid
                          ? "valid"
                          : "invalid"
                        : ""
                    }
                  />
                </div>
              </div>
              <button className="btn-next" onClick={handleModalNext}>
                다음
              </button>
            </div>
          </div>
        )}
        {/* 기타 모달, 카드 결제, 예약 확인 등은 별도 컴포넌트로 분리 필요 */}
        <div className="card-modal"></div>
        <div className="total-modal"></div>
        <div role="button" className="scroll-top" id="scrollTopBtn">
          <img src="image/scrollTop.png" alt="scroll-top" />
        </div>
      </div>
      <Footer />
    </>
  );
}
