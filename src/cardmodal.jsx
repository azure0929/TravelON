import React from "react";

// TODO: Flatpickr 등 외부 CSS/JS는 public/index.html 또는 App.js에서 import 필요
// TODO: js/cardmodal.js 등은 React useEffect 등으로 이식 필요
// TODO: 동적 데이터, 이벤트 등은 후속 단계에서 React 방식으로 이식

export default function CardModal() {
  return (
    <div
      className="modal card-payment-modal"
      id="cardModal"
      style={{ display: "none" }}
    >
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <div className="modal-header">
          <div className="modalTitle">
            <div className="cardimg">
              <img src="image/card.png" alt="카드 아이콘" />
            </div>
            <span>카드 결제</span>
          </div>
          <button
            className="modal-close"
            id="cardModalCloseBtn"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="cardCompanySelect">카드사</label>
            <select id="cardCompanySelect">
              <option>국민카드</option>
              <option>신한카드</option>
              <option>우리카드</option>
              <option>삼성카드</option>
            </select>
          </div>
          <div className="form-group">
            <label>카드번호</label>
            <ul className="cardnumber">
              <li>
                <input type="text" maxLength="4" className="card-input" />
              </li>{" "}
              -
              <li>
                <input type="text" maxLength="4" className="card-input" />
              </li>{" "}
              -
              <li>
                <input type="text" maxLength="4" className="card-input" />
              </li>{" "}
              -
              <li>
                <input type="text" maxLength="4" className="card-input" />
              </li>
            </ul>
          </div>
          <div className="form-group">
            <label htmlFor="payerName">이름</label>
            <input
              type="text"
              id="payerName"
              placeholder="이름을 입력하세요"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="payerEmail">이메일</label>
            <input
              type="email"
              id="payerEmail"
              placeholder="이메일을 입력하세요"
              readOnly
            />
          </div>
        </div>
        <button className="btn-next" id="submitCard">
          예약
        </button>
      </div>
    </div>
  );
}
