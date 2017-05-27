import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class editCorporation {

    corporation: {}

    constructor(private http: HttpClient, private router: Router) {}

    created() {
        this.getCorporation();
    }

    getCorporation() {
        this.http.fetch('corporation/show', {
            body: json(this.router.currentInstruction.params.id)
        })
            .then(response => response.json())
            .then(data => {
                this.corporation = data;
            });
    }

    update() {
        this.http.fetch('corporation/update', {
            body: json(this.corporation)
        }).then(response => {
            if (response.status == 200) {
                swal({
                    title: "Corporatie succesvol geupdatet",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });

                this.router.navigate("corporaties");
            }
        });
    }
}