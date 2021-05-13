
function swapItems(i1, i2) {

    const draggableItemsContainer = document.querySelector('ul');
    
    // get items from dom
    const item1 = document.querySelector("li[data-index='" + i1 + "']")
    const item2 = document.querySelector("li[data-index='" + i2 + "']")

    // create array of list items
    var elements = [...draggableItemsContainer.children]

    // get indices of items in array
    const index1 = elements.indexOf(item1)
    const index2 = elements.indexOf(item2)

    // swap items
    elements.splice(index1, 1, item2)
    elements.splice(index2, 1, item1)

    // remove all list items
    while (draggableItemsContainer.lastChild) {
        draggableItemsContainer.removeChild(draggableItemsContainer.lastChild);
    }

    // add list items in new order
    elements.forEach(element => {
        draggableItemsContainer.appendChild(element)
    });
    
}

function initDragAndDrop() {

    const draggableItemsContainer = document.querySelector('ul');

    draggableItemsContainer.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragged');
    });
    draggableItemsContainer.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragged');
    });   
    
    // ...
    draggableItemsContainer.addEventListener('dragenter', (e) => {
        if (e.target.dataset.index && !e.target.classList.contains('dragged')) {
            e.target.classList.add('dragover');
        }    
    });
    draggableItemsContainer.addEventListener('dragleave', (e) => {
        if (e.target.dataset.index) {
            e.target.classList.remove('dragover');
        }
    });  
    
    draggableItemsContainer.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.index); // data-index
        e.target.classList.add('dragged');
    });
    // ...
    draggableItemsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    draggableItemsContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        e.target.classList.remove('dragover');
        const index1 = e.dataTransfer.getData('text/plain');
        const index2 = e.target.dataset.index;
        swapItems(index1, index2)
    });

}

function initTouch() {
    const draggableItemsContainer = document.querySelector('ul');
    let initialX = 0;
    let initialY = 0;
    let lastX = 0;
    let lastY = 0;

    draggableItemsContainer.addEventListener('touchstart', (e) => {
        e.target.classList.add('dragged');
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    });

    draggableItemsContainer.addEventListener('touchmove', (e) => {

        const x = e.touches[0].clientX - initialX;
        const y = e.touches[0].clientY - initialY; 
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;

        const dragOverElements = [...document.getElementsByClassName('dragover')]

        const elementList = document.elementsFromPoint(lastX, lastY)
        if (elementList.length > 1 && elementList[1].hasAttribute('draggable')) {
            if (dragOverElements) {
                dragOverElements.forEach(element => {
                    if (![...elementList].includes(element)) element.classList.remove('dragover')
                });
            }
            elementList[1].classList.add('dragover')
        }

        e.target.style.transform = "translate(" + x + "px, " + y + "px)"; 
    });

    draggableItemsContainer.addEventListener('touchend', (e) => {

        const dragOverElements = [...document.getElementsByClassName('dragover')]
        if (dragOverElements) {
            dragOverElements.forEach(element => {
                element.classList.remove('dragover')
            });
        }

        e.target.classList.remove('dragged')
        const elementList = document.elementsFromPoint(lastX, lastY)
        if (elementList.length > 1 && elementList[1].hasAttribute('draggable')) {
            // die swapItems Funktion wurde bereits in Aufgabe 1b von Ihnen erstellt
            swapItems(e.target.dataset.index, elementList[1].dataset.index);
        }        
        e.target.style.transform = "translate(0px, 0px)";
    });
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
  }

console.log(isTouchDevice())

if (isTouchDevice()) initTouch();
else initDragAndDrop();
