import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"

@autoinject
export class softwares {

    softwares = [];

    constructor(private http: HttpClient) {
        this.fetchSoftwares();
    }

    fetchSoftwares() {
        //this.http.fetch('software/index', {
        //        body: json()
        //    })
        //    .then(response => response.json())
        //    .then(data => {
        //        this.softwares = data;
        //    });
    }

    destroy(forum) {
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder dit forum',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (forum) => {
            this.http.fetch('forum/destroy').then(data => {
                swal({
                    title: 'Verwijderd',
                    text: 'Het forum is succesvol verwijderd',
                    type: 'success',
                    showConfirmButton: false,
                });
            });
        });
    }
}

