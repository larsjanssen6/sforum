import { HttpClient, json } from "aurelia-fetch-client"
import * as jwt_decode from 'jwt-decode';
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'
import { AuthService } from 'aurelia-authentication';
import { EventAggregator } from 'aurelia-event-aggregator';

@autoinject
export class editUser {

    public corporations: Corporation[] = [];
    public user = new User();

    constructor(private http: HttpClient, private router: Router, private authService: AuthService, private event: EventAggregator) { }

    created() {
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
        this.http.fetch('user/store', {
            body: json(this.user)
        }).then(response => {
            swal({
                title: "Succesvol geregistreerd u kunt nu inloggen",
                type: "success",
                showConfirmButton: false,
                timer: 3000
            });
        });

        this.router.navigate("login");
    }
}

export class Corporation {
    id: number;
    name: string;
    email: string;
    address: string;
    zip: string;
}

export class User {
    id: number;
    corporation_id: number;
    role: number;
    password: string;
    salary: string;
    email: string;
    name: string;
    lastName: string;
    about: string;
    gender: number;
    DateTime: Date;
}

