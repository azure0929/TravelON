import React, { useEffect, useState, useRef } from "react";
import cardIcon from "@/assets/image/card.png";
import "@/css/cardmodal.css";

export default function CardModal({ isOpen, onClose, onPaymentSuccess }) {
  const [cardCompany, setCardCompany] = useState("국민카드");
  const [cardNumber, setCardNumber] = useState(["", "", "", ""]);
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");

  const cardInputRefs = useRef([]);

  useEffect(() => {
    // 로컬스토리지에서 예약자 정보 불러오기
    const reservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    if (reservations.length > 0) {
      setPayerName(reservations[0].user.name || "");
      setPayerEmail(reservations[0].user.email || "");
    }

    // 카드번호 입력 자동 포커스 이동 이벤트 등록
    const cleanupFunctions = [];
    cardInputRefs.current.forEach((input, idx) => {
      if (input) {
        const handleInput = () => {
          if (
            input.value.length === 4 &&
            idx < cardInputRefs.current.length - 1
          ) {
            cardInputRefs.current[idx + 1].focus();
          }
        };
        input.addEventListener("input", handleInput);
        cleanupFunctions.push(() => {
          input.removeEventListener("input", handleInput);
        });
      }
    });

    return () => {
      cleanupFunctions.forEach((func) => func());
    };
  }, []);

  const handleCardNumberChange = (value, index) => {
    const newCardNumber = [...cardNumber];
    newCardNumber[index] = value;
    setCardNumber(newCardNumber);
  };

  const handleSubmitCard = () => {
    const fullCardNumber = cardNumber.join("");

    if (!fullCardNumber || fullCardNumber.length < 16) {
      alert("카드번호를 정확히 입력해주세요.");
      cardInputRefs.current[0]?.focus();
      return;
    }

    // 1. reservations에 카드 정보 업데이트
    const reservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    if (reservations.length > 0) {
      reservations[0].user.cardCompany = cardCompany;
      reservations[0].user.cardNumber = fullCardNumber;
      localStorage.setItem("reservations", JSON.stringify(reservations));
    }

    // 2. TotalModal에서 사용할 카드사 정보 저장
    localStorage.setItem(
      "cardInfo",
      JSON.stringify({ cardCompany: cardCompany })
    );

    // 3. 결제 성공 처리 (CardModal 닫기는 부모에서 처리)
    if (onPaymentSuccess) {
      alert("결제가 완료되었습니다!");
      onPaymentSuccess(); // 부모에서 CardModal 닫고 TotalModal 열기
    }

    if (!isOpen) return null;
  };

  return (
    <div className="modal card-payment-modal" style={{ display: "flex" }}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <div className="modal-header">
          <div className="modalTitle">
            <div className="cardimg">
              <img src={cardIcon} alt="카드 아이콘" />
            </div>
            <span>카드 결제</span>
          </div>
          <button
            className="modal-close"
            id="cardModalCloseBtn"
            aria-label="닫기"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="cardCompanySelect">카드사</label>
            <select
              id="cardCompanySelect"
              value={cardCompany}
              onChange={(e) => setCardCompany(e.target.value)}
            >
              <option>국민카드</option>
              <option>신한카드</option>
              <option>우리카드</option>
              <option>삼성카드</option>
            </select>
          </div>
          <div className="form-group">
            <label>카드번호</label>
            <ul className="cardnumber">
              {[0, 1, 2, 3].map((idx) => (
                <React.Fragment key={idx}>
                  <li>
                    <input
                      type="text"
                      maxLength="4"
                      className="card-input"
                      value={cardNumber[idx]}
                      onChange={(e) =>
                        handleCardNumberChange(e.target.value, idx)
                      }
                      ref={(el) => (cardInputRefs.current[idx] = el)}
                    />
                  </li>
                  {idx < 3 && " - "}{" "}
                </React.Fragment>
              ))}
            </ul>
          </div>
          <div className="form-group">
            <label htmlFor="payerName">이름</label>
            <input
              type="text"
              id="payerName"
              placeholder="이름을 입력하세요"
              value={payerName}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="payerEmail">이메일</label>
            <input
              type="email"
              id="payerEmail"
              placeholder="이메일을 입력하세요"
              value={payerEmail}
              readOnly
            />
          </div>
        </div>
        <button className="btn-next" id="submitCard" onClick={handleSubmitCard}>
          예약
        </button>
      </div>
    </div>
  );
}
