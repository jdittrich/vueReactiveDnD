import {provide, ref, reactive, computed} from './vue/vue.js';

const dragContext = {
    name:"dragContext",
    props:{
        onDragend:Function
    },
    setup: function(props, context){
        // SELECTION HANDLING

        // a selection is  {id:<string>, domRef:<DOMElement>}
        const selectedElements = reactive([]); //array of selections
        const setSelection = newSelection => selectedElements[0] = newSelection; //but for now we only have one selection
        provide('setSelection',setSelection);

        const domRect = computed(function(){
            if(selectedElements[0]){
                return selectedElements[0].domRef.getBoundingClientRect();
            } else {
                return null;
            }
        });
        

        // MOUSE EVENT HANDLING
        
        const isDragging = ref(false);
        provide('isDragging',isDragging)

        // Where the last mousedown was
        let downPoint = {
            x: null, 
            y: null
        };

        // Differences to last mousedown
        let diffToDownPoint = ref({ //ref so one can just replace .value
            x: null,
            y: null
        });

        provide("diffToDownPoint",diffToDownPoint);

        let mousedown =  function(event){
            isDragging.value = true;

            downPoint.x = event.clientX;
            downPoint.y = event.clientY;
        };

        const pointDifference = function(point1, point2){
            return {
                x:point2.x - point1.x,
                y:point2.y - point1.y
            };
        };


        let mousemove = function(event){
            if(isDragging.value === true){
                diffToDownPoint.value = pointDifference(
                    downPoint,
                    {
                        x:event.clientX,
                        y:event.clientY
                    }
                );
            }
        };

        let mouseup = function(event){
            if(isDragging.value == true && props.onDragend){
                props.onDragend(event,selectedElements);
            }
            isDragging.value = false;
        };

        return {
            mouseup,
            mousedown,
            mousemove,
            domRect,
            diffToDownPoint
        }
    },
    template:`
    <div v-on:mousedown="mousedown" v-on:mouseup="mouseup" v-on:mousemove="mousemove">
        <slot></slot>
        <span v-if=domRect>x: {{domRect.x}}, y: {{domRect.y}}, w: {{domRect.width}}  h:{{domRect.height}}</span><br>
        <span v-if=diffToDownPoint.x> x: {{diffToDownPoint.x}}, y: {{diffToDownPoint.y}} </span>

    </div>
    `
}

export {dragContext}