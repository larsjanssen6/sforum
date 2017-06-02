import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class message {

    //This component shows a message

    message: {  reactions: Reaction[], id: "" };
    editing: boolean;
    reaction = new Reaction;

    constructor(private http: HttpClient, private router: Router) {
        this.editing = false;
    }

    created() {
        this.getMessage();
    }

    async activate(params) {
        this.reaction.message_id = params.id;
    }

    getMessage() {
        this.http.fetch('message/show', {
            body: json(this.router.currentInstruction.params.id)
        })
            .then(response => response.json())
            .then(data => {
                this.message = data;
            });
    }

    update() {
        this.http.fetch('message/update', {
            body: json(this.message)
        })
            .then(response => {
                if (response.status == 200) {
                    swal({
                        title: "Bericht succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

                this.editing = false;
            });
    }

    destroy() {
        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder dit bericht',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (isOk) => {
            if (isOk) {
                this.http.fetch('message/destroy', {
                    body: json(this.message)
                }).then(data => {
                    swal({
                        title: 'Verwijderd',
                        text: 'Het bericht is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });
                });

                this.router.navigate("/dashboard");
            }
        });
    }

    post() {
        this.http.fetch('reaction/store', {
            body: json(this.reaction)
        }).then(response => response.json())
            .then(data => {
                swal({
                    title: "Reactie succesvol aangemaakt",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });

                console.log(data);
                this.message.reactions.push(data);
            });
    }
}

export class Reaction {
    message_id: number;
    account_id: number;
    reaction: string;
}