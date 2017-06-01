import { HttpClient, json } from "aurelia-fetch-client"
import * as jwt_decode from 'jwt-decode';
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'
import { AuthService } from 'aurelia-authentication';

@autoinject
export class editUser {

    public corporations: Corporation[] = [];
    public user: {};

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

    created() {
        this.fetchCorporations();
        this.getUser();
    }

    getUser() {
        this.http.fetch('user/show', {
            body: json(this.router.currentInstruction.params.id)
        })
            .then(response => response.json())
            .then(data => {
                this.user = data;
            });
    }

    fetchCorporations() {
        this.http.fetch('corporation/index', {
            body: json(jwt_decode(this.authService.getAccessToken()).corporation_id)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.corporations = data;
            });
    }

    update() {
        this.http.fetch('user/update', {
            body: json(this.user)
        }).then(response => {
            if (response.status == 200) {
                swal({
                    title: "Gebruiker succesvol geupdatet",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    }
}

export class Corporation {
    id: number;
    name: string;
    email: string;
    address: string;
    zip: string;
}