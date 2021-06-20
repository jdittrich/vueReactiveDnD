import {inject} from '../vue/vue.js';

const dragOverlay = {
    name:"drag-overlay",
    props:{},
    setup: function(props, context){
        const diffToDownPoint = inject("diffToDownPoint");
        
    },
    template:`
        <div>
            <slot>
            </slot>
        </div>`
};

export {dragOverlay};