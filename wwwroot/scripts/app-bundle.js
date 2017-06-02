var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-fetch-client", "aurelia-authentication", "aurelia-authentication", "aurelia-event-aggregator", "jwt-decode"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_fetch_client_1, aurelia_authentication_1, aurelia_authentication_2, aurelia_event_aggregator_1, jwt_decode) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(http, config, authService, event) {
            this.http = http;
            this.config = config;
            this.authService = authService;
            this.event = event;
            this.configHttp();
            this.authenticated = this.authService.authenticated;
            this.title = this.authService.authenticated ? "Welkom " + jwt_decode(this.authService.getAccessToken()).name : "SFORUM";
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            var step = new AuthorizeStep(this.authService);
            config.addAuthorizeStep(step);
            config.title = 'Aurelia';
            config.map([
                {
                    route: ['bericht/:id'],
                    name: 'message',
                    moduleId: 'components/message/message',
                    auth: true
                },
                {
                    route: ['berichten/:id/nieuw'],
                    name: 'newMessage',
                    moduleId: 'components/message/newMessage',
                    auth: true
                },
                {
                    route: ['berichten/:id'],
                    name: 'messages',
                    moduleId: 'components/message/messages',
                    auth: true
                },
                {
                    route: ['corporatie/bewerk/:id'],
                    name: 'editCorporation',
                    moduleId: 'components/corporation/editCorporation',
                    auth: true
                },
                {
                    route: ['corporatie/nieuw'],
                    name: 'newCorporation',
                    moduleId: 'components/corporation/newCorporation',
                    auth: true
                },
                {
                    route: ['forum/bewerk/:id'],
                    name: 'editForum',
                    moduleId: 'components/dashboard/editForum',
                    auth: true
                },
                {
                    route: ['forum/nieuw',],
                    name: 'newForum',
                    moduleId: 'components/dashboard/newForum',
                    auth: true
                },
                {
                    route: ['dashboard'],
                    name: 'dashboard',
                    moduleId: 'components/dashboard/dashboard',
                    auth: true
                },
                {
                    route: ['corporaties',],
                    name: 'corporations',
                    moduleId: 'components/corporation/corporations',
                    auth: true
                },
                {
                    route: ['gebruiker/bewerk/:id'],
                    name: 'editUser',
                    moduleId: 'components/user/editUser',
                    auth: true
                },
                {
                    route: ['gebruikers'],
                    name: 'users',
                    moduleId: 'components/user/users',
                    auth: true
                },
                {
                    route: ['software/niuew'],
                    name: 'newSoftware',
                    moduleId: 'components/software/newSoftware',
                    auth: true
                },
                {
                    route: ['software/bewerk/:id'],
                    name: 'editSoftware',
                    moduleId: 'components/software/editSoftware',
                    auth: true
                },
                {
                    route: ['software'],
                    name: 'softwares',
                    moduleId: 'components/software/softwares',
                    auth: true
                },
                {
                    route: ['/', 'login'],
                    name: 'login',
                    moduleId: 'components/authentication/login'
                },
            ]);
        };
        App.prototype.configHttp = function () {
            this.http.configure(function (config) {
                config
                    .withBaseUrl('api/')
                    .withDefaults({
                    method: "POST",
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                })
                    .withInterceptor({
                    request: function (request) {
                        console.log("Requesting " + request.method + " " + request.url);
                        return request;
                    },
                    response: function (response) {
                        console.log("Received " + response.status + " " + response.url);
                        return response;
                    }
                });
            });
            this.config.configure(this.http);
        };
        App.prototype.created = function (owningView, myView) {
            this.currUrl = window.location.pathname;
        };
        App.prototype.attached = function () {
            var _this = this;
            this.event.subscribe('signedIn', function (response) {
                _this.authenticated = response;
                _this.title = "Welkom " + jwt_decode(_this.authService.getAccessToken()).name;
            });
        };
        App.prototype.logout = function () {
            var _this = this;
            return this.authService.logout()
                .then(function () {
                _this.authenticated = _this.authService.authenticated;
                _this.router.navigate("login");
                _this.title = "SFORUM";
                swal({
                    title: "Bedankt voor uw bezoek",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            });
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient,
            aurelia_authentication_1.FetchConfig,
            aurelia_authentication_2.AuthService,
            aurelia_event_aggregator_1.EventAggregator])
    ], App);
    exports.App = App;
    var AuthorizeStep = (function () {
        function AuthorizeStep(authService) {
            this.authService = authService;
        }
        AuthorizeStep.prototype.run = function (navigationInstruction, next) {
            if (navigationInstruction.getAllInstructions().some(function (i) { return i.config.auth; })) {
                var isLoggedIn = this.authService.isAuthenticated();
                if (!isLoggedIn) {
                    return next.cancel(new aurelia_router_1.Redirect('login'));
                }
            }
            return next();
        };
        return AuthorizeStep;
    }());
    AuthorizeStep = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_authentication_2.AuthService])
    ], AuthorizeStep);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFXQSxJQUFhLEdBQUc7UUFNWixhQUFvQixJQUFnQixFQUNoQixNQUFtQixFQUNuQixXQUF3QixFQUN4QixLQUFzQjtZQUh0QixTQUFJLEdBQUosSUFBSSxDQUFZO1lBQ2hCLFdBQU0sR0FBTixNQUFNLENBQWE7WUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7WUFFdEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFDcEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzVILENBQUM7UUFFRCw2QkFBZSxHQUFmLFVBQWdCLE1BQU0sRUFBRSxNQUFNO1lBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBRXJCLElBQUksSUFBSSxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDUDtvQkFDSSxLQUFLLEVBQUUsQ0FBQyxhQUFhLENBQUM7b0JBQ3RCLElBQUksRUFBRSxTQUFTO29CQUNmLFFBQVEsRUFBRSw0QkFBNEI7b0JBQ3RDLElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUM5QixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsUUFBUSxFQUFFLCtCQUErQjtvQkFDekMsSUFBSSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUN4QixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsSUFBSSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ2hDLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFFBQVEsRUFBRSx3Q0FBd0M7b0JBQ2xELElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUMzQixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixRQUFRLEVBQUUsdUNBQXVDO29CQUNqRCxJQUFJLEVBQUUsSUFBSTtpQkFDYjtnQkFDRDtvQkFDSSxLQUFLLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDM0IsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLGFBQWEsRUFBRTtvQkFDdkIsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQztvQkFDcEIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLGFBQWEsRUFBRTtvQkFDdkIsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLFFBQVEsRUFBRSxxQ0FBcUM7b0JBQy9DLElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUMvQixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsSUFBSSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUNyQixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxJQUFJLEVBQUUsSUFBSTtpQkFDYjtnQkFDRDtvQkFDSSxLQUFLLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDekIsSUFBSSxFQUFFLGFBQWE7b0JBQ25CLFFBQVEsRUFBRSxpQ0FBaUM7b0JBQzNDLElBQUksRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNJLEtBQUssRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUM5QixJQUFJLEVBQUUsY0FBYztvQkFDcEIsUUFBUSxFQUFFLGtDQUFrQztvQkFDNUMsSUFBSSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUNuQixJQUFJLEVBQUUsV0FBVztvQkFDakIsUUFBUSxFQUFFLCtCQUErQjtvQkFDekMsSUFBSSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztvQkFDckIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFLGlDQUFpQztpQkFDOUM7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsd0JBQVUsR0FBVjtZQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtnQkFDdEIsTUFBTTtxQkFDRCxXQUFXLENBQUMsTUFBTSxDQUFDO3FCQUNuQixZQUFZLENBQUM7b0JBQ1YsTUFBTSxFQUFFLE1BQU07b0JBQ2QsV0FBVyxFQUFFLGFBQWE7b0JBQzFCLE9BQU8sRUFBRTt3QkFDTCxRQUFRLEVBQUUsa0JBQWtCO3dCQUM1QixrQkFBa0IsRUFBRSxPQUFPO3FCQUM5QjtpQkFDSixDQUFDO3FCQUNELGVBQWUsQ0FBQztvQkFDYixPQUFPLFlBQUMsT0FBTzt3QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFjLE9BQU8sQ0FBQyxNQUFNLFNBQUksT0FBTyxDQUFDLEdBQUssQ0FBQyxDQUFDO3dCQUMzRCxNQUFNLENBQUMsT0FBTyxDQUFDO29CQUNuQixDQUFDO29CQUNELFFBQVEsWUFBQyxRQUFrQjt3QkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFZLFFBQVEsQ0FBQyxNQUFNLFNBQUksUUFBUSxDQUFDLEdBQUssQ0FBQyxDQUFDO3dCQUMzRCxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUNwQixDQUFDO2lCQUNKLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxxQkFBTyxHQUFQLFVBQVEsVUFBVSxFQUFFLE1BQU07WUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUM1QyxDQUFDO1FBRUQsc0JBQVEsR0FBUjtZQUFBLGlCQUtDO1lBSkcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQUEsUUFBUTtnQkFDckMsS0FBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7Z0JBQzlCLEtBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2hGLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELG9CQUFNLEdBQU47WUFBQSxpQkFjQztZQWJHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtpQkFDM0IsSUFBSSxDQUFDO2dCQUNGLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7Z0JBQ3BELEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QixLQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztnQkFFdEIsSUFBSSxDQUFDO29CQUNELEtBQUssRUFBRSx3QkFBd0I7b0JBQy9CLElBQUksRUFBRSxTQUFTO29CQUNmLGlCQUFpQixFQUFFLEtBQUs7b0JBQ3hCLEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUNMLFVBQUM7SUFBRCxDQXpLQSxBQXlLQyxJQUFBO0lBektZLEdBQUc7UUFEZiw4QkFBVTt5Q0FPbUIsaUNBQVU7WUFDUixvQ0FBVztZQUNOLG9DQUFXO1lBQ2pCLDBDQUFlO09BVGpDLEdBQUcsQ0F5S2Y7SUF6S1ksa0JBQUc7SUE0S2hCLElBQU0sYUFBYTtRQUNmLHVCQUFvQixXQUF3QjtZQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFHLENBQUM7UUFFaEQsMkJBQUcsR0FBSCxVQUFJLHFCQUE0QyxFQUFFLElBQVU7WUFDeEQsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBYixDQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXBELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHlCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztZQUNMLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUNMLG9CQUFDO0lBQUQsQ0FkQSxBQWNDLElBQUE7SUFkSyxhQUFhO1FBRGxCLDhCQUFVO3lDQUUwQixvQ0FBVztPQUQxQyxhQUFhLENBY2xCIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IFJvdXRlciwgUm91dGVyQ29uZmlndXJhdGlvbiwgTmV4dCwgUmVkaXJlY3QsIE5hdmlnYXRpb25JbnN0cnVjdGlvbiB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnYXVyZWxpYS1mZXRjaC1jbGllbnQnO1xyXG5pbXBvcnQgeyBGZXRjaENvbmZpZyB9IGZyb20gJ2F1cmVsaWEtYXV0aGVudGljYXRpb24nO1xyXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICdhdXJlbGlhLWRlcGVuZGVuY3ktaW5qZWN0aW9uJztcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICdhdXJlbGlhLWF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0IHsgRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yJztcclxuaW1wb3J0ICogYXMgand0X2RlY29kZSBmcm9tICdqd3QtZGVjb2RlJztcclxuXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICAgIHJvdXRlcjogUm91dGVyO1xyXG4gICAgYXV0aGVudGljYXRlZDogYm9vbGVhbjtcclxuICAgIGN1cnJVcmw6IHN0cmluZztcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBjb25maWc6IEZldGNoQ29uZmlnLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGV2ZW50OiBFdmVudEFnZ3JlZ2F0b3IpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb25maWdIdHRwKCk7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU2VydmljZS5hdXRoZW50aWNhdGVkO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aGlzLmF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0ZWQgPyBcIldlbGtvbSBcIiArIGp3dF9kZWNvZGUodGhpcy5hdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpKS5uYW1lIDogXCJTRk9SVU1cIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVSb3V0ZXIoY29uZmlnLCByb3V0ZXIpIHtcclxuICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcclxuXHJcbiAgICAgICAgbGV0IHN0ZXAgPSBuZXcgQXV0aG9yaXplU3RlcCh0aGlzLmF1dGhTZXJ2aWNlKTtcclxuICAgICAgICBjb25maWcuYWRkQXV0aG9yaXplU3RlcChzdGVwKTtcclxuXHJcbiAgICAgICAgY29uZmlnLnRpdGxlID0gJ0F1cmVsaWEnO1xyXG4gICAgICAgIGNvbmZpZy5tYXAoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydiZXJpY2h0LzppZCddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ21lc3NhZ2UnLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL21lc3NhZ2UvbWVzc2FnZScsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiBbJ2JlcmljaHRlbi86aWQvbmlldXcnXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICduZXdNZXNzYWdlJyxcclxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnY29tcG9uZW50cy9tZXNzYWdlL25ld01lc3NhZ2UnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydiZXJpY2h0ZW4vOmlkJ10sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbWVzc2FnZXMnLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL21lc3NhZ2UvbWVzc2FnZXMnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydjb3Jwb3JhdGllL2Jld2Vyay86aWQnXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdlZGl0Q29ycG9yYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL2NvcnBvcmF0aW9uL2VkaXRDb3Jwb3JhdGlvbicsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiBbJ2NvcnBvcmF0aWUvbmlldXcnXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICduZXdDb3Jwb3JhdGlvbicsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvY29ycG9yYXRpb24vbmV3Q29ycG9yYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydmb3J1bS9iZXdlcmsvOmlkJ10sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnZWRpdEZvcnVtJyxcclxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnY29tcG9uZW50cy9kYXNoYm9hcmQvZWRpdEZvcnVtJyxcclxuICAgICAgICAgICAgICAgIGF1dGg6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnZm9ydW0vbmlldXcnLF0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbmV3Rm9ydW0nLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL2Rhc2hib2FyZC9uZXdGb3J1bScsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiBbJ2Rhc2hib2FyZCddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Rhc2hib2FyZCcsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZCcsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiBbJ2NvcnBvcmF0aWVzJyxdLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvcnBvcmF0aW9ucycsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvY29ycG9yYXRpb24vY29ycG9yYXRpb25zJyxcclxuICAgICAgICAgICAgICAgIGF1dGg6IHRydWVcclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiBbJ2dlYnJ1aWtlci9iZXdlcmsvOmlkJ10sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnZWRpdFVzZXInLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL3VzZXIvZWRpdFVzZXInLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydnZWJydWlrZXJzJ10sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAndXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL3VzZXIvdXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnc29mdHdhcmUvbml1ZXcnXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICduZXdTb2Z0d2FyZScsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvc29mdHdhcmUvbmV3U29mdHdhcmUnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnc29mdHdhcmUvYmV3ZXJrLzppZCddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2VkaXRTb2Z0d2FyZScsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvc29mdHdhcmUvZWRpdFNvZnR3YXJlJyxcclxuICAgICAgICAgICAgICAgIGF1dGg6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnc29mdHdhcmUnXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzb2Z0d2FyZXMnLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL3NvZnR3YXJlL3NvZnR3YXJlcycsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiBbJy8nLCAnbG9naW4nXSxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdsb2dpbicsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlnSHR0cCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmh0dHAuY29uZmlndXJlKGNvbmZpZyA9PiB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1xyXG4gICAgICAgICAgICAgICAgLndpdGhCYXNlVXJsKCdhcGkvJylcclxuICAgICAgICAgICAgICAgIC53aXRoRGVmYXVsdHMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnWC1SZXF1ZXN0ZWQtV2l0aCc6ICdGZXRjaCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLndpdGhJbnRlcmNlcHRvcih7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdChyZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZXF1ZXN0aW5nICR7cmVxdWVzdC5tZXRob2R9ICR7cmVxdWVzdC51cmx9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UocmVzcG9uc2U6IFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZWNlaXZlZCAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS51cmx9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25maWcuY29uZmlndXJlKHRoaXMuaHR0cCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlZChvd25pbmdWaWV3LCBteVZpZXcpIHtcclxuICAgICAgICB0aGlzLmN1cnJVcmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoZWQoKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudC5zdWJzY3JpYmUoJ3NpZ25lZEluJywgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IFwiV2Vsa29tIFwiICsgand0X2RlY29kZSh0aGlzLmF1dGhTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKCkpLm5hbWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nb3V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2aWNlLmxvZ291dCgpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IHRoaXMuYXV0aFNlcnZpY2UuYXV0aGVudGljYXRlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwibG9naW5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gXCJTRk9SVU1cIjtcclxuXHJcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCZWRhbmt0IHZvb3IgdXcgYmV6b2VrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyOiAyMDAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBhdXRvaW5qZWN0XHJcbmNsYXNzIEF1dGhvcml6ZVN0ZXAge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UpIHt9XHJcblxyXG4gICAgcnVuKG5hdmlnYXRpb25JbnN0cnVjdGlvbjogTmF2aWdhdGlvbkluc3RydWN0aW9uLCBuZXh0OiBOZXh0KTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICBpZiAobmF2aWdhdGlvbkluc3RydWN0aW9uLmdldEFsbEluc3RydWN0aW9ucygpLnNvbWUoaSA9PiBpLmNvbmZpZy5hdXRoKSkge1xyXG4gICAgICAgICAgICBsZXQgaXNMb2dnZWRJbiA9IHRoaXMuYXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzTG9nZ2VkSW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbmNlbChuZXcgUmVkaXJlY3QoJ2xvZ2luJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV4dCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

define('authConfig',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var config = {
        providers: {
            google: {
                name: 'google',
                clientId: '833710645751-q02snmqimmijs2jdk9orckpmfdvi53dt.apps.googleusercontent.com'
            }
        }
    };
    exports.default = config;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGhDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUEsSUFBSSxNQUFNLEdBQUc7UUFDVCxTQUFTLEVBQUU7WUFDUCxNQUFNLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsUUFBUSxFQUFFLDBFQUEwRTthQUN2RjtTQUNKO0tBQ0osQ0FBQTtJQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJhdXRoQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbmZpZyA9IHtcbiAgICBwcm92aWRlcnM6IHtcbiAgICAgICAgZ29vZ2xlOiB7XG4gICAgICAgICAgICBuYW1lOiAnZ29vZ2xlJyxcbiAgICAgICAgICAgIGNsaWVudElkOiAnODMzNzEwNjQ1NzUxLXEwMnNubXFpbW1panMyamRrOW9yY2twbWZkdmk1M2R0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBLGtCQUFlO1FBQ2IsS0FBSyxFQUFFLElBQUk7UUFDWCxPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUMiLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGRlYnVnOiB0cnVlLFxuICB0ZXN0aW5nOiB0cnVlXG59O1xuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('main',["require", "exports", "./environment", "./authConfig"], function (require, exports, environment_1, authConfig_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-authentication', function (baseConfig) {
            baseConfig.configure(authConfig_1.default);
        });
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBSUEsbUJBQTBCLE9BQWdCO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHO2FBQ04scUJBQXFCLEVBQUU7YUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUNwQixNQUFNLENBQUMsd0JBQXdCLEVBQ2hDLFVBQUMsVUFBVTtZQUNQLFVBQVUsQ0FBQyxTQUFTLENBQUMsb0JBQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLENBQUMscUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFsQkQsOEJBa0JDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXJlbGlhIH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnXG5pbXBvcnQgZW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vYXV0aENvbmZpZydcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZShhdXJlbGlhOiBBdXJlbGlhKSB7XG4gICAgYXVyZWxpYS51c2VcbiAgICAgICAgLnN0YW5kYXJkQ29uZmlndXJhdGlvbigpXG4gICAgICAgIC5mZWF0dXJlKCdyZXNvdXJjZXMnKVxuICAgICAgICAucGx1Z2luKCdhdXJlbGlhLWF1dGhlbnRpY2F0aW9uJyxcbiAgICAgICAgKGJhc2VDb25maWcpID0+IHtcbiAgICAgICAgICAgIGJhc2VDb25maWcuY29uZmlndXJlKGNvbmZpZyk7XG4gICAgICAgIH0pO1xuXG4gICAgaWYgKGVudmlyb25tZW50LmRlYnVnKSB7XG4gICAgICAgIGF1cmVsaWEudXNlLmRldmVsb3BtZW50TG9nZ2luZygpO1xuICAgIH1cblxuICAgIGlmIChlbnZpcm9ubWVudC50ZXN0aW5nKSB7XG4gICAgICAgIGF1cmVsaWEudXNlLnBsdWdpbignYXVyZWxpYS10ZXN0aW5nJyk7XG4gICAgfVxuXG4gICAgYXVyZWxpYS5zdGFydCgpLnRoZW4oKCkgPT4gYXVyZWxpYS5zZXRSb290KCkpO1xufSJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFFQSxtQkFBMEIsTUFBOEI7SUFFeEQsQ0FBQztJQUZELDhCQUVDIiwiZmlsZSI6InJlc291cmNlcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RnJhbWV3b3JrQ29uZmlndXJhdGlvbn0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZzogRnJhbWV3b3JrQ29uZmlndXJhdGlvbikge1xuICAvL2NvbmZpZy5nbG9iYWxSZXNvdXJjZXMoW10pO1xufVxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/corporation/corporations',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var corporations = (function () {
        function corporations(http, router) {
            this.http = http;
            this.router = router;
            this.corporations = [];
            this.fetchCorporations();
        }
        corporations.prototype.fetchCorporations = function () {
            var _this = this;
            this.http.fetch('corporation/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.corporations = data;
            });
        };
        corporations.prototype.destroy = function (event, forum) {
            var _this = this;
            event.stopPropagation();
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder deze corporatie',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (isOk) {
                if (isOk) {
                    _this.http.fetch('corporation/destroy', {
                        body: aurelia_fetch_client_1.json(forum)
                    }).then(function (data) {
                        _this.corporations = _this.corporations.filter(function (obj) { return obj.id != forum.id; });
                        swal({
                            title: 'Verwijderd',
                            text: 'Corporatie is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    });
                }
            });
        };
        corporations.prototype.editUrl = function (event, corporation) {
            event.stopPropagation();
            this.router.navigate("corporatie/bewerk/" + corporation.id);
        };
        return corporations;
    }());
    corporations = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], corporations);
    exports.corporations = corporations;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29ycG9yYXRpb24vY29ycG9yYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUtBLElBQWEsWUFBWTtRQUtyQixzQkFBb0IsSUFBZ0IsRUFBVSxNQUFjO1lBQXhDLFNBQUksR0FBSixJQUFJLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBSDVELGlCQUFZLEdBQUcsRUFBRSxDQUFDO1lBSWQsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELHdDQUFpQixHQUFqQjtZQUFBLGlCQU1DO1lBTEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUM7aUJBQy9CLElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUk7Z0JBQ04sS0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsOEJBQU8sR0FBUCxVQUFRLEtBQUssRUFBRSxLQUFLO1lBQXBCLGlCQTBCQztZQXpCRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDO2dCQUNELEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLElBQUksRUFBRSxTQUFTO2dCQUNmLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGlCQUFpQixFQUFFLDhCQUE4QjtnQkFDakQsZ0JBQWdCLEVBQUUsT0FBTztnQkFDekIsa0JBQWtCLEVBQUUsU0FBUzthQUNoQyxFQUFFLFVBQUMsSUFBSTtnQkFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNQLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFO3dCQUNuQyxJQUFJLEVBQUUsMkJBQUksQ0FBQyxLQUFLLENBQUM7cUJBQ3BCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO3dCQUNSLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQWxCLENBQWtCLENBQUMsQ0FBQzt3QkFFMUUsSUFBSSxDQUFDOzRCQUNELEtBQUssRUFBRSxZQUFZOzRCQUNuQixJQUFJLEVBQUUsb0NBQW9DOzRCQUMxQyxJQUFJLEVBQUUsU0FBUzs0QkFDZixpQkFBaUIsRUFBRSxLQUFLOzRCQUN4QixLQUFLLEVBQUUsSUFBSTt5QkFDZCxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELDhCQUFPLEdBQVAsVUFBUSxLQUFLLEVBQUUsV0FBVztZQUN0QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFDTCxtQkFBQztJQUFELENBakRBLEFBaURDLElBQUE7SUFqRFksWUFBWTtRQUR4Qiw4QkFBVTt5Q0FNbUIsaUNBQVUsRUFBa0IsdUJBQU07T0FMbkQsWUFBWSxDQWlEeEI7SUFqRFksb0NBQVkiLCJmaWxlIjoiY29tcG9uZW50cy9jb3Jwb3JhdGlvbi9jb3Jwb3JhdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIGNvcnBvcmF0aW9ucyB7XHJcblxyXG4gICAgY29ycG9yYXRpb25zID0gW107XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikge1xyXG4gICAgICAgIHRoaXMuZmV0Y2hDb3Jwb3JhdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmZXRjaENvcnBvcmF0aW9ucygpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ2NvcnBvcmF0aW9uL2luZGV4JylcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ycG9yYXRpb25zID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveShldmVudCwgZm9ydW0pIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICdXZWV0IHUgaGV0IHpla2VyPycsXHJcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdKYSB2ZXJ3aWpkZXIgZGV6ZSBjb3Jwb3JhdGllJyxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ1N0b3AhJyxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnIzAwMmU1YicsXHJcbiAgICAgICAgfSwgKGlzT2spID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzT2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnY29ycG9yYXRpb24vZGVzdHJveScsIHtcclxuICAgICAgICAgICAgICAgICAgICBib2R5OiBqc29uKGZvcnVtKVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnBvcmF0aW9ucyA9IHRoaXMuY29ycG9yYXRpb25zLmZpbHRlcigob2JqKSA9PiBvYmouaWQgIT0gZm9ydW0uaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdWZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0NvcnBvcmF0aWUgaXMgc3VjY2Vzdm9sIHZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDMwMDBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdFVybChldmVudCwgY29ycG9yYXRpb24pIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImNvcnBvcmF0aWUvYmV3ZXJrL1wiICsgY29ycG9yYXRpb24uaWQpO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/corporation/editCorporation',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var editCorporation = (function () {
        function editCorporation(http, router) {
            this.http = http;
            this.router = router;
        }
        editCorporation.prototype.created = function () {
            this.getCorporation();
        };
        editCorporation.prototype.getCorporation = function () {
            var _this = this;
            this.http.fetch('corporation/show', {
                body: aurelia_fetch_client_1.json(this.router.currentInstruction.params.id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.corporation = data;
            });
        };
        editCorporation.prototype.update = function () {
            var _this = this;
            this.http.fetch('corporation/update', {
                body: aurelia_fetch_client_1.json(this.corporation)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Corporatie succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    _this.router.navigate("corporaties");
                }
            });
        };
        return editCorporation;
    }());
    editCorporation = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], editCorporation);
    exports.editCorporation = editCorporation;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29ycG9yYXRpb24vZWRpdENvcnBvcmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUtBLElBQWEsZUFBZTtRQUl4Qix5QkFBb0IsSUFBZ0IsRUFBVSxNQUFjO1lBQXhDLFNBQUksR0FBSixJQUFJLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQUcsQ0FBQztRQUVoRSxpQ0FBTyxHQUFQO1lBQ0ksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFFRCx3Q0FBYyxHQUFkO1lBQUEsaUJBUUM7WUFQRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtnQkFDaEMsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3ZELENBQUM7aUJBQ0csSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxnQ0FBTSxHQUFOO1lBQUEsaUJBZUM7WUFkRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtnQkFDbEMsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDWixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQzt3QkFDRCxLQUFLLEVBQUUsZ0NBQWdDO3dCQUN2QyxJQUFJLEVBQUUsU0FBUzt3QkFDZixpQkFBaUIsRUFBRSxLQUFLO3dCQUN4QixLQUFLLEVBQUUsSUFBSTtxQkFDZCxDQUFDLENBQUM7b0JBRUgsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxzQkFBQztJQUFELENBcENBLEFBb0NDLElBQUE7SUFwQ1ksZUFBZTtRQUQzQiw4QkFBVTt5Q0FLbUIsaUNBQVUsRUFBa0IsdUJBQU07T0FKbkQsZUFBZSxDQW9DM0I7SUFwQ1ksMENBQWUiLCJmaWxlIjoiY29tcG9uZW50cy9jb3Jwb3JhdGlvbi9lZGl0Q29ycG9yYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIGVkaXRDb3Jwb3JhdGlvbiB7XHJcblxyXG4gICAgY29ycG9yYXRpb246IHt9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7fVxyXG5cclxuICAgIGNyZWF0ZWQoKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDb3Jwb3JhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvcnBvcmF0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnY29ycG9yYXRpb24vc2hvdycsIHtcclxuICAgICAgICAgICAgYm9keToganNvbih0aGlzLnJvdXRlci5jdXJyZW50SW5zdHJ1Y3Rpb24ucGFyYW1zLmlkKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnBvcmF0aW9uID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnY29ycG9yYXRpb24vdXBkYXRlJywge1xyXG4gICAgICAgICAgICBib2R5OiBqc29uKHRoaXMuY29ycG9yYXRpb24pXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3Jwb3JhdGllIHN1Y2Nlc3ZvbCBnZXVwZGF0ZXRcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiY29ycG9yYXRpZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/corporation/newCorporation',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var newCorporation = (function () {
        function newCorporation(http, router) {
            this.http = http;
            this.router = router;
        }
        newCorporation.prototype.store = function () {
            var _this = this;
            this.http.fetch('corporation/store', {
                body: aurelia_fetch_client_1.json(this.corporation)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Corporatie succesvol aangemaakt",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    _this.router.navigate("corporaties");
                }
            });
        };
        return newCorporation;
    }());
    newCorporation = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], newCorporation);
    exports.newCorporation = newCorporation;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29ycG9yYXRpb24vbmV3Q29ycG9yYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBS0EsSUFBYSxjQUFjO1FBSXZCLHdCQUFvQixJQUFnQixFQUFVLE1BQWM7WUFBeEMsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBSSxDQUFDO1FBRWpFLDhCQUFLLEdBQUw7WUFBQSxpQkFlQztZQWRHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFO2dCQUNqQyxJQUFJLEVBQUUsMkJBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNaLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDO3dCQUNELEtBQUssRUFBRSxpQ0FBaUM7d0JBQ3hDLElBQUksRUFBRSxTQUFTO3dCQUNmLGlCQUFpQixFQUFFLEtBQUs7d0JBQ3hCLEtBQUssRUFBRSxJQUFJO3FCQUNkLENBQUMsQ0FBQztvQkFFSCxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNMLHFCQUFDO0lBQUQsQ0F0QkEsQUFzQkMsSUFBQTtJQXRCWSxjQUFjO1FBRDFCLDhCQUFVO3lDQUttQixpQ0FBVSxFQUFrQix1QkFBTTtPQUpuRCxjQUFjLENBc0IxQjtJQXRCWSx3Q0FBYyIsImZpbGUiOiJjb21wb25lbnRzL2NvcnBvcmF0aW9uL25ld0NvcnBvcmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwganNvbiB9IGZyb20gXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiXHJcbmltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tIFwiYXVyZWxpYS1mcmFtZXdvcmtcIlxyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdhdXJlbGlhLXJvdXRlcidcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBuZXdDb3Jwb3JhdGlvbiB7XHJcblxyXG4gICAgY29ycG9yYXRpb246IHt9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7IH1cclxuXHJcbiAgICBzdG9yZSgpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ2NvcnBvcmF0aW9uL3N0b3JlJywge1xyXG4gICAgICAgICAgICBib2R5OiBqc29uKHRoaXMuY29ycG9yYXRpb24pXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJDb3Jwb3JhdGllIHN1Y2Nlc3ZvbCBhYW5nZW1hYWt0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyOiAyMDAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImNvcnBvcmF0aWVzXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('components/authentication/login',["require", "exports", "sweetalert", "aurelia-framework", "aurelia-fetch-client", "aurelia-authentication", "aurelia-event-aggregator", "aurelia-router"], function (require, exports, swal, aurelia_framework_1, aurelia_fetch_client_1, aurelia_authentication_1, aurelia_event_aggregator_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var login = (function () {
        function login(auth, http, event, router) {
            this.auth = auth;
            this.http = http;
            this.event = event;
            this.router = router;
            this.email = "";
            this.password = "";
        }
        login.prototype.login = function () {
            var _this = this;
            this.auth.login({
                email: this.email,
                password: this.password
            }).then(function (response) {
                _this.event.publish('signedIn', true);
                swal({
                    title: "U bent succesvol ingelogd",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                _this.router.navigate("dashboard");
            })
                .catch(function (err) {
                swal({
                    title: "Inloggegevens zijn onjuist",
                    type: "warning",
                    showCancelButton: true,
                    showConfirmButton: false,
                    closeOnConfirm: true
                });
            });
        };
        login.prototype.logout = function () {
            this.auth.logout('');
        };
        login.prototype.test = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2];
                });
            });
        };
        return login;
    }());
    login = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_authentication_1.AuthService,
            aurelia_fetch_client_1.HttpClient,
            aurelia_event_aggregator_1.EventAggregator,
            aurelia_router_1.Router])
    ], login);
    exports.login = login;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFRQSxJQUFhLEtBQUs7UUFLZCxlQUFvQixJQUFpQixFQUNqQixJQUFnQixFQUNoQixLQUFzQixFQUN0QixNQUFjO1lBSGQsU0FBSSxHQUFKLElBQUksQ0FBYTtZQUNqQixTQUFJLEdBQUosSUFBSSxDQUFZO1lBQ2hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7WUFObEMsVUFBSyxHQUFHLEVBQUUsQ0FBQztZQUNYLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFLd0IsQ0FBQztRQUV2QyxxQkFBSyxHQUFMO1lBQUEsaUJBeUJDO1lBeEJHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQzFCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNaLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFckMsSUFBSSxDQUFDO29CQUNELEtBQUssRUFBRSwyQkFBMkI7b0JBQ2xDLElBQUksRUFBRSxTQUFTO29CQUNmLGlCQUFpQixFQUFFLEtBQUs7b0JBQ3hCLEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztnQkFFRCxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztnQkFDTixJQUFJLENBQUM7b0JBQ0QsS0FBSyxFQUFFLDRCQUE0QjtvQkFDbkMsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsZ0JBQWdCLEVBQUUsSUFBSTtvQkFDdEIsaUJBQWlCLEVBQUUsS0FBSztvQkFDeEIsY0FBYyxFQUFFLElBQUk7aUJBQ3ZCLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELHNCQUFNLEdBQU47WUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUssb0JBQUksR0FBVjs7Ozs7O1NBRUM7UUFDTCxZQUFDO0lBQUQsQ0E1Q0EsQUE0Q0MsSUFBQTtJQTVDWSxLQUFLO1FBRGpCLDhCQUFVO3lDQU1tQixvQ0FBVztZQUNYLGlDQUFVO1lBQ1QsMENBQWU7WUFDZCx1QkFBTTtPQVJ6QixLQUFLLENBNENqQjtJQTVDWSxzQkFBSyIsImZpbGUiOiJjb21wb25lbnRzL2F1dGhlbnRpY2F0aW9uL2xvZ2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc3dhbCBmcm9tICdzd2VldGFsZXJ0JztcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gXCJhdXJlbGlhLWF1dGhlbnRpY2F0aW9uXCJcclxuaW1wb3J0IHsgRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgbG9naW4ge1xyXG5cclxuICAgIGVtYWlsID0gXCJcIjtcclxuICAgIHBhc3N3b3JkID0gXCJcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGg6IEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBldmVudDogRXZlbnRBZ2dyZWdhdG9yLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikgeyB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgdGhpcy5hdXRoLmxvZ2luKHtcclxuICAgICAgICAgICAgZW1haWw6IHRoaXMuZW1haWwsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQucHVibGlzaCgnc2lnbmVkSW4nLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiVSBiZW50IHN1Y2Nlc3ZvbCBpbmdlbG9nZFwiLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0aW1lcjogMjAwMFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJkYXNoYm9hcmRcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiSW5sb2dnZWdldmVucyB6aWpuIG9uanVpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLmF1dGgubG9nb3V0KCcnKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0ZXN0KCkge1xyXG5cclxuICAgIH1cclxufSAiXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('components/message/message',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var message = (function () {
        function message(http, router) {
            this.http = http;
            this.router = router;
            this.reaction = new Reaction;
            this.editing = false;
        }
        message.prototype.created = function () {
            this.getMessage();
        };
        message.prototype.activate = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.reaction.message_id = params.id;
                    return [2];
                });
            });
        };
        message.prototype.getMessage = function () {
            var _this = this;
            this.http.fetch('message/show', {
                body: aurelia_fetch_client_1.json(this.router.currentInstruction.params.id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.message = data;
            });
        };
        message.prototype.update = function () {
            var _this = this;
            this.http.fetch('message/update', {
                body: aurelia_fetch_client_1.json(this.message)
            })
                .then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Bericht succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
                _this.editing = false;
            });
        };
        message.prototype.destroy = function () {
            var _this = this;
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder dit bericht',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (isOk) {
                if (isOk) {
                    _this.http.fetch('message/destroy', {
                        body: aurelia_fetch_client_1.json(_this.message)
                    }).then(function (data) {
                        swal({
                            title: 'Verwijderd',
                            text: 'Het bericht is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    });
                    _this.router.navigate("/dashboard");
                }
            });
        };
        message.prototype.post = function () {
            var _this = this;
            this.http.fetch('reaction/store', {
                body: aurelia_fetch_client_1.json(this.reaction)
            }).then(function (response) { return response.json(); })
                .then(function (data) {
                swal({
                    title: "Reactie succesvol aangemaakt",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log(data);
                _this.message.reactions.push(data);
            });
        };
        return message;
    }());
    message = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], message);
    exports.message = message;
    var Reaction = (function () {
        function Reaction() {
        }
        return Reaction;
    }());
    exports.Reaction = Reaction;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvbWVzc2FnZS9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBS0EsSUFBYSxPQUFPO1FBTWhCLGlCQUFvQixJQUFnQixFQUFVLE1BQWM7WUFBeEMsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7WUFGNUQsYUFBUSxHQUFHLElBQUksUUFBUSxDQUFDO1lBR3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLENBQUM7UUFFRCx5QkFBTyxHQUFQO1lBQ0ksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFSywwQkFBUSxHQUFkLFVBQWUsTUFBTTs7O29CQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDOzs7O1NBQ3hDO1FBRUQsNEJBQVUsR0FBVjtZQUFBLGlCQVFDO1lBUEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsMkJBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7YUFDdkQsQ0FBQztpQkFDRyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2lCQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNOLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELHdCQUFNLEdBQU47WUFBQSxpQkFnQkM7WUFmRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDOUIsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUMzQixDQUFDO2lCQUNHLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ1YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsS0FBSyxFQUFFLDZCQUE2Qjt3QkFDcEMsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsaUJBQWlCLEVBQUUsS0FBSzt3QkFDeEIsS0FBSyxFQUFFLElBQUk7cUJBQ2QsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQseUJBQU8sR0FBUDtZQUFBLGlCQXlCQztZQXhCRyxJQUFJLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsaUJBQWlCLEVBQUUsMEJBQTBCO2dCQUM3QyxnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixrQkFBa0IsRUFBRSxTQUFTO2FBQ2hDLEVBQUUsVUFBQyxJQUFJO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUU7d0JBQy9CLElBQUksRUFBRSwyQkFBSSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUM7cUJBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO3dCQUNSLElBQUksQ0FBQzs0QkFDRCxLQUFLLEVBQUUsWUFBWTs0QkFDbkIsSUFBSSxFQUFFLHFDQUFxQzs0QkFDM0MsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsaUJBQWlCLEVBQUUsS0FBSzs0QkFDeEIsS0FBSyxFQUFFLElBQUk7eUJBQ2QsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxDQUFDO29CQUVILEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsc0JBQUksR0FBSjtZQUFBLGlCQWVDO1lBZEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzlCLElBQUksRUFBRSwyQkFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7aUJBQy9CLElBQUksQ0FBQyxVQUFBLElBQUk7Z0JBQ04sSUFBSSxDQUFDO29CQUNELEtBQUssRUFBRSw4QkFBOEI7b0JBQ3JDLElBQUksRUFBRSxTQUFTO29CQUNmLGlCQUFpQixFQUFFLEtBQUs7b0JBQ3hCLEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUMsQ0FBQztnQkFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBQ0wsY0FBQztJQUFELENBekZBLEFBeUZDLElBQUE7SUF6RlksT0FBTztRQURuQiw4QkFBVTt5Q0FPbUIsaUNBQVUsRUFBa0IsdUJBQU07T0FObkQsT0FBTyxDQXlGbkI7SUF6RlksMEJBQU87SUEyRnBCO1FBQUE7UUFJQSxDQUFDO1FBQUQsZUFBQztJQUFELENBSkEsQUFJQyxJQUFBO0lBSlksNEJBQVEiLCJmaWxlIjoiY29tcG9uZW50cy9tZXNzYWdlL21lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIG1lc3NhZ2Uge1xyXG5cclxuICAgIG1lc3NhZ2U6IHsgIHJlYWN0aW9uczogUmVhY3Rpb25bXSwgaWQ6IFwiXCIgfTtcclxuICAgIGVkaXRpbmc6IGJvb2xlYW47XHJcbiAgICByZWFjdGlvbiA9IG5ldyBSZWFjdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHtcclxuICAgICAgICB0aGlzLmVkaXRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVkKCkge1xyXG4gICAgICAgIHRoaXMuZ2V0TWVzc2FnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFjdGl2YXRlKHBhcmFtcykge1xyXG4gICAgICAgIHRoaXMucmVhY3Rpb24ubWVzc2FnZV9pZCA9IHBhcmFtcy5pZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRNZXNzYWdlKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnbWVzc2FnZS9zaG93Jywge1xyXG4gICAgICAgICAgICBib2R5OiBqc29uKHRoaXMucm91dGVyLmN1cnJlbnRJbnN0cnVjdGlvbi5wYXJhbXMuaWQpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ21lc3NhZ2UvdXBkYXRlJywge1xyXG4gICAgICAgICAgICBib2R5OiBqc29uKHRoaXMubWVzc2FnZSlcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCZXJpY2h0IHN1Y2Nlc3ZvbCBnZXVwZGF0ZXRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICdXZWV0IHUgaGV0IHpla2VyPycsXHJcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdKYSB2ZXJ3aWpkZXIgZGl0IGJlcmljaHQnLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnU3RvcCEnLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMDAyZTViJyxcclxuICAgICAgICB9LCAoaXNPaykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNPaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLmZldGNoKCdtZXNzYWdlL2Rlc3Ryb3knLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keToganNvbih0aGlzLm1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnSGV0IGJlcmljaHQgaXMgc3VjY2Vzdm9sIHZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDMwMDBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiL2Rhc2hib2FyZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBvc3QoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdyZWFjdGlvbi9zdG9yZScsIHtcclxuICAgICAgICAgICAgYm9keToganNvbih0aGlzLnJlYWN0aW9uKVxyXG4gICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJSZWFjdGllIHN1Y2Nlc3ZvbCBhYW5nZW1hYWt0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyOiAyMDAwXHJcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlLnJlYWN0aW9ucy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlYWN0aW9uIHtcclxuICAgIG1lc3NhZ2VfaWQ6IG51bWJlcjtcclxuICAgIGFjY291bnRfaWQ6IG51bWJlcjtcclxuICAgIHJlYWN0aW9uOiBzdHJpbmc7XHJcbn0iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/message/messages',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var messages = (function () {
        function messages(http, router) {
            this.http = http;
            this.router = router;
            this.messages = [];
        }
        messages.prototype.created = function () {
            this.forumId = this.router.currentInstruction.params.id;
            this.fetchMessages();
        };
        messages.prototype.fetchMessages = function () {
            var _this = this;
            this.http.fetch('message/index', {
                body: aurelia_fetch_client_1.json(this.forumId)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.messages = data;
            });
        };
        messages.prototype.isEmpty = function (messages) {
            return messages == [];
        };
        messages.prototype.link = function (message) {
            this.router.navigate("bericht/" + message.id);
        };
        return messages;
    }());
    messages = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], messages);
    exports.messages = messages;
    var MessageModel = (function () {
        function MessageModel() {
        }
        return MessageModel;
    }());
    exports.MessageModel = MessageModel;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvbWVzc2FnZS9tZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFLQSxJQUFhLFFBQVE7UUFLakIsa0JBQW9CLElBQWdCLEVBQVUsTUFBYztZQUF4QyxTQUFJLEdBQUosSUFBSSxDQUFZO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUhyRCxhQUFRLEdBQW1CLEVBQUUsQ0FBQztRQUcwQixDQUFDO1FBRWhFLDBCQUFPLEdBQVA7WUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN4RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDekIsQ0FBQztRQUVELGdDQUFhLEdBQWI7WUFBQSxpQkFRQztZQVBHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtnQkFDM0IsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUN6QixDQUFDO2lCQUNELElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUk7Z0JBQ04sS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsMEJBQU8sR0FBUCxVQUFRLFFBQVE7WUFDWixNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBRUQsdUJBQUksR0FBSixVQUFLLE9BQU87WUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDTCxlQUFDO0lBQUQsQ0E3QkEsQUE2QkMsSUFBQTtJQTdCWSxRQUFRO1FBRHBCLDhCQUFVO3lDQU1tQixpQ0FBVSxFQUFrQix1QkFBTTtPQUxuRCxRQUFRLENBNkJwQjtJQTdCWSw0QkFBUTtJQStCckI7UUFBQTtRQU9BLENBQUM7UUFBRCxtQkFBQztJQUFELENBUEEsQUFPQyxJQUFBO0lBUFksb0NBQVkiLCJmaWxlIjoiY29tcG9uZW50cy9tZXNzYWdlL21lc3NhZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwganNvbiB9IGZyb20gXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiXHJcbmltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tIFwiYXVyZWxpYS1mcmFtZXdvcmtcIlxyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdhdXJlbGlhLXJvdXRlcidcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBtZXNzYWdlcyB7XHJcblxyXG4gICAgcHVibGljIG1lc3NhZ2VzOiBNZXNzYWdlTW9kZWxbXSA9IFtdO1xyXG4gICAgcHVibGljIGZvcnVtSWQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHt9XHJcblxyXG4gICAgY3JlYXRlZCgpIHtcclxuICAgICAgICB0aGlzLmZvcnVtSWQgPSB0aGlzLnJvdXRlci5jdXJyZW50SW5zdHJ1Y3Rpb24ucGFyYW1zLmlkO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hNZXNzYWdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoTWVzc2FnZXMoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdtZXNzYWdlL2luZGV4Jywge1xyXG4gICAgICAgICAgICAgIGJvZHk6IGpzb24odGhpcy5mb3J1bUlkKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRW1wdHkobWVzc2FnZXMpIHtcclxuICAgICAgICByZXR1cm4gbWVzc2FnZXMgPT0gW107XHJcbiAgICB9XHJcblxyXG4gICAgbGluayhtZXNzYWdlKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJiZXJpY2h0L1wiICsgbWVzc2FnZS5pZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlTW9kZWwge1xyXG4gICAgaWQ6IG51bWJlcjtcclxuICAgIGZvcnVtOiBzdHJpbmc7XHJcbiAgICB1c2VyOiBzdHJpbmc7XHJcbiAgICBzb2Z0d2FyZTogc3RyaW5nO1xyXG4gICAgc3ViamVjdDogc3RyaW5nO1xyXG4gICAgbWVzc2FnZTogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/message/newMessage',["require", "exports", "aurelia-fetch-client", "jwt-decode", "aurelia-framework", "aurelia-router", "aurelia-authentication"], function (require, exports, aurelia_fetch_client_1, jwt_decode, aurelia_framework_1, aurelia_router_1, aurelia_authentication_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var newMessage = (function () {
        function newMessage(http, router, authService) {
            this.http = http;
            this.router = router;
            this.authService = authService;
            this.message = new Message();
            this.softwares = [];
            this.fetchSoftware();
        }
        newMessage.prototype.fetchSoftware = function () {
            var _this = this;
            this.http.fetch('software/index', {
                body: aurelia_fetch_client_1.json(jwt_decode(this.authService.getAccessToken()).corporation_id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.softwares = data;
            });
        };
        newMessage.prototype.store = function () {
            var _this = this;
            this.message.forum = this.router.currentInstruction.params.id;
            this.http.fetch('message/store', {
                body: aurelia_fetch_client_1.json(this.message)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Bericht succesvol aangemaakt",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    _this.router.navigate("berichten/" + _this.router.currentInstruction.params.id);
                }
            });
        };
        return newMessage;
    }());
    newMessage = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router, aurelia_authentication_1.AuthService])
    ], newMessage);
    exports.newMessage = newMessage;
    var Software = (function () {
        function Software() {
        }
        return Software;
    }());
    exports.Software = Software;
    var Message = (function () {
        function Message() {
        }
        return Message;
    }());
    exports.Message = Message;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvbWVzc2FnZS9uZXdNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQU9BLElBQWEsVUFBVTtRQUtuQixvQkFBb0IsSUFBZ0IsRUFBVSxNQUFjLEVBQVUsV0FBd0I7WUFBMUUsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7WUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtZQUh2RixZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUN4QixjQUFTLEdBQWUsRUFBRSxDQUFDO1lBRzlCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBRUQsa0NBQWEsR0FBYjtZQUFBLGlCQVFDO1lBUEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzFCLElBQUksRUFBRSwyQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDO2FBQzNFLENBQUM7aUJBQ0QsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCwwQkFBSyxHQUFMO1lBQUEsaUJBaUJDO1lBaEJHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUU5RCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7Z0JBQzdCLElBQUksRUFBRSwyQkFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ1osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsS0FBSyxFQUFFLDhCQUE4Qjt3QkFDckMsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsaUJBQWlCLEVBQUUsS0FBSzt3QkFDeEIsS0FBSyxFQUFFLElBQUk7cUJBQ2QsQ0FBQyxDQUFDO29CQUVILEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEYsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNMLGlCQUFDO0lBQUQsQ0FyQ0EsQUFxQ0MsSUFBQTtJQXJDWSxVQUFVO1FBRHRCLDhCQUFVO3lDQU1tQixpQ0FBVSxFQUFrQix1QkFBTSxFQUF1QixvQ0FBVztPQUxyRixVQUFVLENBcUN0QjtJQXJDWSxnQ0FBVTtJQXVDdkI7UUFBQTtRQUdBLENBQUM7UUFBRCxlQUFDO0lBQUQsQ0FIQSxBQUdDLElBQUE7SUFIWSw0QkFBUTtJQUtyQjtRQUFBO1FBTUEsQ0FBQztRQUFELGNBQUM7SUFBRCxDQU5BLEFBTUMsSUFBQTtJQU5ZLDBCQUFPIiwiZmlsZSI6ImNvbXBvbmVudHMvbWVzc2FnZS9uZXdNZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwganNvbiB9IGZyb20gXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiXHJcbmltcG9ydCAqIGFzIGp3dF9kZWNvZGUgZnJvbSAnand0LWRlY29kZSc7XHJcbmltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tIFwiYXVyZWxpYS1mcmFtZXdvcmtcIlxyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdhdXJlbGlhLXJvdXRlcidcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICdhdXJlbGlhLWF1dGhlbnRpY2F0aW9uJztcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBuZXdNZXNzYWdlIHtcclxuXHJcbiAgICBwdWJsaWMgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBwdWJsaWMgc29mdHdhcmVzOiBTb2Z0d2FyZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuZmV0Y2hTb2Z0d2FyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoU29mdHdhcmUoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdzb2Z0d2FyZS9pbmRleCcsIHtcclxuICAgICAgICAgICAgICAgIGJvZHk6IGpzb24oand0X2RlY29kZSh0aGlzLmF1dGhTZXJ2aWNlLmdldEFjY2Vzc1Rva2VuKCkpLmNvcnBvcmF0aW9uX2lkKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zb2Z0d2FyZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9yZSgpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlLmZvcnVtID0gdGhpcy5yb3V0ZXIuY3VycmVudEluc3RydWN0aW9uLnBhcmFtcy5pZDtcblxyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnbWVzc2FnZS9zdG9yZScsIHtcclxuICAgICAgICAgICAgYm9keToganNvbih0aGlzLm1lc3NhZ2UpXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJCZXJpY2h0IHN1Y2Nlc3ZvbCBhYW5nZW1hYWt0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyOiAyMDAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImJlcmljaHRlbi9cIiArIHRoaXMucm91dGVyLmN1cnJlbnRJbnN0cnVjdGlvbi5wYXJhbXMuaWQpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNvZnR3YXJlIHtcclxuICAgIGNvcnBvcmF0aW9uX2lkOiBudW1iZXI7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbn1cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2Uge1xuICAgIGlkOiBudW1iZXI7XHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgc3ViamVjdDogc3RyaW5nO1xuICAgIGZvcnVtOiBudW1iZXI7XG4gICAgc29mdHdhcmU6IG51bWJlcjtcclxufVxyXG5cclxuXHJcblxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/dashboard',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dashboard = (function () {
        function dashboard(http, router) {
            this.http = http;
            this.router = router;
            this.forums = [];
            this.fetchForums();
        }
        dashboard.prototype.fetchForums = function () {
            var _this = this;
            this.http.fetch('forum/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.forums = data;
            });
        };
        dashboard.prototype.destroy = function (event, forum) {
            var _this = this;
            event.stopPropagation();
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder dit forum',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (isOk) {
                if (isOk) {
                    _this.http.fetch('forum/destroy', {
                        body: aurelia_fetch_client_1.json(forum)
                    }).then(function (data) {
                        _this.forums = _this.forums.filter(function (obj) { return obj.id != forum.id; });
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
        };
        dashboard.prototype.link = function (forum) {
            event.stopPropagation();
            this.router.navigate("berichten/" + forum.id);
        };
        dashboard.prototype.editUrl = function (event, forum) {
            event.stopPropagation();
            this.router.navigate("forum/bewerk/" + forum.id);
        };
        dashboard.prototype.isEmpty = function (forums) {
            return forums == [];
        };
        return dashboard;
    }());
    dashboard = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], dashboard);
    exports.dashboard = dashboard;
    var ForumModel = (function () {
        function ForumModel() {
        }
        return ForumModel;
    }());
    exports.ForumModel = ForumModel;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFLQSxJQUFhLFNBQVM7UUFJbEIsbUJBQW9CLElBQWdCLEVBQVUsTUFBYztZQUF4QyxTQUFJLEdBQUosSUFBSSxDQUFZO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUZyRCxXQUFNLEdBQWlCLEVBQUUsQ0FBQztZQUc3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUVELCtCQUFXLEdBQVg7WUFBQSxpQkFNQztZQUxHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztpQkFDekIsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCwyQkFBTyxHQUFQLFVBQVEsS0FBSyxFQUFFLEtBQUs7WUFBcEIsaUJBMEJDO1lBekJHLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsaUJBQWlCLEVBQUUsd0JBQXdCO2dCQUMzQyxnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixrQkFBa0IsRUFBRSxTQUFTO2FBQ2hDLEVBQUUsVUFBQyxJQUFJO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO3dCQUM3QixJQUFJLEVBQUUsMkJBQUksQ0FBQyxLQUFLLENBQUM7cUJBQ3BCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO3dCQUNSLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQWxCLENBQWtCLENBQUMsQ0FBQzt3QkFFOUQsSUFBSSxDQUFDOzRCQUNELEtBQUssRUFBRSxZQUFZOzRCQUNuQixJQUFJLEVBQUUsbUNBQW1DOzRCQUN6QyxJQUFJLEVBQUUsU0FBUzs0QkFDZixpQkFBaUIsRUFBRSxLQUFLOzRCQUN4QixLQUFLLEVBQUUsSUFBSTt5QkFDZCxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELHdCQUFJLEdBQUosVUFBSyxLQUFLO1lBQ04sS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVELDJCQUFPLEdBQVAsVUFBUSxLQUFLLEVBQUUsS0FBSztZQUNoQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQsMkJBQU8sR0FBUCxVQUFRLE1BQU07WUFDVixNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQXpEQSxBQXlEQyxJQUFBO0lBekRZLFNBQVM7UUFEckIsOEJBQVU7eUNBS21CLGlDQUFVLEVBQWtCLHVCQUFNO09BSm5ELFNBQVMsQ0F5RHJCO0lBekRZLDhCQUFTO0lBMkR0QjtRQUFBO1FBSUEsQ0FBQztRQUFELGlCQUFDO0lBQUQsQ0FKQSxBQUlDLElBQUE7SUFKWSxnQ0FBVSIsImZpbGUiOiJjb21wb25lbnRzL2Rhc2hib2FyZC9kYXNoYm9hcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIGRhc2hib2FyZCB7XHJcblxyXG4gICAgcHVibGljIGZvcnVtczogRm9ydW1Nb2RlbFtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaEZvcnVtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoRm9ydW1zKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnZm9ydW0vaW5kZXgnKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3J1bXMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KGV2ZW50LCBmb3J1bSkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ1dlZXQgdSBoZXQgemVrZXI/JyxcclxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0phIHZlcndpamRlciBkaXQgZm9ydW0nLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnU3RvcCEnLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMDAyZTViJyxcclxuICAgICAgICB9LCAoaXNPaykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNPaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLmZldGNoKCdmb3J1bS9kZXN0cm95Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGpzb24oZm9ydW0pXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ydW1zID0gdGhpcy5mb3J1bXMuZmlsdGVyKChvYmopID0+IG9iai5pZCAhPSBmb3J1bS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnSGV0IGZvcnVtIGlzIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAzMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxpbmsoZm9ydW0pIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImJlcmljaHRlbi9cIiArIGZvcnVtLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0VXJsKGV2ZW50LCBmb3J1bSkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwiZm9ydW0vYmV3ZXJrL1wiICsgZm9ydW0uaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRW1wdHkoZm9ydW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcnVtcyA9PSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcnVtTW9kZWwge1xyXG4gICAgaWQ6IG51bWJlcjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/editForum',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var editForum = (function () {
        function editForum(http, router) {
            this.http = http;
            this.router = router;
            this.forum = new Forum();
        }
        editForum.prototype.created = function () {
            this.getForum();
        };
        editForum.prototype.getForum = function () {
            var _this = this;
            this.http.fetch('forum/show', {
                body: aurelia_fetch_client_1.json(this.router.currentInstruction.params.id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.forum = data;
            });
        };
        editForum.prototype.update = function () {
            this.http.fetch('forum/update', {
                body: aurelia_fetch_client_1.json(this.forum)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Forum succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        };
        return editForum;
    }());
    editForum = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], editForum);
    exports.editForum = editForum;
    var Forum = (function () {
        function Forum() {
        }
        return Forum;
    }());
    exports.Forum = Forum;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGFzaGJvYXJkL2VkaXRGb3J1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFLQSxJQUFhLFNBQVM7UUFJbEIsbUJBQW9CLElBQWdCLEVBQVUsTUFBYztZQUF4QyxTQUFJLEdBQUosSUFBSSxDQUFZO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUZyRCxVQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUVvQyxDQUFDO1FBRWhFLDJCQUFPLEdBQVA7WUFDSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUVELDRCQUFRLEdBQVI7WUFBQSxpQkFRQztZQVBHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtnQkFDMUIsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3ZELENBQUM7aUJBQ0csSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUN0QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCwwQkFBTSxHQUFOO1lBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFO2dCQUM1QixJQUFJLEVBQUUsMkJBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ3pCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNaLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDO3dCQUNELEtBQUssRUFBRSwyQkFBMkI7d0JBQ2xDLElBQUksRUFBRSxTQUFTO3dCQUNmLGlCQUFpQixFQUFFLEtBQUs7d0JBQ3hCLEtBQUssRUFBRSxJQUFJO3FCQUNkLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQWxDQSxBQWtDQyxJQUFBO0lBbENZLFNBQVM7UUFEckIsOEJBQVU7eUNBS21CLGlDQUFVLEVBQWtCLHVCQUFNO09BSm5ELFNBQVMsQ0FrQ3JCO0lBbENZLDhCQUFTO0lBb0N0QjtRQUFBO1FBSUEsQ0FBQztRQUFELFlBQUM7SUFBRCxDQUpBLEFBSUMsSUFBQTtJQUpZLHNCQUFLIiwiZmlsZSI6ImNvbXBvbmVudHMvZGFzaGJvYXJkL2VkaXRGb3J1bS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgZWRpdEZvcnVtIHtcclxuXHJcbiAgICBwdWJsaWMgZm9ydW0gPSBuZXcgRm9ydW0oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHt9XHJcblxyXG4gICAgY3JlYXRlZCgpIHtcclxuICAgICAgICB0aGlzLmdldEZvcnVtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Rm9ydW0oKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdmb3J1bS9zaG93Jywge1xyXG4gICAgICAgICAgICBib2R5OiBqc29uKHRoaXMucm91dGVyLmN1cnJlbnRJbnN0cnVjdGlvbi5wYXJhbXMuaWQpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9ydW0gPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdmb3J1bS91cGRhdGUnLCB7XHJcbiAgICAgICAgICAgIGJvZHk6IGpzb24odGhpcy5mb3J1bSlcclxuICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkZvcnVtIHN1Y2Nlc3ZvbCBnZXVwZGF0ZXRcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IGNsYXNzIEZvcnVtIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/newForum',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var newForum = (function () {
        function newForum(http) {
            this.http = http;
        }
        newForum.prototype.store = function () {
            var _this = this;
            this.http.fetch('forum/store', {
                body: aurelia_fetch_client_1.json(this.forum)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Forum succesvol aangemaakt",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    _this.forum.name = "";
                    _this.forum.description = "";
                }
            });
        };
        return newForum;
    }());
    newForum = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], newForum);
    exports.newForum = newForum;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGFzaGJvYXJkL25ld0ZvcnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlBLElBQWEsUUFBUTtRQUlqQixrQkFBb0IsSUFBZ0I7WUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFJLENBQUM7UUFFekMsd0JBQUssR0FBTDtZQUFBLGlCQWdCQztZQWZHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtnQkFDdkIsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDZCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQzt3QkFDRCxLQUFLLEVBQUUsNEJBQTRCO3dCQUNuQyxJQUFJLEVBQUUsU0FBUzt3QkFDZixpQkFBaUIsRUFBRSxLQUFLO3dCQUN4QixLQUFLLEVBQUUsSUFBSTtxQkFDZCxDQUFDLENBQUM7b0JBRUgsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNyQixLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxlQUFDO0lBQUQsQ0F2QkEsQUF1QkMsSUFBQTtJQXZCWSxRQUFRO1FBRHBCLDhCQUFVO3lDQUttQixpQ0FBVTtPQUozQixRQUFRLENBdUJwQjtJQXZCWSw0QkFBUSIsImZpbGUiOiJjb21wb25lbnRzL2Rhc2hib2FyZC9uZXdGb3J1bS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBuZXdGb3J1bSB7XHJcblxyXG4gICAgZm9ydW06IHsgbmFtZTogXCJcIiwgZGVzY3JpcHRpb246IFwiXCIgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxyXG5cclxuICAgIHN0b3JlKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnZm9ydW0vc3RvcmUnLCB7XHJcbiAgICAgICAgICAgICAgICBib2R5OiBqc29uKHRoaXMuZm9ydW0pXHJcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRm9ydW0gc3VjY2Vzdm9sIGFhbmdlbWFha3RcIixcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmZvcnVtLm5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmZvcnVtLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuICAgICAgICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/reaction/reaction',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "aurelia-framework", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, aurelia_framework_2, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var reaction = (function () {
        function reaction(http, event) {
            this.http = http;
            this.event = event;
            this.editing = false;
        }
        reaction.prototype.destroy = function () {
            var _this = this;
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder deze reactie',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (isOk) {
                if (isOk) {
                    _this.http.fetch('reaction/destroy', {
                        body: aurelia_fetch_client_1.json(_this.reaction)
                    }).then(function (data) {
                        swal({
                            title: 'Verwijderd',
                            text: 'De reactie is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        _this.event.publish('destroy-reaction', _this.reaction);
                    });
                }
            });
        };
        reaction.prototype.update = function () {
            var _this = this;
            this.http.fetch('reaction/update', {
                body: aurelia_fetch_client_1.json(this.reaction)
            })
                .then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Reactie succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
                _this.editing = false;
            });
        };
        return reaction;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], reaction.prototype, "reaction", void 0);
    reaction = __decorate([
        aurelia_framework_2.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_event_aggregator_1.EventAggregator])
    ], reaction);
    exports.reaction = reaction;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvcmVhY3Rpb24vcmVhY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBTUEsSUFBYSxRQUFRO1FBS2pCLGtCQUFvQixJQUFnQixFQUFTLEtBQXNCO1lBQS9DLFNBQUksR0FBSixJQUFJLENBQVk7WUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFpQjtZQUMvRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN6QixDQUFDO1FBR0QsMEJBQU8sR0FBUDtZQUFBLGlCQXlCQztZQXhCRyxJQUFJLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsaUJBQWlCLEVBQUUsMkJBQTJCO2dCQUM5QyxnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixrQkFBa0IsRUFBRSxTQUFTO2FBQ2hDLEVBQUUsVUFBQyxJQUFJO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUU7d0JBQ2hDLElBQUksRUFBRSwyQkFBSSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUM7cUJBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO3dCQUNSLElBQUksQ0FBQzs0QkFDRCxLQUFLLEVBQUUsWUFBWTs0QkFDbkIsSUFBSSxFQUFFLG9DQUFvQzs0QkFDMUMsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsaUJBQWlCLEVBQUUsS0FBSzs0QkFDeEIsS0FBSyxFQUFFLElBQUk7eUJBQ2QsQ0FBQyxDQUFDO3dCQUVILEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUQsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELHlCQUFNLEdBQU47WUFBQSxpQkFnQkM7WUFmRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM1QixDQUFDO2lCQUNHLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ1YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsS0FBSyxFQUFFLDZCQUE2Qjt3QkFDcEMsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsaUJBQWlCLEVBQUUsS0FBSzt3QkFDeEIsS0FBSyxFQUFFLElBQUk7cUJBQ2QsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBQ0wsZUFBQztJQUFELENBdERBLEFBc0RDLElBQUE7SUFyRGE7UUFBVCw0QkFBUTs7OENBQVU7SUFEVixRQUFRO1FBRHBCLDhCQUFVO3lDQU1tQixpQ0FBVSxFQUFnQiwwQ0FBZTtPQUwxRCxRQUFRLENBc0RwQjtJQXREWSw0QkFBUSIsImZpbGUiOiJjb21wb25lbnRzL3JlYWN0aW9uL3JlYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYmluZGFibGUgfSBmcm9tICdhdXJlbGlhLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yJztcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyByZWFjdGlvbiB7XHJcbiAgICBAYmluZGFibGUgcmVhY3Rpb247XHJcblxyXG4gICAgZWRpdGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHB1YmxpYyBldmVudDogRXZlbnRBZ2dyZWdhdG9yKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XHJcbiAgICB9ICAgIFxyXG5cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ1dlZXQgdSBoZXQgemVrZXI/JyxcclxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0phIHZlcndpamRlciBkZXplIHJlYWN0aWUnLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnU3RvcCEnLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMDAyZTViJyxcclxuICAgICAgICB9LCAoaXNPaykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNPaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLmZldGNoKCdyZWFjdGlvbi9kZXN0cm95Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGpzb24odGhpcy5yZWFjdGlvbilcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVyd2lqZGVyZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdEZSByZWFjdGllIGlzIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAzMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnQucHVibGlzaCgnZGVzdHJveS1yZWFjdGlvbicsIHRoaXMucmVhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ3JlYWN0aW9uL3VwZGF0ZScsIHtcclxuICAgICAgICAgICAgYm9keToganNvbih0aGlzLnJlYWN0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIlJlYWN0aWUgc3VjY2Vzdm9sIGdldXBkYXRldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cbiAgICAgICAgICAgICAgICB0aGlzLmVkaXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/reaction/reactions',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var reactions = (function () {
        function reactions(event) {
            this.event = event;
        }
        reactions.prototype.attached = function () {
            var _this = this;
            this.event.subscribe('destroy-reaction', function (response) {
                _this.reactions = _this.reactions.filter(function (reaction) { return reaction.id != response.id; });
            });
        };
        return reactions;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", Object)
    ], reactions.prototype, "reactions", void 0);
    reactions = __decorate([
        aurelia_framework_2.autoinject,
        __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
    ], reactions);
    exports.reactions = reactions;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvcmVhY3Rpb24vcmVhY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUtBLElBQWEsU0FBUztRQUdsQixtQkFBbUIsS0FBc0I7WUFBdEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFBRyxDQUFDO1FBRTdDLDRCQUFRLEdBQVI7WUFBQSxpQkFJQztZQUhHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLFVBQUEsUUFBUTtnQkFDN0MsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxFQUFFLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1lBQ25GLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNMLGdCQUFDO0lBQUQsQ0FWQSxBQVVDLElBQUE7SUFUYTtRQUFULDRCQUFROztnREFBVztJQURYLFNBQVM7UUFEckIsOEJBQVU7eUNBSW1CLDBDQUFlO09BSGhDLFNBQVMsQ0FVckI7SUFWWSw4QkFBUyIsImZpbGUiOiJjb21wb25lbnRzL3JlYWN0aW9uL3JlYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJpbmRhYmxlIH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgRXZlbnRBZ2dyZWdhdG9yIH0gZnJvbSAnYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yJztcclxuXG5AYXV0b2luamVjdFxuZXhwb3J0IGNsYXNzIHJlYWN0aW9ucyB7XG4gICAgQGJpbmRhYmxlIHJlYWN0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBldmVudDogRXZlbnRBZ2dyZWdhdG9yKSB7fSAgXG5cbiAgICBhdHRhY2hlZCgpIHtcclxuICAgICAgICB0aGlzLmV2ZW50LnN1YnNjcmliZSgnZGVzdHJveS1yZWFjdGlvbicsIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWFjdGlvbnMgPSB0aGlzLnJlYWN0aW9ucy5maWx0ZXIocmVhY3Rpb24gPT4gcmVhY3Rpb24uaWQgIT0gcmVzcG9uc2UuaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('components/shared/sideBar',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sideBar = (function () {
        function sideBar() {
        }
        return sideBar;
    }());
    exports.sideBar = sideBar;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc2hhcmVkL3NpZGVCYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUE7UUFBQTtRQUFzQixDQUFDO1FBQUQsY0FBQztJQUFELENBQXRCLEFBQXVCLElBQUE7SUFBViwwQkFBTyIsImZpbGUiOiJjb21wb25lbnRzL3NoYXJlZC9zaWRlQmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIHNpZGVCYXIge30iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/software/editSoftware',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var editSoftware = (function () {
        function editSoftware(http, router) {
            this.http = http;
            this.router = router;
            this.corporations = [];
            this.fetchCorporations();
        }
        editSoftware.prototype.attached = function () {
            this.getSoftware();
        };
        editSoftware.prototype.getSoftware = function () {
            var _this = this;
            this.http.fetch('software/show', {
                body: aurelia_fetch_client_1.json(this.router.currentInstruction.params.id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.software = data;
            });
        };
        editSoftware.prototype.fetchCorporations = function () {
            var _this = this;
            this.http.fetch('corporation/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.corporations = data;
            });
        };
        editSoftware.prototype.update = function () {
            this.http.fetch('software/update', {
                body: aurelia_fetch_client_1.json(this.software)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Software succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        };
        return editSoftware;
    }());
    editSoftware = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], editSoftware);
    exports.editSoftware = editSoftware;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc29mdHdhcmUvZWRpdFNvZnR3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUtBLElBQWEsWUFBWTtRQUtyQixzQkFBb0IsSUFBZ0IsRUFBVSxNQUFjO1lBQXhDLFNBQUksR0FBSixJQUFJLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBSDVELGlCQUFZLEdBQUcsRUFBRSxDQUFDO1lBSWQsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUVELCtCQUFRLEdBQVI7WUFDSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUVELGtDQUFXLEdBQVg7WUFBQSxpQkFRQztZQVBHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtnQkFDN0IsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3ZELENBQUM7aUJBQ0csSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCx3Q0FBaUIsR0FBakI7WUFBQSxpQkFNQztZQUxHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDO2lCQUMvQixJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2lCQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNOLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELDZCQUFNLEdBQU47WUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDaEIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsS0FBSyxFQUFFLDhCQUE4Qjt3QkFDckMsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsaUJBQWlCLEVBQUUsS0FBSzt3QkFDeEIsS0FBSyxFQUFFLElBQUk7cUJBQ2QsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILENBQUM7UUFDTCxtQkFBQztJQUFELENBN0NBLEFBNkNDLElBQUE7SUE3Q1ksWUFBWTtRQUR4Qiw4QkFBVTt5Q0FNbUIsaUNBQVUsRUFBa0IsdUJBQU07T0FMbkQsWUFBWSxDQTZDeEI7SUE3Q1ksb0NBQVkiLCJmaWxlIjoiY29tcG9uZW50cy9zb2Z0d2FyZS9lZGl0U29mdHdhcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIGVkaXRTb2Z0d2FyZSB7XG5cbiAgICBjb3Jwb3JhdGlvbnMgPSBbXTtcbiAgICBzb2Z0d2FyZToge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHtcclxuICAgICAgICB0aGlzLmZldGNoQ29ycG9yYXRpb25zKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoZWQoKSB7XG4gICAgICAgIHRoaXMuZ2V0U29mdHdhcmUoKTtcclxuICAgIH1cblxuICAgIGdldFNvZnR3YXJlKCkge1xuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ3NvZnR3YXJlL3Nob3cnLCB7XHJcbiAgICAgICAgICAgIGJvZHk6IGpzb24odGhpcy5yb3V0ZXIuY3VycmVudEluc3RydWN0aW9uLnBhcmFtcy5pZClcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zb2Z0d2FyZSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSBcblxyXG4gICAgZmV0Y2hDb3Jwb3JhdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdjb3Jwb3JhdGlvbi9pbmRleCcpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnBvcmF0aW9ucyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ3NvZnR3YXJlL3VwZGF0ZScsIHtcbiAgICAgICAgICAgIGJvZHk6IGpzb24odGhpcy5zb2Z0d2FyZSlcclxuICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIlNvZnR3YXJlIHN1Y2Nlc3ZvbCBnZXVwZGF0ZXRcIixcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/software/newSoftware',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var editSoftware = (function () {
        function editSoftware(http, router) {
            this.http = http;
            this.router = router;
            this.corporations = [];
            this.fetchCorporations();
        }
        editSoftware.prototype.fetchCorporations = function () {
            var _this = this;
            this.http.fetch('corporation/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.corporations = data;
            });
        };
        editSoftware.prototype.store = function () {
            var _this = this;
            this.http.fetch('software/store', {
                body: aurelia_fetch_client_1.json(this.software)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Software succesvol aangemaakt",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
                _this.router.navigate("software");
            });
        };
        return editSoftware;
    }());
    editSoftware = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], editSoftware);
    exports.editSoftware = editSoftware;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc29mdHdhcmUvbmV3U29mdHdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBS0EsSUFBYSxZQUFZO1FBS3JCLHNCQUFvQixJQUFnQixFQUFVLE1BQWM7WUFBeEMsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7WUFINUQsaUJBQVksR0FBRyxFQUFFLENBQUM7WUFJZCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBRUQsd0NBQWlCLEdBQWpCO1lBQUEsaUJBTUM7WUFMRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztpQkFDL0IsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCw0QkFBSyxHQUFMO1lBQUEsaUJBZUM7WUFkRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDOUIsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDWixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQzt3QkFDRCxLQUFLLEVBQUUsK0JBQStCO3dCQUN0QyxJQUFJLEVBQUUsU0FBUzt3QkFDZixpQkFBaUIsRUFBRSxLQUFLO3dCQUN4QixLQUFLLEVBQUUsSUFBSTtxQkFDZCxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFFRCxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxtQkFBQztJQUFELENBakNBLEFBaUNDLElBQUE7SUFqQ1ksWUFBWTtRQUR4Qiw4QkFBVTt5Q0FNbUIsaUNBQVUsRUFBa0IsdUJBQU07T0FMbkQsWUFBWSxDQWlDeEI7SUFqQ1ksb0NBQVkiLCJmaWxlIjoiY29tcG9uZW50cy9zb2Z0d2FyZS9uZXdTb2Z0d2FyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgZWRpdFNvZnR3YXJlIHtcblxuICAgIGNvcnBvcmF0aW9ucyA9IFtdO1xuICAgIHNvZnR3YXJlOiB7fTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikge1xyXG4gICAgICAgIHRoaXMuZmV0Y2hDb3Jwb3JhdGlvbnMoKTtcbiAgICB9XG5cclxuICAgIGZldGNoQ29ycG9yYXRpb25zKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnY29ycG9yYXRpb24vaW5kZXgnKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3Jwb3JhdGlvbnMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cblxuICAgIHN0b3JlKCkge1xuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ3NvZnR3YXJlL3N0b3JlJywge1xuICAgICAgICAgICAgYm9keToganNvbih0aGlzLnNvZnR3YXJlKVxyXG4gICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiU29mdHdhcmUgc3VjY2Vzdm9sIGFhbmdlbWFha3RcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFwic29mdHdhcmVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/software/softwares',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-authentication", "jwt-decode", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_authentication_1, jwt_decode, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var softwares = (function () {
        function softwares(http, authService, router) {
            this.http = http;
            this.authService = authService;
            this.router = router;
            this.softwares = [];
            this.fetchSoftwares();
        }
        softwares.prototype.fetchSoftwares = function () {
            var _this = this;
            this.http.fetch('software/index', {
                body: aurelia_fetch_client_1.json(jwt_decode(this.authService.getAccessToken()).corporation_id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.softwares = data;
            });
        };
        softwares.prototype.destroy = function (event, software) {
            var _this = this;
            event.stopPropagation();
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder deze software',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (ok) {
                if (ok) {
                    console.log(software);
                    _this.http.fetch('software/destroy', {
                        body: aurelia_fetch_client_1.json(software)
                    }).then(function (response) {
                        if (response.status === 200) {
                            _this.softwares = _this.softwares.filter(function (obj) { return obj.id != software.id; });
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
        };
        softwares.prototype.editUrl = function (event, software) {
            event.stopPropagation();
            this.router.navigate("software/bewerk/" + software.id);
        };
        return softwares;
    }());
    softwares = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_authentication_1.AuthService, aurelia_router_1.Router])
    ], softwares);
    exports.softwares = softwares;
    var SoftwareModel = (function () {
        function SoftwareModel() {
        }
        return SoftwareModel;
    }());
    exports.SoftwareModel = SoftwareModel;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc29mdHdhcmUvc29mdHdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQU9BLElBQWEsU0FBUztRQUlsQixtQkFBb0IsSUFBZ0IsRUFBVSxXQUF3QixFQUFVLE1BQWM7WUFBMUUsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUZ2RixjQUFTLEdBQW9CLEVBQUUsQ0FBQztZQUduQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUVELGtDQUFjLEdBQWQ7WUFBQSxpQkFRQztZQVBHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO2dCQUMxQixJQUFJLEVBQUUsMkJBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQzthQUMzRSxDQUFDO2lCQUNELElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUk7Z0JBQ04sS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsMkJBQU8sR0FBUCxVQUFRLEtBQUssRUFBRSxRQUFRO1lBQXZCLGlCQStCQztZQTlCRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFeEIsSUFBSSxDQUFDO2dCQUNELEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLElBQUksRUFBRSxTQUFTO2dCQUNmLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGlCQUFpQixFQUFFLDRCQUE0QjtnQkFDL0MsZ0JBQWdCLEVBQUUsT0FBTztnQkFDekIsa0JBQWtCLEVBQUUsU0FBUzthQUNoQyxFQUFFLFVBQUMsRUFBRTtnQkFDRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXRCLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFO3dCQUNoQyxJQUFJLEVBQUUsMkJBQUksQ0FBQyxRQUFRLENBQUM7cUJBQ3ZCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO3dCQUNaLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDMUIsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsQ0FBQyxFQUFFLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDOzRCQUV2RSxJQUFJLENBQUM7Z0NBQ0QsS0FBSyxFQUFFLFlBQVk7Z0NBQ25CLElBQUksRUFBRSxrQ0FBa0M7Z0NBQ3hDLElBQUksRUFBRSxTQUFTO2dDQUNmLGlCQUFpQixFQUFFLEtBQUs7NkJBQzNCLENBQUMsQ0FBQzt3QkFDUCxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUVQLENBQUM7UUFFRCwyQkFBTyxHQUFQLFVBQVEsS0FBSyxFQUFFLFFBQVE7WUFDbkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQXZEQSxBQXVEQyxJQUFBO0lBdkRZLFNBQVM7UUFEckIsOEJBQVU7eUNBS21CLGlDQUFVLEVBQXVCLG9DQUFXLEVBQWtCLHVCQUFNO09BSnJGLFNBQVMsQ0F1RHJCO0lBdkRZLDhCQUFTO0lBeUR0QjtRQUFBO1FBS0EsQ0FBQztRQUFELG9CQUFDO0lBQUQsQ0FMQSxBQUtDLElBQUE7SUFMWSxzQ0FBYSIsImZpbGUiOiJjb21wb25lbnRzL3NvZnR3YXJlL3NvZnR3YXJlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICdhdXJlbGlhLWF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0ICogYXMgand0X2RlY29kZSBmcm9tICdqd3QtZGVjb2RlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3Mgc29mdHdhcmVzIHtcclxuXHJcbiAgICBwdWJsaWMgc29mdHdhcmVzOiBTb2Z0d2FyZU1vZGVsW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaFNvZnR3YXJlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoU29mdHdhcmVzKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnc29mdHdhcmUvaW5kZXgnLCB7XHJcbiAgICAgICAgICAgICAgICBib2R5OiBqc29uKGp3dF9kZWNvZGUodGhpcy5hdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpKS5jb3Jwb3JhdGlvbl9pZClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc29mdHdhcmVzID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveShldmVudCwgc29mdHdhcmUpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnV2VldCB1IGhldCB6ZWtlcj8nLFxyXG4gICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnSmEgdmVyd2lqZGVyIGRlemUgc29mdHdhcmUnLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnU3RvcCEnLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMDAyZTViJyxcclxuICAgICAgICB9LCAob2spID0+IHtcbiAgICAgICAgICAgIGlmIChvaykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNvZnR3YXJlKTtcclxuXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLmZldGNoKCdzb2Z0d2FyZS9kZXN0cm95Jywge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBqc29uKHNvZnR3YXJlKVxuICAgICAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc29mdHdhcmVzID0gdGhpcy5zb2Z0d2FyZXMuZmlsdGVyKChvYmopID0+IG9iai5pZCAhPSBzb2Z0d2FyZS5pZCk7XG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1NvZnR3YXJlIGlzIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIH0pO1xuXHJcbiAgICB9XG5cbiAgICBlZGl0VXJsKGV2ZW50LCBzb2Z0d2FyZSkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcInNvZnR3YXJlL2Jld2Vyay9cIiArIHNvZnR3YXJlLmlkKTtcclxuICAgIH1cclxufVxuXG5leHBvcnQgY2xhc3MgU29mdHdhcmVNb2RlbCB7XHJcbiAgICBpZDogbnVtYmVyO1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgY29ycG9yYXRpb25faWQ6IG51bWJlcjtcbiAgICBjb3Jwb3JhdGlvbjogc3RyaW5nXHJcbn1cclxuXG5cclxuXHJcblxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/user/editUser',["require", "exports", "aurelia-fetch-client", "jwt-decode", "aurelia-framework", "aurelia-router", "aurelia-authentication"], function (require, exports, aurelia_fetch_client_1, jwt_decode, aurelia_framework_1, aurelia_router_1, aurelia_authentication_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var editUser = (function () {
        function editUser(http, router, authService) {
            this.http = http;
            this.router = router;
            this.authService = authService;
            this.corporations = [];
        }
        editUser.prototype.created = function () {
            this.fetchCorporations();
            this.getUser();
        };
        editUser.prototype.getUser = function () {
            var _this = this;
            this.http.fetch('user/show', {
                body: aurelia_fetch_client_1.json(this.router.currentInstruction.params.id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.user = data;
            });
        };
        editUser.prototype.fetchCorporations = function () {
            var _this = this;
            this.http.fetch('corporation/index', {
                body: aurelia_fetch_client_1.json(jwt_decode(this.authService.getAccessToken()).corporation_id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                console.log(data);
                _this.corporations = data;
            });
        };
        editUser.prototype.update = function () {
            this.http.fetch('user/update', {
                body: aurelia_fetch_client_1.json(this.user)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Gebruiker succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        };
        return editUser;
    }());
    editUser = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router, aurelia_authentication_1.AuthService])
    ], editUser);
    exports.editUser = editUser;
    var Corporation = (function () {
        function Corporation() {
        }
        return Corporation;
    }());
    exports.Corporation = Corporation;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlci9lZGl0VXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFPQSxJQUFhLFFBQVE7UUFLakIsa0JBQW9CLElBQWdCLEVBQVUsTUFBYyxFQUFVLFdBQXdCO1lBQTFFLFNBQUksR0FBSixJQUFJLENBQVk7WUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1lBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFIdkYsaUJBQVksR0FBa0IsRUFBRSxDQUFDO1FBR3lELENBQUM7UUFFbEcsMEJBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBRUQsMEJBQU8sR0FBUDtZQUFBLGlCQVFDO1lBUEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUN6QixJQUFJLEVBQUUsMkJBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7YUFDdkQsQ0FBQztpQkFDRyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2lCQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNOLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELG9DQUFpQixHQUFqQjtZQUFBLGlCQVNDO1lBUkcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ2pDLElBQUksRUFBRSwyQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDO2FBQzNFLENBQUM7aUJBQ0csSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCx5QkFBTSxHQUFOO1lBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO2dCQUMzQixJQUFJLEVBQUUsMkJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNaLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDO3dCQUNELEtBQUssRUFBRSwrQkFBK0I7d0JBQ3RDLElBQUksRUFBRSxTQUFTO3dCQUNmLGlCQUFpQixFQUFFLEtBQUs7d0JBQ3hCLEtBQUssRUFBRSxJQUFJO3FCQUNkLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0wsZUFBQztJQUFELENBL0NBLEFBK0NDLElBQUE7SUEvQ1ksUUFBUTtRQURwQiw4QkFBVTt5Q0FNbUIsaUNBQVUsRUFBa0IsdUJBQU0sRUFBdUIsb0NBQVc7T0FMckYsUUFBUSxDQStDcEI7SUEvQ1ksNEJBQVE7SUFpRHJCO1FBQUE7UUFNQSxDQUFDO1FBQUQsa0JBQUM7SUFBRCxDQU5BLEFBTUMsSUFBQTtJQU5ZLGtDQUFXIiwiZmlsZSI6ImNvbXBvbmVudHMvdXNlci9lZGl0VXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgKiBhcyBqd3RfZGVjb2RlIGZyb20gJ2p3dC1kZWNvZGUnO1xyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnYXVyZWxpYS1hdXRoZW50aWNhdGlvbic7XHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgZWRpdFVzZXIge1xyXG5cclxuICAgIHB1YmxpYyBjb3Jwb3JhdGlvbnM6IENvcnBvcmF0aW9uW10gPSBbXTtcbiAgICBwdWJsaWMgdXNlcjoge307XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cblxuICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgIHRoaXMuZmV0Y2hDb3Jwb3JhdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmdldFVzZXIoKTtcclxuICAgIH1cblxuICAgIGdldFVzZXIoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCd1c2VyL3Nob3cnLCB7XHJcbiAgICAgICAgICAgIGJvZHk6IGpzb24odGhpcy5yb3V0ZXIuY3VycmVudEluc3RydWN0aW9uLnBhcmFtcy5pZClcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XG5cbiAgICBmZXRjaENvcnBvcmF0aW9ucygpIHtcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdjb3Jwb3JhdGlvbi9pbmRleCcsIHtcclxuICAgICAgICAgICAgYm9keToganNvbihqd3RfZGVjb2RlKHRoaXMuYXV0aFNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oKSkuY29ycG9yYXRpb25faWQpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29ycG9yYXRpb25zID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCd1c2VyL3VwZGF0ZScsIHtcclxuICAgICAgICAgICAgYm9keToganNvbih0aGlzLnVzZXIpXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJHZWJydWlrZXIgc3VjY2Vzdm9sIGdldXBkYXRldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjAwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvcnBvcmF0aW9uIHtcbiAgICBpZDogbnVtYmVyO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIGFkZHJlc3M6IHN0cmluZztcbiAgICB6aXA6IHN0cmluZztcclxufSJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/user/users',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var users = (function () {
        function users(http, router) {
            this.http = http;
            this.router = router;
            this.users = [];
            this.fetchUsers();
        }
        users.prototype.fetchUsers = function () {
            var _this = this;
            this.http.fetch('user/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.users = data;
            });
        };
        users.prototype.destroy = function (event, user) {
            var _this = this;
            event.stopPropagation();
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder deze gebruiker',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (ok) {
                if (ok) {
                    _this.http.fetch('user/destroy', {
                        body: aurelia_fetch_client_1.json(user)
                    })
                        .then(function (data) {
                        swal({
                            title: 'Verwijderd',
                            text: 'Gebruiker is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                        });
                        _this.users = _this.users.filter(function (obj) { return obj.id != user.id; });
                    });
                }
            });
        };
        users.prototype.editUrl = function (event, user) {
            event.stopPropagation();
            this.router.navigate("gebruiker/bewerk/" + user.id);
        };
        return users;
    }());
    users = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], users);
    exports.users = users;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlci91c2Vycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFLQSxJQUFhLEtBQUs7UUFJZCxlQUFvQixJQUFnQixFQUFVLE1BQWM7WUFBeEMsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7WUFGNUQsVUFBSyxHQUFHLEVBQUUsQ0FBQztZQUdQLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN0QixDQUFDO1FBRUQsMEJBQVUsR0FBVjtZQUFBLGlCQU1DO1lBTEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO2lCQUN4QixJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2lCQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNOLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELHVCQUFPLEdBQVAsVUFBUSxLQUFLLEVBQUUsSUFBSTtZQUFuQixpQkEyQkM7WUExQkcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXhCLElBQUksQ0FBQztnQkFDRCxLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixJQUFJLEVBQUUsU0FBUztnQkFDZixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixpQkFBaUIsRUFBRSw2QkFBNkI7Z0JBQ2hELGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGtCQUFrQixFQUFFLFNBQVM7YUFDaEMsRUFBRSxVQUFDLEVBQUU7Z0JBQ0YsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDTCxLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7d0JBQzVCLElBQUksRUFBRSwyQkFBSSxDQUFDLElBQUksQ0FBQztxQkFDbkIsQ0FBQzt5QkFDRyxJQUFJLENBQUMsVUFBQSxJQUFJO3dCQUNOLElBQUksQ0FBQzs0QkFDRCxLQUFLLEVBQUUsWUFBWTs0QkFDbkIsSUFBSSxFQUFFLG1DQUFtQzs0QkFDekMsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsaUJBQWlCLEVBQUUsS0FBSzt5QkFDM0IsQ0FBQyxDQUFDO3dCQUVILEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztvQkFDL0QsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELHVCQUFPLEdBQVAsVUFBUSxLQUFLLEVBQUUsSUFBSTtZQUNmLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQWpEQSxBQWlEQyxJQUFBO0lBakRZLEtBQUs7UUFEakIsOEJBQVU7eUNBS21CLGlDQUFVLEVBQWtCLHVCQUFNO09BSm5ELEtBQUssQ0FpRGpCO0lBakRZLHNCQUFLIiwiZmlsZSI6ImNvbXBvbmVudHMvdXNlci91c2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgdXNlcnMge1xyXG5cclxuICAgIHVzZXJzID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaFVzZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2hVc2VycygpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ3VzZXIvaW5kZXgnKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VycyA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koZXZlbnQsIHVzZXIpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnV2VldCB1IGhldCB6ZWtlcj8nLFxyXG4gICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnSmEgdmVyd2lqZGVyIGRlemUgZ2VicnVpa2VyJyxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ1N0b3AhJyxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnIzAwMmU1YicsXHJcbiAgICAgICAgfSwgKG9rKSA9PiB7XG4gICAgICAgICAgICBpZiAob2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ3VzZXIvZGVzdHJveScsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keToganNvbih1c2VyKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVyd2lqZGVyZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnR2VicnVpa2VyIGlzIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcnMgPSB0aGlzLnVzZXJzLmZpbHRlcigob2JqKSA9PiBvYmouaWQgIT0gdXNlci5pZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgIH1cblxuICAgIGVkaXRVcmwoZXZlbnQsIHVzZXIpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShcImdlYnJ1aWtlci9iZXdlcmsvXCIgKyB1c2VyLmlkKTtcclxuICAgIH1cclxufVxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('text!app.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\r\n  <require from=\"sweetalert/dist/sweetalert.css\"></require>\r\n  <div id=\"app\">\r\n    <div class=\"strip strip__top\"></div>\r\n    <nav class=\"navbar navbar-default navbar-static-top\">\r\n      <div class=\"container\">\r\n        <div class=\"navbar-header\">\r\n\r\n          <!-- Collapsed Hamburger -->\r\n          <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#app-navbar-collapse\">\r\n            <span class=\"sr-only\">Toggle Navigation</span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n          </button>\r\n\r\n          <a class=\"navbar-brand hidden-xs\" href=\"/\">\r\n            ${title}\r\n          </a>\r\n        </div>\r\n\r\n        <div class=\"collapse navbar-collapse\" id=\"app-navbar-collapse\">\r\n          <!-- Right Side Of Navbar -->\r\n          <ul class=\"nav navbar-nav navbar-right\">\r\n            <li>\r\n              <a route-href=\"route: dashboard\" class=\"${currUrl == 'dashboard' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Dashboard\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a route-href=\"route: corporations\" class=\"${currUrl == 'corporations' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Corporaties\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a route-href=\"route: users\" class=\"${currUrl == 'users' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Gebruikers\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a route-href=\"route: softwares\" class=\"${currUrl == 'softwares' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Software\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a href=\"#\" click.delegate=\"logout()\" show.bind=\"authenticated\">\r\n                Uitloggen\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a href=\"#\" class=\"${currUrl == 'register' ? 'active' : ''}\" show.bind=\"!authenticated\">\r\n                Registreer\r\n              </a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </nav>\r\n\r\n    <router-view></router-view>\r\n  </div>\r\n\r\n  <div id=\"footer\">\r\n    <p>SFORUM 2017</p>\r\n  </div>\r\n  <div class=\"strip strip__footer\"></div>\r\n</template>\r\n"; });
define('text!components/reaction/reaction.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <u>\r\n            <a href=\"#\">\r\n              ${reaction.name} \r\n            </a>\r\n          </u>    \r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"panel-body\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12 margin__top__small\">\r\n          <div class=\"margin__bottom__small\" if.bind=\"editing\">\r\n            <form enctype=\"multipart/form-data\" method=\"post\" submit.delegate=\"update()\">\r\n              <textarea class=\"form-control margin__bottom__small\" value.bind=\"reaction.reaction\" name=\"reaction\"></textarea>\r\n\r\n              <button type=\"submit\" class=\"btn btn-xs btn-second\">\r\n                Update\r\n              </button>\r\n\r\n              <button class=\"btn btn-xs btn-link\" click.delegate=\"editing = false\">\r\n                Annuleer\r\n              </button>\r\n            </form>\r\n          </div>\r\n\r\n          <div if.bind=\"!editing\">\r\n              <p>${reaction.reaction}</p>\r\n          </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"panel-footer\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-12\">\r\n          <button class=\"btn btn-primary slideDown\" click.delegate=\"destroy()\">\r\n            Verwijder\r\n          </button>\r\n\r\n          <button class=\"btn btn-second slideDown\" if.bind=\"!editing\" click.delegate=\"editing = true\">\r\n            Bewerk\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n</template>"; });
define('text!components/reaction/reactions.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./reaction\"></require>\n\n  <div repeat.for=\"reaction of reactions\">\n    <reaction reaction.bind=\"reaction\"></reaction>\n  </div>\n</template>"; });
define('text!components/authentication/login.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Login</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-heading\">\r\n            SFORUM \r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" id=\"form\" role=\"form\" method=\"POST\" submit.delegate=\"login()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"email\" class=\"col-md-4 control-label\">E-Mail</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input id=\"email\" type=\"email\" class=\"form-control\" name=\"email\" value.bind=\"email\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"password\" class=\"col-md-4 control-label\">Wachtwoord</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input id=\"password\" type=\"password\" class=\"form-control\" name=\"password\" value.bind=\"password\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-8 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                      Login\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/corporation/corporations.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Corporaties</h1>\r\n  </div>\r\n\r\n  <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar>\r\n        <div slot=\"buttons\">\r\n          <a route-href=\"route: newCorporation\" class=\"btn btn-primary btn-block margin__bottom__small\">Maak Corporatie</a>\r\n        </div>\r\n      </side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Naam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Adres\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Postcode\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"corporation of corporations\">\r\n                  <td class=\"col-md-3\">\r\n                    ${corporation.name}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${corporation.address}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${corporation.zip}\r\n                  </td>\r\n\r\n                  <td>\r\n                    <i class=\"material-icons\" click.delegate=\"destroy($event, corporation)\">&#xE872;</i>               \r\n                    <i class=\"material-icons\" click.delegate=\"editUrl($event, corporation)\">&#xE254;</i>\r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/corporation/editCorporation.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Bewerk Corporatie</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Bewerk corporatie</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"update()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"address\" class=\"col-md-4 control-label\">Adres</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.address\" id=\"address\" type=\"text\" class=\"form-control\" name=\"address\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"zip\" class=\"col-md-4 control-label\">Postcode</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.zip\" placeholder=\"Zip formaat in deze format: 5993-hk\" id=\"zip\" type=\"text\" class=\"form-control\" name=\"zip\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"email\" class=\"col-md-4 control-label\">Email</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.email\" id=\"zip\" type=\"text\" class=\"form-control\" name=\"email\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Update corporatie\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/corporation/newCorporation.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Nieuwe Corporatie</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Nieuwe corporatie</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"store()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"address\" class=\"col-md-4 control-label\">Adres</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.address\" id=\"address\" type=\"text\" class=\"form-control\" name=\"address\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"zip\" class=\"col-md-4 control-label\">Postcode</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.zip\" placeholder=\"Zip formaat in deze format: 5993-hk\" id=\"zip\" type=\"text\" class=\"form-control\" name=\"zip\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"email\" class=\"col-md-4 control-label\">Email</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"corporation.email\" id=\"zip\" type=\"text\" class=\"form-control\" name=\"email\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Maak corporatie\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\" >\r\n    <h1>Forum</h1>\r\n  </div>\r\n\r\n <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar>\r\n          <div slot=\"buttons\">\r\n              <a route-href=\"route: newForum\" class=\"btn btn-primary btn-block margin__bottom__small\">Maak Forum</a>\r\n          </div>\r\n      </side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-5 table__title\">\r\n                    Naam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Omschrijving\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"forum of forums\" click.delegate=\"link(forum)\">\r\n                  <td class=\"col-md-4\">\r\n                    ${forum.name}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${forum.description}\r\n                  </td>\r\n\r\n                  <td>\r\n                    <i class=\"material-icons\" click.delegate=\"destroy($event, forum)\">&#xE872;</i>\r\n                    <i class=\"material-icons\" click.delegate=\"editUrl($event, forum)\">&#xE254;</i>                \r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n </div>\r\n</template>"; });
define('text!components/dashboard/editForum.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Bewerk forum</h1>\r\n  </div>\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>bewerk forum</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"update()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"description\" class=\"col-md-4 control-label\">Beschrijving</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.description\" id=\"description\" type=\"description\" class=\"form-control\" name=\"description\">\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Update forum\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/dashboard/newForum.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Nieuw forum</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Nieuw forum</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"store()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"description\" class=\"col-md-4 control-label\">Beschrijving</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.description\" id=\"description\" type=\"description\" class=\"form-control\" name=\"description\">\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Maak forum\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/message/message.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../reaction/reactions\"></require>\r\n\n  <div class=\"bar\">\r\n    <h1>Bericht</h1>\r\n  </div>\n\r\n  <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <div class=\"row\">\r\n              <div class=\"col-md-11\">\r\n                <u>\r\n                  <a href=\"#\" style=\"color:white;\">\r\n                    ${message.user}\r\n                  </a>\r\n                </u>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <div class=\"row\" style=\"border-bottom: 1px solid black;\">\r\n              <div class=\"col-md-12 margin__bottom__small\">\r\n                <input id=\"subject\" if.bind=\"editing\" type=\"text\" class=\"form-control\" name=\"subject\" value.bind=\"message.subject\" required autofocus>\r\n                <h3 if.bind=\"!editing\">${message.subject}</h3>\r\n              </div>\r\n            </div>\r\n\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12 margin__top__small\">\r\n                <div if.bind=\"editing\">\r\n                  <textarea class=\"form-control margin__bottom__small\" value.bind=\"message.message\" name=\"message\"></textarea>\r\n\r\n                  <button class=\"btn btn-xs btn-second\" click.delegate=\"update()\">Update</button>\r\n                  <button class=\"btn btn-xs btn-link\" click.delegate=\"editing = false\">Annuleer</button>\r\n                </div>\r\n\r\n                <div if.bind=\"!editing\">\r\n                  <p>${message.message}</p>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n\r\n          <div class=\"panel-footer\">\r\n            <div class=\"row\">\r\n              <div class=\"col-md-12\">\r\n                <button class=\"btn btn-primary slideDown\" click.delegate=\"destroy()\">\r\n                  Verwijder\r\n                </button>\r\n\r\n                <button class=\"btn btn-second slideDown\" if.bind=\"!editing\" click.delegate=\"editing = true\">\r\n                  Bewerk\r\n                </button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <reactions reactions.bind=\"message.reactions\"></reactions>\r\n        <textarea class=\"form-control margin__bottom__small margin__top__small\" value.bind=\"reaction.reaction\" name=\"reaction\"></textarea>\r\n        <button click.delegate=\"post()\" class=\"btn btn-primary\">\r\n          Post reactie\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/message/messages.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Berichten</h1>\r\n  </div>\r\n\r\n  <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar>\r\n        <div slot=\"buttons\">\r\n          <a route-href=\"route: newMessage; params.bind: { id: forumId }\" class=\"btn btn-primary btn-block margin__bottom__small\">Nieuw bericht</a>\r\n        </div>\r\n      </side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-5 table__title\">\r\n                    Onderwerp\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Door\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Software\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"message of messages\" click.delegate=\"link(message)\">\r\n                  <td class=\"col-md-4\">\r\n                    ${message.subject}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${message.user}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${message.software}\r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/message/newMessage.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Nieuw bericht</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Nieuw bericht</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"store()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"subject\" class=\"col-md-4 control-label\">Onderwerp</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"message.subject\" id=\"subject\" type=\"text\" class=\"form-control\" name=\"subject\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"message\" class=\"col-md-4 control-label\">Bericht</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <textarea value.bind=\"message.message\" id=\"message\" type=\"message\" class=\"form-control\" name=\"message\"></textarea>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"urgent\" class=\"col-md-4 control-label\">Software</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <select class=\"form-control\" value.bind=\"message.software\" required>\r\n                    <option disabled value=\"\">Selecteer software</option>\r\n\r\n                    <option repeat.for=\"software of softwares\" model.bind=\"software.id\">${software.name}</option>\r\n                  </select>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Maak bericht aan\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/shared/sideBar.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-2 col-lg-2\">\r\n    <slot name=\"buttons\"></slot>\r\n\r\n    <ul class=\"list-group sidebar\">\r\n      <li class=\"list-group-item menu\">\r\n        <h4>Menu</h4>\r\n      </li>\r\n\r\n      <a href=\"#\">\r\n        <li class=\"list-group-item\">\r\n          <h4>Nieuwe berichten</h4>\r\n        </li>\r\n      </a>\r\n\r\n      <a href=\"#\">\r\n        <li class=\"list-group-item\">\r\n          <h4>Mijn berichten</h4>\r\n        </li>\r\n      </a>\r\n\r\n      <li class=\"list-group-item\">\r\n        <input id=\"searchInput\"\r\n               onkeydown=\"if (event.keyCode == 13) document.getElementById('search').click()\"\r\n               class=\"form-control\"\r\n               placeholder=\"Zoeken\">\r\n\r\n        <button id=\"search\" onclick=\"search()\" class=\"btn btn-primary btn-block margin__top__small\">\r\n            Zoeken\r\n        </button>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n\n</template>\n"; });
define('text!components/software/editSoftware.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Bewerk software</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Bewerk software</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"update()\">\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"software.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\n\r\n              <div class=\"form-group\">\r\n                <label for=\"urgent\" class=\"col-md-4 control-label\">Corporatie</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <select class=\"form-control\" value.bind=\"software.corporation_id\" required>\r\n                    <option disabled value=\"\">Selecteer corporation</option>\r\n\r\n                    <option repeat.for=\"corporation of corporations\" model.bind=\"software.corporation_id\">${corporation.name}</option>\r\n                  </select>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Update software\r\n                  </button>\r\n                </div>\r\n              </div>\n            </form>\n          </div>\n        </div>\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/software/newSoftware.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Nieuwe software</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Nieuwe software</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"store()\">\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"software.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"urgent\" class=\"col-md-4 control-label\">Corporatie</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <select class=\"form-control\" value.bind=\"software.corporation_id\" required>\r\n                    <option disabled value=\"\">Selecteer corporation</option>\r\n\r\n                    <option repeat.for=\"corporation of corporations\" model.bind=\"software.corporation_id\">${corporation.name}</option>\r\n                  </select>\r\n                </div>\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Maak software\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/software/softwares.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Software</h1>\r\n  </div>\r\n\r\n  <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar>\r\n        <div slot=\"buttons\">\r\n          <a route-href=\"route: newSoftware\" class=\"btn btn-primary btn-block margin__bottom__small\">Nieuwe software</a>\r\n        </div>\r\n      </side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Naam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Corporation\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"software of softwares\">\r\n                  <td class=\"col-md-3\">\r\n                    ${software.name}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${software.corporation}\r\n                  </td>\n\r\n                  <td>\r\n                    <i class=\"material-icons\" click.delegate=\"destroy($event, software)\">&#xE872;</i>\r\n                    <i class=\"material-icons\" click.delegate=\"editUrl($event, software)\">&#xE254;</i>\r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/user/editUser.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Bewerk gebruiker</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Bewerk gebruiker</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"update()\">\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"user.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <label for=\"last_name\" class=\"col-md-4 control-label\">Achternaam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"user.lastName\" id=\"last_name\" type=\"text\" class=\"form-control\" name=\"last_name\" required autofocus>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <label for=\"urgent\" class=\"col-md-4 control-label\">Corporatie</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <select class=\"form-control\" value.bind=\"user.corporation_id\" required>\r\n                    <option disabled value=\"\">Selecteer corporatie</option>\r\n                    <option repeat.for=\"corporation of corporations\" model.bind=\"corporation.id\">${corporation.name}</option>\r\n                  </select>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <label for=\"urgent\" class=\"col-md-4 control-label\">Role</label>\r\n                <div class=\"col-md-6\">\r\n                  <select class=\"form-control\" value.bind=\"user.role\" required>\r\n                    <option disabled value=\"\">Selecteer role</option>\r\n\r\n                    <option model.bind=\"1\">\r\n                      Gebruiker\r\n                    </option>\r\n                    <option model.bind=\"2\">\r\n                      Admin\r\n                    </option>\r\n          \r\n                  </select>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <label for=\"urgent\" class=\"col-md-4 control-label\">Geslacht</label>\r\n                <div class=\"col-md-6\">\r\n                  <select class=\"form-control\" value.bind=\"user.gender\" required>\r\n                    <option disabled value=\"\">Selecteer geslacht</option>\r\n\r\n                    <option model.bind=\"1\">\r\n                      Man\r\n                    </option>\r\n                    <option model.bind=\"2\">\r\n                      Vrouw\r\n                    </option>\r\n\r\n                  </select>\r\n                </div>\r\n              </div>\r\n\n\r\n              <div class=\"form-group\">\r\n                <label for=\"salary\" class=\"col-md-4 control-label\">Salaris</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"user.salary\" id=\"salary\" type=\"text\" class=\"form-control\" name=\"salary\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"email\" class=\"col-md-4 control-label\">Email</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"user.email\" id=\"email\" type=\"email\" class=\"form-control\" name=\"description\" required>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <label for=\"about\" class=\"col-md-4 control-label\">Over mij</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <textarea value.bind=\"user.about\" id=\"about\" type=\"text\" class=\"form-control\" name=\"about\" required></textarea>\r\n                </div>\r\n              </div>\n\n              <div class=\"form-group\">\r\n                <label for=\"password\" class=\"col-md-4 control-label\">Wachtwoord</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"user.password\" id=\"password\" type=\"password\" class=\"form-control\" name=\"password\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Update gebruiker\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/user/users.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Gebruikers</h1>\r\n  </div>\r\n\r\n  <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar></side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Naam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Achternaam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Email\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"user of users\">\r\n                  <td class=\"col-md-3\">\r\n                    ${user.name}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${user.lastName}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${user.email}\r\n                  </td>\r\n\r\n                  <td>\r\n                    <i class=\"material-icons\" click.delegate=\"destroy($event, user)\">&#xE872;</i>\r\n                    <i class=\"material-icons\" click.delegate=\"editUrl($event, user)\">&#xE254;</i>\r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map