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

    filterItems.forEach(item => {
        item.addEventListener("click", () => {
            const category = item.textContent.trim();

            filterItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Mostra o nascondi le immagini in base alla categoria
            images.forEach(img => {
                if (category === "ALL" || img.getAttribute('data-category') === category) {
                    img.classList.add('show'); // Applica la classe per mostrare l'immagine
                } else {
                    img.classList.remove('show'); // Rimuovi la classe per nascondere l'immagine
                }
            });

            // Gestisci la visibilità dell'elemento "ALL"
            if (category !== "ALL") {
                allFilter.style.display = "block"; // Mostra "ALL" quando un filtro è attivo
                setTimeout(() => {
                    allFilter.style.opacity = "1"; // Animazione di apparizione
                }, 10); // Piccola attesa per permettere l'animazione
            } else {
                allFilter.style.opacity = "0"; // Nascondi "ALL" se è selezionato
                setTimeout(() => {
                    allFilter.style.display = "none"; // Nascondi completamente dopo l'animazione
                }, 500); // Aspetta la fine dell'animazione
            }
        });
    });

    // Tooltip
    imagestool.forEach(image => {
        const container = image.parentElement; // Ottieni il contenitore dell'immagine

        image.addEventListener("mouseenter", () => {
            const text = container.querySelector(".image-text").textContent; // Ottieni il testo dall'elemento image-text
            tooltip.textContent = text; // Imposta il testo del tooltip
            tooltip.style.opacity = 1; // Rendi il tooltip visibile
        });

        image.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 10 + "px"; // Posiziona il tooltip a destra del cursore
            tooltip.style.top = e.pageY + 10 + "px"; // Posiziona il tooltip sotto il cursore
        });

        image.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0; // Nascondi il tooltip
        });
    });

    // Hover per cambiare immagini
    const galleryImages = document.querySelectorAll(".image-container img");

    // Salva l'immagine originale per ogni immagine
    const originalSrcMap = new Map();
    galleryImages.forEach((img) => {
        originalSrcMap.set(img, img.src); // Salva il valore originale di `src`
    });

    galleryImages.forEach((img) => {
        img.addEventListener("mouseover", () => {
            galleryImages.forEach((otherImg) => {
                if (otherImg !== img) {
                    otherImg.src = otherImg.dataset.hover || originalSrcMap.get(otherImg); // Cambia immagine degli altri
                    otherImg.classList.add("replaced"); // Aggiungi una classe visiva (opzionale)
                }
            });
        });

        img.addEventListener("mouseout", () => {
            galleryImages.forEach((otherImg) => {
                otherImg.src = originalSrcMap.get(otherImg); // Torna all'immagine originale
                otherImg.classList.remove("replaced"); // Rimuovi la classe visiva
            });
        });
    });

    // SUPERFORMA
    const imagesproj1 = [
        '../src/01_01.png',
        '../src/01_02.png',
        '../src/01_01.png',
        '../src/01_01.png',
        '../src/01_01.png'
    ];

    let currentIndex1 = 0;

    function changeImage1(direction) {
        currentIndex1 += direction;

        if (currentIndex1 < 0) {
            currentIndex1 = imagesproj1.length - 1;
        } else if (currentIndex1 >= imagesproj1.length) {
            currentIndex1 = 0;
        }

        document.getElementById('mainImage1').src = imagesproj1[currentIndex1];
    }

    // DOUBLECHECK
    const imagesproj04 = [
        '../src/04_01.png',
        '../src/04_02.png',
        '../src/04_03.png',
        '../src/04_04.png',
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

    // AMAROFAVERO
    const imagesproj12 = [
        '../src/12_01.png',
        '../src/12_02.png',
        '../src/12_03.png',
        '../src/12_04.png',
    ];
    let currentIndex12 = 0;

    function changeImage12(direction) {
        currentIndex12 += direction;

        if (currentIndex12 < 0) {
            currentIndex12 = imagesproj12.length - 1;
        } else if (currentIndex12 >= imagesproj12.length) {
            currentIndex12 = 0;
        }

        document.getElementById('mainImage12').src = imagesproj12[currentIndex12];
    }

    // DISCOJOURNAL
    const imagesproj06 = [
        '../src/06_01.png',
        '../src/12_02.png',
        '../src/12_03.png',
        '../src/12_04.png',
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
});
