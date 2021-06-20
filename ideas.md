## central drag manager

generates:
* Events that send out the "holds data" 
* … or should I rather provide a stream of all the data? Like: This is the mouse position, this is currently selected…
    * …This is the mouse position, the initial mouse position, the mouse state
    * …This is the selected element, its type

holds data:
* draggables that are selected
* draggable strategy
* types of stuff that can be dragged (register with it!)


* inform droppables:
 * element is dragged
 * element is "over you" 

## Drag-initiators

* draggables can *initiate* a drag. 

Setup: 
* need a ref to the to-be-dragged Dom element
* can set a drag strategy

## Draggables

* are drag initiators
* need a ref ot the to-be-dragged element
* provide position data to the element
* can be cloned or directly dragged (basically, they are always cloned, but sometimes the original remains visible)

Advanced:
* snap-to
* possibly know their containers (the container can provide overlays and stuff)

Needs to provice:
* moveMe-Function?

## Droppables

Setup: 
* need a ref to the element representing the drop zone. 

Droppables:
* Are informed when a draggable is dropped on them
* Can only recieve certain kinds 
* can autoscroll when a droppable element is over them


provides this reactive data: 


# Cases

* very simple: 
    * drag an object 
    * draw a line of mouse movement
* advanced selection
    * drag multiple objects (needs holding a selection) → that probably is using "move" on multiple objects rather than on
