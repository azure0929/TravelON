import { useEffect, useState } from "react";
import "@/css/totalmodal.css";
import "@/css/common.css";

export default function TotalModal({ isOpen, onClose }) {
  const [reservationDetails, setReservationDetails] = useState(null);
  const [stayPeriod, setStayPeriod] = useState("");
  const [nights, setNights] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [cardCompany, setCardCompany] = useState("정보 없음");

  useEffect(() => {
    if (isOpen) {
      const reservations = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );
      const cardInfo = JSON.parse(localStorage.getItem("cardInfo") || "{}");

      if (reservations.length === 0) {
        console.warn("저장된 예약 정보가 없습니다.");
        setReservationDetails(null);
        return;
      }

      const r = reservations[0];
      setReservationDetails(r);

      const u = r.user;
      const c = r.card;

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

      const priceValue =
        typeof c.discountPrice === "string"
          ? Number(c.discountPrice.replace(/[^\d]/g, ""))
          : c.discountPrice;

      if (!isNaN(priceValue) && priceValue !== null) {
        setDisplayPrice(priceValue.toLocaleString());
      } else {
        setDisplayPrice("0");
      }

      if (cardInfo.cardCompany) {
        setCardCompany(cardInfo.cardCompany);
      } else {
        setCardCompany("정보 없음");
      }
    }
  }, [isOpen]);

  const getNightCount = (range) => {
    if (!range || !range.includes(" - ")) return 0;
    const [start, end] = range.split(" - ");
    const d1 = new Date(start);
    const d2 = new Date(end);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  };

  const handleConfirmYes = () => {
    if (!reservationDetails) {
      alert("예약 정보를 불러올 수 없습니다. 다시 시도해주세요.");
      onClose();
      return;
    }

    const r = reservationDetails;
    const u = r.user;
    const c = r.card;

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

    const clients = JSON.parse(localStorage.getItem("clients") || "[]");
    clients.push(newClient);
    localStorage.setItem("clients", JSON.stringify(clients));

    alert("예약 정보가 성공적으로 저장되었습니다!");
    // localStorage.removeItem("reservations");
    // localStorage.removeItem("cardInfo");
    onClose();
  };

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
        <div className="confirm-modal-header">
          <h2 id="totalModalTitle">예약 정보</h2>
        </div>
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
          <p></p>
          <p>예약일: {new Date().toISOString().split("T")[0]}</p>
          <p>숙박예정일: {stayPeriod}</p>
          <p>숙박기간: {nights}</p>
          <p>결제: {cardCompany}</p>
          <p>결제한 금액: {displayPrice}원</p>
        </div>
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
