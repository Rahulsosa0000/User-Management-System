import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormService } from '../../service/userform/form.service';

@Component({
  selector: 'app-editpage',
  imports: [CommonModule,FormsModule, NgMultiSelectDropDownModule, ReactiveFormsModule],
  templateUrl: './editpage.component.html',
  styleUrl: './editpage.component.css'
})
export class EditpageComponent implements OnInit {
  detailsform!: FormGroup;  
  userId!: number; // Store User ID

  
  // Dropdown Data
  states = ['Gujarat', 'Chhattisgarh', 'Goa', 'Assam'];
  districts: string[] = [];
  talukas: string[] = [];
  villages: string[] = [];
 
  // Static Data for Cascading Dropdowns
  districtData: { [key: string]: string[] } = {
    Gujarat: ['Ahmedabad', 'Somnath'],
    Chhattisgarh: ['Raipur', 'Bilaspur'],
    Goa: ['North Goa', 'South Goa'],
    Assam: ['Guwahati', 'Dibrugarh']
  };
 
  talukaData: { [key: string]: string[] } = {
    'Ahmedabad': ['Sanand', 'Mandal'],
    'Somnath': ['Kodinar', 'Una'],
    'Raipur': ['Abhanpur', 'Arang'],
    'Bilaspur': ['Takhatpur', 'Mungeli'],
    'North Goa': ['Bardez', 'Bicholim'],
    'South Goa': ['Mormugao', 'Quepem'],
    'Guwahati': ['Dispur', 'Azara'],
    'Dibrugarh': ['Naharkatia', 'Tingkhong']
  };
 
  villageData: { [key: string]: string[] } = {
    'Sanand': ['Changodar'],
    'Mandal': ['Hansalpur', 'Kanpura'],
    'Kodinar': ['Velva','kadodara'],
    'Una': ['Amodra ', 'Bhacha'],
    'Abhanpur': ['Navagaon', 'Kurud'],
    'Arang': ['Tumgaon', 'Bhatgaon'],
    'Takhatpur': ['Lormi', 'Malhar'],
    'Mungeli': ['Patharia', 'Lawan'],
    'Bardez': ['Calangute', 'Candolim'],
    'Bicholim': ['Mayem', 'Pilgao'],
    'Mormugao': ['Vasco', 'Chicalim'],
    'Quepem': ['Curchorem', 'Balli'],
    'Dispur': ['Khanapara', 'Panbazar'],
    'Azara': ['Garal', 'Borjhar'],
    'Naharkatia': ['Tipling', 'Joypur'],
    'Tingkhong': ['Namrup', 'Duliajan']
  };


  constructor(private fb: FormBuilder,
       private router : Router,
       private http : HttpClient,
       private route : ActivatedRoute,
       private userservice: FormService) {}


ngOnInit(): void {
  this.detailsform = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', Validators.required],
    userType: ['', Validators.required],
    state: ['', Validators.required],
    district: [{ value: '', disabled: true }, Validators.required],
    taluka: [{ value: '', disabled: true }, Validators.required],
    village: [{ value: '', disabled: true }, Validators.required]
  });

  // Get User ID from URL
  this.route.params.subscribe(params => {
    const userId = params['id'];
    console.log("Route Parameter ID:", userId); // Debugging
    if (userId) {
      this.userId = Number(userId); // Store the userId
      console.log("Stored User ID:", this.userId);
      this.fetchUserData(this.userId);
    }
  });
}



fetchUserData(userId: number) {
  this.http.get<any>(`http://localhost:8080/api/users/${userId}`).subscribe(user => {
    this.detailsform.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      userType: user.userType,
      state: user.state,
      district: user.district,
      taluka: user.taluka,
      village: user.village
    });

    // Enable dropdowns based on selected values
    this.districts = this.districtData[user.state] || [];
    this.talukas = this.talukaData[user.district] || [];
    this.villages = this.villageData[user.taluka] || [];

    this.detailsform.get('district')?.enable();
    this.detailsform.get('taluka')?.enable();
    this.detailsform.get('village')?.enable();
  });
}



  onStateChange(event: any) {
    const selectedState = event.target.value;
    this.districts = this.districtData[selectedState] || [];
    this.talukas = [];
    this.villages = [];
    
    this.detailsform.get('district')?.reset();
    this.detailsform.get('taluka')?.reset();
    this.detailsform.get('village')?.reset();
    
    this.detailsform.get('district')?.enable();
    this.detailsform.get('taluka')?.disable();
    this.detailsform.get('village')?.disable();
  }

  onDistrictChange(event: any) {
    const selectedDistrict = event.target.value;
    this.talukas = this.talukaData[selectedDistrict] || [];
    this.villages = [];
    
    this.detailsform.get('taluka')?.reset();
    this.detailsform.get('village')?.reset();
    
    this.detailsform.get('taluka')?.enable();
    this.detailsform.get('village')?.disable();
  }

  onTalukaChange(event: any) {
    const selectedTaluka = event.target.value;
    this.villages = this.villageData[selectedTaluka] || [];
    
    this.detailsform.get('village')?.reset();
    this.detailsform.get('village')?.enable();
  }

 



// submit() {
//   console.log("User ID before update:", this.userId);
//   console.log("Form Data before update:", this.detailsform.value);

//   if (this.userId === undefined || this.userId === null) {
//       console.error("Error: User ID is undefined or null!");
//       alert("Invalid User ID!");
//       return;
//   }

//   if (this.detailsform.valid) {
//     this.userservice.updateUser(this.userId, this.detailsform.value).subscribe(
//       (response) => {
//         console.log('User Updated:', response);
//         alert("Updated successfully");
//         this.router.navigate(['/dashboard']); // Redirect to dashboard
//       },
//       (error) => {
//         console.error('Update Failed:', error);
//         alert("Update failed! Please try again.");
//       }
//     );
//   } else {
//     console.log('Form is invalid');
//   }
// }


submit() {
  console.log("User ID before update:", this.userId);
  console.log("Form Data before update:", this.detailsform.value);

  if (!this.userId) {
    console.error("Error: User ID is undefined or null!");
    alert("Invalid User ID!");
    return;
  }

  if (!this.detailsform.valid) {
    console.error("Error: Form is invalid!");
    return;
  }

  // Debugging Form Data
  Object.keys(this.detailsform.value).forEach(key => {
    if (this.detailsform.value[key] === undefined) {
      console.error(`Error: Form field ${key} is undefined!`);
    }
  });

  this.userservice.updateUser(this.userId, this.detailsform.value).subscribe(
    (response) => {
      console.log('User Updated:', response);
      alert("Updated successfully");
      this.router.navigate(['/dashboard']); 
    },
    (error) => {
      console.error('Update Failed:', error);
      alert("Update failed! Please try again.");
    }
  );
}

}


  

