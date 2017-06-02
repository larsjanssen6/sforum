import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class users {

    //This component returns all users

    users = [];

    constructor(private http: HttpClient, private router: Router) {
        this.fetchUsers();
    }

    fetchUsers() {
        this.http.fetch('user/index')
            .then(response => response.json())
            .then(data => {
                this.users = data;
            });
    }

    destroy(event, user) {
        event.stopPropagation();

        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder deze gebruiker',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (ok) => {
            if (ok) {
                this.http.fetch('user/destroy', {
                    body: json(user)
                })
                    .then(data => {
                        swal({
                            title: 'Verwijderd',
                            text: 'Gebruiker is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                        });

                        this.users = this.users.filter((obj) => obj.id != user.id);
                    });
            }         
        });
    }

    editUrl(event, user) {
        event.stopPropagation();
        this.router.navigate("gebruiker/bewerk/" + user.id);
    }
}

