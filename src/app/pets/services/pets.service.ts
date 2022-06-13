import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../interfaces/pet.interface';
import {
  addDoc,
  collectionData,
  doc,
  docData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { collection, deleteDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  baseUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient, private firestore: Firestore) {}

  //Firebase
  addPet(pet: Pet) {
    const petsRef = collection(this.firestore, 'pets');
    return addDoc(petsRef, pet);
  }

  getAllPets(): Observable<Pet[]> {
    const petsRef = collection(this.firestore, 'pets');
    return collectionData(petsRef, { idField: 'id' }) as Observable<Pet[]>;
  }

  getPetById(id: string): Observable<Pet> {
    const petsRef = doc(this.firestore, `pets/${id}`);
    return docData(petsRef, { idField: 'id' }) as Observable<Pet>;
  }

  updatePet(pet: Pet, id: string) {
    const petsRef = doc(this.firestore, `pets/${id}`);
    return setDoc(petsRef, pet);
  }

  deletePet(id: string) {
    const petsRef = doc(this.firestore, `pets/${id}`);
    return deleteDoc(petsRef);
  }
}
