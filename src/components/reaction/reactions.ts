import { bindable } from 'aurelia-framework';
import { autoinject } from "aurelia-framework"
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class reactions {

    //This component shows all messages

    @bindable reactions;

    constructor(public event: EventAggregator) {}  

    attached() {
        this.event.subscribe('destroy-reaction', response => {
            this.reactions = this.reactions.filter(reaction => reaction.id != response.id);
        });
    }
}