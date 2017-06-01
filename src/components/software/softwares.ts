import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { AuthService } from 'aurelia-authentication';
import * as jwt_decode from 'jwt-decode';

@autoinject
export class softwares {

    public softwares: SoftwareModel[] = [];

    constructor(private http: HttpClient, private authService: AuthService) {
        this.fetchSoftwares();
    }

    fetchSoftwares() {
        this.http.fetch('software/index', {
                body: json(jwt_decode(this.authService.getAccessToken()).corporation_id)
            })
            .then(response => response.json())
            .then(data => {
                this.softwares = data;
            });
    }

    destroy(event, software) {
        event.stopPropagation();

        swal({
            title: 'Weet u het zeker?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ja verwijder deze software',
            cancelButtonText: 'Stop!',
            confirmButtonColor: '#002e5b',
        }, (ok) => {
            if (ok) {
                console.log(software);

                this.http.fetch('software/destroy', {
                    body: json(software)
                }).then(response => {
                    if (response.status === 200) {
                        this.softwares = this.softwares.filter((obj) => obj.id != software.id);

                        swal({
                            title: 'Verwijderd',
                            text: 'Software is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                        });
                    }
                });
            }        
        });
    }
}

export class SoftwareModel {
    id: number;
    name: string;
    corporation_id: number;
    corporation: string
}




