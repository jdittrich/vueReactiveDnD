import {unref} from './vue/vue.js'
/**
 * 
 * @param {Map} draggableElements 
 * @param {Map} droppableElements 
 * @param {*} dragged 
 * @param {*} mode 
 * @returns 
 */
const findDropTarget = function(draggableElements,droppableElements, draggedId){
    //if this would be universal, there would be the choice of selected Elements and point
    //point being useful when dragging many elements (then the mouse cursor counts)
    //selectedWhenDraggingOneElement, I guess. 
    const draggedElement = draggableElements.get(unref(draggedId));
    const targetId = whereIsRectContained(droppableElements,draggedElement);
    return targetId;
};


const whereIsRectColliding = function(collisionPatients,collisionAgent){
    let collisions = [];

    collisionPatients.forEach(patient => {
        if(isRectCollidingWithRect(
            patient.domRef.getBoundingClientRect(),
            collisionAgent.domRef.getBoundingClientRect
        )){
            collisions.push(patient);
        }
    });

    return collisions;
};

const whereIsRectContained = function(droppables,draggedDom){
    let containment = [];

    droppables.forEach((droppable,id) => {
        const isInside = isInnerRectInOuterRect(
            draggedDom.getBoundingClientRect(),
            droppable.getBoundingClientRect()
        );
        if(isInside){
            containment.push(id);
        }
    });

    return containment[0];
};

const whereIsPointContained = function(containers, point){
    let containment = [];

    containers.forEach(container => {
        if(
            isPointInRect(
                point,
                container.domRef.getBoundingClientRect()
        )){
            containment.push(container);
        }
    });

    return containment;
};



/**
 * Do the rectangles intersect?
 * The results do not depend on which rect is first parameter.
 * 
 * @param {DOMRect} rect1 
 * @param {DOMRect} rect2 
 * @returns {Boolean}
 */
const isRectCollidingWithRect = function(rect1, rect2){
    let doesCollide = null; 

    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        doesCollide = true;
     } else {
        doesCollide = false;
     }

     return doesCollide;     
}

/**
 * is the inner rect totally enclosed by the outer rect?
 * 
 * @param {DOMRect} inner 
 * @param {DOMRect} outer 
 * @returns {boolean} 
 */

const isInnerRectInOuterRect = function (inner, outer){
    let doesContain = null;
    if(
        inner.y > outer.y && //bottom of top side
        inner.x + inner.width < outer.x + outer.width &&   //left of right Side
        inner.y + inner.height < outer.y + outer.height && //top of bottom side
        inner.x > outer.x  //right of left side
    ){ 
        doesContain = true; 
    } else {
        doesContain = false;
    }

    return doesContain;
}

/**
 * Is the point inside the rectagle 
 * 
 * @param {DOMPoint} point 
 * @param {DOMRect} rect 
 * @returns {boolean}
 */

const isPointInRect = function(point,rect){
    let isInRect = null; 
    if(
        point.y > rect.y && //bottom of top side
        point.x < rect.x + rect.width &&  //left of right Side
        point.y < rect.y + rect.height && //top of bottom side
        point.x > rect.x //right of left side
    ){
        isInRect = true;
    } else {
        isInRect = false;
    }
    return isInRect;
}

export {
    isInnerRectInOuterRect,
    isPointInRect,
    isRectCollidingWithRect,
    whereIsPointContained,
    whereIsRectContained,
    whereIsRectColliding,
    findDropTarget
};