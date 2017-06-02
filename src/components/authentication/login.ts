import * as swal from 'sweetalert';
import { autoinject } from "aurelia-framework"
import { HttpClient, json } from "aurelia-fetch-client"
import { AuthService } from "aurelia-authentication"
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router'

@autoinject
export class login {

    email = "";
    password = "";

    constructor(private auth: AuthService,
                private http: HttpClient,
                private event: EventAggregator,
                private router: Router) { }

    login() {
        this.auth.login({
            email: this.email,
            password: this.password
        }).then(response => {
            this.event.publish('signedIn', true);

            swal({
                title: "U bent succesvol ingelogd",
                type: "success",
                showConfirmButton: false,
                timer: 2000
            });

              this.router.navigate("dashboard");
            })
            .catch(err => {
                swal({
                    title: "Inloggegevens zijn onjuist",
                    type: "warning",
                    showCancelButton: true,
                    showConfirmButton: false,
                    closeOnConfirm: true
                });
            });
    }

    logout() {
        this.auth.logout('');
    }
} 