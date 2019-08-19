import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'img';

  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  isLoad: boolean = false;
  isError: boolean = false;

  constructor() {
    this.image = new Image();
    this.canvas = document.createElement("canvas");
  }

  canShowImage(): boolean {
    return this.isLoad;
  }

  loadFile(event: Event) {
    const elm = event.target as HTMLInputElement;
    if (elm.files.length == 0) return;
    const file = elm.files[0];

    if (!this.validate(file)) return;

    this.readFile(file).then(res => {
      this.image.src = res.toString();
      this.image.onload = () => {
        this.isLoad = true;
        this.isError = false;
      }
    }).catch(error => {
      this.isLoad = false;
      this.isError = true;

      console.log(error)
    });
  }

  private validate(file: File): boolean {
    const allowedExtension = ["jpeg", "png"];
    return (allowedExtension.some(item => file.type.includes(item)));
  }

  private readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      }
      reader.onerror = error => {
        reject(error);
      }
      reader.onabort = error => {
        reject(error);
      }

      reader.readAsDataURL(file);
    });
  }
}
