import { Component, OnInit, Input } from '@angular/core';
import { Global } from '../global';
import { httpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormTriajeComponent } from '../form-triaje/form-triaje.component';
declare var $:any;
declare var moment:any;

@Component({
  selector: 'app-form-admision',
  templateUrl: './form-admision.component.html',
  styleUrls: ['./form-admision.component.css']
})
export class FormAdmisionComponent implements OnInit {
@Input() init:any;
@Input('btnNpaciente') btnNpaciente:boolean = false;
  constructor(public httpService:httpService,
			public global:Global,
			public fb:FormBuilder) { }

  ngOnInit() {
  	this.restFormAdmision();
  	this.getSeguro();
  	this.getColectivo();
  }
   FormPacienteAdmision:FormGroup;
   listSeguro:any = [];
   listColectivo:any = [];
   colectivoActivo:any = [];
   seguroActivo:any = [];
   form:any;
   type2:any;
   edit:any;
   isMenor:boolean = false;

   	changeTypeIdentity = (accion) => {
		if (accion == 'admision') {
			let self = this;
			let type = this.FormPacienteAdmision.controls['PatientClient'].value.TypeIdentityCard;
			let isMenor = this.isMenor;
			//console.log(isMenor);
			if (isMenor) {
				this.FormPacienteAdmision.controls['PatientClient'].value.IdentityCard = 'temporal';
				this.FormPacienteAdmision.controls['PatientClient'].value.CellPhone = 'temporal';
				let array = this.FormPacienteAdmision.controls['PatientClient'].value;
				this.FormPacienteAdmision.controls['PatientClient'].setValue(array);
			} else {
				this.FormPacienteAdmision.controls['PatientClient'].value.IdentityCard = '';
				this.FormPacienteAdmision.controls['PatientClient'].value.CellPhone = '';
				let array = this.FormPacienteAdmision.controls['PatientClient'].value;
				this.FormPacienteAdmision.controls['PatientClient'].setValue(array);
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
				this.FormPacienteAdmision.controls['PatientClient'].value.IsMinor = true;
				let array = this.FormPacienteAdmision.controls['PatientClient'].value;
				this.FormPacienteAdmision.controls['PatientClient'].setValue(array);
			} else {
				this.isMenor = false;
				this.FormPacienteAdmision.controls['PatientClient'].value.IsMinor = false;
				let array = this.FormPacienteAdmision.controls['PatientClient'].value;
				this.FormPacienteAdmision.controls['PatientClient'].setValue(array);
			}
		} 
	}
	calFecha = (d1, d2):any =>{
		return d2.getFullYear()-d1.getFullYear();
	}

	confirmarGuardar = (form, type, edit?) => {
	  	this.form = form;
	  	this.type2 = type;
	  	this.edit = edit;
	  	this.submit();
	  	//this.global.closeModal('modal-Editar_'+this.type);
	  	setTimeout(()=>{
	  		//this.global.openModal('modal-confirmar_'+this.type);
	  	},500);
	  	
	  }
	  public selectedSeguro = (val) =>{
  	//console.log(val);
    this.FormPacienteAdmision.controls['AdmissionClient'].value.AssuredId = val.id;
    let array = this.FormPacienteAdmision.controls['AdmissionClient'].value;
    this.FormPacienteAdmision.controls['AdmissionClient'].setValue(array);

  }
  public selectedColectivo = (val) =>{
  	//console.log(val);
    this.FormPacienteAdmision.controls['AdmissionClient'].value.CollectiveId = val.id;
    let array = this.FormPacienteAdmision.controls['AdmissionClient'].value;
    this.FormPacienteAdmision.controls['AdmissionClient'].setValue(array);
  }

   submit = () => {
  	let form = this.form;
  	let type = this.type2;
  	let edit = this.edit;
  	if (type == 'admision') {
      if (edit) {
        console.log(form);
        let cedula = form.PatientClient.IdentityCard;
        let typeCedula = form.PatientClient.typeIdentityCard;
        let familiar = form.FamiliarClient;
        let telefono = form.PatientClient.CellPhone;
        if (this.isMenor) {
          form.PatientClient.CellPhone = form.FamiliarClient.CellPhone;
          form.PatientClient.IdentityCard = form.FamiliarClient.IdentityCard;
          cedula = form.PatientClient.IdentityCard;
          telefono = form.PatientClient.CellPhone;
          if (familiar.Address !== '', familiar.Name1 !== '' && familiar.LastName1 !== '' && familiar.BirthDate !== '' && familiar.Gender !== '' && familiar.IdentityCard !== '' && familiar.Phone !== '') {
            if (true) {
              if (true) {
                if (cedula != '') {
                  if (telefono != '') {
                    this.httpService.admision(form).then((res)=>{
                      console.log(res);
                      let data = res.Object;
                      if (res.Status) {
                      	//this.global.closeModal('modal-confirmar_'+this.type);
                        this.resFormAdmision(data);
                        this.global.closeModal('modal-Editar_'+this.init);
                        this.global.msj('Guardado con éxito', 'success');
                        //this.global.closeModal('modal-Editar_'+this.type);
                      } else {
                        this.global.msj(data, 'danger');
                      }
                      
                    });
                    //this.global.msj('Guardado con éxito','success');
                  } else {
                    this.global.msj('Telefono es requerido','danger');
                  }
                } else {
                  this.global.msj('Cedula es requerido','danger');
                }
              }
            }
          } else {
            this.global.msj('Todos los campos del familiar son requeridos','danger');
          }
        } else {
          if (true) {
            if (true) {
              if (cedula != '') {
                if (telefono != '') {
                  this.httpService.admision(form).then((res)=>{
                    console.log(res);
                    let data = res.Object;
                    if (res.Status) {
                    	//this.global.closeModal('modal-confirmar_'+this.type);
                      this.resFormAdmision(data);
                      this.global.closeModal('modal-Editar_'+this.init);
                      this.global.msj('Guardado con éxito', 'success');
                      //this.global.closeModal('modal-Editar_'+this.type);
                    } else {
                      this.global.msj(data, 'danger');
                    }
                    
                  });
                  //this.global.msj('Guardado con éxito','success');
                } else {
                  this.global.msj('Telefono es requerido','danger');
                }
              } else {
                this.global.msj('Cedula es requerido','danger');
              }
            }
          }
        }
        
      } else {
        console.log(form);
        let cedula = form.PatientClient.IdentityCard;
        let typeCedula = form.PatientClient.TypeIdentityCard;
        let familiar = form.FamiliarClient;
        let telefono = form.PatientClient.CellPhone;
        //let IsvitalSigns = form.EmergencyClient.IsVitalSigns;
        //let virtalsigns = form.VitalSignsClient;
        //console.log(typeCedula);
        if (typeCedula === "M") {
          form.PatientClient.CellPhone = form.FamiliarClient.CellPhone;
          form.PatientClient.IdentityCard = form.FamiliarClient.IdentityCard;
          cedula = form.PatientClient.IdentityCard;
          telefono = form.PatientClient.CellPhone;
          console.log(cedula);
          if (familiar.Address !== '',familiar.Name1 !== '' && familiar.LastName1 !== '' && familiar.BirthDate !== '' && familiar.Gender !== '' && familiar.IdentityCard !== '' && familiar.Phone !== '') {
            if (true) {
              if (true) {
                if (cedula != '') {
                  if (telefono != '') {
                    this.httpService.traumaShock().then((res)=>{
                      console.log(res);
                      let data = res.Object;
                      if (res.Status) {
                        this.resFormAdmision(data);
                        this.global.msj('Guardado con éxito', 'success');
                      } else {
                        this.global.msj(data, 'danger');
                      }
                      
                    });
                    //this.global.msj('Guardado con éxito','success');
                  } else {
                    this.global.msj('Telefono es requerido','danger');
                  }
                } else {
                  this.global.msj('Cedula es requerido','danger');
                }
              }
            }
          } else {
            this.global.msj('Todos los campos del familiar son requeridos','danger');
          }
        } else {
          if (true) {
            if (true) {
              if (cedula != '') {
                if (telefono != '') {
                  this.httpService.traumaShock().then((res)=>{
                    console.log(res);
                    let data = res.Object;
                    if (res.Status) {
                      this.resFormAdmision(data);
                      this.global.msj('Guardado con éxito', 'success');
                    } else {
                      this.global.msj(data, 'danger');
                    }
                    
                  });
                  //this.global.msj('Guardado con éxito','success');
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
  		
  	}
  	
  	
  	

  	
  }


  get = (id:number) => {
		let path = 'api/WebServices/GetFileEmergency?sParamsSigleIdClient={"Id":' +id+ '}';
		console.log(path);
		this.httpService.get(path).then(res=>{
			console.log(res);
			let statu:boolean = res.Status;
			if (statu) {
				let obj = res.Object;
				let pacient = obj.Patient;
			    let familiar = obj.Patient.Familiar;
			    let vitalSigns = obj.VitalSigns;

				let forForm:any;
			
				      forForm = {
				         PatientClient: pacient,
				          FamiliarClient: familiar,
				          AdmissionClient: obj.Admission,
				      };
				      this.resFormAdmision(forForm);
				      this.colectivoActivo = [];
					    this.seguroActivo = [];
					    this.listColectivo.forEach((val)=>{
					      if (obj.Admission.CollectiveId == val.id) {
					        this.colectivoActivo.push({id:obj.Admission.CollectiveId,text:val.text});
					      } else if (obj.Admission.CollectiveId == null) {
					        this.colectivoActivo = [];
					      }
					    });
					    this.listSeguro.forEach((val)=>{
					      if (obj.Admission.AssuredId == val.id) {
					        this.seguroActivo.push({id:obj.Admission.AssuredId,text:val.text});
					      } else if (obj.Admission.AssuredId == null) {
					        this.seguroActivo = [];
					      }
					    });
			}
		});
	}
   resFormAdmision = (form) => {
    let pacient = form.PatientClient;
    let familiar = form.FamiliarClient;
    let admision = form.AdmissionClient;
    //console.log(pacient);
    if (familiar !== null) {
      this.FormPacienteAdmision = this.fb.group({
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
          "Address":pacient.Address
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
          "CellPhone": pacient.CellPhone,
          "HomePhone": pacient.HomePhone,
          "Email": familiar.Email,
          "TypeIdentityCard":familiar.TypeIdentityCard,
          "Address":pacient.Address
        }),
        AdmissionClient: this.fb.group({
          "Id": admision.Id,
          "Code": admision.Code,
          "CashPayment": admision.CashPayment,
          "AssuredId": admision.AssuredId,
          "CollectiveId": admision.CollectiveId
        })
      });
    } else {
      this.FormPacienteAdmision = this.fb.group({
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
          "Address":pacient.Address
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
        AdmissionClient: this.fb.group({
          "Id": admision.Id,
          "Code": admision.Code,
          "CashPayment": admision.CashPayment,
          "AssuredId": admision.AssuredId,
          "CollectiveId": admision.CollectiveId
        })
      });
    }
  }
  restFormAdmision = () =>{
  	this.FormPacienteAdmision = this.fb.group({
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
  			"Address":''
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
  			"Address":''
  		}),
  		AdmissionClient: this.fb.group({
  			"Id": 0,
        "Code": '',
        "CashPayment": true,
        "AssuredId": '',
        "CollectiveId": ''
  		})
  	});
  }
   getSeguro = () => {
    let path = "api/WebServices/SelectRecord?sParamsIn={'Id': 0,'EntityName': 'AssuredClient','page':0, 'pageSize':20}";
    this.httpService.get(path).then((res)=>{
      //console.log(res);
      let datos = res.Object.ListItems;
      datos.forEach((val)=>{
        this.listSeguro.push({id:val.Id,text:val.Name});
      });
    });
  }
  getColectivo = () => {
    let path = "api/WebServices/SelectRecord?sParamsIn={'Id': 0,'EntityName': 'CollectiveClient','page':0, 'pageSize':20}";
    this.httpService.get(path).then((res)=>{
      //console.log(res);
      let datos = res.Object.ListItems;
      datos.forEach((val)=>{
        this.listColectivo.push({id:val.Id,text:val.Name});
      });
    });
  }
}
