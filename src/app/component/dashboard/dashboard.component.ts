 
// import { Component, OnInit } from '@angular/core';
// import { FormService } from '../../service/userform/form.service';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
 
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [DatePipe, CommonModule, ReactiveFormsModule, FormsModule, NgMultiSelectDropDownModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   users: any[] = [];
//   userForm: FormGroup; // manage user form
//   selectedUser: any = null; //Stores the currently selected user.
//   filteredUsers: any[] = []; // Filtered users list
 
 
//   selectedFilters: string[] = []; // Multiple selected filters
//   searchValue: string = ''; // Search input value
 
//   isDropdownOpen = false; //  Dropdown Open/Close State
 
//   filterOptions = [
//     { key: "name", label: "Name" },
//     { key: "email", label: "Email" },
//     { key: "phone", label: "Phone" },
//     { key: "dob", label: "Date of Birth" },
//     { key: "gender", label: "Gender" },
//     { key: "address", label: "Address" },
//     { key: "userType", label: "User Type" },
//     { key: "state", label: "State" },
//     { key: "district", label: "District" },
//     { key: "taluka", label: "Taluka" },
//     { key: "village", label: "Village" }
//   ];
 
//   // Variables for dropdowns
//   states: any[] = [];
//   districts: any[] = [];
//   talukas: any[] = [];
//   villages: any[] = [];
 
//   // Filter variables
//   selectedState: any[] = [];
//   selectedDistrict: any[] = [];
//   selectedTaluka: any[] = [];
//   selectedVillage: any[] = [];
 
//   dropdownSettings = {
//     singleSelection: false,
//     idField: 'id',
//     textField: 'name',
//     allowSearchFilter: true
//   };
 
//   constructor(
//     private fb: FormBuilder,
//     private userService: FormService
//   ) {
//     this.userForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', Validators.required],
//       dob: ['', Validators.required],
//       gender: ['', Validators.required],
//       address: ['', Validators.required],
//       userType: ['', Validators.required],
//       state: ['', Validators.required],
//       district: ['', Validators.required],
//       taluka: ['', Validators.required],
//       village: ['', Validators.required]
//     });
//   }
 
//   ngOnInit(): void {
//     this.getUsers(); // Fetch users when component loads
//   }
 
//   // Fetch user data from the service
//   getUsers() {
//     this.userService.getAllUsers().subscribe((data: any) => {
//       this.users = data;
//       this.filteredUsers = [...this.users]; // Initialize filtered users
//       // Populate states, districts, talukas, and villages based on the fetched users
//       this.populateDropdowns();
//     });
//   }
 
//   // Populate the dropdowns based on the fetched users
//   populateDropdowns() {
//     // Extract unique states from users
//     this.states = this.getUniqueValues(this.users, 'state');
//   }
 
 
 
//   // Helper function to get unique values for dropdowns (like state, district, etc.)
//   getUniqueValues(array: any[], key: string): any[] {
//     return Array.from(new Set(array.map((item) => item[key]))).map((value) => ({
//       id: value,
//       name: value
//     }));
//   }
 
 
//   onStateChange(event: any): void {
//     // If event is an array, handle multiple selections for state
//     const selectedStates = event ? event.map((item: any) => item.name) : [];
//     console.log("Selected states:", selectedStates);  // Log selected states
 
//     if (selectedStates.length > 0) {
//       // Update districts based on selected states
//       this.districts = this.getUniqueValues(
//         this.users.filter(user => selectedStates.includes(user.state)),
//         'district'
//       );
//       console.log("Updated districts for states:", selectedStates, this.districts);  // Log updated districts
//     } else {
//       this.districts = [];
//       this.villages = [];
//     }
 
//     // Reset the selections for district, taluka, and village
//     this.selectedDistrict = [];
//     this.selectedTaluka = [];
//     this.selectedVillage = [];
//   }
 
 
 
//   onDistrictChange(event: any): void {
//     // Handle multiple selections for districts
//     const selectedDistricts = event ? event.map((item: any) => item.name) : [];
//     console.log("Selected districts:", selectedDistricts);  // Log selected districts
 
//     if (selectedDistricts.length > 0) {
//       // Update talukas based on selected districts
//       this.talukas = this.getUniqueValues(
//         this.users.filter(user => selectedDistricts.includes(user.district)),
//         'taluka'
//       );
//       console.log("Updated talukas for selected districts:", selectedDistricts, this.talukas);  // Log updated talukas
//     } else {
//       this.talukas = [];
//       this.villages = [];
//     }
 
//     // Reset the taluka and village selections
//     this.selectedTaluka = [];
//     this.selectedVillage = [];
//   }
 
 
 
 
//   onTalukaChange(event: any): void {
//     // Handle multiple selections for talukas
//     const selectedTalukas = event ? event.map((item: any) => item.name) : [];
//     console.log("Selected talukas:", selectedTalukas);  // Log selected talukas
 
//     if (selectedTalukas.length > 0) {
//       // Update villages based on selected talukas
//       this.villages = this.getUniqueValues(
//         this.users.filter(user => selectedTalukas.includes(user.taluka)),
//         'village'
//       );
//       console.log("Updated villages for selected talukas:", selectedTalukas, this.villages);  // Log updated villages
//     } else {
//       this.villages = [];
//     }
 
//     // Reset the village selection
//     this.selectedVillage = [];
//   }
 
 
//   // Apply filters based on selected values
//   applyFilters() {
//     this.filteredUsers = this.users.filter(user => {
//       return (
//         (this.selectedState.length === 0 || this.selectedState.some((state: { name: string }) => state.name === user.state)) &&
//         (this.selectedDistrict.length === 0 || this.selectedDistrict.some((district: { name: string }) => district.name === user.district)) &&
//         (this.selectedTaluka.length === 0 || this.selectedTaluka.some((taluka: { name: string }) => taluka.name === user.taluka)) &&
//         (this.selectedVillage.length === 0 || this.selectedVillage.some((village: { name: string }) => village.name === user.village))
//       );
//     });
//   }
 
//   editUser(user: any) {
//     this.selectedUser = user;
//     this.userForm.patchValue(user);
//   }
 
 
   
//   updateUser() {
//     if (this.userForm.valid && this.selectedUser) {
//       const updatedUser = this.userForm.value;
//       updatedUser.id = this.selectedUser.id; // Ensure ID is included
 
//       this.userService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
//         console.log("User updated successfully");
//         this.getUsers();
//         this.selectedUser = null;
//         this.userForm.reset();
//       });
//     }
//   }
 
//   deleteUser(user: any) {
//     if (confirm('Are you sure you want to delete this user?')) {
//       this.userService.deleteUser(user.id).subscribe(() => {
//         this.getUsers();
//       });
//     }
//   }
 
 
//      //  Toggle Dropdown
//      toggleDropdown() {
//       this.isDropdownOpen = !this.isDropdownOpen;
//     }
 
//     //  Multi-Select Filters with Checkboxes
//     toggleFilter(event: any, key: string) {
//       if (event.target.checked) {
//         this.selectedFilters.push(key);
//       } else {
//         this.selectedFilters = this.selectedFilters.filter(filter => filter !== key);
//       }
//     }
 
//     // 🔍 Apply Search
//     applySearch() {
//       if (!this.selectedFilters.length || !this.searchValue.trim()) {
//         this.filteredUsers = [...this.users];
//         return;
//       }
 
//       const searchTerms = this.searchValue.toLowerCase().split(',').map(term => term.trim());
 
//       this.filteredUsers = this.users.filter(user => {
//         return this.selectedFilters.some(filter => {
//           let fieldValue = user[filter]?.toString().toLowerCase();
 
//           //  Date of Birth Special Case
//           if (filter === 'dob' && fieldValue) {
//             const date = new Date(fieldValue);
//             if (!isNaN(date.getTime())) {
//               const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
//               const formattedShort = date.getDate().toString().padStart(2, '0') + '-' +
//                                      (date.getMonth() + 1).toString().padStart(2, '0'); // "DD-MM"
 
//               return searchTerms.some(term =>
//                 formattedDate.includes(term) || formattedShort.includes(term)
//               );
//             }
//           }
 
//           return fieldValue && searchTerms.some(term =>
//             fieldValue.includes(term) || fieldValue.startsWith(term)
//           );
//         });
//       });
//     }
     
   
//     // Reset Search
//     resetSearch() {
//       this.selectedFilters = [];
//       this.searchValue = '';
//       this.filteredUsers = [...this.users];
//     }
   
 
 
 
 
//   // Reset all filters
//   resetFilters() {
//     this.selectedState = [];
//     this.selectedDistrict = [];
//     this.selectedTaluka = [];
//     this.selectedVillage = [];
//     this.filteredUsers = [...this.users];
//   }
// }
 
 

import { Component, OnInit } from '@angular/core';
import { FormService } from '../../service/userform/form.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule, FormsModule, NgMultiSelectDropDownModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  
  users: any[] = [];
  userForm: FormGroup; // manage user form
  selectedUser: any = null; // Stores the currently selected user.
  filteredUsers: any[] = []; // Filtered users list

  selectedFilters: string[] = []; // Multiple selected filters
  searchValue: string = ''; // Search input value

  isDropdownOpen = false; // Dropdown Open/Close State

  filterOptions = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "address", label: "Address" },
    { key: "userType", label: "User Type" },
    { key: "state", label: "State" },
    { key: "district", label: "District" },
    { key: "taluka", label: "Taluka" },
    { key: "village", label: "Village" }
  ];

  // Variables for dropdowns
  states: any[] = [];
  districts: any[] = [];
  talukas: any[] = [];
  villages: any[] = [];

  // Filter variables
  selectedState: any[] = [];
  selectedDistrict: any[] = [];
  selectedTaluka: any[] = [];
  selectedVillage: any[] = [];

  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    allowSearchFilter: true
  };

  constructor(
    private fb: FormBuilder,
    private userService: FormService,
    private router : Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      userType: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      taluka: ['', Validators.required],
      village: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsers(); // Fetch users when component loads
  }

  // Fetch user data from the service
  getUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.users = data;
      this.filteredUsers = [...this.users]; // Initialize filtered users
      // Populate states, districts, talukas, and villages based on the fetched users
      this.populateDropdowns();
    });
  }

  // Populate the dropdowns based on the fetched users
  populateDropdowns() {
    // Extract unique states from users
    this.states = this.getUniqueValues(this.users, 'state');
  }

  // Helper function to get unique values for dropdowns (like state, district, etc.)
  getUniqueValues(array: any[], key: string): any[] {
    return Array.from(new Set(array.map((item) => item[key]))).map((value) => ({
      id: value,
      name: value
    }));
  }

  // Handle state selection change (single and multiple)
  onStateChange(event: any): void {
    const selectedStates = this.handleSelection(event);
    console.log("Selected states:", selectedStates);

    if (selectedStates.length > 0) {
      // Update districts based on selected states
      this.districts = this.getUniqueValues(
        this.users.filter(user => selectedStates.includes(user.state)),
        'district'
      );
      console.log("Updated districts for selected states:", this.districts);
    } else {
      this.districts = [];
      this.villages = [];
    }

    // Reset the selections for district, taluka, and village
    this.selectedDistrict = [];
    this.selectedTaluka = [];
    this.selectedVillage = [];
  }

  // Handle district selection change (single and multiple)
  onDistrictChange(event: any): void {
    const selectedDistricts = this.handleSelection(event);
    console.log("Selected districts:", selectedDistricts);

    if (selectedDistricts.length > 0) {
      // Update talukas based on selected districts
      this.talukas = this.getUniqueValues(
        this.users.filter(user => selectedDistricts.includes(user.district)),
        'taluka'
      );
      console.log("Updated talukas for selected districts:", this.talukas);
    } else {
      this.talukas = [];
      this.villages = [];
    }

    // Reset the selections for taluka and village
    this.selectedTaluka = [];
    this.selectedVillage = [];
  }

  // Handle taluka selection change (single and multiple)
  onTalukaChange(event: any): void {
    const selectedTalukas = this.handleSelection(event);
    console.log("Selected talukas:", selectedTalukas);

    if (selectedTalukas.length > 0) {
      // Update villages based on selected talukas
      this.villages = this.getUniqueValues(
        this.users.filter(user => selectedTalukas.includes(user.taluka)),
        'village'
      );
      console.log("Updated villages for selected talukas:", this.villages);
    } else {
      this.villages = [];
    }

    // Reset the village selection
    this.selectedVillage = [];
  }

  // Handle village selection change (single and multiple)
  onVillageChange(event: any): void {
    const selectedVillages = this.handleSelection(event);
    console.log("Selected villages:", selectedVillages);

    // Reset village selection if no villages are selected
    if (selectedVillages.length === 0) {
      this.selectedVillage = [];
    }
  }

  // Helper method to handle selection (single or multi)
  handleSelection(event: any): string[] {
    let selected: string[] = [];
    if (Array.isArray(event)) {
      selected = event.map((item: any) => item.name);
    } else if (event && event.name) {
      selected = [event.name];
    }
    return selected;
  }

  // Apply filters based on selected values
  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      return (
        (this.selectedState.length === 0 || this.selectedState.some((state: { name: string }) => state.name === user.state)) &&
        (this.selectedDistrict.length === 0 || this.selectedDistrict.some((district: { name: string }) => district.name === user.district)) &&
        (this.selectedTaluka.length === 0 || this.selectedTaluka.some((taluka: { name: string }) => taluka.name === user.taluka)) &&
        (this.selectedVillage.length === 0 || this.selectedVillage.some((village: { name: string }) => village.name === user.village))
      );
    });
  }

  // editUser(user: any) {
  //   this.router.navigate(['/edit-user', user.id]);
  //   this.selectedUser = user;
  //   this.userForm.patchValue(user);
  // }


editUser(userId: number) {
  this.router.navigate(['/edit-user', userId]);
}

  // updateUser() {
  //   if (this.userForm.valid && this.selectedUser) {
  //     const updatedUser = this.userForm.value;
  //     updatedUser.id = this.selectedUser.id; // Ensure ID is included

  //     this.userService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
  //       console.log("User updated successfully");
  //       this.getUsers();
  //       this.selectedUser = null;
  //       this.userForm.reset();
  //     });
  //   }
  // }

  


// editUser(user: any) {
//   this.selectedUser = user;

//   // Populate form values
//   this.userForm.patchValue({
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     dob: user.dob,
//     gender: user.gender,
//     address: user.address,
//     userType: user.userType,
//     state: this.states.find(state => state.name === user.state) || null,
//     district: this.districts.find(district => district.name === user.district) || null,
//     taluka: this.talukas.find(taluka => taluka.name === user.taluka) || null,
//     village: this.villages.find(village => village.name === user.village) || null
//   });

//   // Trigger dependent dropdowns after setting form values
//   this.onStateChange([this.states.find(state => state.name === user.state)]); // Trigger state change
//   this.onDistrictChange([this.districts.find(district => district.name === user.district)]); // Trigger district change
//   this.onTalukaChange([this.talukas.find(taluka => taluka.name === user.taluka)]); // Trigger taluka change
// }


// updateUser() {
//   if (this.userForm.valid && this.selectedUser) {
//     const updatedUser = this.userForm.value;

//     // Ensure 'state' is just a string (name or id depending on your backend)
//     if (updatedUser.state && updatedUser.state.name) {
//       updatedUser.state = updatedUser.state.name;  // Use the 'name' if it's an object
//     }

//     // Similarly handle district, taluka, and village
//     if (updatedUser.district && updatedUser.district.name) {
//       updatedUser.district = updatedUser.district.name;  // Use the 'name' if it's an object
//     }

//     if (updatedUser.taluka && updatedUser.taluka.name) {
//       updatedUser.taluka = updatedUser.taluka.name;  // Use the 'name' if it's an object
//     }

//     if (updatedUser.village && updatedUser.village.name) {
//       updatedUser.village = updatedUser.village.name;  // Use the 'name' if it's an object
//     }

//     updatedUser.id = this.selectedUser.id;  // Ensure ID is included

//     this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
//       () => {
//         console.log("User updated successfully");
//         this.getUsers();
//         this.selectedUser = null;
//         this.userForm.reset();
//       },
//       (error) => {
//         console.error("Error updating user:", error);
//       }
//     );
//   }
// }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.getUsers();
      });
    }
  }

  // Toggle Dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Multi-Select Filters with Checkboxes
  toggleFilter(event: any, key: string) {
    if (event.target.checked) {
      this.selectedFilters.push(key);
    } else {
      this.selectedFilters = this.selectedFilters.filter(filter => filter !== key);
    }
  }

  // Apply Search
  applySearch() {
    if (!this.selectedFilters.length || !this.searchValue.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchTerms = this.searchValue.toLowerCase().split(',').map(term => term.trim());

    this.filteredUsers = this.users.filter(user => {
      return this.selectedFilters.some(filter => {
        let fieldValue = user[filter]?.toString().toLowerCase();

        // Date of Birth Special Case
        if (filter === 'dob' && fieldValue) {
          const date = new Date(fieldValue);
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
            const formattedShort = date.getDate().toString().padStart(2, '0') + '-' +
                                   (date.getMonth() + 1).toString().padStart(2, '0'); // "DD-MM"

            return searchTerms.some(term =>
              formattedDate.includes(term) || formattedShort.includes(term)
            );
          }
        }

        return fieldValue && searchTerms.some(term =>
          fieldValue.includes(term) || fieldValue.startsWith(term)
        );
      });
    });
  }

  // Reset Search
  resetSearch() {
    this.selectedFilters = [];
    this.searchValue = '';
    this.filteredUsers = [...this.users];
  }

  // Reset all filters
  resetFilters() {
    this.selectedState = [];
    this.selectedDistrict = [];
    this.selectedTaluka = [];
    this.selectedVillage = [];
    this.filteredUsers = [...this.users];
  }
}
