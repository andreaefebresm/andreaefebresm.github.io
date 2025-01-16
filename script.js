document.addEventListener("DOMContentLoaded", () => {
    const filterItems = document.querySelectorAll(".filter ul li");
    const allFilter = document.querySelector(".all-filter");
    const images = document.querySelectorAll(".images img");
    const imagestool = document.querySelectorAll(".image-container img");
    const tooltip = document.getElementById("tooltip");

    // Mostra tutte le immagini all'apertura del sito
    images.forEach(img => {
        img.classList.add('show'); // Assicurati che tutte le immagini siano visibili
    });

    // Filter functionality
    filterItems.forEach(item => {
        item.addEventListener("click", () => {
            const category = item.textContent.trim();

            filterItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show or hide images based on category
            images.forEach(img => {
                if (category === "ALL" || img.getAttribute('data-category') === category) {
                    img.classList.add('show'); // Show image
                } else {
                    img.classList.remove('show'); // Hide image
                }
            });

            // Handle "ALL" filter visibility
            if (category !== "ALL") {
                allFilter.style.display = "block";
                setTimeout(() => {
                    allFilter.style.opacity = "1";
                }, 10);
            } else {
                allFilter.style.opacity = "0";
                setTimeout(() => {
                    allFilter.style.display = "none";
                }, 500);
            }
        });
    });

    // Tooltip functionality
    imagestool.forEach(image => {
        const container = image.parentElement;

        image.addEventListener("mouseenter", () => {
            const text = container.querySelector(".image-text").textContent;
            tooltip.textContent = text;
            tooltip.style.opacity = 1;
        });

        image.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY + 10 + "px";
        });

        image.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
        });
    });

    // Hover effect functionality
    const galleryImages = document.querySelectorAll(".image-container img");

    // Save the original image source for each image
    const originalSrcMap = new Map();
    galleryImages.forEach((img) => {
        originalSrcMap.set(img, img.src); // Save the original src
    });

    let lastHoveredImage = null; // Track the last hovered image

    galleryImages.forEach((img) => {
        img.addEventListener("mouseover", () => {
            // Only apply hover effect if it is not already applied to the current image
            if (lastHoveredImage !== img) {
                // Change the image source of the last hovered image back to its original source
                if (lastHoveredImage) {
                    lastHoveredImage.src = originalSrcMap.get(lastHoveredImage);
                }

                // Change the source of the current hovered image
                img.src = img.dataset.hover || originalSrcMap.get(img); // Use data-hover if available
                lastHoveredImage = img; // Update the last hovered image
            }
        });

        img.addEventListener("mouseout", () => {
            // Reset the image source to its original on mouse out
            if (lastHoveredImage === img) {
                img.src = originalSrcMap.get(img);
                lastHoveredImage = null; // Clear the last hovered image
            }
        });
    });

    // SUPERFORMA Image Navigation
    const imagesproj01 = [
        '../src/01_01.png',
        '../src/01_02.png',
        '../src/01_03.png',
        '../src/01_04.png',
        '../src/01_02.png'
    ];

    let currentIndex01 = 0;

    function changeImage01(direction) {
        currentIndex01 += direction;

        if (currentIndex01 < 0) {
            currentIndex01 = imagesproj01.length - 1;
        } else if (currentIndex01 >= imagesproj01.length) {
            currentIndex01 = 0;
        }

        document.getElementById('mainImage01').src = imagesproj01[currentIndex01];
    }

    const prevButton01 = document.querySelector('.arrow-left');
    const nextButton01 = document.querySelector('.arrow-right');

    prevButton01.addEventListener('click', () => changeImage01(-1)); 
    nextButton01.addEventListener('click', () => changeImage01(1));  


    // 02AF Image Navigation
    const imagesproj02 = [
        '../src/02_01.png',
        '../src/01_02.png',
        '../src/01_03.png',
        '../src/01_04.png',
        '../src/01_02.png'
    ];

    let currentIndex02 = 0;

    function changeImage02(direction) {
        currentIndex02 += direction;

        if (currentIndex02 < 0) {
            currentIndex02 = imagesproj02.length - 1;
        } else if (currentIndex02 >= imagesproj02.length) {
            currentIndex02 = 0;
        }

        document.getElementById('mainImage02').src = imagesproj02[currentIndex02];
    }

    const prevButton02 = document.querySelector('.arrow-left');
    const nextButton02 = document.querySelector('.arrow-right');

    prevButton02.addEventListener('click', () => changeImage02(-1)); // Previous button
    nextButton02.addEventListener('click', () => changeImage02(1));  // Next button


    // 03SF Image Navigation
    const imagesproj03 = [
        '../src/03_01.png',
        '../src/03_02.png',
        '../src/03_03.png',
        '../src/03_04.png',
        '../src/03_02.png'
    ];

    let currentIndex03 = 0;

    function changeImage03(direction) {
        currentIndex03 += direction;

        if (currentIndex03 < 0) {
            currentIndex03 = imagesproj03.length - 1;
        } else if (currentIndex03 >= imagesproj03.length) {
            currentIndex03 = 0;
        }

        document.getElementById('mainImage03').src = imagesproj03[currentIndex03];
    }

    const prevButton03 = document.querySelector('.arrow-left');
    const nextButton03 = document.querySelector('.arrow-right');

    prevButton03.addEventListener('click', () => changeImage03(-1)); 
    nextButton03.addEventListener('click', () => changeImage03(1)); 


    // 04AF Image Navigation
    const imagesproj04 = [
        '../src/04_01.png',
        '../src/04_02.png',
        '../src/04_03.png',
        '../src/04_04.png',
        '../src/04_02.png'
    ];

    let currentIndex04 = 0;

    function changeImage04(direction) {
        currentIndex04 += direction;

        if (currentIndex04 < 0) {
            currentIndex04 = imagesproj04.length - 1;
        } else if (currentIndex04 >= imagesproj04.length) {
            currentIndex04 = 0;
        }

        document.getElementById('mainImage04').src = imagesproj04[currentIndex04];
    }

    const prevButton04 = document.querySelector('.arrow-left');
    const nextButton04 = document.querySelector('.arrow-right');

    prevButton04.addEventListener('click', () => changeImage04(-1)); 
    nextButton04.addEventListener('click', () => changeImage04(1)); 


    // 05SF Image Navigation
    const imagesproj05 = [
        '../src/05_01.png',
        '../src/05_02.png',
        '../src/05_03.png',
        '../src/05_04.png',
        '../src/05_02.png'
    ];

    let currentIndex05 = 0;

    function changeImage05(direction) {
        currentIndex05 += direction;

        if (currentIndex05 < 0) {
            currentIndex05 = imagesproj05.length - 1;
        } else if (currentIndex05 >= imagesproj05.length) {
            currentIndex05 = 0;
        }

        document.getElementById('mainImage05').src = imagesproj05[currentIndex05];
    }

    const prevButton05 = document.querySelector('.arrow-left');
    const nextButton05 = document.querySelector('.arrow-right');

    prevButton05.addEventListener('click', () => changeImage05(-1)); 
    nextButton05.addEventListener('click', () => changeImage05(1)); 


    // 06AF Image Navigation
    const imagesproj06 = [
        '../src/06_01.png',
        '../src/06_02.png',
        '../src/06_03.png',
        '../src/06_04.png',
        '../src/06_02.png'
    ];

    let currentIndex06 = 0;

    function changeImage06(direction) {
        currentIndex06 += direction;

        if (currentIndex06 < 0) {
            currentIndex06 = imagesproj06.length - 1;
        } else if (currentIndex06 >= imagesproj06.length) {
            currentIndex06 = 0;
        }

        document.getElementById('mainImage06').src = imagesproj06[currentIndex06];
    }

    const prevButton06 = document.querySelector('.arrow-left');
    const nextButton06 = document.querySelector('.arrow-right');

    prevButton06.addEventListener('click', () => changeImage06(-1)); 
    nextButton06.addEventListener('click', () => changeImage06(1)); 


    // 07SF Image Navigation
    const imagesproj07 = [
        '../src/07_01.png',
        '../src/07_02.png',
        '../src/07_03.png',
        '../src/07_04.png',
        '../src/07_02.png'
    ];

    let currentIndex07 = 0;

    function changeImage07(direction) {
        currentIndex07 += direction;

        if (currentIndex07 < 0) {
            currentIndex07 = imagesproj07.length - 1;
        } else if (currentIndex07 >= imagesproj07.length) {
            currentIndex07 = 0;
        }

        document.getElementById('mainImage07').src = imagesproj07[currentIndex07];
    }

    const prevButton07 = document.querySelector('.arrow-left');
    const nextButton07 = document.querySelector('.arrow-right');

    prevButton07.addEventListener('click', () => changeImage07(-1)); 
    nextButton07.addEventListener('click', () => changeImage07(1)); 


    // 08AF Image Navigation
    const imagesproj08 = [
        '../src/08_01.png',
        '../src/08_02.png',
        '../src/08_03.png',
        '../src/08_04.png',
        '../src/08_02.png'
    ];

    let currentIndex08 = 0;

    function changeImage08(direction) {
        currentIndex08 += direction;

        if (currentIndex08 < 0) {
            currentIndex08 = imagesproj08.length - 1;
        } else if (currentIndex08 >= imagesproj08.length) {
            currentIndex08 = 0;
        }

        document.getElementById('mainImage08').src = imagesproj08[currentIndex08];
    }

    const prevButton08 = document.querySelector('.arrow-left');
    const nextButton08 = document.querySelector('.arrow-right');

    prevButton08.addEventListener('click', () => changeImage08(-1)); 
    nextButton08.addEventListener('click', () => changeImage08(1)); 


    // 09SF Image Navigation
    const imagesproj09 = [
        '../src/09_01.png',
        '../src/09_02.png',
        '../src/09_03.png',
        '../src/09_04.png',
        '../src/09_02.png'
    ];

    let currentIndex09 = 0;

    function changeImage09(direction) {
        currentIndex09 += direction;

        if (currentIndex09 < 0) {
            currentIndex09 = imagesproj09.length - 1;
        } else if (currentIndex09 >= imagesproj09.length) {
            currentIndex09 = 0;
        }

        document.getElementById('mainImage09').src = imagesproj09[currentIndex09];
    }

    const prevButton09 = document.querySelector('.arrow-left');
    const nextButton09 = document.querySelector('.arrow-right');

    prevButton09.addEventListener('click', () => changeImage09(-1)); 
    nextButton09.addEventListener('click', () => changeImage09(1)); 
});
