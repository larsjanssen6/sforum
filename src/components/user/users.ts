import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"

@autoinject
export class users {

    users = [];

    constructor(private http: HttpClient) {
        this.fetchUsers();
    }

    fetchUsers() {
        this.http.fetch('user/index')
            .then(response => response.json())
            .then(data => {
                this.users = data;
            });
    }

    destroy(forum) {
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder dit forum',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (forum) => {
            this.http.fetch('forum/destroy').then(data => {
                swal({
                    title: 'Verwijderd',
                    text: 'Het forum is succesvol verwijderd',
                    type: 'success',
                    showConfirmButton: false,
                });
            });
        });
    }
}

