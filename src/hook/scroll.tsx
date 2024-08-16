import React, { useState, useEffect } from 'react';

function ScrollToTopButton(props: any) {
  const [isVisible, setIsVisible] = useState(false);
const {scrollId} = props

console.log(scrollId)
//scrollId lấy giá trị của thẻ bang id
  // Thêm sự kiện lắng nghe cho cuộn trang
  useEffect(() => {
    function handleScroll() {
      // Lấy vị trí cuộn của trang
      const scrollTop = scrollId.scrollTop
        console.log(scrollTop)
      // Nếu vị trí cuộn đủ xa (ví dụ: > 100px), hiển thị button
      setIsVisible(scrollTop != 0);
    }

    scrollId ? scrollId.addEventListener('scroll', handleScroll):'';

    // Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
        scrollId ? scrollId.removeEventListener('scroll', handleScroll):'';
    };
  }, []);

  // Cuộn về đầu trang khi nhấp vào button
  const scrollToTop = () => {
    scrollId ?scrollId.scrollTo({
      top: 0,
      behavior: 'smooth'
    }):'';
  };

  return (
    <button
      className="scroll-to-top-button"
      onClick={scrollToTop}
      style={{ display: isVisible ? 'inline' : 'none' }}
    >
      Đầu trang
    </button>
  );
}

export default ScrollToTopButton;
