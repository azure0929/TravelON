import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "@/css/common.css";

// image
import logo from "@/assets/image/logo.png";
import reserveIcon from "@/assets/image/reserve.png";
import wishlistIcon from "@/assets/image/wishlist.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const [menuActive, setMenuActive] = useState(false);
  const menubarRef = useRef(null);

  // 메뉴바 초기 숨김 설정
  useEffect(() => {
    if (menubarRef.current) {
      menubarRef.current.style.opacity = 0;
      menubarRef.current.style.transform = "translateX(-446px)";
      menubarRef.current.style.display = "none";
    }
  }, []);

  // 메뉴바 열기/닫기 GSAP 애니메이션
  useEffect(() => {
    const menubar = menubarRef.current;
    if (!menubar) return;

    if (menuActive) {
      menubar.style.display = "flex";
      gsap.fromTo(
        menubar,
        { x: -446, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    } else {
      gsap.to(menubar, {
        x: -446,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => {
          menubar.style.display = "none";
        },
      });
    }
  }, [menuActive]);

  // URL 쿼리 파싱 (최초 1회)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedQuery = params.get("query");
    if (savedQuery) {
      setSearch(savedQuery);
      setSearchActive(true);
    }
  }, []);

  // 검색 아이콘 클릭 핸들러
  const handleSearchIconClick = () => {
    if (searchActive) {
      setSearch("");
      setSearchActive(false);
    } else if (search.trim()) {
      navigate(`/searchpage?query=${encodeURIComponent(search)}`);
      setSearchActive(true);
    }
  };

  // 검색 input 변경 핸들러
  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (!e.target.value) {
      setSearchActive(false);
    }
  };

  // Enter 키로 검색 실행
  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchIconClick();
    }
  };

  // 예약 버튼 클릭 시 모달 열기
  const handleReserveClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  // 예약 모달 확인 버튼 핸들러
  const handleModalConfirm = () => {
    setModalOpen(false);
    searchInputRef.current && searchInputRef.current.focus();
  };

  // 예약 모달 취소 버튼 핸들러
  const handleModalCancel = () => setModalOpen(false);

  return (
    <header>
      <div className="inner">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="TravelON 로고" loading="lazy" />
          </a>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="떠나고 싶은 여행지를 입력해 주세요! ex)강릉"
            id="searchInput"
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
            style={{ color: searchActive ? "#191919" : undefined }}
            ref={searchInputRef}
          />
          <div
            className={`search-icon${searchActive ? " active" : ""}`}
            onClick={handleSearchIconClick}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={searchActive && search.trim() ? faTimes : faSearch}
            />
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#none" id="reserveBtn" onClick={handleReserveClick}>
                <img src={reserveIcon} alt="예약" loading="lazy" />
                <span>예약</span>
              </a>
            </li>
            <li>
              <a href="/jjim">
                <img src={wishlistIcon} alt="찜" loading="lazy" />
                <span>찜</span>
              </a>
            </li>
          </ul>
          <div className="menu" onClick={() => setMenuActive(true)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
      {/* menubar */}
      <div className="menubar" ref={menubarRef} aria-label="카테고리 메뉴">
        <div
          role="button"
          className="close-btn"
          aria-label="카테고리 닫기"
          onClick={() => setMenuActive(false)}
        >
          ✕
        </div>
        <div className="menubar-inner">
          <h2 className="title">카테고리</h2>
          <div className="info">
            <div className="section sale">
              <span>특가 상품</span>
              <ul>
                <li>여름 한정! 바다 앞 감성 숙소 50% 할인</li>
                <li>2박 이상 예약 시, 1박 무료 이벤트</li>
                <li>평일 전용! 조식 포함 힐링 숙소 1만원 할인</li>
                <li>친구랑 같이 가면 추가 10% 할인 쿠폰 제공</li>
                <li>첫 예약 고객 전용 웰컴 기프트 + 숙박 할인</li>
              </ul>
            </div>
            <div className="section recommend">
              <span>추천 숙소</span>
              <ul>
                <li>빽패커스하우스 (홍대)</li>
                <li>게스트하우스 1984 (부산)</li>
                <li>어반모던 스테이 (서울 종로)</li>
                <li>마운틴 하우스 (제천)</li>
                <li>달빛완용 게스트하우스 (경주)</li>
              </ul>
            </div>
            <div className="section joy">
              <span>주변 즐길거리</span>
              <ul className="tags">
                <li>인생샷 사진 투어</li>
                <li>패밀리 바비큐장</li>
                <li>야경 명소 산책</li>
                <li>플리마켓 탐방</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirm Modal */}
      {modalOpen && (
        <div id="confirmModal" className="show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">예약 확인</h5>
              </div>
              <div className="modal-body">
                <p>
                  예약을 하시려면 숙소를 선택해야 합니다. <br />
                  메인 페이지에서 검색을 진행해 주세요.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  id="cancelBtn"
                  onClick={handleModalCancel}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  id="confirmBtn"
                  onClick={handleModalConfirm}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
