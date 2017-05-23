import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"

@autoinject
export class corporations {

    corporations = [];


    constructor(private http: HttpClient) {
        this.fetchCorporations();
    }

    fetchCorporations() {
        this.http.fetch('corporation/index')
            .then(response => response.json())
            .then(data => {
                this.corporations = data;
            });
    }

    destroy(forum) {
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder deze corporatie',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (isOk) => {
            if (isOk) {
                this.http.fetch('corporation/destroy', {
                    body: json(forum)
                }).then(data => {
                    this.corporations = this.corporations.filter((obj) => obj.id != forum.id);

                    swal({
                        title: 'Verwijderd',
                        text: 'Corporatie is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });
                });
            }
        });
    }
}