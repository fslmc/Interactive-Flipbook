// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

// Lazy Load Background Images
const lazyLoadBackgrounds = () => {
    const elements = document.querySelectorAll('[data-bg]');
    
    const loadBackground = (entry) => {
        const element = entry.target;
        const bgImage = element.getAttribute('data-bg');
        element.style.backgroundImage = `url('${bgImage}')`;
        element.style.backgroundSize = 'cover';
        element.removeAttribute('data-bg'); // Remove the attribute after loading
        observer.unobserve(element); // Stop observing the element
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadBackground(entry);
            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });
};

// Initialize Lazy Loading
document.addEventListener('DOMContentLoaded', lazyLoadBackgrounds);
const papers = [];
for (let i = 1; i <= 9; i++) {
    papers.push(document.querySelector(`#paper${i}`));
}

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Business Logic
let currentLocation = 1;
let numOfPapers = 9;
let maxLocation = numOfPapers + 1;

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-275px)";
    nextBtn.style.transform = "translateX(275px)";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
    
    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if(currentLocation < maxLocation) {
        if (currentLocation === 1) {
            openBook();
        }
        papers[currentLocation - 1].classList.add("flipped");
        papers[currentLocation - 1].style.zIndex = currentLocation;
        if (currentLocation === numOfPapers) {
            closeBook(false);
        }
        currentLocation++;
        showInteractiveObjects(currentLocation);
        console.log(currentLocation);
    }
}

function goPrevPage() {
    if(currentLocation > 1) {
        if (currentLocation === 2) {
            closeBook(true);
        }
        papers[currentLocation - 2].classList.remove("flipped");
        papers[currentLocation - 2].style.zIndex = numOfPapers - currentLocation + 2;
        if (currentLocation === numOfPapers + 1) {
            openBook();
        }
        currentLocation--;
        showInteractiveObjects(currentLocation);
    }
}

function showInteractiveObjects(location) {
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        if (parseInt(draggable.getAttribute('data-page')) === location || (location === 3 && draggable.id === 'road')) {
            draggable.style.display = 'block';
            draggable.style.zIndex = 100;
        } else {
            draggable.style.display = 'none';
        }
    });
}

showInteractiveObjects(currentLocation);

document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.style.display = 'none';
        }, 0);
    }

    function dragEnd(e) {
        e.target.style.display = 'block';
        e.target.style.left = `${e.pageX - e.target.offsetWidth / 2}px`;
        e.target.style.top = `${e.pageY - e.target.offsetHeight / 2}px`;
    }

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        draggable.style.left = `${e.pageX - draggable.offsetWidth / 2}px`;
        draggable.style.top = `${e.pageY - draggable.offsetHeight / 2}px`;
    });
});
