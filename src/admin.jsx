import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "@/css/admin.css";
import logo from "@/image/logo.png";
import clientsJson from "@/data/client.json";
import salesJson from "@/data/sales.json";
import reserveJson from "@/data/reserve.json";
import ScrollTop from "@/components/ScrollTop";

// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faUsers,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

// image
import adminProfile from "@/image/admin-profile.png";
import facebook from "@/image/facebook.png";
import instagram from "@/image/instagram.png";
import kakaoIcon from "@/image/kakao.png";
import callIcon from "@/image/call.png";

Chart.register(ChartDataLabels);

export default function Admin() {
  const [activeTab, setActiveTab] = useState(0);
  const [salesData, setSalesData] = useState(salesJson);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [monthlySalesTitle, setMonthlySalesTitle] = useState("월별 매출: 0원");
  const [weeklySalesTitle, setWeeklySalesTitle] = useState("주별 매출: 0원");
  const [clientsData, setClientsData] = useState(
    clientsJson.clients || clientsJson
  );

  const monthlyChartRef = useRef(null);
  const weeklyChartRef = useRef(null);
  const ageChartRef = useRef(null);
  const regionChartRef = useRef(null);
  const roomChartRef = useRef(null);
  const guesthouseChartRef = useRef(null);

  const pastelColors = [
    "rgba(163, 216, 244, 0.8)",
    "rgba(247, 200, 224, 0.8)",
    "rgba(253, 226, 228, 0.8)",
    "rgba(181, 234, 234, 0.8)",
    "rgba(255, 218, 193, 0.8)",
    "rgba(213, 170, 255, 0.8)",
    "rgba(160, 231, 229, 0.8)",
    "rgba(180, 248, 200, 0.8)",
    "rgba(251, 231, 198, 0.8)",
    "rgba(190, 227, 219, 0.8)",
    "rgba(255, 181, 232, 0.8)",
    "rgba(199, 206, 234, 0.8)",
  ];

  const pieChartColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  // 탭 클릭 핸들러
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  // 매출 차트 제목 업데이트
  const updateSalesTitles = (month, week, data) => {
    if (!data) return;
    const monthlyValue = data.monthlySales[month - 1] || 0;
    const weekValue = data.weeklySales[month]?.[week - 1] || 0;
    setMonthlySalesTitle(`월별 매출: ${monthlyValue.toLocaleString()}원`);
    setWeeklySalesTitle(`주별 매출: ${weekValue.toLocaleString()}원`);
  };

  // 주별 매출 차트 렌더링
  const renderWeeklyChart = (month, data) => {
    if (!data) return;
    const weeklyData = data.weeklySales[month] || [];
    const ctx = document.getElementById("weeklySalesChart").getContext("2d");

    if (weeklyChartRef.current) {
      weeklyChartRef.current.destroy();
    }

    weeklyChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: weeklyData.map((_, i) => `${i + 1}주차`),
        datasets: [
          {
            label: `${month}월 주별 매출`,
            data: weeklyData,
            backgroundColor: pastelColors[month - 1],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => val.toLocaleString() + "원",
            },
          },
        },
      },
    });
  };

  // 월별 매출 차트 렌더링
  const renderMonthlyChart = (data) => {
    if (!data) return;
    const ctx = document.getElementById("monthlySalesChart").getContext("2d");

    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }

    monthlyChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...Array(12).keys()].map((i) => `${i + 1}월`),
        datasets: [
          {
            label: "월별 매출",
            data: data.monthlySales,
            backgroundColor: pastelColors,
            borderWidth: 2,
            borderColor: "#2A95A9",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => val.toLocaleString() + "원",
            },
          },
        },
      },
    });
  };

  // 파이 차트 렌더링 함수
  const renderPieChart = (id, labels, data, chartRef) => {
    const ctx = document.getElementById(id).getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: pieChartColors,
            borderWidth: 1,
            borderColor: "#2A95A9",
            hoverOffset: 30,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`,
            },
          },
          datalabels: {
            color: "#fff",
            formatter: function (value) {
              return value + "%";
            },
            font: {
              weight: "medium",
              size: 16,
            },
          },
        },
      },
    });
  };

  // 매출 데이터 초기 렌더링
  useEffect(() => {
    if (salesData) {
      renderMonthlyChart(salesData);
      renderWeeklyChart(currentMonth, salesData);
      updateSalesTitles(currentMonth, selectedWeek, salesData);
    }
  }, [salesData]);

  // 월 선택 변경 시 주별 차트 및 제목 업데이트
  useEffect(() => {
    if (salesData) {
      renderWeeklyChart(currentMonth, salesData);
      updateSalesTitles(currentMonth, selectedWeek, salesData);
    }
  }, [currentMonth, selectedWeek, salesData]);

  // 예약자 비율 차트 렌더링 (reserveJson.statistics 사용)
  useEffect(() => {
    const reservationStatistics = reserveJson.statistics;

    if (!reservationStatistics) {
      console.error("예약 통계 데이터가 없습니다.");
      return;
    }
    renderPieChart(
      "ageChart",
      reservationStatistics.ageGroup.labels,
      reservationStatistics.ageGroup.data.map((val) =>
        (
          (val /
            reservationStatistics.ageGroup.data.reduce((a, b) => a + b, 0)) *
          100
        ).toFixed(1)
      ),
      ageChartRef
    );
    renderPieChart(
      "regionChart",
      reservationStatistics.region.labels,
      reservationStatistics.region.data.map((val) =>
        (
          (val / reservationStatistics.region.data.reduce((a, b) => a + b, 0)) *
          100
        ).toFixed(1)
      ),
      regionChartRef
    );
    renderPieChart(
      "roomChart",
      reservationStatistics.roomType.labels,
      reservationStatistics.roomType.data.map((val) =>
        (
          (val /
            reservationStatistics.roomType.data.reduce((a, b) => a + b, 0)) *
          100
        ).toFixed(1)
      ),
      roomChartRef
    );
    renderPieChart(
      "guesthouseChart",
      reservationStatistics.guesthouseType.labels,
      reservationStatistics.guesthouseType.data.map((val) =>
        (
          (val /
            reservationStatistics.guesthouseType.data.reduce(
              (a, b) => a + b,
              0
            )) *
          100
        ).toFixed(1)
      ),
      guesthouseChartRef
    );

    // 컴포넌트 언마운트 시 차트 인스턴스 정리
    return () => {
      if (monthlyChartRef.current) monthlyChartRef.current.destroy();
      if (weeklyChartRef.current) weeklyChartRef.current.destroy();
      if (ageChartRef.current) ageChartRef.current.destroy();
      if (regionChartRef.current) regionChartRef.current.destroy();
      if (roomChartRef.current) roomChartRef.current.destroy();
      if (guesthouseChartRef.current) guesthouseChartRef.current.destroy();
    };
  }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행

  return (
    <div id="admin-wrapper">
      <header className="admin-header">
        <div className="logo-wrapper">
          <img className="logo" src={logo} alt="TravelON 로고" />
        </div>
      </header>
      <main className="admin-main">
        <section
          id="sales"
          className={`main-section ${activeTab === 0 ? "active" : ""}`}
        >
          <h1 className="title">매출 현황</h1>
          <section className="sales-chart">
            <div className="info">
              <h2 className="chart-title monthly">{monthlySalesTitle}</h2>
              <div className="month-dropdown dropdown">
                <select
                  id="monthSelect"
                  onChange={(e) => {
                    setCurrentMonth(Number(e.target.value));
                    setSelectedWeek(1); // 월 변경 시 주차 초기화
                  }}
                  value={currentMonth}
                >
                  {[...Array(12).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}월
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="chart-container">
              <canvas id="monthlySalesChart"></canvas>
            </div>
          </section>
          <section className="sales-chart">
            <div className="info">
              <h2 className="chart-title weekly">{weeklySalesTitle}</h2>
              <div className="week-dropdown dropdown">
                <select
                  id="weekSelect"
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  value={selectedWeek}
                >
                  {[...Array(4).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}주차
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="chart-container">
              <canvas id="weeklySalesChart"></canvas>
            </div>
          </section>
        </section>

        <section
          id="clients"
          className={`main-section ${activeTab === 1 ? "active" : ""}`}
        >
          <h1 className="title">고객 정보</h1>
          <div className="clients-contents">
            {clientsData.map((client, index) => (
              <div className="clients-card" key={index}>
                <div className="clients-profile">
                  <div className="client-image">
                    <img
                      src={require(`./image/${client.image}`)}
                      alt={`${client.name} 프로필 사진`}
                      loading="lazy"
                    />
                  </div>
                  <div className="client-info">
                    <p className="name">
                      이름: <span>{client.name}</span>
                    </p>
                    <p className="email">
                      이메일: <span>{client.email}</span>
                    </p>
                  </div>
                </div>
                <div className="reservation-info">
                  <span className="reserve-title">예약 정보</span>
                  <div className="reserve-detail">
                    <span>{client.guesthouse}</span>{" "}
                    <p>
                      룸 유형: <span>{client.roomType}</span>
                    </p>
                    <p>
                      숙박 예정일:{" "}
                      <span>
                        {client.checkin} - {client.checkout}
                      </span>{" "}
                    </p>
                    <p>
                      인원 수: <span>{client.people}</span>명{" "}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="loading-spinner" aria-hidden="true"></div>
        </section>

        <section
          id="reserve"
          className={`main-section ${activeTab === 2 ? "active" : ""}`}
        >
          <h1 className="title">예약자 비율</h1>
          <div className="contents">
            <div className="detail">
              <article className="chart">
                <div className="chart-container">
                  <h1>나이별</h1>
                  <canvas id="ageChart"></canvas>
                </div>
              </article>
              <article className="chart">
                <div className="chart-container">
                  <h1>지역별</h1>
                  <canvas id="regionChart"></canvas>
                </div>
              </article>
            </div>
            <div className="detail">
              <article className="chart">
                <div className="chart-container">
                  <h1>룸 유형별</h1>
                  <canvas id="roomChart"></canvas>
                </div>
              </article>
              <article className="chart">
                <div className="chart-container">
                  <h1>게스트하우스 유형별</h1>
                  <canvas id="guesthouseChart"></canvas>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <aside>
        <div className="aside-inner">
          <div className="profile">
            <div className="photo">
              <img src={adminProfile} alt="관리자 프로필" />
            </div>
            <ul className="tabs">
              <li
                className={`tab ${activeTab === 0 ? "active" : ""}`}
                onClick={() => handleTabClick(0)}
              >
                <span className="icon">
                  <i>
                    <FontAwesomeIcon icon={faChartSimple} />
                  </i>
                </span>
                <span>매출 현황</span>
              </li>
              <li
                className={`tab ${activeTab === 1 ? "active" : ""}`}
                onClick={() => handleTabClick(1)}
              >
                <span className="icon">
                  <i>
                    <FontAwesomeIcon icon={faUsers} />
                  </i>
                </span>
                <span>고객 정보</span>
              </li>
              <li
                className={`tab ${activeTab === 2 ? "active" : ""}`}
                onClick={() => handleTabClick(2)}
              >
                <span className="icon">
                  <i>
                    <FontAwesomeIcon icon={faChartPie} />
                  </i>
                </span>
                <span>예약자 비율</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      <footer className="admin-footer">
        <div className="footer-inner">
          <img className="footer-logo" src={logo} alt="TravelON 로고" />
          <div className="info-wrap">
            <div className="info-inner">
              <div className="company-info">
                <p>
                  (주) 게스트하우스 | 대표: 이우진, 함동윤, 양준용 |
                  사업자등록번호: 012-34-56789 | 통신판매업신고:
                  2025-서울시청-0123
                </p>
                <p>
                  메일: kosagh1@gmail.com | 관광사업자 등록번호: 제2025-000012호
                  | 주소: 서울 종로구 창경궁로 254 7층
                </p>
                <p>고객센터: 1644-1234 (오전 9시 - 오후 6시)</p>
              </div>
              <nav className="footer-nav">
                <a href="#none">회사소개</a>
                <a href="#none">이용약관</a>
                <a href="#none">개인정보처리방침</a>
              </nav>
              <div className="social-links">
                <a href="#none" aria-label="Facebook">
                  <img src={facebook} alt="Facebook 아이콘" />
                </a>
                <a href="#none" aria-label="Instagram">
                  <img src={instagram} alt="Instagram 아이콘" />
                </a>
              </div>
            </div>
            <div className="customer-support">
              <h3>고객센터</h3>
              <p>고객문의: 오전 09시 ~ 오후 6시</p>
              <p>카카오톡 문의: 24시간 운영</p>
              <div className="contact-buttons">
                <a href="#none" className="contact-button">
                  <img src={callIcon} alt="전화 아이콘" />
                  <span>1677-1234</span>
                </a>
                <a href="#none" className="contact-button">
                  <img src={kakaoIcon} alt="kakao 아이콘" />
                  <span>카카오 문의</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ScrollTop />
    </div>
  );
}
