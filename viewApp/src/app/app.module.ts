import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
// import { httpService } from './service/HttpService';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule, MatCheckboxModule,MatFormFieldModule, MatInputModule, MatAutocompleteModule,
  MatSnackBarModule,  MatIconModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import {} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatAutocompleteModule,
    FormsModule, 
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIconModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
