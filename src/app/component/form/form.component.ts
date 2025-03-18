import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  detailsform: FormGroup;
  zipFileError: string = '';
  selectedFile: File | null = null;

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

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router
  ) {
    this.detailsform = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      userType: ['', Validators.required],
      state: ['', Validators.required],
      district: [{ value: '', disabled: true }, Validators.required],
      taluka: [{ value: '', disabled: true }, Validators.required],
      village: [{ value: '', disabled: true }, Validators.required]
    });
  }

  onStateChange(event: any): void {
    const state = event.target.value;
    this.districts = this.districtData[state] || [];
    this.detailsform.patchValue({ district: '', taluka: '', village: '' });
  
    // Enable district field only if there are districts available
    if (this.districts.length) {
      this.detailsform.get('district')?.enable();
    } else {
      this.detailsform.get('district')?.disable();
    }
  
    this.detailsform.get('taluka')?.disable();
    this.detailsform.get('village')?.disable();
  }
  
  onDistrictChange(event: any): void {
    const district = event.target.value;
    this.talukas = this.talukaData[district] || [];
    this.detailsform.patchValue({ taluka: '', village: '' });
  
    if (this.talukas.length) {
      this.detailsform.get('taluka')?.enable();
    } else {
      this.detailsform.get('taluka')?.disable();
    }
  
    this.detailsform.get('village')?.disable();
  }
  
  onTalukaChange(event: any): void {
    const taluka = event.target.value;
    this.villages = this.villageData[taluka] || [];
    this.detailsform.patchValue({ village: '' });
  
    if (this.villages.length) {
      this.detailsform.get('village')?.enable();
    } else {
      this.detailsform.get('village')?.disable();
    }
  }
  
  
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.name.endsWith('.zip')) {
        this.selectedFile = file;
        this.zipFileError = '';
      } else {
        this.selectedFile = null;
        this.zipFileError = 'Only .zip files are allowed';
      }
    }
  }

  submit() {
    if (!this.detailsform.valid) {
      this.detailsform.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }

    if (!this.selectedFile) {
      alert('Please upload a ZIP file.');
      return;
    }

    const formData = new FormData();
    Object.keys(this.detailsform.controls).forEach(key => {
      const value = this.detailsform.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/api/files/upload', formData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Form and file uploaded successfully:', response);
          alert('Form and ZIP file uploaded successfully!');
          this.detailsform.reset();
          this.selectedFile = null;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error submitting form and file:', error);
          alert('Error submitting form and file. Please try again.');
        }
      });
  }
}
