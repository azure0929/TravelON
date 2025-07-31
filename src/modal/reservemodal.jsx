import React, { useState, useEffect, useRef } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_green.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";
import "@/css/reservemodal.css";
import "@/css/common.css";

import roomCategoriesData from "@/data/roomCategories.json";
import reservemodalIcon from "@/assets/image/reservemodalicon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ReserveModal({
  isOpen,
  onClose,
  onSubmitReservation,
  selectedRoomTitleFromParent,
  currentCard,
}) {
  // --- [상태 관리] 모달 내부 폼 필드 상태 ---
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

  // --- [상태 관리] 각 입력 필드의 유효성 검사 오류 메시지 상태 ---
  const [userNameError, setUserNameError] = useState("");
  const [userAgeError, setUserAgeError] = useState("");
  const [guestCountError, setGuestCountError] = useState("");
  const [userEmailError, setUserEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [datesError, setDatesError] = useState("");

  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  // --- [참조 관리] 각 입력 필드에 대한 DOM 참조 ---
  const nameInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const ageInputRef = useRef(null);
  const guestCountInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmInputRef = useRef(null);

  // --- [유효성 검사 함수] 이름 유효성 검사 ---
  const validateUserName = (name) => {
    const nameRegex = /^[a-zA-Z가-힣\s]*$/;
    if (!name.trim()) {
      setUserNameError("이름을 입력해주세요.");
      return false;
    } else if (!nameRegex.test(name)) {
      setUserNameError("이름은 영어와 한글만 입력 가능합니다.");
      return false;
    }
    setUserNameError("");
    return true;
  };

  // --- [유효성 검사 함수] 나이 유효성 검사 ---
  const validateUserAge = (age) => {
    const ageValue = parseInt(age);
    if (!age.trim()) {
      setUserAgeError("나이를 입력해주세요.");
      return false;
    } else if (isNaN(ageValue) || ageValue < 1 || ageValue > 99) {
      setUserAgeError("나이는 1부터 99까지 숫자로만 입력 가능합니다.");
      return false;
    }
    setUserAgeError("");
    return true;
  };

  // --- [유효성 검사 함수] 인원 수 유효성 검사 ---
  const validateGuestCount = (count) => {
    const guestCountValue = parseInt(count);
    if (!count.trim()) {
      setGuestCountError("인원 수를 입력해주세요.");
      return false;
    } else if (
      isNaN(guestCountValue) ||
      guestCountValue < 1 ||
      guestCountValue > 99
    ) {
      setGuestCountError("인원 수는 1부터 99까지 숫자로만 입력 가능합니다.");
      return false;
    }
    setGuestCountError("");
    return true;
  };

  // --- [유효성 검사 함수] 이메일 유효성 검사 ---
  const validateUserEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setUserEmailError("이메일을 입력해주세요.");
      return false;
    } else if (!emailRegex.test(email)) {
      setUserEmailError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    setUserEmailError("");
    return true;
  };

  // --- [유효성 검사 함수] 비밀번호 유효성 검사 ---
  const validatePassword = (pass) => {
    if (!pass.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      return false;
    } else if (pass.length < 4 || pass.length > 8) {
      setPasswordError("비밀번호는 4자 이상 8자 이하로 입력해주세요.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // --- [유효성 검사 함수] 비밀번호 확인 유효성 검사 ---
  const validatePasswordConfirm = (confirmPass, originalPass) => {
    if (!confirmPass.trim()) {
      setPasswordConfirmError("비밀번호 확인을 입력해주세요.");
      return false;
    } else if (confirmPass !== originalPass) {
      setPasswordConfirmError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }
    setPasswordConfirmError("");
    return true;
  };

  // --- [유효성 검사 함수] 날짜 선택 유효성 검사 ---
  const validateDates = (dates) => {
    if (dates.length < 2) {
      setDatesError("숙박 예정일을 선택해주세요.");
      return false;
    }
    setDatesError("");
    return true;
  };

  // --- [Effect 훅] 모달이 열릴 때마다 폼 필드 초기화 및 로그인 정보 불러오기 ---
  useEffect(() => {
    if (isOpen) {
      // 폼 필드 및 오류 메시지 상태 초기화
      setUserName("");
      setUserAge("");
      setGuestCount("");
      setUserEmail("");
      setPassword("");
      setPasswordConfirm("");
      setSelectedDates([]);

      setUserNameError("");
      setUserAgeError("");
      setGuestCountError("");
      setUserEmailError("");
      setPasswordError("");
      setPasswordConfirmError("");
      setDatesError("");

      // 로그인된 사용자 정보를 세션 스토리지에서 가져와서 필드에 자동 채우기
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      if (loggedInUser) {
        setUserName(loggedInUser.name);
        setUserAge(loggedInUser.age);
        setUserEmail(loggedInUser.email);
        setPassword(loggedInUser.password);
        setPasswordConfirm(loggedInUser.password);
      }

      // 선택된 객실의 상세 정보를 찾아서 상태에 저장
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

  // --- [헬퍼 함수] 모든 폼 필드에 대한 유효성 검사 일괄 처리 ---
  const validateAllFields = () => {
    // 모든 유효성 검사 함수를 순차적으로 실행
    const isUserNameValid = validateUserName(userName);
    const isUserAgeValid = validateUserAge(userAge);
    const isGuestCountValid = validateGuestCount(guestCount);
    const isUserEmailValid = validateUserEmail(userEmail);
    const isPasswordValid = validatePassword(password);
    const isPasswordConfirmValid = validatePasswordConfirm(
      passwordConfirm,
      password
    );
    const isDatesValid = validateDates(selectedDates);

    // 전체 유효성 검사 결과
    let overallValid =
      isUserNameValid &&
      isUserAgeValid &&
      isGuestCountValid &&
      isUserEmailValid &&
      isPasswordValid &&
      isPasswordConfirmValid &&
      isDatesValid;

    // 추가적인 유효성 검사 (부모 컴포넌트로부터 받은 데이터)
    if (!currentCard) {
      alert("게스트하우스 정보를 찾을 수 없습니다.");
      overallValid = false;
    }
    if (!selectedRoomDetails) {
      alert("선택된 객실 정보가 유효하지 않습니다.");
      overallValid = false;
    }

    // 유효성 검사 실패 시 첫 번째 오류 필드로 포커스 이동
    if (!overallValid) {
      if (!isUserNameValid) nameInputRef.current?.focus();
      else if (!isUserAgeValid) ageInputRef.current?.focus();
      else if (!isGuestCountValid) guestCountInputRef.current?.focus();
      else if (!isUserEmailValid) emailInputRef.current?.focus();
      else if (!isPasswordValid) passwordInputRef.current?.focus();
      else if (!isPasswordConfirmValid)
        passwordConfirmInputRef.current?.focus();
      else if (!isDatesValid) dateInputRef.current?.flatpickr?.open();
    }

    return overallValid;
  };

  // --- [이벤트 핸들러] '다음' 버튼 클릭 시 예약 정보 제출 ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateAllFields()) {
      // 모든 유효성 검사 통과 시, 예약 객체 생성
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

      // 예약 정보를 로컬 스토리지에 저장 (데모용)
      localStorage.setItem("reservations", JSON.stringify([reservationObj]));
      // 부모 컴포넌트에 예약 정보 전달 및 모달 닫기
      onSubmitReservation(reservationObj);
    }
  };

  // --- [이벤트 핸들러] 날짜 선택 아이콘 클릭 시 DatePicker 열기 ---
  const handleDatePickerIconClick = () => {
    dateInputRef.current?.flatpickr?.open();
  };

  // 모달이 닫힌 상태일 때는 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  // --- [JSX 렌더링] ---
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
              maxLength={20}
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (userNameError) validateUserName(e.target.value);
              }}
              onBlur={() => validateUserName(userName)}
              required
              ref={nameInputRef}
            />
            {userNameError && <p className="error-message">{userNameError}</p>}
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
              type="text"
              id="ageInput"
              placeholder="나이를 입력하세요."
              maxLength={2}
              value={userAge}
              onChange={(e) => {
                setUserAge(e.target.value);
                if (userAgeError) validateUserAge(e.target.value);
              }}
              onBlur={() => validateUserAge(userAge)}
              required
              ref={ageInputRef}
            />
            {userAgeError && <p className="error-message">{userAgeError}</p>}
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
              onChange={(e) => {
                setUserEmail(e.target.value);
                if (userEmailError) validateUserEmail(e.target.value);
              }}
              onBlur={() => validateUserEmail(userEmail)}
              required
              ref={emailInputRef}
            />
            {userEmailError && (
              <p className="error-message">{userEmailError}</p>
            )}
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
                  validateDates(dates);
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
            {datesError && <p className="error-message">{datesError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="passwordInput">비밀번호</label>
            <input
              type="password"
              id="passwordInput"
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) validatePassword(e.target.value);
                if (passwordConfirmError)
                  validatePasswordConfirm(passwordConfirm, e.target.value);
              }}
              onBlur={() => validatePassword(password)}
              required
              ref={passwordInputRef}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="guestCountInput">인원 수</label>
            <input
              type="text"
              id="guestCountInput"
              placeholder="ex. 3"
              maxLength={2}
              value={guestCount}
              onChange={(e) => {
                setGuestCount(e.target.value);
                if (guestCountError) validateGuestCount(e.target.value);
              }}
              onBlur={() => validateGuestCount(guestCount)}
              required
              ref={guestCountInputRef}
            />
            {guestCountError && (
              <p className="error-message">{guestCountError}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirmInput">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirmInput"
              placeholder="비밀번호를 다시 입력하세요."
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                if (passwordConfirmError)
                  validatePasswordConfirm(e.target.value, password);
              }}
              onBlur={() => validatePasswordConfirm(passwordConfirm, password)}
              required
              ref={passwordConfirmInputRef}
            />
            {passwordConfirmError && (
              <p className="error-message">{passwordConfirmError}</p>
            )}
          </div>
        </div>
        <button className="btn-next" onClick={handleSubmit}>
          다음
        </button>
      </div>
    </div>
  );
}
