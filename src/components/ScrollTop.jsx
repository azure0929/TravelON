import scrollTopIcon from "@/image/scrollTop.png";
import { useEffect } from "react";
import "@/css/common.css";

export default function ScrollTop() {
  // scrollTop 버튼
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
    <>
      <div
        role="button"
        className="scroll-top"
        id="scrollTopBtn"
        aria-label="맨 위로 이동"
      >
        <img src={scrollTopIcon} alt="scroll-top" />
      </div>
    </>
  );
}
