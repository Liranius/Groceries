import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TextField } from 'tns-core-modules/ui/text-field';
import * as SocialShare from 'nativescript-social-share';

import { Grocery } from '../../shared/grocery/grocery';
import { GroceryListService } from '../../shared/grocery/grocery-list.service';

@Component({
    selector: 'list',
    providers: [GroceryListService],
    templateUrl: 'pages/list/list.html',
    styleUrls: ['pages/list/list-common.css', 'pages/list/list.css']
})
export class ListComponent implements OnInit {

    @ViewChild("groceryTextField")
    groceryTextField: ElementRef;

    grocery ='';
    groceryList: Array<Grocery> = [];

    isLoading = false;
    listLoaded = false;

    constructor(
        private groceryListService: GroceryListService
    ) {}

    add() {
        if (this.grocery.trim() === '') {
            alert('Enter a grocery item');
            return;
        }

        // Dismiss the keyboard
        const textField = <TextField>this.groceryTextField.nativeElement;
        textField.dismissSoftInput();

        this.groceryListService.add(this.grocery).subscribe(
            groceryObject => {
                this.groceryList.unshift(groceryObject);
                this.grocery = '';
            },
            () => {
                alert({
                    message: 'An error occurred while adding an item to your list.',
                    okButtonText: 'OK'
                });
                this.grocery = '';
            }
        )
    }

    share() {
        const listString = this.groceryList
            .map(grocery => grocery.name)
            .join(', ')
            .trim();
        SocialShare.shareText(listString);
    }

    ngOnInit() {
        this.isLoading = true;
        this.groceryListService.load().subscribe(loadedGroceries => {
            loadedGroceries.forEach(groceryObject => {
                this.groceryList.unshift(groceryObject);
            });
            this.isLoading = false;
            this.listLoaded = true;
        });
    }
}
