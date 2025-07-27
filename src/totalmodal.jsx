import React from "react";

export default function TotalModal() {
  return (
    <div className="reservation-confirm-modal" id="checkModal">
      <div className="confirm-modal-container">
        <div className="confirm-modal-header">예약 정보</div>
        <div className="confirm-modal-body" id="checkModalBody"></div>
        <div className="confirm-modal-footer">
          <p className="confirm-question">예약을 하시겠습니까?</p>
          <div className="confirm-buttons">
            <button className="btn-check-yes">예</button>
            <button className="btn-check-no">아니오</button>
          </div>
        </div>
      </div>
    </div>
  );
}
