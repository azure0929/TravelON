import React, { useEffect, useRef, useState } from "react";
import "./css/jjim.css";
import "./css/common.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TotalModal from "./totalmodal";
import CardModal from "./cardmodal";
import ScrollTop from "@/components/ScrollTop";
import ReserveModal from "./reservemodal";

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
  const [totalPrice, setTotalPrice] = useState(0);
  const stayDateInputRef = useRef(null);

  // 예약 모달 상태
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveCurrentCard, setReserveCurrentCard] = useState(null);
  const [reserveRoomType, setReserveRoomType] = useState("");

  // 카드 결제 모달 상태
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // 총 결제 내역 모달 상태
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);

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

  // 예약 버튼 클릭 (첫 번째 선택 항목만)
  const handleReserve = () => {
    if (selected.length === 0) {
      alert("예약할 항목을 선택해주세요.");
      return;
    }

    const firstIdx = selected[0];
    const card = cards[firstIdx];
    const firstRoomType = card.rooms?.[0]?.roomType || "";

    setReserveCurrentCard(card);
    setReserveRoomType(firstRoomType);
    setIsReserveModalOpen(true);
  };

  // ReserveModal → 다음 단계로 전달
  const handleSubmitReservationFromReserveModal = (reservationData) => {
    setIsReserveModalOpen(false);
    setIsCardModalOpen(true); // 예약 완료 후 결제 모달 열기
    console.log("예약 데이터:", reservationData);
  };

  // CardModal → 결제 완료 후 TotalModal 열기
  const handlePaymentSuccessFromCardModal = () => {
    setIsCardModalOpen(false);
    setIsTotalModalOpen(true);
  };

  const handleCloseTotalModal = () => {
    setIsTotalModalOpen(false);
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

        {/* ReserveModal */}
        {isReserveModalOpen && (
          <ReserveModal
            isOpen={isReserveModalOpen}
            onClose={() => setIsReserveModalOpen(false)}
            onSubmitReservation={handleSubmitReservationFromReserveModal}
            selectedRoomTitleFromParent={reserveRoomType}
            currentCard={reserveCurrentCard}
          />
        )}

        {/* CardModal */}
        {isCardModalOpen && (
          <CardModal
            isOpen={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccessFromCardModal}
          />
        )}

        {/* TotalModal */}
        {isTotalModalOpen && (
          <TotalModal
            isOpen={isTotalModalOpen}
            onClose={handleCloseTotalModal}
          />
        )}

        <ScrollTop />
      </div>
      <Footer />
    </>
  );
}
