﻿import { Router } from 'aurelia-router'
import { autoinject } from "aurelia-framework"

@autoinject
export class sideBar {

    //This component makes sure there is a sidebar

    constructor(private router: Router) { }

    home() {
        this.router.navigate("dashboard");
    }
}