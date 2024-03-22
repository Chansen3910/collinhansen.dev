<script>
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';

    export let self;

    const lockX = true;
    const lockY = false;
    let dragElement;
    let originRect;
    let mouseX = 0;
    let mouseY = 0;
    let deltaMouseX = 0;
    let deltaMouseY = 0;

    onMount(function() {
        if(browser) document.body.style.overflow = "hidden";
    });

    onDestroy(function() {
        if(browser) document.body.style.overflow = "visible";
    });

    //Set the #mouseX and #mouseY members when dragging over the container.
    //lockX and lockY disable the associated axes.
    function documentDragover(e) {
        e.preventDefault();
        if(!lockX) mouseX = e.pageX;
        if(!lockY) mouseY = e.pageY;
    }

    function documentTouchmove(e) {
        //You should not be able to scroll the document while this element is connected.
        //This indicates that the document was reloaded and the previous scroll position was used to extrapolate the page.
        //This behavior is strenuous and unacceptable..
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function onTouchStart(e) {
        originRect = dragElement.getBoundingClientRect();

        //Calculate the equivalent of the layerX and layerY members of the dragstart event.
        const layerX = e.touches[0].clientX - originRect.left;
        const layerY = e.touches[0].clientY - originRect.top;

        //Now we can use them to calculate the delta members.
        if(!lockX) deltaMouseX = (-layerX);
        if(!lockY) deltaMouseY = (-layerY);
    }

    function onTouchMove(e) {
        e.stopPropagation();
        //This is all the same as the drag and drop api except that the pageX and pageY are members of the first touch in the touches array (active first touch which initiated the touchstart event).
        if(!lockX) mouseX = e.touches[0].pageX;
        if(!lockY) mouseY = e.touches[0].pageY;
        dragElement.style.transform = `translate(${ (mouseX + deltaMouseX) }px, ${ (mouseY + deltaMouseY) }px)`;
    }

    function onTouchEnd(e) {
        let droppedRect = getElementPageVector(dragElement);
        if(Math.abs(droppedRect.top) > (0.3 * window.innerHeight)) {
            fadeAndRemove();
            return;
        }
        relax();
    }

    //Emits at the start of the drag, sets variables in a way that the viewport can change and still works properly.
    function onDragStart(e) {
        //Get the originRect before dragging.
        //The originRect must be stored to relax() the container to the start point if the drag was not far enough to fade() and disconnect.
        originRect = dragElement.getBoundingClientRect();
        //Set the deltas from event object layer coordinates on dragstart.
        if(!lockX) deltaMouseX = (-e.layerX);
        if(!lockY) deltaMouseY = (-e.layerY);
        //Make the ghost drag image invisible.
        //If not invisible, it will show the element ghost and looks bad.
        let img = new Image();
        img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=`;
        e.dataTransfer.setDragImage(img, 0, 0);
    }

    //Emits while dragging from the drag "handle" elements to transform the container.
    function onDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        dragElement.style.transform = `translate(${ (mouseX + deltaMouseX) }px, ${ (mouseY + deltaMouseY) }px)`;
    }

    //Emits when the drag stops.
    //Decides whether the element was dragged far enough to fade() and disconnect().
    //If not, the element relax()es back to the #originRect position set in onDragstart().
    function onDragEnd(e) {
        let droppedRect = getElementPageVector(dragElement);
        if(Math.abs(droppedRect.top) > (0.3 * window.innerHeight)) {
            fadeAndRemove();
            return;
        }
        relax();
    }

    function getElementPageVector(element) {
        let rect = element.getBoundingClientRect();
        return({
            left: (rect.left + window.scrollX),
            top: (rect.top + window.scrollY)
        });
    }

    function relax(steps = 12) {
        //linearly return the page values back to the originRect.
        let droppedRect = getElementPageVector(dragElement);
        let dropped = {
            x: droppedRect.left,
            y: droppedRect.top
        };
        let origin = {
            x: originRect.left,
            y: originRect.top
        };

        const distance = Math.sqrt((dropped.x - origin.x) ** 2 + (dropped.y - origin.y) ** 2);
        const segmentLength = distance / (steps + 1);
        let unitVector = {
            x: ((dropped.x - origin.x) / distance),
            y: ((dropped.y - origin.y) / distance)
        };

        let i = steps;
        let interval = setInterval(function() {
            if(--i <= 0) clearInterval(interval);
            let point = {
                x: (origin.x + (segmentLength * i * unitVector.x)),
                y: (origin.y + (segmentLength * i * unitVector.y))
            };
            dragElement.style.transform = `translate(${ point.x }px, ${ point.y }px)`;
        }.bind(this), i);
    }

    function fadeAndRemove(steps = 12, duration = 0.3) {
        let frametime = (duration * 1000) / steps;
        let delta = (Number(window.getComputedStyle(dragElement).opacity)) / steps;
        let interval = setInterval(function() {
            let opacity = Number(window.getComputedStyle(dragElement).opacity);
            if(opacity <= 0) {
                clearInterval(interval);
                //dragElement.parentNode.removeChild(dragElement);
                self.$destroy();
            }
            dragElement.style.opacity = `${ opacity - delta }`;
        }, frametime);
    }
</script>

<svelte:document
    on:dragover={ documentDragover }
    on:touchstart={ documentTouchmove }/>

<div id="container" class="col center end" bind:this={ dragElement }>
    <div id="drag-handle"
        class="col center"
        draggable="true"
        role="none"
        on:dragstart={ onDragStart }
        on:drag={ onDrag }
        on:dragend={ onDragEnd }
        on:touchstart|passive={ onTouchStart }
        on:touchmove|passive={ onTouchMove }
        on:touchend={ onTouchEnd }>

        <svg style="color:#1345B7;fill:#1345B7;" width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0796 2.73553C11.7779 3.59132 11.6503 4.8512 10.7945 5.54955C7.86908 7.93674 6 11.5672 6 15.64C6 21.1654 10.4746 25.64 16 25.64C21.5254 25.64 26 21.1654 26 15.64C26 11.7746 22.8654 8.64 19 8.64C15.1346 8.64 12 11.7746 12 15.64C12 17.8554 13.7846 19.64 16 19.64C18.2154 19.64 20 17.8554 20 15.64C20 15.0846 19.5554 14.64 19 14.64C18.4446 14.64 18 15.0846 18 15.64C18 16.7446 17.1046 17.64 16 17.64C14.8954 17.64 14 16.7446 14 15.64C14 12.8754 16.2354 10.64 19 10.64C21.7646 10.64 24 12.8754 24 15.64C24 20.0646 20.4246 23.64 16 23.64C11.5754 23.64 8 20.0646 8 15.64C8 9.56543 12.9254 4.64 19 4.64C25.0746 4.64 30 9.56543 30 15.64C30 23.3746 23.7346 29.64 16 29.64C8.26543 29.64 2 23.3746 2 15.64C2 10.3128 4.45092 5.56326 8.26553 2.45045C9.12132 1.7521 10.3812 1.87974 11.0796 2.73553Z" fill="#1345B7"/>
        </svg>

        <span>Slide up to open</span>

    </div>
</div>

<style>
    #container {
        height: 100vh;
        width: 100vw;
        position: absolute;
        z-index: 9999;
        bottom: 0px;
        left: 0px;
        background-color: rgba(0, 0, 33, 0.7);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
    }

    #drag-handle {
        padding: 24px;
    }
    #drag-handle > * {
        cursor: pointer;
    }
    #drag-handle > *:not(:last-child) {
        margin-bottom: 24px;
    }
    #drag-handle span {
        font-size: 21px;
        font-weight: 500;
    }
</style>