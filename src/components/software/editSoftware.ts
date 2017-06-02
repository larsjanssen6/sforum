import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class editSoftware {

    //This component makes sure software can be edited

    corporations = [];
    software: {};

    constructor(private http: HttpClient, private router: Router) {
        this.fetchCorporations();
    }

    attached() {
        this.getSoftware();
    }

    getSoftware() {
        this.http.fetch('software/show', {
            body: json(this.router.currentInstruction.params.id)
        })
            .then(response => response.json())
            .then(data => {
                this.software = data;
            });
    } 

    fetchCorporations() {
        this.http.fetch('corporation/index')
            .then(response => response.json())
            .then(data => {
                this.corporations = data;
            });
    }

    update() {
        this.http.fetch('software/update', {
            body: json(this.software)
        }).then(response => {
        if (response.status == 200) {
            swal({
                title: "Software succesvol geupdatet",
                type: "success",
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
    }
}

