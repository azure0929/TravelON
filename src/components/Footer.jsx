import "@/css/common.css";

// image
import logo from "@/assets/image/logo.png";
import facebookIcon from "@/assets/image/facebook.png";
import instagramIcon from "@/assets/image/instagram.png";
import callIcon from "@/assets/image/call.png";
import kakaoIcon from "@/assets/image/kakao.png";

export default function Footer() {
  return (
    <footer>
      <div className="inner">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="company-info">
          <div className="left">
            <div className="company-info_detail">
              <span>
                (주) travelON | 대표: 이우진, 함동윤, 양준용 | 사업자등록번호:
                012-34-56789 | 통신판매신고: 2025-서울성북-0123
              </span>
              <span>
                메일: travelON@gmail.com | 관광사업자 등록번호: 제2025-000012호
                | 주소: 서울 종로구 창경궁로 254 7층
              </span>
              <span>고객센터: 1644-1234 (오전 9시 - 오후 6시)</span>
            </div>
            <ul className="company-link">
              <li>
                <a href="#none">회사소개</a>
              </li>
              <li>
                <a href="#none">이용약관</a>
              </li>
              <li>
                <a href="#none">개인정보처리방침</a>
              </li>
            </ul>
            <ul className="sns">
              <li>
                <a href="#none">
                  <img src={facebookIcon} alt="facebook" />
                </a>
              </li>
              <li>
                <a href="#none">
                  <img src={instagramIcon} alt="instagram" />
                </a>
              </li>
            </ul>
          </div>
          <div className="contact">
            <span>고객센터</span>
            <div className="call">
              <span>고객문의: 오전 09시 ~ 오후 6시</span>
              <span>카카오톡 문의: 24시간 운영</span>
            </div>
            <ul className="contact-link">
              <li>
                <a href="#none">
                  <div className="photo">
                    <img src={callIcon} alt="전화문의" />
                  </div>
                  <span>1677-1234</span>
                </a>
              </li>
              <li>
                <a href="#none">
                  <div className="photo">
                    <img src={kakaoIcon} alt="카카오 문의" />
                  </div>
                  <span>카카오 문의</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
