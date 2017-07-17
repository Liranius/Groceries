import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { View } from 'tns-core-modules/ui/core/view';
import { Color } from 'tns-core-modules/color';

import { User } from '../../shared/user/user';
import { UserService } from '../../shared/user/user.service';

@Component({
    selector: 'login',
    providers: [UserService],
    templateUrl: 'pages/login/login.html',
    styleUrls: ['pages/login/login-common.css', 'pages/login/login.css']
})
export class LoginComponent implements OnInit {

    @ViewChild('container')
    container: ElementRef;

    user: User;
    isLoggingIn = true;

    constructor(
        private router: Router,
        private page: Page,
        private userService: UserService
    ) {
        this.user = new User();
        this.user.email = 'bulb@bulb.bulb';
        this.user.password = '123456';
    }

    submit() {
        if (!this.user.isValidEmail()) {
            alert('Enter a valid email address.');
            return;
        }

        if (this.isLoggingIn) {
            this.login();
        } else {
            this.signUp();
        }
    }

    login() {
        this.userService.login(this.user).subscribe(
            () => this.router.navigate(['/list']),
            (error) => alert('Unfortunately we could not find your account.')
        );
    }

    signUp() {
        this.userService.register(this.user).subscribe(() => {
                alert('Your account was successfully created.');
                this.toggleDisplay();
            },
            () => alert('Unfortunately we were unable to create your account.')
        );
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
        const container = <View>this.container.nativeElement;
        container.animate({
            backgroundColor: this.isLoggingIn ? new Color('white') : new Color('#301217'),
            duration: 200
        });
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.page.backgroundImage = 'res://bg_login';
    }
}
