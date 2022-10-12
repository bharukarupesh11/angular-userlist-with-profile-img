import { EncryptionService } from './../../shared/services/encryption.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  error: string = '';
  user: User;
  userId: number;
  formTitle: string = "Add User";
  buttonTitle: string = "Create";

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private encryptionService: EncryptionService) {
      this.userId = +(this.route.snapshot.paramMap.get('userId')); // type casting string to number using '+'
      
      if(this.userId) {
        this.formTitle = "Edit User";
        this.buttonTitle = "Update";

        this.userService.get(this.userId).subscribe((user: User) => {
          this.userForm.setValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            file: user.file,
            isAdmin: user.isAdmin
          });
        });
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      file: ['', Validators.required],
      isAdmin: [0]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  uploadFile(event: any) {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];

      // Setting file inside file variable
      this.userForm.get('file').setValue(file);
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if(this.userForm.invalid) return ;

    this.loading = true; // start spinner loading only if form if valid

    this.user = this.userForm.value; // copy the form values in the user object
    
    const formData = new FormData();
    formData.append('firstName', this.user.firstName);
    formData.append('lastName', this.user.lastName);
    formData.append('email', this.user.email);

    // encrypting password
    const encryptedPassword = this.encryptionService.encrypt(this.user.password);
    this.user.password = encryptedPassword;

    formData.append('password', this.user.password);
    formData.append('file', this.user.file);
    formData.append('isAdmin', JSON.stringify(this.user.isAdmin)); // need to convert on the backend back to boolean value

    if(this.userId) this.updateUser(formData);
    else this.createUser(formData);
  }

  createUser(formData: FormData) {
    this.userService.create(formData)
      .subscribe({
        next: (result) => { 
          console.log('User Result: ', result);
          this.router.navigate(['/user-list']);
        },
        error: (e) => { 
          this.error = e.error.errorMsg;
          this.loading = false;
          console.log('Error: ', e) 
          return ;
        },
        complete: () => console.log('Complete')
      });
  }

  updateUser(formData: FormData) {
    this.userService.update(this.userId, formData)
    .subscribe({
      next: (result) => { 
        console.log('User Result: ', result);
        this.router.navigate(['/user-list']);
      },
      error: (e) => { 
        this.error = e.error.errorMsg;
        this.loading = false;
        console.log('Error: ', e) 
        return ;
      },
      complete: () => console.log('Complete')
    });
  }

}
