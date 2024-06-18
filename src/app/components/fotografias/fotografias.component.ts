import { Component,Input,Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PhotosService } from '../../services/photos.service';
@Component({
  selector: 'app-fotografias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './fotografias.component.html',
  styleUrl: './fotografias.component.css'
})
export class FotografiasComponent {
  verFotos: any;
  @Input() fotografia_id:any;
  @Output() volver = new EventEmitter<void>();
  insertarPhotos = new FormGroup({
    photo: new FormControl('', Validators.required),
  });

  selectedFiles: File[] = [];
  constructor(private photosService: PhotosService) {}

  ngOnInit(): void {
    this.cargarFotos();
  }
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  subirFoto() {
    const formData = new FormData();

    for (let file of this.selectedFiles) {
      formData.append('file', file);
    }

    this.photosService.insertPhotos(this.fotografia_id!, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.cargarFotos();
        this.insertarPhotos.reset();
      },
      error: (error) => {
        console.log('No se insertó la foto:', error);
      },
    });
  }

  cargarFotos(): void {
    if (this.fotografia_id) {
      this.photosService.verFotosEvento(this.fotografia_id).subscribe({
        next: (response) => {
          this.verFotos = response.data;
        },
        error: (error) => {
          console.log('No se pueden ver las fotos:', error);
        },
      });
    }
  }

  eliminarFoto(id_photo: number): void {
    this.photosService.deletePhoto(id_photo).subscribe({
      next: (response) => {
        console.log(response);
        this.verFotos = this.verFotos.filter(
          (photo: any) => photo.id_photos !== id_photo
        );
      },
      error: (error) => {
        console.log('No se puede borrar la foto:', error);
      },
    });
  }


  onVolver() {
    this.volver.emit();
  }



}
