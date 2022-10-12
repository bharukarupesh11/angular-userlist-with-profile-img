import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'user-delete-popup',
  templateUrl: './user-delete-popup.component.html',
  styleUrls: ['./user-delete-popup.component.scss']
})
export class UserDeletePopupComponent implements OnInit {
  loading: boolean = false;
  error: string = '';

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

  delete(userId: number) {
    console.log('Inside user del confirmation');

    this.loading = true;
    console.log('User Id: ', userId);

     /* this.userService.delete(userId)
      .subscribe(
        response => {
          window.location.reload(); // reload the current page
        },
        (e) => {
          this.loading = false;
          console.log('Error : ', e);
          this.error = e.error.errorMsg;
          return ;
        }); */

      this.userService.delete(userId)
        .subscribe({
          next: (response) => { 
            console.log('Delete Response: ', response);
            window.location.reload(); // reload the current page
          },
          error: (e) => { 
            this.loading = false;
            console.log('Error : ', e);
            this.error = e.error.errorMsg;
            return ; 
          },
          complete: () => console.log('Complete')
        });
  }

}
