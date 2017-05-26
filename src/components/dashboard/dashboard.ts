import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class dashboard {

    public forums: ForumModel[] = [];

    constructor(private http: HttpClient, private router: Router) {
        this.fetchForums();
    }

    fetchForums() {
        this.http.fetch('forum/index')
            .then(response => response.json())
            .then(data => {
                this.forums = data;
            });
    }

    destroy($event, forum) {
        event.stopPropagation();
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder dit forum',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (isOk) => {
            if (isOk) {
                this.http.fetch('forum/destroy', {
                    body: json(forum)
                }).then(data => {
                    this.forums = this.forums.filter((obj) => obj.id != forum.id);

                    swal({
                        title: 'Verwijderd',
                        text: 'Het forum is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });
                });
            }
        });
    }

    link(forum) {
        event.stopPropagation();
        this.router.navigate("berichten/" + forum.id);
    }

    editUrl(event, forum) {
        event.stopPropagation();
        this.router.navigate("forum/bewerk/" + forum.id);
    }

    isEmpty(forums) {
        return forums == [];
    }
}

export class ForumModel {
    id: number;
    name: string;
    description: string;
}

