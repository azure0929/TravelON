import React from "react";
import "@/css/common.css";
import "@/css/admin.css";

// TODO: Bootstrap, Fontawesome, Chart.js 등 외부 CSS/JS는 public/index.html 또는 App.js에서 import 필요
// TODO: js/admin.js, js/common.js 등은 React useEffect 등으로 이식 필요
// TODO: 동적 데이터, 이벤트, 차트 등은 후속 단계에서 React 방식으로 이식

export default function Admin() {
  return (
    <div id="wrap">
      {/* header */}
      <header>
        <div className="logo-wrapper">
          <img className="logo" src="image/logo.png" alt="TravelON 로고" />
        </div>
      </header>
      <main>
        {/* ... (admin.html의 <main> 내부 전체 구조를 JSX로 변환하여 삽입) ... */}
      </main>
      {/* aside */}
      <aside>
        <div className="aside-inner">
          <div className="profile">
            <div className="photo">
              <img src="image/admin-profile.png" alt="관리자 프로필" />
            </div>
            <ul className="tabs">
              <li className="tab active">
                <span className="icon">
                  <i className="fa-solid fa-chart-simple"></i>
                </span>
                <span>매출 현황</span>
              </li>
              <li className="tab">
                <span className="icon">
                  <i className="fa-solid fa-users"></i>
                </span>
                <span>고객 정보</span>
              </li>
              <li className="tab">
                <span className="icon">
                  <i className="fa-solid fa-chart-pie"></i>
                </span>
                <span>예약자 비율</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      {/* footer */}
      <footer className="footer">
        <div className="footer-inner">
          <img
            className="footer-logo"
            src="image/logo.png"
            alt="TravelON 로고"
          />
          <div className="info-wrap">
            <div className="info-inner">
              <div className="company-info">
                <p>
                  (주) 게스트하우스 | 대표: 이우진, 함동윤, 양준용 |
                  사업자등록번호: 012-34-56789 | 통신판매업신고:
                  2025-서울시청-0123
                </p>
                <p>
                  메일: kosagh1@gmail.com | 관광사업자 등록번호: 제2025-000012호
                  | 주소: 서울 종로구 창경궁로 254 7층
                </p>
                <p>고객센터: 1644-1234 (오전 9시 - 오후 6시)</p>
              </div>
              <nav className="footer-nav">
                <a href="#none">회사소개</a>
                <a href="#none">이용약관</a>
                <a href="#none">개인정보처리방침</a>
              </nav>
              <div className="social-links">
                <a href="#none" aria-label="Facebook">
                  <img src="image/facebook.png" alt="Facebook 아이콘" />
                </a>
                <a href="#none" aria-label="Instagram">
                  <img src="image/instagram.png" alt="Instagram 아이콘" />
                </a>
              </div>
            </div>
            <div className="customer-support">
              <h3>고객센터</h3>
              <p>고객문의: 오전 09시 ~ 오후 6시</p>
              <p>카카오톡 문의: 24시간 운영</p>
              <div className="contact-buttons">
                <a href="#none" className="contact-button">
                  <img src="image/call.png" alt="전화 아이콘" />
                  <span>1677-1234</span>
                </a>
                <a href="#none" className="contact-button">
                  <div className="kakao-icon"></div>
                  <span>카카오 문의</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div role="button" className="scroll-top" id="scrollTopBtn">
        <img src="image/scrollTop.png" alt="scroll-top" />
      </div>
    </div>
  );
}
