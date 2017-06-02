import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class newCorporation {

    //This component makes sure a new corporation can be created

    corporation: {}

    constructor(private http: HttpClient, private router: Router) { }

    store() {
        this.http.fetch('corporation/store', {
            body: json(this.corporation)
        }).then(response => {
            if (response.status == 200) {
                swal({
                    title: "Corporatie succesvol aangemaakt",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });

                this.router.navigate("corporaties");
            }
        });
    }
}