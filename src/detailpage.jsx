import { useEffect, useRef, useState } from "react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_green.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

import "./css/common.css";
import "./css/detailpage.css";
import "./css/totalmodal.css";
import "./css/reservemodal.css";

// image
import singleroom from "@/image/singleroom.webp";
import detailImage1 from "@/image/detailimage1.webp";
import detailImage2 from "@/image/detailimage2.webp";
import detailImage3 from "@/image/detailimage3.webp";
import location from "@/image/location.webp";
import heartNonIcon from "@/image/heart_non.webp";
import heartSelIcon from "@/image/heart_sel.webp";
import personIcon from "@/image/person.png";
import bedIcon from "@/image/bed.png";
import scrollTopIcon from "@/image/scrollTop.png";
import modalReserveIcon from "@/image/modal-reserve.png";

import cardData from "@/data/cardData.json";
import roomCategoriesData from "@/data/roomCategories.json";

SwiperCore.use([Navigation, Pagination]);

const DetailPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [currentCard, setCurrentCard] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const scrollTopBtnRef = useRef(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const encodedTitleFromUrl = pathSegments[pathSegments.length - 1];

    if (encodedTitleFromUrl) {
      const decodedTitle = decodeURIComponent(encodedTitleFromUrl);

      const foundCard = cardData.find((card) => card.title === decodedTitle);

      if (foundCard) {
        setCurrentCard(foundCard);
      } else {
        console.error("Card not found for title:", decodedTitle);
      }
    }

    const handleScroll = () => {
      if (scrollTopBtnRef.current) {
        if (window.scrollY > 200) {
          scrollTopBtnRef.current.style.display = "flex";
        } else {
          scrollTopBtnRef.current.style.display = "none";
        }
      }
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("scroll", handleScroll);

    if (scrollTopBtnRef.current) {
      scrollTopBtnRef.current.addEventListener("click", scrollToTop);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTopBtnRef.current) {
        scrollTopBtnRef.removeEventListener("click", scrollToTop);
      }
    };
  }, []);

  const handleReserveClick = (roomTitle) => {
    setSelectedRoom(roomTitle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom("");
    setSelectedDates([]);
  };

  const handleSubmitReservation = () => {
    console.log("예약이 제출되었습니다!");
    console.log("선택된 날짜:", selectedDates);
    setIsModalOpen(false);
  };

  const handleHeartClick = (event) => {
    const heartImg = event.target;
    // Use imported image variables directly for comparison and assignment
    if (heartImg.src !== heartNonIcon) {
      heartImg.src = heartSelIcon;
    }
  };

  const roomCategories = roomCategoriesData;

  if (!currentCard) {
    return (
      <>
        <Header />
        <main>
          <div className="detailpage-wrapper">
            <p>게스트하우스를 찾을 수 없습니다.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="detailpage-wrapper">
          <Swiper
            className="image-slider"
            spaceBetween={10}
            slidesPerView={1}
            navigation
          >
            <SwiperSlide>
              <img
                src={detailImage1}
                alt="이미지1"
                className="slider-img"
                loading="lazy"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={detailImage2}
                alt="이미지2"
                className="slider-img"
                loading="lazy"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={detailImage3}
                alt="이미지3"
                className="slider-img"
                loading="lazy"
              />
            </SwiperSlide>
          </Swiper>

          <div className="location-section">
            <h2 id="detail-title" className="place-name">
              {currentCard.title}
            </h2>
            <p id="detail-location" className="location-text">
              <img
                src={location} // Use imported image
                alt="위치"
                className="icon"
                loading="lazy"
              />
              {currentCard.location}
            </p>
          </div>

          <div className="review-section">
            <Swiper
              className="review-slider"
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
            >
              <SwiperSlide>
                <div className="review-item">
                  <p>
                    "정말 즐거운 시간을 보냈습니다. 깨끗하고 서비스도
                    최고였어요!" - 김철수
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="review-item">
                  <p>
                    "위치도 좋고, 방도 편안해서 다음에도 이용하고 싶어요." -
                    이영희
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          <h2 className="room-select">객실 선택</h2>
          {roomCategories.map((category) => (
            <div className="room-category" key={category.type}>
              <h3 className="room-type-title">{category.type}</h3>
              {category.rooms.map((room) => (
                <div className="room-card" key={room.id}>
                  <img
                    src={singleroom}
                    alt={room.title}
                    className="room-img"
                    loading="lazy"
                  />
                  <div className="room-info">
                    <div className="room-main">
                      <div className="room-header">
                        <div className="room-title">{room.title}</div>
                      </div>
                      <div className="room-desc">{room.desc}</div>
                      <div className="room-meta">
                        <div>
                          <img src={personIcon} className="icon" />{" "}
                          {/* Use imported image */}
                          <span className="room-limit">{room.limit}</span>
                        </div>
                        <div className="room-beds">
                          <img src={bedIcon} className="icon" />{" "}
                          {/* Use imported image */}
                          <span className="room-bed">{room.beds}</span>
                        </div>
                      </div>
                    </div>
                    <div className="room-side">
                      <button className="heart-btn" onClick={handleHeartClick}>
                        <img
                          src={heartNonIcon} // Use imported image
                          alt="찜하기"
                          className="heart-img"
                        />
                      </button>
                      <div className="room-price">
                        <span className="original-price">
                          {room.originalPrice}
                        </span>
                        <span className="discount-price">
                          {room.discountPrice}
                        </span>
                      </div>
                      <div className="room-actions">
                        <button
                          className="reserve-btn"
                          onClick={() => handleReserveClick(room.title)}
                        >
                          예약하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal" id="modalWrap" style={{ display: "block" }}>
            <div
              className="modal-container"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalTitle"
            >
              <div className="modal-header">
                <div className="info-head">
                  <img
                    src={modalReserveIcon} // Use imported image
                    alt="예약 아이콘"
                  />
                  <span id="modalTitle">예약</span>
                </div>
                <button
                  className="modal-close"
                  id="modalCloseBtn"
                  aria-label="닫기"
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="nameInput">이름</label>
                  <input
                    type="text"
                    id="nameInput"
                    placeholder="이름을 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label>게스트하우스</label>
                  <div className="tag-boxes">
                    <span className="tag-box">{currentCard.title}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ageInput">나이</label>
                  <input
                    type="number"
                    id="ageInput"
                    placeholder="나이를 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="roomInput">룸</label>
                  <input
                    type="text"
                    id="roomInput"
                    value={selectedRoom}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emailInput">이메일</label>
                  <input
                    type="email"
                    id="emailInput"
                    placeholder="이메일을 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stayDateInput">숙박 예정일</label>
                  <div className="date-picker-wrapper">
                    <Flatpickr
                      options={{
                        mode: "range",
                        dateFormat: "Y.m.d",
                        locale: Korean,
                        placeholder: "예: 2025.06.01 - 2025.06.04",
                      }}
                      value={selectedDates}
                      onChange={(dates) => {
                        setSelectedDates(dates);
                      }}
                      className="form-control"
                      id="stayDateInput"
                    />
                    <svg
                      className="date-picker-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      role="button"
                      tabIndex="0"
                      aria-label="날짜 선택 열기"
                    >
                      <path d="M7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14
                                            c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-4zm0
                                            16H5V9h14v11z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="passwordInput">비밀번호</label>
                  <input
                    type="password"
                    id="passwordInput"
                    placeholder="비밀번호를 입력하세요."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guestCountInput">인원 수</label>
                  <input type="text" id="guestCountInput" placeholder="ex. 3" />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordConfirmInput">비밀번호 확인</label>
                  <input
                    type="password"
                    id="passwordConfirmInput"
                    placeholder="비밀번호를 다시 입력하세요."
                  />
                </div>
              </div>
              <button className="btn-next" onClick={handleSubmitReservation}>
                다음
              </button>
            </div>
          </div>
        )}

        <div className="card-modal" id="cardModal"></div>
        <div className="total-modal" id="totalModal"></div>
      </main>
      <Footer />
      <div
        role="button"
        className="scroll-top"
        id="scrollTopBtn"
        aria-label="맨 위로 이동"
      >
        <img src={scrollTopIcon} alt="scroll-top" />
      </div>
    </>
  );
};

export default DetailPage;
