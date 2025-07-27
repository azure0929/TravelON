import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "@/css/common.css";
import "@/css/searchpage.css";

import cardData from "@/data/cardData.json";

function SearchPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [pageSpinnerVisible, setPageSpinnerVisible] = useState(true);
  const [listSpinnerVisible, setListSpinnerVisible] = useState(false);
  const [sortDropdownActive, setSortDropdownActive] = useState(false);
  const [currentSortOption, setCurrentSortOption] = useState("예약가 높은순");
  const [filteredListCards, setFilteredListCards] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const cardsPerLoad = 6;
  const sortContainerRef = useRef(null);
  const listSpinnerRef = useRef(null); // 무한 스크롤 스피너를 위한 ref

  // 모든 카테고리 데이터
  const categories = [
    "전체",
    "도미토리형",
    "프라이빗형",
    "패밀리/독채형",
    "테마형/특수형",
    "장기 숙박형",
  ];

  useEffect(() => {
    setPageSpinnerVisible(true);
    setTimeout(() => {
      setPageSpinnerVisible(false);
      restoreHeartButtons();
    }, 1000);
  }, []);

  const restoreHeartButtons = useCallback(() => {
    // Card 컴포넌트 내부의 useEffect가 로컬 스토리지에 따라 isJjimmed 상태를 관리합니다.
  }, []);

  const sortCards = useCallback((cards, optionText) => {
    return [...cards].sort((a, b) => {
      const getPrice = (card) => {
        if (card.soldOut) return null;
        const priceStr = card.discountPrice || card.originalPrice;
        if (!priceStr) return null;
        return parseInt(priceStr.replace(/,/g, ""));
      };

      const priceA = getPrice(a);
      const priceB = getPrice(b);

      if (optionText === "예약가 낮은순") {
        if (priceA === null) return 1;
        if (priceB === null) return -1;
        return priceA - priceB;
      }

      if (optionText === "예약가 높은순") {
        if (priceA === null) return 1;
        if (priceB === null) return -1;
        return priceB - priceA;
      }

      if (optionText === "찜 많은 순" || optionText === "등록 많은 순") {
        const ratingA = parseFloat(a.rating);
        const ratingB = parseFloat(b.rating);
        return ratingB - ratingA;
      }

      return 0;
    });
  }, []);

  const renderAllCategoryCards = useCallback(() => {
    setPageSpinnerVisible(true);
    setTimeout(() => {
      setPageSpinnerVisible(false);
      restoreHeartButtons();
    }, 1000);
  }, [restoreHeartButtons]);

  const renderCardListViewByCategory = useCallback(
    (category) => {
      setListSpinnerVisible(true);
      setLoadedCount(0);

      const initialFilteredCards =
        category === "전체"
          ? cardData
          : cardData.filter((card) => card.category === category);

      const sortedCards = sortCards(initialFilteredCards, currentSortOption);
      setFilteredListCards(sortedCards);

      setTimeout(() => {
        setLoadedCount(cardsPerLoad);
        setListSpinnerVisible(false);
        restoreHeartButtons();
      }, 500);
    },
    [currentSortOption, sortCards, restoreHeartButtons]
  );

  const renderNextCards = useCallback(() => {
    if (isLoadingMore || loadedCount >= filteredListCards.length) return;

    setIsLoadingMore(true);
    setListSpinnerVisible(true);

    setTimeout(() => {
      setLoadedCount((prevCount) => {
        const newCount = prevCount + cardsPerLoad;
        setIsLoadingMore(false);
        if (newCount >= filteredListCards.length) {
          setListSpinnerVisible(false);
        }
        return newCount;
      });
    }, 500);
  }, [isLoadingMore, loadedCount, filteredListCards.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          activeCategory !== "전체" &&
          !isLoadingMore
        ) {
          renderNextCards();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (listSpinnerRef.current && activeCategory !== "전체") {
      observer.observe(listSpinnerRef.current);
    }

    return () => {
      if (listSpinnerRef.current) {
        observer.unobserve(listSpinnerRef.current);
      }
    };
  }, [activeCategory, isLoadingMore, renderNextCards]);

  useEffect(() => {
    renderAllCategoryCards();

    const handleClickOutside = (event) => {
      if (
        sortContainerRef.current &&
        !sortContainerRef.current.contains(event.target)
      ) {
        setSortDropdownActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [renderAllCategoryCards]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSortDropdownActive(false);
    if (category === "전체") {
      renderAllCategoryCards();
    } else {
      renderCardListViewByCategory(category);
    }
  };

  const handleSortOptionClick = (option) => {
    setCurrentSortOption(option);
  };

  const handleApplySort = () => {
    setSortDropdownActive(false);
    if (activeCategory !== "전체") {
      renderCardListViewByCategory(activeCategory);
    }
  };

  const handleCardClick = (card) => {
    const url = `detailpage?title=${encodeURIComponent(
      card.title
    )}&image=${encodeURIComponent(card.image)}&location=${encodeURIComponent(
      card.location
    )}&originalPrice=${encodeURIComponent(
      card.originalPrice || ""
    )}&discountPrice=${encodeURIComponent(card.discountPrice || "")}`;
    window.location.href = url;
  };

  const handleHeartClick = (card, isAdding) => {
    let jjimCards = JSON.parse(localStorage.getItem("jjimCards") || "[]");

    if (isAdding) {
      if (!jjimCards.some((item) => item.title === card.title)) {
        jjimCards.push({
          title: card.title,
          image: card.image,
          location: card.location,
        });
      }
    } else {
      jjimCards = jjimCards.filter((item) => item.title !== card.title);
    }
    localStorage.setItem("jjimCards", JSON.stringify(jjimCards));
  };

  return (
    <>
      <Header />
      <main>
        <div className="contain">
          <div className="category-btns">
            <div>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn category-btn btn-sm ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div
              className={`sort-container ${sortDropdownActive ? "active" : ""}`}
              ref={sortContainerRef}
            >
              <button
                className="sort-toggle"
                onClick={() => setSortDropdownActive(!sortDropdownActive)}
              >
                <img
                  className="sort-image"
                  src={
                    sortDropdownActive
                      ? "image/sort_sel.webp"
                      : "image/sort_non.webp"
                  }
                  alt="정렬이미지"
                  loading="lazy"
                />
              </button>
              <ul className="sort-dropdown">
                {[
                  "예약가 높은순",
                  "예약가 낮은순",
                  "등록 많은 순",
                  "찜 많은 순",
                ].map((option) => (
                  <li
                    key={option}
                    className={`sort-option ${
                      currentSortOption === option ? "selected" : ""
                    }`}
                    onClick={() => handleSortOptionClick(option)}
                  >
                    {option}
                  </li>
                ))}
                <li>
                  <button className="btn-apply" onClick={handleApplySort}>
                    적용
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {pageSpinnerVisible && (
            <div id="page-spinner" className="spinner-overlay">
              <div className="spinner"></div>
            </div>
          )}

          <div
            id="search-total"
            style={{ display: activeCategory === "전체" ? "block" : "none" }}
          >
            {categories.slice(1).map((category) => (
              <section key={category} className="category-group">
                <h2 className="gh-title">{category}</h2>
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={20}
                  slidesPerView={3}
                  navigation={true}
                  breakpoints={{
                    320: {
                      slidesPerView: 1.5,
                      spaceBetween: 10,
                      slidesPerGroup: 1,
                    },
                    768: {
                      slidesPerView: 2.5,
                      spaceBetween: 15,
                      slidesPerGroup: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                      slidesPerGroup: 2,
                    },
                  }}
                  className="mySwiper"
                >
                  {cardData
                    .filter((card) => card.category === category)
                    .map((card) => (
                      <SwiperSlide key={card.title}>
                        <Card
                          card={card}
                          onHeartClick={handleHeartClick}
                          onCardClick={handleCardClick}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </section>
            ))}
          </div>

          <div
            id="search-list"
            className="list-wrapper"
            style={{ display: activeCategory !== "전체" ? "flex" : "none" }}
          >
            {filteredListCards.slice(0, loadedCount).map((card) => (
              <Card
                key={card.title}
                card={card}
                onHeartClick={handleHeartClick}
                onCardClick={handleCardClick}
              />
            ))}
            {listSpinnerVisible && (
              <div
                id="spinner"
                ref={listSpinnerRef}
                style={{ display: "flex" }}
              >
                <div className="spinner"></div>
              </div>
            )}
          </div>

          <div
            role="button"
            className="scroll-top"
            id="scrollTopBtn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src="image/scrollTop.png" alt="scroll-top" loading="lazy" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SearchPage;
