import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class editForum {

    public forum: {};

    constructor(private http: HttpClient, private router: Router) {
        
        this.getForum();
    }

    created() {
        this.getForum();
    }

    getForum() {
        this.http.fetch('forum/show', {
            body: json(this.router.currentInstruction.params.id)
        })
            .then(response => response.json())
            .then(data => {
                this.forum = data;
            });
    }

    update() {
        this.http.fetch('forum/update', {
            body: json(this.forum)
        }).then(response => {
            if (response.status == 200) {
                swal({
                    title: "Forum succesvol geupdatet",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    }
}