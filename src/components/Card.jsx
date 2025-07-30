import { useState, useEffect } from "react";
import "@/css/searchpage.css";
import "@/css/common.css";
import star from "@/assets/image/star.webp";
import heartSel from "@/assets/image/heart_sel.webp";
import heartNon from "@/assets/image/heart_non.webp";
import locationIcon from "@/assets/image/location.webp";

function Card({ card, onHeartClick, onCardClick }) {
  const [isJjimmed, setIsJjimmed] = useState(false);

  useEffect(() => {
    const jjimCards = JSON.parse(localStorage.getItem("jjimCards") || "[]");
    setIsJjimmed(jjimCards.some((item) => item.title === card.title));
  }, [card.title]);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onHeartClick(card, !isJjimmed);
    setIsJjimmed(!isJjimmed);
  };

  const handleCardClick = () => {
    onCardClick(card);
  };

  const priceHtml = card.soldOut ? (
    <p className="sold-out">예약마감</p>
  ) : (
    <p className="cardprice">
      <del className="original-price">{card.originalPrice}</del>
      <span className="discount-price">{card.discountPrice}</span>
    </p>
  );

  return (
    <div className="card" onClick={handleCardClick}>
      {" "}
      <div className="card-img-wrapper">
        <a href={`/detail/${card.title}`} onClick={(e) => e.stopPropagation()}>
          <img
            src={require(`../assets/image/${card.image}`)}
            className="card-img"
            alt="썸네일"
            loading="lazy"
          />
        </a>
      </div>
      <div className="card-body">
        <div className="card-head">
          <h5 className="card-title">{card.title}</h5>
          <div className="rating-heart">
            <div className="rating">
              <img src={star} alt="별점" className="star-icon" />
              <span className="rating-score">{card.rating}</span>
            </div>
            <button className="heart-btn" onClick={handleHeartClick}>
              <img
                className="heart-img"
                src={isJjimmed ? heartSel : heartNon}
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
            src={locationIcon}
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
