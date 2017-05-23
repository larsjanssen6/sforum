import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"

@autoinject
export class newForum {

    forum: { name: "", description: "" };

    constructor(private http: HttpClient) { }

    store() {
        this.http.fetch('forum/store', {
                body: json(this.forum)
            }).then(response => {
              if (response.status == 200) {
                  swal({
                      title: "Forum succesvol aangemaakt",
                      type: "success",
                      showConfirmButton: false,
                      timer: 2000
                  });

                  this.forum.name = "";
                  this.forum.description = "";
              }          
        });
    }
}