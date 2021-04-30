import {inject,  ref, reactive, onMounted, computed} from './vue/vue.js';

const simpleRect = {
    name:"simple-rect",
    props:{
    },
    setup: function(props, context){
        

        return {
        };
    },
    template:`
        <div style="background-color:#AAA">I can be dragged! Yey!</div>`

}

export {simpleRect}