import { bindable } from 'aurelia-framework';
import { HttpClient } from "aurelia-fetch-client"

export class reaction {
    @bindable reaction;

    editing: boolean;

    constructor(private http: HttpClient) {
        this.editing = false;
    }    

    update() {

    }

    destroy(reaction) {

    }
}