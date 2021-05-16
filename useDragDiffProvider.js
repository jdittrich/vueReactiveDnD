import {ref} from './vue/vue.js';

const useDragDiffProvider = function (props, context) {

    //----- Variables ------

    const downPoint = { // Where the last mousedown was; only locally used in this function
        x: null,
        y: null
    };


    const diffToDownPoint = ref({ // Differences to last mousedown; ref so one can just replace .value
        x: null,
        y: null
    });

    const isDragging = ref(false);


    // ----- Util -----

    const utilPointDifference = function (point1, point2) {
        return {
            x: point2.x - point1.x,
            y: point2.y - point1.y
        };
    };


    // ----- Event handlers ------

    const diffHandlerDown = function (event) {
        isDragging.value = true;

        downPoint.x = event.clientX;
        downPoint.y = event.clientY;
    };

    const diffHandlerMove = function (event) {
        if (isDragging.value === true) {
            diffToDownPoint.value = utilPointDifference(
                downPoint,
                {
                    x: event.clientX,
                    y: event.clientY
                }
            );
        }
    };
    const diffHandlerUp = function (event) {
        diffToDownPoint.value = {x:0, y:0};
        downPoint.value =  {x:0, y:0};
        isDragging.value = false;
    };

    return {
        diffToDownPoint,
        isDragging,
        diffHandlerDown,
        diffHandlerMove,
        diffHandlerUp
    };
};

export {useDragDiffProvider};