import { Component, OnInit } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { AppDialogComponent } from './appDialog/appDialog.component';
import { AppService } from './appservice.service';
import { Task } from './task.model';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "task-tracker";
  tasksData;

  totalPlanned;
  totalInProgress;
  totalCompleted;

  constructor(
    private tasksService: AppService,
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "add",
      sanitizer.bypassSecurityTrustResourceUrl(
        "../assets/outline-add_circle_outline-24px.svg"
      )
    );
  }

  ngOnInit() {
    this.getTasks();
  }

  // get all tasks
  getTasks() {
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasksData = data;
      console.log(this.tasksData);

      this.totalPlanned = this.sumHs("Planned");
      this.totalInProgress = this.sumHs("In Progress");
      this.totalCompleted = this.sumHs("Completed");
      console.log("total hs " + this.totalPlanned);
      console.log("total hs " + this.totalInProgress);
      console.log("total hs " + this.totalCompleted);
    });
  }

  // delete a task
  deleteTask(task: Task): void {
    this.tasksService.deleteTask(task.id).subscribe(data => {
      this.tasksData = this.tasksData.filter(i => i !== task);
      this.getTasks();
    });
  }

  // edit a task padding data to dialog
  editTask(task: Task): void {
    const dialogRef = this.dialog.open(AppDialogComponent, {
      position: {
        top: "20%"
      },
      data: { taskData: task, title: "Edit task" }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTasks();
    });
  }

  // open dialog to create a task
  openDialog(): void {
    const dialogRef = this.dialog.open(AppDialogComponent, {
      position: {
        top: "20%"
      },
      data: { title: "Add new task", disableSelect: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTasks();
    });
  }

  sumHs(status) {
    return this.tasksData
      .filter(task => task.state === status)
      .reduce((sum, elem) => sum + elem.estimate, 0);
  }
}
