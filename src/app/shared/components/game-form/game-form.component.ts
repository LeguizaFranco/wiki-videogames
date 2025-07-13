import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms'; // Importa AbstractControl y ValidationErrors
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.css'
})
export class GameFormComponent implements OnInit {
  @Input() gameToEdit: Game | null = null;
  @Output() formSubmit = new EventEmitter<Game>();

  gameForm!: FormGroup; // Usamos "!" para asegurar que se inicializará en ngOnInit

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    if (this.gameToEdit) {
      this.gameForm.patchValue(this.gameToEdit);
      // Si estamos editando, el ID siempre se deshabilita
      this.gameForm.get('id')?.disable();
    } else {
      // Si es un nuevo juego, el ID también se deshabilita (lo generaremos)
      this.gameForm.get('id')?.disable();
    }
  }

  createForm(): void {
    this.gameForm = this.fb.group({
      // El valor inicial puede ser nulo o vacío
      id: [this.gameToEdit ? this.gameToEdit.id : null],
      name: ['', Validators.required],
      background_image: ['', Validators.required],
      released: ['', [Validators.required, this.releasedYearValidator]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  // Nuevo método: Validador personalizado para el año
  releasedYearValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Si no hay valor, lo deja al Validators.required
    }
    const year = new Date(control.value).getFullYear();
    // Verifica si es una fecha válida y si el año es 2000 o posterior
    if (isNaN(year) || year < 2000) {
      return { invalidReleasedYear: true }; // Devuelve un error si no cumple
    }
    return null; // Válido
  }


  // Conveniencia para un acceso más fácil a los controles del formulario en la plantilla
  get formControls() {
    return this.gameForm.controls;
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      // Si el ID está deshabilitado (modo edición), necesitamos obtener su valor deshabilitado
      const formValue = this.gameForm.getRawValue();
      this.formSubmit.emit(formValue);
    } else {
      this.gameForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}