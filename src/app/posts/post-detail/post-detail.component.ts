import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';
import { DocumentNode } from 'graphql';
import { client } from '../graphql.client';


import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { PostByIdInterface } from '../graphql/schema';
import { GetPostsQuery } from '../graphql/queries';

@Component({
    templateUrl: './post-detail.component.html'
})
export class postDetailComponent implements OnInit {
    public pageTitle: string = 'post Detail';
    public post: ApolloQueryObservable<PostByIdInterface>;
    public errorMessage: string;
    private apollo: Apollo;
    public nameControl = new FormControl();
    // Observable variable of the graphql query
    public nameFilter: Subject<string> = new Subject<string>();
    // Inject Angular2Apollo service
    constructor(apollo: Apollo) {
        this.apollo = apollo;
    }

    ngOnInit(): void {
        // Query users data with observable variables
        this.post = this.apollo.watchQuery<PostByIdInterface>({
            query: GetPostsQuery,
        })
            // Return only users, not the whole ApolloQueryResult
            .map(result => result.data) as any;

        // Add debounce time to wait 300 ms for a new change instead of keep hitting the server
        this.nameControl.valueChanges.debounceTime(300).subscribe(name => {
            this.nameFilter.next(name);
        });
        console.log('post detail');
        console.log(this.post);

    }



    // getpost(id: number) {
    //     this._postService.getpost(id).subscribe(
    //         post => this.post = post,
    //         error => this.errorMessage = <any>error);
    // }

    // onBack(): void {
    //     this._router.navigate(['/posts']);
    // }

    onRatingClicked(message: string): void {
        this.pageTitle = 'post Detail: ' + message;
    }
}