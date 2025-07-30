import React, { useState, useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_green.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import "@/css/reservemodal.css";
import "@/css/common.css";

import roomCategoriesData from "@/data/roomCategories.json";
import reservemodalIcon from "@/image/reservemodalicon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ReserveModal({
  isOpen,
  onClose,
  onSubmitReservation,
  selectedRoomTitleFromParent,
  currentCard,
}) {
  // 모달 내부 폼 필드 상태 관리
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  const nameInputRef = useRef(null);
  const dateInputRef = useRef(null);

  // 모달이 열릴 때마다 초기화 및 데이터 설정
  useEffect(() => {
    if (isOpen) {
      setUserName("");
      setUserAge("");
      setGuestCount("");
      setUserEmail("");
      setPassword("");
      setPasswordConfirm("");
      setSelectedDates([]);

      let foundRoom = null;
      for (const category of roomCategoriesData) {
        foundRoom = category.rooms.find(
          (room) => room.title === selectedRoomTitleFromParent
        );
        if (foundRoom) {
          setSelectedRoomDetails({ ...foundRoom, categoryType: category.type });
          break;
        }
      }
      if (!foundRoom) {
        console.warn(
          "선택된 방의 상세 정보를 찾을 수 없습니다:",
          selectedRoomTitleFromParent
        );
      }
    }
  }, [isOpen, selectedRoomTitleFromParent]);

  // '다음' 버튼 클릭 시 예약 정보 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      alert("이름을 입력해주세요.");
      userName.current?.focus();
      return;
    }
    if (!userAge.trim()) {
      alert("나이를 입력해주세요.");
      userAge.current?.focus();
      return;
    }
    if (!guestCount.trim()) {
      alert("인원 수를 입력해주세요.");
      guestCount.current?.focus();
      return;
    }
    if (!userEmail.trim()) {
      alert("이메일을 입력해주세요.");
      userEmail.current?.focus();
      return;
    }
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      password.current?.focus();
      return;
    }
    if (!passwordConfirm.trim()) {
      alert("비밀번호 확인을 입력해주세요.");
      passwordConfirm.current?.focus();
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      password.current?.focus();
      return;
    }

    if (!currentCard) {
      alert("게스트하우스 정보를 찾을 수 없습니다.");
      currentCard.current?.focus();
      return;
    }

    if (!selectedRoomDetails) {
      alert("선택된 객실 정보가 유효하지 않습니다.");
      selectedRoomDetails.current?.focus();
      return;
    }

    if (selectedDates.length < 2) {
      alert("숙박 예정일을 선택해주세요.");
      nameInputRef.current?.focus();
      return;
    }

    // 예약 객체 구성
    const reservationObj = {
      card: {
        title: currentCard.title,
        location: currentCard.location,
        roomType: selectedRoomDetails.title,
        discountPrice: selectedRoomDetails.discountPrice,
        roomTop: selectedRoomDetails.categoryType,
      },
      user: {
        name: userName,
        age: userAge,
        guestCount: guestCount,
        stayDate: selectedDates
          .map((date) => date.toISOString().split("T")[0])
          .join(" - "),
        email: userEmail,
      },
    };

    localStorage.setItem("reservations", JSON.stringify([reservationObj]));

    onSubmitReservation(reservationObj);
  };

  // 날짜 선택 아이콘 클릭 핸들러
  const handleDatePickerIconClick = () => {
    dateInputRef.current?.flatpickr?.open();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="reservemodal" style={{ display: "flex" }}>
      <div
        className="reservemodal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <div className="reservemodal-header">
          <div className="modalTitle">
            <div className="reservemodalicon">
              <img src={reservemodalIcon} alt="reserveIcon" />
            </div>
            <span>예약</span>
          </div>
          <div
            role="button"
            className="reservemodal-close"
            id="modalCloseBtn"
            aria-label="닫기"
            onClick={onClose}
          >
            <i>
              <FontAwesomeIcon icon={faTimes} />
            </i>
          </div>
        </div>
        <div className="reservemodal-body">
          <div className="form-group">
            <label htmlFor="nameInput">이름</label>
            <input
              type="text"
              id="nameInput"
              placeholder="이름을 입력하세요."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              ref={nameInputRef}
            />
          </div>
          <div className="form-group">
            <label>게스트하우스</label>
            <div className="tag-boxes">
              <span className="tag-box">
                {currentCard?.title || "정보 없음"}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ageInput">나이</label>
            <input
              type="number"
              id="ageInput"
              placeholder="나이를 입력하세요."
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomInput">룸</label>
            <input
              type="text"
              id="roomInput"
              value={selectedRoomTitleFromParent || ""}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailInput">이메일</label>
            <input
              type="email"
              id="emailInput"
              placeholder="이메일을 입력하세요."
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
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
                  minDate: "today",
                  allowInput: false,
                }}
                value={selectedDates}
                onChange={(dates) => {
                  setSelectedDates(dates);
                }}
                className="form-control"
                id="stayDateInput"
                ref={dateInputRef}
                placeholder="예: 2025.06.01 - 2025.06.04"
                style={{ border: "1px solid var(--input-border-color)" }}
              />
              <svg
                className="date-picker-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                role="button"
                tabIndex="0"
                aria-label="날짜 선택 열기"
                onClick={handleDatePickerIconClick}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="guestCountInput">인원 수</label>
            <input
              type="text"
              id="guestCountInput"
              placeholder="ex. 3"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirmInput">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirmInput"
              placeholder="비밀번호를 다시 입력하세요."
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
        </div>
        <button className="btn-next" onClick={handleSubmit}>
          다음
        </button>
      </div>
    </div>
  );
}
