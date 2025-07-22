$(() => {
  // 탭 클릭 이벤트
  $('.tab').on('click', function () {
    $('.tab').removeClass('active');
    $(this).addClass('active');

    const index = $(this).index();
    const sectionIds = ['#sales', '#clients', '#reserve'];

    $('.main-section').removeClass('active');
    $(sectionIds[index]).addClass('active');
  });

  // 매출 차트 관련 초기화 
  const pastelColors = [
    'rgba(163, 216, 244, 0.8)', // #A3D8F4 → 연한 하늘색
    'rgba(247, 200, 224, 0.8)', // #F7C8E0 → 연한 분홍
    'rgba(253, 226, 228, 0.8)', // #FDE2E4 → 매우 연한 핑크
    'rgba(181, 234, 234, 0.8)', // #B5EAEA → 민트계열
    'rgba(255, 218, 193, 0.8)', // #FFDAC1 → 베이지핑크
    'rgba(213, 170, 255, 0.8)', // #D5AAFF → 연보라
    'rgba(160, 231, 229, 0.8)', // #A0E7E5 → 청록 계열
    'rgba(180, 248, 200, 0.8)', // #B4F8C8 → 연초록
    'rgba(251, 231, 198, 0.8)', // #FBE7C6 → 연한 베이지
    'rgba(190, 227, 219, 0.8)', // #BEE3DB → 회청색
    'rgba(255, 181, 232, 0.8)', // #FFB5E8 → 진한 분홍
    'rgba(199, 206, 234, 0.8)'  // #C7CEEA → 회보라
  ];

  const monthlyCtx = document.getElementById('monthlySalesChart').getContext('2d');
  const weeklyCtx = document.getElementById('weeklySalesChart').getContext('2d');

  const $monthContainer = $('.month-dropdown');
  const $weekContainer = $('.week-dropdown');

  const $monthSelect = $('<select id="monthSelect"></select>');
  for (let i = 1; i <= 12; i++) {
    $monthSelect.append(`<option value="${i}">${i}월</option>`);
  }
  $monthContainer.append($monthSelect);

  const $weekSelect = $('<select id="weekSelect"></select>');
  for (let i = 1; i <= 4; i++) {
    $weekSelect.append(`<option value="${i}">${i}주차</option>`);
  }
  $weekContainer.append($weekSelect);

  let salesData;
  let monthlyChart;
  let weeklyChart;
  let currentMonth = 1;

  const updateTitles = (month, week) => {
    const monthlyValue = salesData.monthlySales[month - 1];
    const weekValue = salesData.weeklySales[month]?.[week - 1] || 0;
    $('.chart-title.monthly').text(`월별 매출: ${monthlyValue.toLocaleString()}원`);
    $('.chart-title.weekly').text(`주별 매출: ${weekValue.toLocaleString()}원`);
  };

  const renderWeeklyChart = (month) => {
    const weeklyData = salesData.weeklySales[month] || [];
    if (weeklyChart) weeklyChart.destroy();

    weeklyChart = new Chart(weeklyCtx, {
      type: 'bar',
      data: {
        labels: weeklyData.map((_, i) => `${i + 1}주차`),
        datasets: [{
          label: `${month}월 주별 매출`,
          data: weeklyData,
          backgroundColor: pastelColors[month - 1]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: val => val.toLocaleString() + '원'
            }
          }
        }
      }
    });
  };

  const renderMonthlyChart = (data) => {
    monthlyChart = new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels: [...Array(12).keys()].map(i => `${i + 1}월`),
        datasets: [{
          label: '월별 매출',
          data: data.monthlySales,
          backgroundColor: pastelColors,
          borderWidth: 2,
          borderColor: '#2A95A9'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: val => val.toLocaleString() + '원'
            }
          }
        }
      }
    });
  };

  fetch('data/sales.json')
    .then(res => res.json())
    .then(data => {
      salesData = data;

      renderMonthlyChart(data);
      renderWeeklyChart(1);
      updateTitles(1, 1);

      $monthSelect.on('change', function () {
        currentMonth = Number($(this).val());
        $weekSelect.val(1);
        renderWeeklyChart(currentMonth);
        updateTitles(currentMonth, 1);
      });

      $weekSelect.on('change', function () {
        const selectedWeek = Number($(this).val());
        updateTitles(currentMonth, selectedWeek);
      });
    });

  // 예약자 비율 파이 차트 영역
  fetch("data/client.json")
    .then(res => res.json())
    .then(data => {
      // 만약 client.json 내에 clients 배열 없이 바로 배열이라면 아래처럼:
      // const clients = data;
      const clients = data.clients || data;

      // 20대, 30대 필터링 + 통계 초기화
      const statistics = {
        ageGroup: {},
        region: {},
        roomType: {},
        guesthouseType: {}
      };

      // 연령대 분류 함수 (20대, 30대만)
      const getAgeGroup = (age) => {
        if (age >= 20 && age < 30) return "20대";
        if (age >= 30 && age < 40) return "30대";
        return null;
      };

      const filteredClients = clients.filter(c => getAgeGroup(c.age));

      // 통계 집계
      filteredClients.forEach(client => {
        const ageGroup = getAgeGroup(client.age);
        if (!ageGroup) return;

        statistics.ageGroup[ageGroup] = (statistics.ageGroup[ageGroup] || 0) + 1;
        statistics.region[client.region] = (statistics.region[client.region] || 0) + 1;
        statistics.roomType[client.roomType] = (statistics.roomType[client.roomType] || 0) + 1;
        statistics.guesthouseType[client.guesthouseType] = (statistics.guesthouseType[client.guesthouseType] || 0) + 1;
      });

      // 비율 계산 함수
      const toPercentage = (obj) => {
        const total = Object.values(obj).reduce((a, b) => a + b, 0);
        const labels = Object.keys(obj);
        const data = Object.values(obj).map(v => ((v / total) * 100).toFixed(1));
        return { labels, data, total };
      };

      // 차트 데이터 변환 (비율)
      const ageData = toPercentage(statistics.ageGroup);
      const regionData = toPercentage(statistics.region);
      const roomData = toPercentage(statistics.roomType);
      const guesthouseData = toPercentage(statistics.guesthouseType);

      // 파이 차트 렌더링 함수
      function renderPieChart(id, labels, data) {
      const ctx = document.getElementById(id).getContext("2d");
      if (window[id + "Chart"]) window[id + "Chart"].destroy();

      window[id + "Chart"] = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',   // #FF6384 → 부드러운 분홍
              'rgba(54, 162, 235, 0.6)',   // #36A2EB → 연한 파랑
              'rgba(255, 206, 86, 0.6)',   // #FFCE56 → 연노랑
              'rgba(75, 192, 192, 0.6)',   // #4BC0C0 → 민트계열
              'rgba(153, 102, 255, 0.6)',  // #9966FF → 연보라
              'rgba(255, 159, 64, 0.6)'    // #FF9F40 → 연한 주황
            ],
            borderWidth: 1,
            borderColor: '#2A95A9',
            hoverOffset: 30
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top"
            },
            tooltip: {
              callbacks: {
                label: context => `${context.label}: ${context.parsed}%`
              }
            },
            datalabels: {
              color: '#fff',
              formatter: function(value, context) {
                return value + '%';
              },
              font: {
                weight: 'medium',
                size: 16
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    }

      // 차트 렌더링
      renderPieChart("ageChart", ageData.labels, ageData.data);
      renderPieChart("regionChart", regionData.labels, regionData.data);
      renderPieChart("roomChart", roomData.labels, roomData.data);
      renderPieChart("guesthouseChart", guesthouseData.labels, guesthouseData.data);
    })
    .catch(err => console.error("고객 데이터 로드 실패:", err));
});
