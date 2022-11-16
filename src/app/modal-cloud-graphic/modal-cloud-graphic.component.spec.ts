import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCloudGraphicComponent } from './modal-cloud-graphic.component';

describe('ModalCloudGraphicComponent', () => {
  let component: ModalCloudGraphicComponent;
  let fixture: ComponentFixture<ModalCloudGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCloudGraphicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCloudGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
