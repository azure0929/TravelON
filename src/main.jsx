import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/css/common.css";
import "@/css/main.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";
import popularData from "@/data/popularData.json";

// image
import event01 from "@/image/event01.webp";
import event02 from "@/image/event02.webp";
import event03 from "@/image/event03.webp";
import video01 from "@/image/video01.mp4";
import video02 from "@/image/video02.mp4";
import benefit01 from "@/image/benefit01.png";
import benefit02 from "@/image/benefit02.webp";
import benefit03 from "@/image/benefit03.webp";
import benefit04 from "@/image/benefit04.png";
import arrow from "@/image/main-arrow.png";
import weeklysale01 from "@/image/weeklysale01.webp";
import weeklysale02 from "@/image/weeklysale02.webp";
import weeklysale03 from "@/image/weeklysale03.webp";
import weeklyrecommend01 from "@/image/weeklyrecommend01.jpg";
import weeklyrecommend02 from "@/image/weeklyrecommend02.jpg";
import weeklyrecommend03 from "@/image/weeklyrecommend03.jpg";

export default function Main() {
  const [popularTab, setPopularTab] = useState("seoul");

  useEffect(() => {
    const scrollBtn = document.getElementById("scrollTopBtn");
    const handleScroll = () => {
      if (window.scrollY > 200) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    };
    window.addEventListener("scroll", handleScroll);
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="wrap">
      <Header />
      <main>
        {/* section: intro */}
        <section className="intro">
          <div className="inner">
            <div className="title">
              <span>진짜_최종.여행</span>
              <span>최대 70% 할인가로 FLEX!</span>
            </div>
            <div className="intro-bg" aria-label="여행 메인 배경 이미지"></div>
          </div>
        </section>
        {/* section: 공지사항 */}
        <section className="notice" id="notice" aria-label="공지사항">
          <div className="inner">
            <a href="#none" aria-label="공지사항 상세보기">
              <span className="title">공지</span>
              <span>
                6월 25일(화)까지 조기예약 시 최대 70% 할인 혜택을 드립니다!
              </span>
            </a>
          </div>
        </section>
        {/* section: event */}
        <section className="event" aria-label="이벤트">
          <div className="inner">
            <h1 className="title">이벤트</h1>
            <div className="content">
              <div className="main">
                <img src={event01} alt="이벤트-01" loading="lazy" />
                <div className="info">
                  <div>
                    <span>친구, 연인과 함께라면</span>
                    <span>선착순 30% 할인받자!</span>
                  </div>
                  <span>단, 7월 말까지</span>
                </div>
              </div>
              <div className="event-lists">
                <Swiper
                  className="event-wrap"
                  slidesPerView={2}
                  loop={true}
                  spaceBetween={20}
                  pagination={{
                    type: "progressbar",
                    el: ".event-progressbar",
                  }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  modules={[Autoplay, Pagination]}
                >
                  <SwiperSlide className="event-list">
                    <div className="photo">
                      <a href="#none">
                        <img src={event02} alt="이벤트-02" loading="lazy" />
                      </a>
                    </div>
                    <div className="info">
                      <div className="info-detail">
                        <span>TRAVLEON과</span>
                        <span>함께 떠나는</span>
                      </div>
                      <span>서울 근처 50% 할인</span>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="event-list">
                    <div className="photo">
                      <a href="#none">
                        <img src={event03} alt="이벤트-03" loading="lazy" />
                      </a>
                    </div>
                    <div className="info">
                      <div className="info-detail">
                        <span>2만원 즉시할인</span>
                        <span>가족 동반 시 x2!</span>
                      </div>
                      <span>국민카드로 결제하기</span>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="event-list">
                    <div className="photo">
                      <a href="#none">
                        <img src={event02} alt="이벤트-02" loading="lazy" />
                      </a>
                    </div>
                    <div className="info">
                      <div className="info-detail">
                        <span>TRAVLEON과</span>
                        <span>함께 떠나는</span>
                      </div>
                      <span>서울 근처 50% 할인</span>
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div
                  className="swiper-pagination event-progressbar"
                  aria-label="이벤트 진행바"
                ></div>
              </div>
            </div>
          </div>
        </section>
        {/* section: 놀라운 혜택! */}
        <section className="benefit" aria-label="혜택 안내">
          <div className="inner">
            <h2 className="title">놀라운 혜택!</h2>
            <div className="content">
              <ul>
                <li className="offer-card">
                  <div>
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      id="bg-video"
                      preload="none"
                    >
                      <source src={video01} type="video/mp4" />
                    </video>
                    <img
                      src={benefit01}
                      alt="도심 호캉스 이미지"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="info">
                    도심 호캉스! <br />
                    여름 한정 <br />
                    최대 반값!
                  </h3>
                  <div className="link">
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <img src={arrow} alt="arrow" loading="lazy" />
                    </button>
                  </div>
                </li>
                <li className="offer-card">
                  <img src={benefit02} alt="주말 특가 이미지" loading="lazy" />
                  <h3 className="info">
                    주말 특가! <br />
                    인기 숙소 단 2일간 <br />
                    40% 할인!
                  </h3>
                  <div className="link">
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <img src={arrow} alt="arrow" loading="lazy" />
                    </button>
                  </div>
                </li>
                <li className="offer-card">
                  <img
                    src={benefit03}
                    alt="얼리버드 특전 이미지"
                    loading="lazy"
                  />
                  <h3 className="info">
                    지금 예약하면 <br />
                    얼리버드 <br />
                    특전 제공!
                  </h3>
                  <div className="link">
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <img src={arrow} alt="arrow" loading="lazy" />
                    </button>
                  </div>
                </li>
                <li className="offer-card">
                  <div>
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      id="bg-video"
                      preload="auto"
                    >
                      <source src={video02} type="video/mp4" />
                    </video>
                    <img
                      src={benefit04}
                      alt="바다 근처 숙소 이미지"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="info">
                    무더위 탈출! <br />
                    바다 근처 숙소 <br />
                    최대 1박 무료!
                  </h3>
                  <div className="link">
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <img src={arrow} alt="arrow" loading="lazy" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* section: 이번 주 특가 숙소 */}
        <section className="weeklysale" aria-label="이번 주 특가 숙소">
          <div className="inner">
            <h2 className="title">이번 주 특가 숙소</h2>
            <div className="lists">
              <Swiper
                modules={[Navigation]}
                className="weeklysaleSwiper content"
                slidesPerView={3}
                navigation={true}
                spaceBetween={30}
              >
                <SwiperSlide className="list">
                  <div className="photo">
                    <a href="#none">
                      <img
                        src={weeklysale01}
                        alt="코코아 게스트하우스"
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className="info">
                    <span>코코아 게스트하우스</span>
                    <div className="detail">
                      <span className="saleprice">70%</span>
                      <span>35,000원~</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="list">
                  <div className="photo">
                    <a href="#none">
                      <img
                        src={weeklysale02}
                        alt="해운대 Y 게스트하우스"
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className="info">
                    <span>해운대 Y 게스트하우스</span>
                    <div className="detail">
                      <span className="saleprice">55%</span>
                      <span>25,000원~</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="list">
                  <div className="photo">
                    <a href="#none">
                      <img
                        src={weeklysale03}
                        alt="ABC 홈스테이"
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className="info">
                    <span>ABC 홈스테이</span>
                    <div className="detail">
                      <span className="saleprice">35%</span>
                      <span>35,000원</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="list">
                  <div className="photo">
                    <a href="#none">
                      <img
                        src={weeklysale01}
                        alt="코코아 게스트하우스"
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className="info">
                    <span>코코아 게스트하우스</span>
                    <div className="detail">
                      <span className="saleprice">70%</span>
                      <span>35,000원~</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="list">
                  <div className="photo">
                    <a href="#none">
                      <img
                        src={weeklysale02}
                        alt="해운대 Y 게스트하우스"
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className="info">
                    <span>해운대 Y 게스트하우스</span>
                    <div className="detail">
                      <span className="saleprice">55%</span>
                      <span>25,000원~</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="list">
                  <div className="photo">
                    <a href="#none">
                      <img
                        src={weeklysale03}
                        alt="ABC 홈스테이"
                        loading="lazy"
                      />
                    </a>
                  </div>
                  <div className="info">
                    <span>ABC 홈스테이</span>
                    <div className="detail">
                      <span className="saleprice">35%</span>
                      <span>35,000원</span>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </section>
        {/* section: 이번 달 추천 숙소 */}
        <section className="weeklyrecommend" aria-label="이번 달 추천 숙소">
          <div className="inner">
            <h2 className="title">이번 달 추천 숙소</h2>
            <Swiper
              className="weeklyrecommendSwiper content"
              slidesPerView={3}
              navigation={true}
              modules={[Navigation]}
              spaceBetween={30}
            >
              <SwiperSlide className="list">
                <div className="photo">
                  <a href="#none">
                    <img
                      src={weeklyrecommend01}
                      alt="백팩 GH 이태원"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="info">
                  <h3>
                    서울 <br />
                    패밀리/단체형 <br />
                    백팩 GH 이태원
                  </h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="list">
                <div className="photo">
                  <a href="#none">
                    <img
                      src={weeklyrecommend02}
                      alt="인천공항 라인 게스트하우스"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="info">
                  <h3>
                    인천 <br />
                    프라이빗형 <br />
                    인천공항 라인 게스트하우스
                  </h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="list">
                <div className="photo">
                  <a href="#none">
                    <img
                      src={weeklyrecommend03}
                      alt="오게스트"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="info">
                  <h3>
                    부산 <br />
                    테마/특수형 <br />
                    오게스트
                  </h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="list">
                <div className="photo">
                  <a href="#none">
                    <img
                      src={weeklyrecommend01}
                      alt="백팩 GH 이태원"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="info">
                  <h3>
                    서울 <br />
                    패밀리/단체형 <br />
                    백팩 GH 이태원
                  </h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="list">
                <div className="photo">
                  <a href="#none">
                    <img
                      src={weeklyrecommend02}
                      alt="인천공항 라인 게스트하우스"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="info">
                  <h3>
                    인천 <br />
                    프라이빗형 <br />
                    인천공항 라인 게스트하우스
                  </h3>
                </div>
              </SwiperSlide>
              <SwiperSlide className="list">
                <div className="photo">
                  <a href="#none">
                    <img
                      src={weeklyrecommend03}
                      alt="오게스트"
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="info">
                  <h3>
                    부산 <br />
                    테마/특수형 <br />
                    오게스트
                  </h3>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
        {/* section: skip_ad */}
        <section className="skip_ad" aria-label="광고"></section>
        {/* section: 웰컴 쿠폰 */}
        <section className="welcome" aria-label="웰컴 쿠폰 안내">
          <div className="inner">
            <h2 className="title">WELCOM COUPON</h2>
            <div className="content">
              <div className="info">
                <span>
                  지금 가입 시 최대 <span className="sale">~70%</span>
                </span>
                <div className="detail">
                  <p>
                    초특가 세일! 놀라운 특가와 다양한 즐길거리! 역대 최대
                    할인가로 예약하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* section: 많이 찾는 볼거리 */}
        <section className="popular" aria-label="많이 찾는 볼거리">
          <div className="inner">
            <h2 className="title">많이 찾는 볼거리</h2>
            <div className="content">
              <ul className="tabs" role="tablist" aria-label="도시 선택 탭">
                <li
                  className={`tab${popularTab === "seoul" ? " active" : ""}`}
                  data-city="seoul"
                  onClick={() => setPopularTab("seoul")}
                >
                  서울
                </li>
                <li
                  className={`tab${popularTab === "busan" ? " active" : ""}`}
                  data-city="busan"
                  onClick={() => setPopularTab("busan")}
                >
                  부산
                </li>
                <li
                  className={`tab${popularTab === "incheon" ? " active" : ""}`}
                  data-city="incheon"
                  onClick={() => setPopularTab("incheon")}
                >
                  인천
                </li>
              </ul>
              <div>
                <ul className="popularlists" aria-label="인기 명소 리스트">
                  {popularData[popularTab].map((item, i) => (
                    <li key={i} className="list">
                      <div className="photo">
                        <img
                          src={require(`./${item.image}`)}
                          alt={item.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="info">
                        <span>{item.title}</span>
                        <p
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollTop />
    </div>
  );
}
