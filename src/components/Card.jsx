import { useState, useEffect } from "react";
import "@/css/searchpage.css";
import "@/css/common.css";

function Card({ card, onHeartClick, onCardClick }) {
  const [isJjimmed, setIsJjimmed] = useState(false);

  useEffect(() => {
    const jjimCards = JSON.parse(localStorage.getItem("jjimCards") || "[]");
    setIsJjimmed(jjimCards.some((item) => item.title === card.title));
  }, [card.title]);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onHeartClick(card, !isJjimmed); // 부모 컴포넌트에 상태 변경 알림
    setIsJjimmed(!isJjimmed); // 현재 컴포넌트의 상태 변경
  };

  const handleCardClick = () => {
    onCardClick(card);
  };

  const priceHtml = card.soldOut ? (
    <p className="sold-out">예약마감</p>
  ) : (
    <p className="cardprice">
      {" "}
      {/* 클래스 이름을 .price에서 .cardprice로 변경했네요. CSS도 확인해주세요! */}
      <del className="original-price">{card.originalPrice}</del>
      <span className="discount-price">{card.discountPrice}</span>
    </p>
  );

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card-img-wrapper">
        <img
          src={card.image}
          className="card-img"
          alt="썸네일"
          loading="lazy"
        />
      </div>
      <div className="card-body">
        <div className="card-head">
          <h5 className="card-title">{card.title}</h5>
          <div className="rating-heart">
            <div className="rating">
              <img src="image/star.webp" alt="별점" className="star-icon" />
              <span className="rating-score">{card.rating}</span>
            </div>
            <button className="heart-btn" onClick={handleHeartClick}>
              <img
                className="heart-img"
                src={
                  isJjimmed ? "image/heart_sel.webp" : "image/heart_non.webp"
                }
                alt="하트"
                loading="lazy"
              />
            </button>
          </div>
        </div>
        {priceHtml}
        <div className="location-box">
          <img
            className="location-icon"
            src="image/location.webp"
            alt="위치 이미지"
            loading="lazy"
          />
          <p className="location-text">{card.location}</p>
        </div>
        <p className="features">{card.features}</p>
      </div>
    </div>
  );
}

export default Card;
