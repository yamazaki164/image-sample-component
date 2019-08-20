import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'img';

  image: HTMLImageElement;
  image2: HTMLImageElement;
  isLoad: boolean = false;
  isError: boolean = false;
  isLoad2: boolean = false;

  constructor() {
    this.image = new Image();
    this.image2 = new Image();
  }

  canShowImage(): boolean {
    return this.isLoad && !this.isError;
  }
  
  loadFile(event: Event) {
    const elm = event.target as HTMLInputElement;
    if (elm.files.length == 0) return;
    const file = elm.files[0];

    if (!this.validate(file)) return;

    this.readFile(file).then(res => {
      this.readImage(res);
    }).catch(error => {
      this.isLoad = false;
      this.isError = true;

      console.log(error)
    });
  }

  rotate(angle: number) {
    const image = this.image2;
    this.image2.src = this.rotateImage(angle, image);
  }

  private rotateImage(angle: number, image: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext("2d");

    canvas.width = image.height;
    canvas.height = image.width;

    context.translate(image.height/2, image.width/2);
    context.rotate(angle * Math.PI / 180);

    context.drawImage(image, -image.width/2, -image.height/2);

    return canvas.toDataURL();
  }

  private readImage(buffer: string | ArrayBuffer) {
    this.image.src = buffer.toString();

    this.image.onload = () => {
      this.isLoad = true;
      this.isError = false;

      this.image2.src = buffer.toString();
      this.image2.onload = () => {
        this.isLoad2 = true;
      }
    }

    this.image.onerror = () => {
      this.isLoad = false;
      this.isError = true;
    }
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
