import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../global';
import { httpService } from '../http.service';
import { Router } from '@angular/router';
import { setTimeout } from 'timers';
declare var $:any;
declare var moment:any;
declare var kendo:any;
export interface init {
	cerrar:boolean;
}
@Component({
	selector: 'app-form-triaje',
	templateUrl: './form-triaje.component.html',
	styleUrls: ['./form-triaje.component.css']
})

export class FormTriajeComponent implements OnInit {
	@Input('btnNpaciente') btnNpaciente:boolean = false;
	@Input() init:init;

	constructor(	public fb: FormBuilder,
		public global:Global,
		public httpService:httpService,
		public router:Router
		) { }

	ngOnInit() {
		this.restForm();
		////console.log(this.init);
	}
	FormPaciente: FormGroup;
	isMenor:boolean = false;
	accion:string = '';
	Responsable:boolean = false;
	

	get = (id:number) => {
		let path = 'api/WebServicesERIS/GetFileEmergency?sParamsSigleIdClient={"Id":' +id+ '}';
		//console.log(path);
		this.httpService.get(path).then(res=>{
			//console.log(res);
			let statu:boolean = res.Status;
			if (statu) {
				let obj = res.Object;
				let pacient = obj.Patient;
			    let familiar = obj.Familiar;
			    let vitalSigns = obj.VitalSigns;

				let forForm:any;
			
				      forForm = {
				         PatientClient: pacient,
				          FamiliarClient: familiar,
				          EmergencyClient: obj,
				          VitalSignsClient: vitalSigns
				      };
				      //console.log(forForm);
				      this.resForm(forForm);
			}
		});
	}

	fnClickNpaciente = (accion,val?) => {
		this.accion = accion;
		let touched = val.touched;
		this.restForm();
		if (touched) {
			//this.global.openModal('modal-confirmar-Dashboard');
		} else {
			this.newPAciente();
		}

	}
	newPAciente = () => {
		let accion = this.accion;
		this.isMenor = false;
		if (accion === 'triaje') {
			this.restForm();	
		}

		this.global.closeModal('modal-confirmar-Dashboard');
		setTimeout(()=>{
			$('#name1T').focus();
		},1000);
	}
	changeTypeIdentity = (accion) => {
		if (accion == 'triaje') {
			let self = this;
			let type = this.FormPaciente.controls['PatientClient'].value.TypeIdentityCard;
			let isMenor = this.isMenor;
			//console.log(isMenor);
			if (isMenor) {
				this.FormPaciente.controls['PatientClient'].value.IdentityCard = 'temporal';
				this.FormPaciente.controls['PatientClient'].value.CellPhone = 'temporal';
				let array = this.FormPaciente.controls['PatientClient'].value;
				this.FormPaciente.controls['PatientClient'].setValue(array);
			}
		}   	
	}

	actFecha = (val, accion?) => {

		let valor = val.target.value;
		let fecha = valor;
		let isValid = moment(this.parseDMY(fecha)).isValid();
		if (!isValid) {
			this.global.msj('Fecha invalida','danger');
			$('.validateDate').addClass('has-error');
		} else {
			$('.validateDate').removeClass('has-error');
			if (accion == 'familiar') {
			} else {
				this.calcularFN(this.stringDMY(fecha));
			}
		}

	}
	parseDMY = (value) => {
		let date = value.split("/");
		let d = parseInt(date[0], 10),
		m = parseInt(date[1], 10),
		y = parseInt(date[2], 10);
		return (y + '-' + (m) + '-' + d);
	}
	stringDMY = (value) => {
		let date = value.split("/");
		let d = parseInt(date[0], 10),
		m = parseInt(date[1], 10),
		y = parseInt(date[2], 10);
		return (m + '/' + (d) + '/' + y);
	}
	calcularFN = (date, accion?) => {
		let fecha:any = new Date(date);
		let hoy:any = new Date();
		let res:any = this.calFecha(fecha,hoy);
		if (accion == 'familiar') {
		} else {
			if (res < 18) {
				this.isMenor = true;
				this.FormPaciente.controls['PatientClient'].value.IsMinor = true;
				let array = this.FormPaciente.controls['PatientClient'].value;
				this.FormPaciente.controls['PatientClient'].setValue(array);
			} else {
				this.isMenor = false;
				this.FormPaciente.controls['PatientClient'].value.IsMinor = false;
				let array = this.FormPaciente.controls['PatientClient'].value;
				this.FormPaciente.controls['PatientClient'].setValue(array);
			}
		} 
	}
	calFecha = (d1, d2):any => {
		return d2.getFullYear()-d1.getFullYear();
	}

	buscar = (value,type):void => {
		//console.log(value);
		let path:string = "api/WebServicesERIS/GetPacients?cedula=" + value +"&type=" + type;
		this.httpService.get(path).then((res):any => {
			//console.log(res);
			this.apiPacientes = res.Object;
			this.typeSearch = type;
			this.listEncontrados = [];
			if(res.Object != "Type Not Found"){
				this.apiPacientes.forEach(element => {
					this.listEncontrados.push(element);
				});
			}
			if(this.listEncontrados.length == 0){
				this.global.msj("Lo siento, no se encontraron pacientes/responsables correspondientes a ésta cédula","success");
			} else {
				$('.cortinaPopup').css('display', 'block');
				$('.popup').removeClass("closeM");
				$('.popup').addClass("openM");
				$('.modal.fade.in').animate({ scrollTop: 50 }, 100);
			}
		});
		
		//console.log(this.listEncontrados);
		
	}
	fnClosePopup = ():void => {
		$('.popup').removeClass("openM");
		$('.popup').addClass("closeM");
		setTimeout(()=>{
			$('.popup').removeClass("closeM");
			$('.cortinaPopup').css('display', 'none');
		},601);
	}
	fnSelect = (obj):void => {
		let type:string = this.typeSearch; 
		//console.log(obj);
		if(type == "patient"){
			this.resPacient(obj);
		} else if(type == "familiar") {
			this.resFamiliar(obj);
		}
		this.fnClosePopup();
	}
	resPacient = (obj):void => {
		this.FormPaciente.controls['PatientClient'].value.Name1 = obj.Name1;
		this.FormPaciente.controls['PatientClient'].value.LastName1 = obj.LastName1;
		this.FormPaciente.controls['PatientClient'].value.Name2 = obj.Name2;
		this.FormPaciente.controls['PatientClient'].value.LastName2 = obj.LastName2;
		this.FormPaciente.controls['PatientClient'].value.BirthDate = moment(obj.BirthDate).format('DD/MM/YYYY');
		this.FormPaciente.controls['PatientClient'].value.CellPhone = obj.CellPhone;
		this.FormPaciente.controls['PatientClient'].value.HomePhone = obj.HomePhone;
		this.FormPaciente.controls['PatientClient'].value.Email = obj.Email;
		this.FormPaciente.controls['PatientClient'].value.Address = obj.Address;
		this.FormPaciente.controls['PatientClient'].value.Responsable = obj.Responsable;
		this.FormPaciente.controls['PatientClient'].value.Gender = obj.Gender;
		this.FormPaciente.controls['PatientClient'].value.IdentityCard = obj.IdentityCard;
		this.FormPaciente.controls['PatientClient'].value.TypeIdentityCard = obj.TypeIdentityCard;
		let array = this.FormPaciente.controls['PatientClient'].value;
		this.FormPaciente.controls['PatientClient'].setValue(array);
	}
	resFamiliar = (obj):void => {
		this.FormPaciente.controls['FamiliarClient'].value.Name1 = obj.Name1;
		this.FormPaciente.controls['FamiliarClient'].value.LastName1 = obj.LastName1;
		this.FormPaciente.controls['FamiliarClient'].value.Name2 = obj.Name2;
		this.FormPaciente.controls['FamiliarClient'].value.LastName2 = obj.LastName2;
		this.FormPaciente.controls['FamiliarClient'].value.BirthDate = moment(obj.BirthDate).format('DD/MM/YYYY');
		this.FormPaciente.controls['FamiliarClient'].value.CellPhone = obj.CellPhone;
		this.FormPaciente.controls['FamiliarClient'].value.HomePhone = obj.HomePhone;
		this.FormPaciente.controls['FamiliarClient'].value.Email = obj.Email;
		this.FormPaciente.controls['FamiliarClient'].value.Address = obj.Address;
		this.FormPaciente.controls['FamiliarClient'].value.Gender = obj.Gender;
		this.FormPaciente.controls['FamiliarClient'].value.IdentityCard = obj.IdentityCard;
		this.FormPaciente.controls['FamiliarClient'].value.TypeIdentityCard = obj.TypeIdentityCard;

		let array = this.FormPaciente.controls['FamiliarClient'].value;
		this.FormPaciente.controls['FamiliarClient'].setValue(array);
	}
	typeSearch:string = '';
	listEncontrados:any = [];
	apiPacientes:any = [];
	submit = (form:any, type:string, edit?:boolean) => {
		if (type == 'triaje') {
			//console.log(form);
			let formulario = {
				PatientClient:this.FormPaciente.controls['PatientClient'].value,
				FamiliarClient:this.FormPaciente.controls['FamiliarClient'].value,
				VitalSignsClient:this.FormPaciente.controls['VitalSignsClient'].value,
				EmergencyClient:this.FormPaciente.controls['EmergencyClient'].value,
			};
			let cedula = form.PatientClient.IdentityCard;
			let typeCedula = form.PatientClient.TypeIdentityCard;
			let familiar = form.FamiliarClient;
			let telefono = form.PatientClient.CellPhone;
			let IsvitalSigns = false;
			let virtalsigns = form.VitalSignsClient;
			let isMenor = this.isMenor;
			let Responsable = form.PatientClient.Responsable;
			let cerrar:boolean = this.init.cerrar;
			//console.log(cerrar);
			let vital:boolean = form.EmergencyClient.IsVitalSigns;
			let PAS = virtalsigns.PAS;
			let PAM = virtalsigns.PAM;
			if (vital) {
				if (PAS == '' || PAM == '') {
					this.global.msj('PAS y PAM son requeridos','danger');
					return;
				}
			}
			if (typeCedula != 'M' && cedula == '') {
				this.global.msj('Numero de cedula es requerido', 'danger');
				return;
			}
			if (isMenor || Responsable) {
				// form.PatientClient.CellPhone = form.FamiliarClient.CellPhone;
				// form.PatientClient.IdentityCard = form.FamiliarClient.IdentityCard;
				cedula = form.PatientClient.IdentityCard;
				telefono = form.PatientClient.CellPhone;
				if (familiar.Address !== '',familiar.Name1 !== '' && familiar.LastName1 !== '' && familiar.BirthDate !== '' && familiar.Gender !== '' && familiar.IdentityCard !== '' && familiar.Phone !== '') {
					if (IsvitalSigns) {
						if (virtalsigns.PAS !== '' && virtalsigns.PAM !== '' && virtalsigns.PAD !== '' && virtalsigns.FC !== '' && virtalsigns.FR !== '' && virtalsigns.TEMP !== '') {
							if (cedula != '') {
								if (telefono != '') {
									//console.log(form);
									this.httpService.triaje(form).then((res)=>{
										//console.log(res);
										let data = res.Object;
										if (res.Status) {

											this.resForm(data);
											this.global.msj('Guardado con éxito', 'success');
											if (!cerrar) {
												this.global.closeModal('modal-Editar_'+this.init);
											}
											
										} else {
											this.global.msj(data, 'danger');
										}

									});
								} else {
									this.global.msj('Telefono es requerido','danger');
								}
							} else {
								this.global.msj('Cedula es requerido','danger');
							}
						} else {
							this.global.msj('Todos los campos de Signos vitales son requeridos','danger');
						}
					} else {
						if (cedula != '') {
							if (telefono != '') {
								//console.log(form);
								this.httpService.triaje(form).then((res)=>{
									//console.log(res);
									let data = res.Object;
									if (res.Status) {

										this.resForm(data);
										this.global.msj('Guardado con éxito', 'success');
										if (!cerrar) {
												this.global.closeModal('modal-Editar_'+this.init);
											}
									} else {
										this.global.msj(data, 'danger');
									}

								});
							} else {
								this.global.msj('Telefono es requerido','danger');
							}
						} else {
							this.global.msj('Cedula es requerido','danger');
						}
					}
				} else {
					this.global.msj('Todos los campos del familiar son requeridos','danger');
				}
			} else {
				if (IsvitalSigns) {
					if (virtalsigns.PAS !== '' && virtalsigns.PAM !== '' && virtalsigns.PAD !== '' && virtalsigns.FC !== '' && virtalsigns.FR !== '' && virtalsigns.TEMP !== '') {
						if (cedula != '') {
							if (telefono != '') {
								this.httpService.triaje(form).then((res)=>{
									//console.log(res);
									let data = res.Object;
									if (res.Status) {

										this.resForm(data);
										this.global.msj('Guardado con éxito', 'success');
										if (!cerrar) {
												this.global.closeModal('modal-Editar_'+this.init);
											}
									} else {
										this.global.msj(data, 'danger');
									}

								});
							} else {
								this.global.msj('Telefono es requerido','danger');
							}
						} else {
							this.global.msj('Cedula es requerido','danger');
						}
					} else {
						this.global.msj('Todos los campos de Signos vitales son requeridos','danger');
					}
				} else {
					if (cedula != '') {
						if (telefono != '') {
							this.httpService.triaje(form).then((res)=>{
								//console.log(res);
								let data = res.Object;
								if (res.Status) {

									this.resForm(data);
									this.global.msj('Guardado con éxito', 'success');
									if (!cerrar) {
										this.global.closeModal('modal-Editar_'+this.init);
									}
								} else {
									this.global.msj(data, 'danger');
								}

							});
						} else {
							this.global.msj('Telefono es requerido','danger');
						}
					} else {
						this.global.msj('Cedula es requerido','danger');
					}
				}
			}

		} 	
	}
	restForm = () =>{
		this.FormPaciente = this.fb.group({
			PatientClient: this.fb.group({
				"Id": 0,
				"Name1": ["", Validators.required],
				"Name2": "",
				"LastName1": ["", Validators.required],
				"LastName2": "",
				"BirthDate": [null,null],
				"Gender": ["",Validators.required],
				"IdentityCard": ["",null],
				"CellPhone": ["",null],
				"HomePhone": ["",null],
				"Email": "",
				"IsMinor": false,
				"TypeIdentityCard":'V',
				"Address":'',
				"Responsable": false
			}),
			FamiliarClient: this.fb.group({
				"Id": 0,
				"Name1": "",
				"Name2": "",
				"LastName1": "",
				"LastName2": "",
				"BirthDate": "",
				"Gender": "",
				"IdentityCard": "",
				"CellPhone": ["",null],
				"HomePhone": ["",null],
				"Email": "",
				"TypeIdentityCard":'V',
				"Address": ""
			}),
			VitalSignsClient: this.fb.group({
				"Id": 0,
				"PAS": '',
				"PAM": '',
				"PAD": '',
				"FC": '',
				"FR": '',
				"TEMP": ''
			}),
			EmergencyClient: this.fb.group({
				"Id": 0,
				"Ticket": "",
				"Kg": ["", Validators.required],
				"Stature": ['',Validators.required],
				"Priority": ['',Validators.required],
				"RasonToConsultation": ["",Validators.required],
				"AllergiesAndHistory": "",
				"IsVitalSigns":false,
				"DestinationTypeRoom":''
			})
		});
	}
	resForm = (form) =>{
		let cerrar = this.init.cerrar;
		
		let pacient = form.PatientClient;
		let familiar = form.FamiliarClient;
		let emergencia = form.EmergencyClient;
		let vitalsigns = form.VitalSignsClient;
		this.isMenor = pacient.IsMinor;
		//console.log(form);
		if (familiar !== null) {
			if (vitalsigns !== null) {
				this.FormPaciente = this.fb.group({
					PatientClient: this.fb.group({
						"Id": pacient.Id,
						"Name1": pacient.Name1,
						"Name2": pacient.Name2,
						"LastName1": pacient.LastName1,
						"LastName2": pacient.LastName2,
						"BirthDate":moment(pacient.BirthDate).format('DD/MM/YYYY'),
						"Gender": pacient.Gender,
						"IdentityCard": pacient.IdentityCard,
						"CellPhone": pacient.CellPhone,
						"HomePhone":pacient.HomePhone,
						"Email": pacient.Email,
						"IsMinor": pacient.IsMinor,
						"TypeIdentityCard":pacient.TypeIdentityCard,
						"Address":pacient.Address,
						"Responsable": pacient.Responsable
					}),
					FamiliarClient: this.fb.group({
						"Id": familiar.Id,
						"Name1": familiar.Name1,
						"Name2": familiar.Name2,
						"LastName1": familiar.LastName1,
						"LastName2": familiar.LastName2,
						"BirthDate": moment(familiar.BirthDate).format('DD/MM/YYYY'),
						"Gender": familiar.Gender,
						"IdentityCard": familiar.IdentityCard,
						"CellPhone": familiar.CellPhone,
						"HomePhone": familiar.HomePhone,
						"Email": familiar.Email,
						"TypeIdentityCard":familiar.TypeIdentityCard,
						"Address":familiar.Address
					}),
					VitalSignsClient: this.fb.group({
						"Id": vitalsigns.Id,
						"PAS": vitalsigns.PAS,
						"PAM": vitalsigns.PAM,
						"PAD": vitalsigns.PAD,
						"FC": vitalsigns.FC,
						"FR": vitalsigns.FR,
						"TEMP": vitalsigns.TEMP
					}),
					EmergencyClient: this.fb.group({
						"Id": emergencia.Id,
						"Ticket": emergencia.Ticket,
						"Kg": emergencia.Kg,
						"Stature": emergencia.Stature,
						"Priority": emergencia.Priority,
						"RasonToConsultation": emergencia.RasonToConsultation,
						"AllergiesAndHistory": emergencia.AllergiesAndHistory,
						"IsVitalSigns":emergencia.IsVitalSigns,
						"DestinationTypeRoom":emergencia.DestinationTypeRoom
					})
				});
			} else {
				this.FormPaciente = this.fb.group({
					PatientClient: this.fb.group({
						"Id": pacient.Id,
						"Name1": pacient.Name1,
						"Name2": pacient.Name2,
						"LastName1": pacient.LastName1,
						"LastName2": pacient.LastName2,
						"BirthDate":moment(pacient.BirthDate).format('DD/MM/YYYY'),
						"Gender": pacient.Gender,
						"IdentityCard": pacient.IdentityCard,
						"CellPhone": pacient.CellPhone,
						"HomePhone": pacient.HomePhone,
						"Email": pacient.Email,
						"IsMinor": pacient.IsMinor,
						"TypeIdentityCard":pacient.TypeIdentityCard,
						"Address":pacient.Address,
						"Responsable": pacient.Responsable
					}),
					FamiliarClient: this.fb.group({
						"Id": familiar.Id,
						"Name1": familiar.Name1,
						"Name2": familiar.Name2,
						"LastName1": familiar.LastName1,
						"LastName2": familiar.LastName2,
						"BirthDate": moment(familiar.BirthDate).format('DD/MM/YYYY'),
						"Gender": familiar.Gender,
						"IdentityCard": familiar.IdentityCard,
						"CellPhone": familiar.CellPhone,
						"HomePhone": familiar.HomePhone,
						"Email": familiar.Email,
						"TypeIdentityCard":familiar.TypeIdentityCard,
						"Address":familiar.Address
					}),
					VitalSignsClient: this.fb.group({
						"Id": 0,
						"PAS": '',
						"PAM": '',
						"PAD": '',
						"FC": '',
						"FR": '',
						"TEMP": ''
					}),
					EmergencyClient: this.fb.group({
						"Id": emergencia.Id,
						"Ticket": emergencia.Ticket,
						"Kg": emergencia.Kg,
						"Stature": emergencia.Stature,
						"Priority": emergencia.Priority,
						"RasonToConsultation":emergencia.RasonToConsultation,
						"AllergiesAndHistory": emergencia.AllergiesAndHistory,
						"IsVitalSigns":emergencia.IsVitalSigns,
						"DestinationTypeRoom":emergencia.DestinationTypeRoom
					})
				});
			}
		} else {
			if (vitalsigns !== null) {
				this.FormPaciente = this.fb.group({
					PatientClient: this.fb.group({
						"Id": pacient.Id,
						"Name1": pacient.Name1,
						"Name2": pacient.Name2,
						"LastName1": pacient.LastName1,
						"LastName2": pacient.LastName2,
						"BirthDate": moment(pacient.BirthDate).format('DD/MM/YYYY'),
						"Gender": pacient.Gender,
						"IdentityCard": pacient.IdentityCard,
						"CellPhone": pacient.CellPhone,
						"HomePhone": pacient.HomePhone,
						"Email": pacient.Email,
						"IsMinor": pacient.IsMinor,
						"TypeIdentityCard":pacient.TypeIdentityCard,
						"Address":pacient.Address,
						"Responsable": pacient.Responsable
					}),
					FamiliarClient: this.fb.group({
						"Id": 0,
						"Name1": '',
						"Name2": '',
						"LastName1": '',
						"LastName2": '',
						"BirthDate": '',
						"Gender": '',
						"IdentityCard": '',
						"CellPhone": ['',null],
						"HomePhone": ['',null],
						"Email": '',
						"TypeIdentityCard":'',
						"Address":''
					}),
					VitalSignsClient: this.fb.group({
						"Id": vitalsigns.Id,
						"PAS": vitalsigns.PAS,
						"PAM": vitalsigns.PAM,
						"PAD": vitalsigns.PAD,
						"FC": vitalsigns.FC,
						"FR": vitalsigns.FR,
						"TEMP": vitalsigns.TEMP
					}),
					EmergencyClient: this.fb.group({
						"Id": emergencia.Id,
						"Ticket": emergencia.Ticket,
						"Kg": emergencia.Kg,
						"Stature": emergencia.Stature,
						"Priority": emergencia.Priority,
						"RasonToConsultation": emergencia.RasonToConsultation,
						"AllergiesAndHistory": emergencia.AllergiesAndHistory,
						"IsVitalSigns":emergencia.IsVitalSigns,
						"DestinationTypeRoom":emergencia.DestinationTypeRoom
					})
				});
			} else {
				//console.log(pacient);
				this.FormPaciente = this.fb.group({
					PatientClient: this.fb.group({
						"Id": pacient.Id,
						"Name1": pacient.Name1,
						"Name2": pacient.Name2,
						"LastName1": pacient.LastName1,
						"LastName2": pacient.LastName2,
						"BirthDate": moment(pacient.BirthDate).format('DD/MM/YYYY'),
						"Gender": pacient.Gender,
						"IdentityCard": pacient.IdentityCard,
						"CellPhone": pacient.CellPhone,
						"HomePhone": pacient.HomePhone,
						"Email": pacient.Email,
						"IsMinor": pacient.IsMinor,
						"TypeIdentityCard":pacient.TypeIdentityCard,
						"Address":pacient.Address,
						"Responsable": pacient.Responsable
					}),
					FamiliarClient: this.fb.group({
						"Id": 0,
						"Name1": '',
						"Name2": '',
						"LastName1": '',
						"LastName2": '',
						"BirthDate": '',
						"Gender": '',
						"IdentityCard": '',
						"CellPhone": '',
						"HomePhone": '',
						"Email": '',
						"TypeIdentityCard":'',
						"Address":''
					}),
					VitalSignsClient: this.fb.group({
						"Id": 0,
						"PAS": '',
						"PAM": '',
						"PAD": '',
						"FC": '',
						"FR": '',
						"TEMP": ''
					}),
					EmergencyClient: this.fb.group({
						"Id": emergencia.Id,
						"Ticket": emergencia.Ticket,
						"Kg": emergencia.Kg,
						"Stature": emergencia.Stature,
						"Priority": emergencia.Priority,
						"RasonToConsultation": emergencia.RasonToConsultation,
						"AllergiesAndHistory": emergencia.AllergiesAndHistory,
						"IsVitalSigns":emergencia.IsVitalSigns,
						"DestinationTypeRoom":emergencia.DestinationTypeRoom
					})
				});
			}

		}
		if (cerrar) {
			$('#clickAqui').click();
			this.restForm();
		}
	}

}
