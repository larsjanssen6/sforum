import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class message {

    message: {};
    editing: boolean;

    constructor(private http: HttpClient, private router: Router) {
        this.editing = false;
    }

    created() {
        this.getMessage();
    }

    getMessage() {
        this.http.fetch('message/show', {
            body: json(this.router.currentInstruction.params.id)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.message = data;
            });
    }

    update() {
        this.http.fetch('message/update', {
            body: json(this.message)
        })
            .then(response => {
                if (response.status == 200) {
                    swal({
                        title: "Bericht succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

                this.editing = false;
            });
    }

    destroy() {
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder dit bericht',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (isOk) => {
            if (isOk) {
                this.http.fetch('message/destroy', {
                    body: json(this.message)
                }).then(data => {
                    swal({
                        title: 'Verwijderd',
                        text: 'Het bericht is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });
                });

                this.router.navigate("/dashboard");
            }
        });
    }
}