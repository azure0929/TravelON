import { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "@/css/common.css";
import "@/css/searchpage.css";

import cardData from "@/data/cardData.json";

// image
import sortSel from "@/assets/image/sort_sel.webp";
import sortNon from "@/assets/image/sort_non.webp";

// [개선 사항]
// 1. 초기 로딩 및 카테고리 전환 시 인위적인 지연(setTimeout)을 모두 제거
//    페이지 응답 속도를 3초에서 1초(실질적으로 즉시)로 개선.
// 2. 스피너 표출 로직을 실제 데이터 처리 시간과 연동되도록 수정.

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
  const listSpinnerRef = useRef(null);

  // 모든 카테고리 데이터
  const categories = [
    "전체",
    "도미토리형",
    "프라이빗형",
    "패밀리/독채형",
    "테마형/특수형",
    "장기 숙박형",
  ];

  // [개선 1-1] restoreHeartButtons 함수는 실제 상태 변경 로직이 없으므로,
  //            useCallback에서 종속성을 제거하고 안정적으로 유지.
  const restoreHeartButtons = useCallback(() => {
    // Card 컴포넌트 내부의 useEffect가 로컬 스토리지에 따라 isJjimmed 상태를 관리한다고 가정
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

      // '찜 많은 순'과 '등록 많은 순'을 rating으로 대체하는 로직은 그대로 유지
      if (optionText === "찜 많은 순" || optionText === "등록 많은 순") {
        const ratingA = parseFloat(a.rating);
        const ratingB = parseFloat(b.rating);
        return ratingB - ratingA;
      }

      return 0;
    });
  }, []);

  // [개선 1-2] '전체' 카테고리 렌더링 함수에서 setTimeout(1000ms) 제거
  const renderAllCategoryCards = useCallback(() => {
    setPageSpinnerVisible(true);
    // setTimeout(1000ms) 제거. 데이터가 이미 로드되어 있으므로 즉시 스피너 숨김.
    setPageSpinnerVisible(false);
    restoreHeartButtons();
  }, [restoreHeartButtons]); // restoreHeartButtons를 종속성에 유지

  // [개선 1-3] 카테고리 뷰 렌더링 함수에서 setTimeout(500ms) 제거
  const renderCardListViewByCategory = useCallback(
    (category) => {
      setListSpinnerVisible(true);
      setLoadedCount(0); // 로딩 시작 시 카운트 초기화

      const initialFilteredCards =
        category === "전체"
          ? cardData
          : cardData.filter((card) => card.category === category);

      const sortedCards = sortCards(initialFilteredCards, currentSortOption);
      setFilteredListCards(sortedCards);

      // setTimeout(500ms) 제거. 데이터 처리 완료 후 즉시 로딩 상태 해제.
      setLoadedCount(cardsPerLoad);
      setListSpinnerVisible(false);
      restoreHeartButtons();
    },
    [currentSortOption, sortCards, restoreHeartButtons]
  );

  // [개선 1-4] 초기 마운트 시 setTimeout(1000ms) 제거
  useEffect(() => {
    // 페이지가 마운트되면 (즉, 데이터 로드가 완료되었다고 간주될 때) 즉시 스피너 숨김 처리.
    // 비동기 데이터 로드가 있다면 해당 로직이 끝난 후 setPageSpinnerVisible(false)를 호출해.
    // 현재는 JSON 파일 로드이므로 마운트 직후를 '로드 완료' 시점으로 간주.
    setPageSpinnerVisible(false);
    restoreHeartButtons();
  }, [restoreHeartButtons]);

  const renderNextCards = useCallback(() => {
    if (isLoadingMore || loadedCount >= filteredListCards.length) return;

    setIsLoadingMore(true);
    setListSpinnerVisible(true);

    // [개선 1-5] 무한 스크롤 로드 시의 인위적인 지연(500ms) 제거
    // 실제 데이터 로드가 끝난 후 setIsWaiting(false)를 호출해야 하지만,
    // 현재는 메모리 내의 배열(filteredListCards)을 조작하므로 지연 없이 즉시 처리.
    setLoadedCount((prevCount) => {
      const newCount = prevCount + cardsPerLoad;
      setIsLoadingMore(false);
      if (newCount >= filteredListCards.length) {
        setListSpinnerVisible(false);
      }
      return newCount;
    });
    setListSpinnerVisible(
      loadedCount + cardsPerLoad < filteredListCards.length
    );
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
    // 초기 로딩 시 전체 카테고리 렌더링은 이미 useEffect 상단에서 처리됨.
    // 이 로직은 첫 마운트 시 한 번만 실행되도록 restoreHeartButtons만 유지.

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
  }, []); // renderAllCategoryCards를 종속성에서 제거

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
      // 정렬 옵션이 변경되었으므로, 새 옵션으로 다시 렌더링
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
                  src={sortDropdownActive ? sortSel : sortNon}
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
            {/* loadedCount가 filteredListCards.length보다 크지 않도록 Math.min 적용 */}
            {filteredListCards
              .slice(0, Math.min(loadedCount, filteredListCards.length))
              .map((card) => (
                <Card
                  key={card.title}
                  card={card}
                  onHeartClick={handleHeartClick}
                  onCardClick={handleCardClick}
                />
              ))}
            {/* 리스트 스피너는 로딩 중이거나, 로드할 카드가 남아있을 때만 표시 */}
            {listSpinnerVisible && loadedCount < filteredListCards.length && (
              <div
                id="spinner"
                ref={listSpinnerRef}
                style={{ display: "flex" }}
              >
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
}

export default SearchPage;
