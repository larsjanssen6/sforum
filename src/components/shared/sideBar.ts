import { Router } from 'aurelia-router'
import { autoinject } from "aurelia-framework"

@autoinject
export class sideBar {
    constructor(private router: Router) { }

    home() {
        this.router.navigate("dashboard");
    }
}