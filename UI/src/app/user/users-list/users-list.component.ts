import { UserService } from './../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AllUsers } from 'src/app/shared/models/all-users';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  public users: User[] = [];
  public totalRecords: number;
  public totalPages: number;
  public currentPageNumber: number = 1;
  public recordsPerPage: number = 5;

  public maxPagesLink: number = 5;
  public directionLink: boolean = true;

  // public url: string = "../../../assets/_birds.jpg";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    console.log('inside user list constructor');

    this.activatedRoute.queryParamMap.subscribe((params): void => {
      this.currentPageNumber = +params.get('page') ? +params.get('page') : 1; // first page

      this.getUsers();
    });
  }

  ngOnInit(): void {}

  getUsers() {
    this.userService
      .getAll(this.currentPageNumber, this.recordsPerPage)
      .subscribe((users: AllUsers) => {
        this.users = users.records;
        this.totalRecords = users.totalRecords;
        this.totalPages = users.totalPages;
      });
  }

  setUserId(userId: number) {
    this.userService.userToDelete = userId;
  }

  onTableDataChange(selectedPageNumber: number) {
    //Reference: https://coding.gonevis.com/how-to-use-pagination-with-query-params-in-angular/
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: selectedPageNumber === 0 ? 1 : selectedPageNumber, // if selected page is 0(zero) then store 1 as first page in the page query param
      },
      queryParamsHandling: 'merge',
    });
  }

  logout() {
    this.authService.logout();
  }
}
