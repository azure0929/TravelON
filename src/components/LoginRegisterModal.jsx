import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "@/css/common.css";

export default function LoginRegisterModal({ isOpen, onClose, setIsLoggedIn }) {
  // 모드 전환 상태: false → 로그인, true → 회원가입
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // 로그인 폼 관련 상태
  const [loginIdOrEmail, setLoginIdOrEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // 로그인 오류 메시지

  // 회원가입 폼 관련 상태
  const [registerName, setRegisterName] = useState("");
  const [registerId, setRegisterId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  // 회원가입 유효성 검사 오류 메시지 상태
  const [nameError, setNameError] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");

  const loginModalRef = useRef(null); // 모달 컨테이너에 대한 참조

  // 모달이 열리거나 닫힐 때 GSAP 애니메이션 적용
  useEffect(() => {
    if (isOpen) {
      if (loginModalRef.current) {
        loginModalRef.current.style.display = "flex";
        loginModalRef.current.style.visibility = "visible";

        gsap.fromTo(
          loginModalRef.current.querySelector(".modal-dialog"),
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    } else {
      if (loginModalRef.current) {
        gsap.to(loginModalRef.current.querySelector(".modal-dialog"), {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (loginModalRef.current) {
              loginModalRef.current.style.display = "none";
              loginModalRef.current.style.visibility = "hidden";
            }
          },
        });
      }
    }
  }, [isOpen]);

  // 모달 닫기/모드 변경 시 폼 필드 및 오류 메시지 초기화
  useEffect(() => {
    setLoginIdOrEmail("");
    setLoginPassword("");
    setLoginError("");

    setRegisterName("");
    setRegisterId("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setRegisterAge("");
    setRegisterEmail("");
    resetRegisterFormErrors();
  }, [isOpen, isRegisterMode]);

  // 회원가입 폼 오류 메시지 초기화 함수
  const resetRegisterFormErrors = () => {
    setNameError("");
    setIdError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setAgeError("");
    setEmailError("");
  };

  // 일반 로그인 처리 핸들러
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginIdOrEmail || !loginPassword) {
      setLoginError("아이디/이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    const storedUser = JSON.parse(sessionStorage.getItem("registeredUser"));

    if (storedUser) {
      const isIdMatch = storedUser.id === loginIdOrEmail;
      const isEmailMatch = storedUser.email === loginIdOrEmail;

      if (
        (isIdMatch || isEmailMatch) &&
        storedUser.password === loginPassword
      ) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        setIsLoggedIn(true);
        onClose();
        alert(`환영합니다, ${storedUser.name}님!`);
      } else {
        setLoginError("아이디/이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } else {
      setLoginError("등록된 회원이 없습니다. 회원가입을 먼저 해주세요.");
    }
  };

  // 일반 회원가입 처리 핸들러
  const handleRegister = (e) => {
    e.preventDefault();
    resetRegisterFormErrors();

    let isValid = true;

    // 이름 유효성 검사
    if (!registerName.trim()) {
      setNameError("이름을 입력해주세요.");
      isValid = false;
    }

    // 아이디 유효성 검사
    const idRegex = /^[a-zA-Z가-힣]{1,10}$/;
    if (!registerId.trim()) {
      setIdError("아이디를 입력해주세요.");
      isValid = false;
    } else if (!idRegex.test(registerId)) {
      setIdError("아이디는 영어와 한글만 10자 이내로 입력해주세요.");
      isValid = false;
    }

    // 비밀번호 유효성 검사
    if (!registerPassword) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    } else if (registerPassword.length < 4 || registerPassword.length > 10) {
      setPasswordError("비밀번호는 최소 4자, 최대 10자 이내여야 합니다.");
      isValid = false;
    }

    // 비밀번호 확인 검사
    if (registerPassword !== registerConfirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else if (!registerConfirmPassword) {
      setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      isValid = false;
    }

    // 나이 유효성 검사
    const ageRegex = /^\d{1,2}$/;
    if (!registerAge) {
      setAgeError("나이를 입력해주세요.");
      isValid = false;
    } else if (
      !ageRegex.test(registerAge) ||
      parseInt(registerAge, 10) < 0 ||
      parseInt(registerAge, 10) > 99
    ) {
      setAgeError("나이는 0~99 사이의 숫자 2자리 이내여야 합니다.");
      isValid = false;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerEmail.trim()) {
      setEmailError("이메일을 입력해주세요.");
      isValid = false;
    } else if (!emailRegex.test(registerEmail)) {
      setEmailError("유효한 이메일 형식이 아닙니다.");
    }

    if (!isValid) {
      return;
    }

    // 유효성 검사 통과 후 회원 정보 저장
    const newUser = {
      name: registerName,
      id: registerId,
      password: registerPassword,
      age: registerAge,
      email: registerEmail,
    };

    sessionStorage.setItem("registeredUser", JSON.stringify(newUser)); // 세션 스토리지에 회원 정보 저장

    setIsRegisterMode(false); // 로그인 모드로 전환
    alert("회원가입이 완료되었습니다. 로그인해 주세요.");
  };

  return (
    <div id="loginModal" className="modal-backdrop" ref={loginModalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isRegisterMode ? "회원가입" : "로그인"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="모달 닫기"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="modal-body">
            {isRegisterMode ? (
              <form onSubmit={handleRegister} className="register-form-grid">
                <div className="form-group">
                  <label htmlFor="registerName">이름</label>
                  <input
                    type="text"
                    id="registerName"
                    className={`form-control ${nameError ? "input-error" : ""}`}
                    placeholder="이름을 입력해주세요."
                    value={registerName}
                    onChange={(e) => {
                      setRegisterName(e.target.value);
                      setNameError("");
                    }}
                    required
                  />
                  {nameError && <p className="error-message">{nameError}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="registerId">아이디</label>
                  <input
                    type="text"
                    id="registerId"
                    className={`form-control ${idError ? "input-error" : ""}`}
                    placeholder="영어/한글 10자 이내"
                    value={registerId}
                    onChange={(e) => {
                      setIdError("");
                      setRegisterId(e.target.value);
                    }}
                    required
                  />
                  {idError && <p className="error-message">{idError}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="registerPassword">비밀번호</label>
                  <input
                    type="password"
                    id="registerPassword"
                    className={`form-control ${
                      passwordError ? "input-error" : ""
                    }`}
                    placeholder="4~10자"
                    value={registerPassword}
                    onChange={(e) => {
                      setPasswordError("");
                      setRegisterPassword(e.target.value);
                    }}
                    required
                  />
                  {passwordError && (
                    <p className="error-message">{passwordError}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="registerConfirmPassword">비밀번호 확인</label>
                  <input
                    type="password"
                    id="registerConfirmPassword"
                    className={`form-control ${
                      confirmPasswordError ? "input-error" : ""
                    }`}
                    placeholder="비밀번호 확인"
                    value={registerConfirmPassword}
                    onChange={(e) => {
                      setConfirmPasswordError("");
                      setRegisterConfirmPassword(e.target.value);
                    }}
                    required
                  />
                  {confirmPasswordError && (
                    <p className="error-message">{confirmPasswordError}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="registerAge">나이</label>
                  <input
                    type="number"
                    id="registerAge"
                    className={`form-control ${ageError ? "input-error" : ""}`}
                    placeholder="0~99세"
                    value={registerAge}
                    onChange={(e) => {
                      setAgeError("");
                      setRegisterAge(e.target.value);
                    }}
                    required
                  />
                  {ageError && <p className="error-message">{ageError}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="registerEmail">이메일</label>
                  <input
                    type="email"
                    id="registerEmail"
                    className={`form-control ${
                      emailError ? "input-error" : ""
                    }`}
                    placeholder="이메일을 입력해주세요."
                    value={registerEmail}
                    onChange={(e) => {
                      setEmailError("");
                      setRegisterEmail(e.target.value);
                    }}
                    required
                  />
                  {emailError && <p className="error-message">{emailError}</p>}
                </div>
                <div className="register-submit-area">
                  <button type="submit" className="btn btn-primary btn-block">
                    회원가입
                  </button>
                  <p className="modal-switch-text">
                    이미 계정이 있으신가요?{" "}
                    <span onClick={() => setIsRegisterMode(false)}>로그인</span>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="loginIdOrEmail">아이디 또는 이메일</label>
                  <input
                    type="text"
                    id="loginIdOrEmail"
                    className={`form-control ${
                      loginError ? "input-error" : ""
                    }`}
                    placeholder="아이디 또는 이메일"
                    value={loginIdOrEmail}
                    onChange={(e) => {
                      setLoginIdOrEmail(e.target.value);
                      setLoginError("");
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">비밀번호</label>
                  <input
                    type="password"
                    id="loginPassword"
                    className={`form-control ${
                      loginError ? "input-error" : ""
                    }`}
                    placeholder="비밀번호"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError("");
                    }}
                    required
                  />
                  {loginError && <p className="error-message">{loginError}</p>}
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  로그인
                </button>
                <p className="modal-switch-text">
                  <span onClick={() => setIsRegisterMode(true)}>회원가입</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
