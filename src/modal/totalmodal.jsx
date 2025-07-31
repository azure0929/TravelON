import { useEffect, useState } from "react";
import "@/css/totalmodal.css";
import "@/css/common.css";

// 예약 확인 모달 컴포넌트
export default function TotalModal({ isOpen, onClose }) {
  // 예약 상세정보 상태
  const [reservationDetails, setReservationDetails] = useState(null);
  const [stayPeriod, setStayPeriod] = useState(""); // 숙박 예정 기간
  const [nights, setNights] = useState(""); // 숙박 일수
  const [displayPrice, setDisplayPrice] = useState(""); // 결제 금액 표시용
  const [cardCompany, setCardCompany] = useState("정보 없음"); // 카드사 이름

  useEffect(() => {
    // 모달이 열릴 때 실행
    if (isOpen) {
      // 로컬스토리지에서 예약 및 카드 정보 가져오기
      const reservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const cardInfo = JSON.parse(localStorage.getItem("cardInfo") || "{}");

      // 예약 정보가 없을 경우
      if (reservations.length === 0) {
        console.warn("저장된 예약 정보가 없습니다.");
        setReservationDetails(null);
        return;
      }

      const r = reservations[0]; // 첫 번째 예약 정보만 사용
      setReservationDetails(r);

      const u = r.user; // 사용자 정보
      const c = r.card; // 카드 및 숙소 정보

      // 숙박 날짜가 유효한 경우 기간 계산
      if (u.stayDate && u.stayDate.includes(" - ")) {
        const [start, end] = u.stayDate.split(" - ");
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        setStayPeriod(`${start} - ${end}`);
        setNights(`${diff}일`);
      } else {
        setStayPeriod("정보 없음");
        setNights("정보 없음");
      }

      // 금액 처리 (문자열일 경우 숫자 추출)
      const priceValue =
        typeof c.discountPrice === "string"
          ? Number(c.discountPrice.replace(/[^\d]/g, ""))
          : c.discountPrice;

      if (!isNaN(priceValue) && priceValue !== null) {
        setDisplayPrice(priceValue.toLocaleString());
      } else {
        setDisplayPrice("0");
      }

      // 카드사 정보 설정
      if (cardInfo.cardCompany) {
        setCardCompany(cardInfo.cardCompany);
      } else {
        setCardCompany("정보 없음");
      }
    }
  }, [isOpen]);

  // 숙박 일수 계산 함수
  const getNightCount = (range) => {
    if (!range || !range.includes(" - ")) return 0;
    const [start, end] = range.split(" - ");
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  };

  // '예' 버튼 클릭 시 실행되는 예약 확정 핸들러
  const handleConfirmYes = () => {
    if (!reservationDetails) {
      alert("예약 정보를 불러올 수 없습니다. 다시 시도해주세요.");
      onClose();
      return;
    }

    const r = reservationDetails;
    const u = r.user;
    const c = r.card;

    // 새로운 고객 정보 객체 생성
    const newClient = {
      name: u.name,
      email: u.email,
      age: Number(u.age),
      region: c.location || "정보 없음",
      guesthouse: c.title,
      roomType: c.roomType,
      guesthouseType: c.roomTop,
      checkin: u.stayDate.split(" - ")[0],
      checkout: u.stayDate.split(" - ")[1],
      nights: getNightCount(u.stayDate),
      people: Number(u.guestCount),
    };

    // 기존 clients 배열에 새 정보 추가 후 저장
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    clients.push(newClient);
    localStorage.setItem("clients", JSON.stringify(clients));

    alert("예약 정보가 성공적으로 저장되었습니다!");
    onClose(); // 모달 닫기
  };

  // 모달이 닫혀 있거나 예약 정보가 없으면 아무것도 렌더링하지 않음
  if (!isOpen || !reservationDetails) {
    return null;
  }

  const u = reservationDetails.user;
  const c = reservationDetails.card;

  return (
    <div className="reservation-confirm-modal" id="#confirmModal">
      <div
        className="confirm-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="totalModalTitle"
      >
        {/* 모달 헤더 */}
        <div className="confirm-modal-header">
          <h2 id="totalModalTitle">예약 정보</h2>
        </div>

        {/* 모달 본문 */}
        <div className="confirm-modal-body" id="checkModalBody">
          <p>
            고객명: <strong>{u.name}</strong>
          </p>
          <p>나이: {u.age}</p>
          <p>이메일: {u.email}</p>
          <p>
            게스트하우스명: <strong>{c.title}</strong>, 객실타입:{" "}
            <strong>{c.roomType}</strong> ({c.roomTop})
          </p>
          <p>예약일: {new Date().toISOString().split("T")[0]}</p>
          <p>숙박예정일: {stayPeriod}</p>
          <p>숙박기간: {nights}</p>
          <p>결제: {cardCompany}</p>
          <p>결제한 금액: {displayPrice}원</p>
        </div>

        {/* 모달 푸터 (버튼 영역) */}
        <div className="confirm-modal-footer">
          <div className="confirm-modal-footer__inner">
            <div>
              <span className="confirm-question">예약을 하시겠습니까?</span>
            </div>
            <div className="confirm__buttons">
              <div
                role="button"
                className="buttons-check"
                onClick={handleConfirmYes}
              >
                예
              </div>
              <div role="button" className="buttons-no" onClick={onClose}>
                아니오
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
