import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DriveService } from '../services/drive.service';

@Component({
  selector: 'app-drivefile',
  templateUrl: './drivefile.component.html',
  styleUrls: ['./drivefile.component.css']
})
export class DrivefileComponent implements OnInit, AfterViewInit {

  // @ViewChild('trigger', {read: MatMenuTrigger, static: false}) trigger: MatMenuTrigger;
  // // tslint:disable-next-line: no-input-rename
  // @Input('fileInfo') file: object;
  imageToShow: any;
  showPreview = false;
  timer: NodeJS.Timer;
  LMDate: string;
  visible = true;
  constructor(private driveService: DriveService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.driveService.slidesLoadedEvent.next(true);
    this.driveService.slidesLoadedEvent.complete();
  }

}