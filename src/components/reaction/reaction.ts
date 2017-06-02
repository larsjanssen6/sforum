import { bindable } from 'aurelia-framework';
import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class reaction {

    //This component shows a reaction

    @bindable reaction;

    editing: boolean;

    constructor(private http: HttpClient, public event: EventAggregator) {
        this.editing = false;
    }    


    destroy() {
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder deze reactie',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (isOk) => {
            if (isOk) {
                this.http.fetch('reaction/destroy', {
                    body: json(this.reaction)
                }).then(data => {
                    swal({
                        title: 'Verwijderd',
                        text: 'De reactie is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    this.event.publish('destroy-reaction', this.reaction);
                });
            }
        });
    }

    update() {
        this.http.fetch('reaction/update', {
            body: json(this.reaction)
        })
            .then(response => {
                if (response.status == 200) {
                    swal({
                        title: "Reactie succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

                this.editing = false;
            });
    }
}