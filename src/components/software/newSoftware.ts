import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class newSoftware {

    //This component makes sure new software can be created

    corporations = [];
    public software = new Software();

    constructor(private http: HttpClient, private router: Router) {
        this.fetchCorporations();
    }

    fetchCorporations() {
        this.http.fetch('corporation/index')
            .then(response => response.json())
            .then(data => {
                this.corporations = data;
            });
    }

    store() {
        this.http.fetch('software/store', {
            body: json(this.software)
        }).then(response => {
            if (response.status == 200) {
                swal({
                    title: "Software succesvol aangemaakt",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            }

            this.router.navigate("software");
        });
    }
}

export class Software {
    id: number;
    name: string;
    corporation_id: number;
}
