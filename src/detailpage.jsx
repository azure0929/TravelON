import React, { useEffect, useState, useCallback } from "react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";

import "@/css/common.css";
import "@/css/detailpage.css";

// image
import singleroom from "@/assets/image/singleroom.webp";
import doubleroom from "@/assets/image/doubleroom.webp";
import optionroom from "@/assets/image/optionroom.webp";
import detailImage1 from "@/assets/image/detailimage1.webp";
import detailImage2 from "@/assets/image/detailimage2.webp";
import detailImage3 from "@/assets/image/detailimage3.webp";
import locationIcon from "@/assets/image/location.webp";
import heartNonIcon from "@/assets/image/heart_non.webp";
import heartSelIcon from "@/assets/image/heart_sel.webp";
import personIcon from "@/assets/image/person.png";
import bedIcon from "@/assets/image/bed.png";

import cardData from "@/data/cardData.json";
import roomCategoriesData from "@/data/roomCategories.json";
import reviewData from "@/data/reviewData.json";

import ReserveModal from "@/modal/reservemodal";
import CardModal from "@/modal/cardmodal";
import TotalModal from "@/modal/totalmodal";

SwiperCore.use([Navigation, Pagination]);

const imageMap = {
  "singleroom.webp": singleroom,
  "doubleroom.webp": doubleroom,
  "optionroom.webp": optionroom,
};

const DetailPage = () => {
  // 각 모달의 열림/닫힘 상태를 별도로 관리합니다.
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false); // 예약 폼 모달
  const [isCardModalOpen, setIsCardModalOpen] = useState(false); // 카드 결제 모달
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false); // 최종 확인 모달

  const [selectedRoomTitle, setSelectedRoomTitle] = useState(""); // 현재 선택된 방 제목 (ReserveModal로 전달)
  const [currentCard, setCurrentCard] = useState(null); // 현재 게스트하우스 데이터 (ReserveModal로 전달)

  const [baseOriginalPrice, setBaseOriginalPrice] = useState(0);
  const [baseDiscountPrice, setBaseDiscountPrice] = useState(0);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <span key={i} className="star full">
            ★
          </span>
        );
      } else if (i - rating < 1) {
        stars.push(
          <span key={i} className="star half">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const encodedTitleFromUrl = pathSegments[pathSegments.length - 1];

    if (encodedTitleFromUrl) {
      const decodedTitle = decodeURIComponent(encodedTitleFromUrl);

      const foundCard = cardData.find((card) => card.title === decodedTitle);

      if (foundCard) {
        setCurrentCard(foundCard);
        const original = parseInt(
          (foundCard.originalPrice || "0").replace(/[^0-9]/g, ""),
          10
        );
        const discount = parseInt(
          (foundCard.discountPrice || "0").replace(/[^0-9]/g, ""),
          10
        );
        setBaseOriginalPrice(original);
        setBaseDiscountPrice(discount);
      } else {
        console.error("Card not found for title:", decodedTitle);
      }
    }
  }, []);

  const restoreHeartButtonsForDetail = useCallback(() => {
    if (!currentCard) return;

    const jjimCards = JSON.parse(localStorage.getItem("jjimCards") || "[]");
    const currentTitle = currentCard.title;

    const guesthouse = jjimCards.find((item) => item.title === currentTitle);
    if (!guesthouse || !guesthouse.rooms) return;

    document.querySelectorAll(".room-card").forEach((roomCardEl) => {
      const roomType = roomCardEl
        .querySelector(".room-title")
        ?.textContent.trim();
      const originalPrice = roomCardEl
        .querySelector(".original-price")
        ?.textContent.trim();
      const heartImg = roomCardEl.querySelector(".heart-img");

      if (roomType && heartImg) {
        const isRoomJjimmed = guesthouse.rooms.some(
          (room) =>
            room.roomType === roomType && room.originalPrice === originalPrice
        );

        if (isRoomJjimmed) {
          heartImg.classList.add("heart-active");
          heartImg.src = heartSelIcon;
        } else {
          heartImg.classList.remove("heart-active");
          heartImg.src = heartNonIcon;
        }
      }
    });
  }, [currentCard]);

  useEffect(() => {
    restoreHeartButtonsForDetail();
  }, [restoreHeartButtonsForDetail]);

  // ReserveModal을 열기 위한 핸들러
  const handleOpenReserveModal = (roomTitle) => {
    setSelectedRoomTitle(roomTitle); // 클릭한 방의 제목 설정
    setIsReserveModalOpen(true); // ReserveModal 열기
  };

  // ReserveModal을 닫기 위한 핸들러
  const handleCloseReserveModal = () => {
    setIsReserveModalOpen(false); // ReserveModal 닫기
    setSelectedRoomTitle(""); // 선택된 방 제목 초기화
  };

  // ReserveModal에서 예약 제출이 완료되었을 때 호출될 핸들러 (다음 모달인 CardModal 열기)
  const handleSubmitReservationFromReserveModal = (reservationData) => {
    setIsReserveModalOpen(false); // ReserveModal 닫기
    setIsCardModalOpen(true); // CardModal 열기
  };

  // CardModal에서 결제가 성공했을 때 호출될 핸들러 (다음 모달인 TotalModal 열기)
  const handlePaymentSuccessFromCardModal = () => {
    setIsCardModalOpen(false); // CardModal 닫기
    setIsTotalModalOpen(true); // TotalModal 열기
  };

  // TotalModal을 닫기 위한 핸들러
  const handleCloseTotalModal = () => {
    setIsTotalModalOpen(false); // TotalModal 닫기
  };

  const handleHeartToggle = (e, room, roomImage) => {
    e.preventDefault();
    e.stopPropagation();

    const heartImg = e.currentTarget.querySelector(".heart-img");
    const isJjimmed = heartImg.src.includes("heart_sel.webp");

    let jjimCards = JSON.parse(localStorage.getItem("jjimCards") || "[]");

    const currentTitle = currentCard.title;
    let existingGuesthouse = jjimCards.find(
      (item) => item.title === currentTitle
    );

    if (!existingGuesthouse) {
      existingGuesthouse = {
        title: currentTitle,
        image: currentCard.image,
        location: currentCard.location,
        rooms: [],
      };
      jjimCards.push(existingGuesthouse);
    }

    const roomObj = {
      roomImage: roomImage,
      roomType: room.title,
      originalPrice: room.originalPrice,
      discountPrice: room.discountPrice,
      limit: room.limit,
      beds: room.beds,
    };

    if (isJjimmed) {
      existingGuesthouse.rooms = existingGuesthouse.rooms.filter(
        (r) =>
          !(
            r.roomType === roomObj.roomType &&
            r.originalPrice === roomObj.originalPrice
          )
      );
      heartImg.src = heartNonIcon;
    } else {
      existingGuesthouse.rooms.push(roomObj);
      heartImg.src = heartSelIcon;
    }

    if (existingGuesthouse.rooms.length === 0) {
      jjimCards = jjimCards.filter((item) => item.title !== currentTitle);
    }

    localStorage.setItem("jjimCards", JSON.stringify(jjimCards));
  };

  const formatPrice = (num) => num.toLocaleString("ko-KR");

  if (!currentCard) {
    return (
      <>
        <Header />
        <main>
          <div className="detailpage-wrapper">
            <p>게스트하우스 정보를 불러오는 중이거나 찾을 수 없습니다.</p>
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
                src={locationIcon}
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
              slidesPerView={2.5}
              navigation={true}
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
              }}
            >
              {reviewData.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="review-card">
                    <div className="review-user">{review.user}</div>
                    <div className="review-info">
                      <div className="date-stars">
                        <div className="review-date">{review.date}</div>
                        <div className="review-stars">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <div className="review-content">
                        <div className="review-text">{review.text}</div>
                        <div className="review-thumb">
                          <img
                            src={require(`./assets/image/${review.image}`)}
                            alt="리뷰 썸네일"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <h2 className="room-select">객실 선택</h2>
          {roomCategoriesData.map((category, categoryIndex) => (
            <div className="room-category" key={category.type}>
              <h3 className="room-type-title">{category.type}</h3>
              {category.rooms.map((room) => {
                const priceGap = categoryIndex * 10000;
                const finalOriginal =
                  baseOriginalPrice > 0 ? baseOriginalPrice + priceGap : null;
                const finalDiscount =
                  baseDiscountPrice > 0 ? baseDiscountPrice + priceGap : null;

                const isSoldOut =
                  baseDiscountPrice === 0 || finalDiscount === null;

                const roomImage = imageMap[category.image];

                return (
                  <div className="room-card" key={room.id}>
                    <img
                      src={roomImage}
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
                            <img
                              src={personIcon}
                              className="icon"
                              alt="인원 아이콘"
                            />{" "}
                            <span className="room-limit">{room.limit}</span>
                          </div>
                          <div className="room-beds">
                            <img
                              src={bedIcon}
                              className="icon"
                              alt="침대 아이콘"
                            />{" "}
                            <span className="room-bed">{room.beds}</span>
                          </div>
                        </div>
                      </div>
                      <div className="room-side">
                        <button
                          className="heart-btn"
                          onClick={(e) => handleHeartToggle(e, room, roomImage)}
                        >
                          <img
                            src={heartNonIcon}
                            alt="찜하기"
                            className="heart-img"
                          />
                        </button>
                        <div className="room-price">
                          {isSoldOut ? (
                            <p className="sold-out">예약마감</p>
                          ) : (
                            <>
                              {finalOriginal &&
                                finalOriginal > finalDiscount && (
                                  <span className="original-price">
                                    {formatPrice(finalOriginal)}
                                  </span>
                                )}
                              <span className="discount-price">
                                {finalDiscount
                                  ? formatPrice(finalDiscount)
                                  : ""}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="room-actions">
                          <button
                            className={`reserve-btn ${
                              isSoldOut ? "disabled-btn" : ""
                            }`}
                            onClick={() => handleOpenReserveModal(room.title)}
                            disabled={isSoldOut}
                          >
                            {isSoldOut ? "예약 마감" : "예약하기"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ReserveModal 렌더링 */}
        {isReserveModalOpen && (
          <ReserveModal
            isOpen={isReserveModalOpen}
            onClose={handleCloseReserveModal}
            onSubmitReservation={handleSubmitReservationFromReserveModal}
            selectedRoomTitleFromParent={selectedRoomTitle}
            currentCard={currentCard}
          />
        )}

        {/* CardModal 렌더링 */}
        {isCardModalOpen && (
          <CardModal
            isOpen={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)} // CardModal 닫기
            onPaymentSuccess={handlePaymentSuccessFromCardModal} // 결제 성공 시 TotalModal 열기
          />
        )}

        {/* TotalModal 렌더링 */}
        {isTotalModalOpen && (
          <TotalModal
            isOpen={isTotalModalOpen}
            onClose={handleCloseTotalModal}
          />
        )}
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
};

export default DetailPage;
