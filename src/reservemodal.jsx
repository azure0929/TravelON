import React from "react";

// TODO: Flatpickr 등 외부 CSS/JS는 public/index.html 또는 App.js에서 import 필요
// TODO: js/reserveModal.js, js/common.js 등은 React useEffect 등으로 이식 필요
// TODO: 동적 데이터, 이벤트 등은 후속 단계에서 React 방식으로 이식

export default function ReserveModal() {
  return (
    <div id="wrap">
      <div className="modal" id="modalWrap">
        <div
          className="modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className="modal-header">
            <div id="modalTitle">📩 예약</div>
            <button
              className="modal-close"
              id="modalCloseBtn"
              aria-label="닫기"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            {/* ... reservemodal.html의 폼 그룹 구조를 JSX로 변환하여 삽입 ... */}
          </div>
          <button className="btn-next">다음</button>
        </div>
      </div>
      <div role="button" className="scroll-top" id="scrollTopBtn">
        <img src="image/scrollTop.png" alt="scroll-top" />
      </div>
    </div>
  );
}
