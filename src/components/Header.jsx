import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "@/css/common.css";

import logo from "@/assets/image/logo.png";
import reserveIcon from "@/assets/image/reserve.png"; // '로그인/예약' 아이콘으로 사용
import wishlistIcon from "@/assets/image/wishlist.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

import LoginRegisterModal from "./LoginRegisterModal";

export default function Header() {
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 사용자 로그인 상태 (Header에서 관리)
  const [loginModalOpen, setLoginModalOpen] = useState(false); // 로그인/회원가입 모달 활성화 상태

  const searchInputRef = useRef(null);
  const menubarRef = useRef(null);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 세션 스토리지에서 로그인 상태 확인
  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedInUser");
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  // 메뉴바 애니메이션 관련
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
      menubar.style.display = "flex"; // 애니메이션 시작 전 'flex'로 설정
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
          menubar.style.display = "none"; // 애니메이션 완료 후 'none'으로 숨김
        },
      });
    }
  }, [menuActive]);

  // URL 쿼리 파싱
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedQuery = params.get("query");
    if (savedQuery) {
      setSearch(savedQuery);
      setSearchActive(true);
    }
  }, []);

  // 검색 기능 관련 핸들러
  const handleSearchIconClick = () => {
    if (searchActive) {
      setSearch("");
      setSearchActive(false);
    } else if (search.trim()) {
      navigate(`/searchpage?query=${encodeURIComponent(search)}`);
      setSearchActive(true);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (!e.target.value) {
      setSearchActive(false);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchIconClick();
    }
  };

  // '로그인'/'예약' 버튼 클릭 핸들러
  const handleLoginOrReserveClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      const userConfirmed = window.confirm("숙소를 바로 보시겠습니까?");
      if (userConfirmed) {
        navigate("/SearchPage");
      } else {
        navigate("/");
      }
    } else {
      setLoginModalOpen(true);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    setIsLoggedIn(false); // 로그인 상태 업데이트
    alert("로그아웃 되었습니다.");
  };

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
            placeholder="ex) 강릉"
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
              {isLoggedIn ? (
                // 로그인 상태일 때 '예약' 버튼
                <a href="#none" onClick={handleLoginOrReserveClick}>
                  <img src={reserveIcon} alt="예약" loading="lazy" />
                  <span>예약</span>
                </a>
              ) : (
                // 비로그인 상태일 때 '로그인' 버튼
                <a href="#none" onClick={handleLoginOrReserveClick}>
                  <img src={reserveIcon} alt="로그인" loading="lazy" />
                  <span>로그인</span>
                </a>
              )}
            </li>
            <li>
              <a href="/jjim">
                <img src={wishlistIcon} alt="찜" loading="lazy" />
                <span>찜</span>
              </a>
            </li>
            {isLoggedIn && ( // 로그인 상태일 때만 '로그아웃' 버튼 표시
              <li className="logout">
                <a href="#none" onClick={handleLogout}>
                  <span>로그아웃</span>
                </a>
              </li>
            )}
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

      {/* LoginRegisterModal 컴포넌트 사용 */}
      <LoginRegisterModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        setIsLoggedIn={setIsLoggedIn}
      />
    </header>
  );
}
