import { HttpClient, json } from "aurelia-fetch-client"
import * as jwt_decode from 'jwt-decode';
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'
import { AuthService } from 'aurelia-authentication';

@autoinject
export class editUser {

    public corporations: Corporation[] = [];
    public user = new User();

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
              swal({
                  title: "Gebruiker succesvol geupdatet",
                  type: "success",
                  showConfirmButton: false,
                  timer: 2000
              });
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

