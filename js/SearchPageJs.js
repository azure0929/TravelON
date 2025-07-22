$(function () {
    // 카테고리 버튼 클릭
    $('.category-btn').click(function () {
        $('.category-btn').removeClass('active');
        $(this).addClass('active');

        const selectedCategory = $(this).text().trim();
        currentCategory = selectedCategory;

        if (selectedCategory === "전체") {
            $('#search-list').css('display', 'none');
            $('#search-total').css('display', 'block');
            restoreHeartButtons();
        } else {
            $('#search-total').css('display', 'none');
            $('#search-list').css('display', 'flex');
            renderCardListViewByCategory(selectedCategory);
        }
    });

    // 초기 전체 뷰 표시
    $('#search-total').show();
    renderCards();
    // 정렬 토글
    const container = document.querySelector(".sort-container");
    const toggle = container.querySelector(".sort-toggle");
    const sortOptions = container.querySelectorAll(".sort-option");
    const btnApply = container.querySelector(".btn-apply");
    const sortImg = document.querySelector('.sort-image');

    toggle.addEventListener("click", function () {
        sortImg.src = "image/sort_sel.webp";
        container.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
        if (!container.contains(e.target)) {
            container.classList.remove("active");
            sortImg.src = "image/sort_non.webp";
        }
    });

    sortOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            sortOptions.forEach(opt => opt.classList.remove("selected"));
            this.classList.add("selected");
        });
    });

    btnApply.addEventListener("click", function () {
        const selectedOption = container.querySelector(".sort-option.selected");
        if (selectedOption && currentCategory !== "") {
            currentSortOption = selectedOption.textContent.trim();
            renderCardListViewByCategory(currentCategory);
        }
        container.classList.remove("active");
        sortImg.src = "image/sort_non.webp";
    });

    // 하트 버튼
    $(document).on('click', '.heart-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const heartImg = $(this).find('.heart-img');
        heartImg.toggleClass('heart-active');
        heartImg.attr('src', heartImg.hasClass('heart-active') ? "image/heart_sel.webp" : "image/heart_non.webp");

        const card = $(this).closest('.card');
        const title = card.find('.card-title').text().trim();
        const image = card.find('.card-img').attr('src');
        const location = card.find('.location-text').text().trim();

        let jjimCards = JSON.parse(localStorage.getItem('jjimCards') || '[]');
        const exists = jjimCards.some(item => item.title === title);

        if (exists) {
            // 찜 해제
            jjimCards = jjimCards.filter(item => item.title !== title);
            heartImg.removeClass('heart-active');
            heartImg.attr('src', 'image/heart_non.webp');
        } else {
            // 찜 추가
            jjimCards.push({ title, image, location});
            heartImg.addClass('heart-active');
            heartImg.attr('src', 'image/heart_sel.webp');
        }

        localStorage.setItem('jjimCards', JSON.stringify(jjimCards));
    });

    // 카드 클릭
    $(document).on('click', '.card', function () {
        const title = $(this).find('.card-title').text().trim();
        const image = $(this).find('.card-img').attr('src');
        const location = $(this).find('.location-text').text().trim();
        const originalPrice = $(this).find('.original-price').text().trim();
        const discountPrice = $(this).find('.discount-price').text().trim();

        const url = `detailpage.html?title=${encodeURIComponent(title)}&image=${encodeURIComponent(image)}&location=${encodeURIComponent(location)}&originalPrice=${encodeURIComponent(originalPrice)}&discountPrice=${encodeURIComponent(discountPrice)}`;
        window.location.href = url;
    });


});

function restoreHeartButtons() {
    const jjimCards = JSON.parse(localStorage.getItem('jjimCards') || '[]');

    $('.card').each(function () {
        const title = $(this).find('.card-title').text().trim();
        const heartImg = $(this).find('.heart-img');

        const isJjimmed = jjimCards.some(item => item.title === title);
        if (isJjimmed) {
            heartImg.addClass('heart-active');
            heartImg.attr('src', 'image/heart_sel.webp');
        } else {
            heartImg.removeClass('heart-active');
            heartImg.attr('src', 'image/heart_non.webp');
        }
    });
}