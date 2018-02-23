import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../global';
import { httpService } from '../http.service';
import { Router } from '@angular/router';
import { fadeInAnimation } from '../_animations';

declare var $:any;
declare var moment:any;
declare var kendo:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class DashboardComponent implements OnInit {

  constructor(public fb: FormBuilder,
  			public global:Global,
  			public httpService:httpService,
        public router:Router) { }

  ngOnInit() {
    //this.FormTriaje.metodo();
    let typeUser = this.global.User.UserProfileId;
    let redirect:string = '';
    if (typeUser == 4) {
           redirect = '/Pantalla';
           this.router.navigate([redirect]);
    }
  	//this.getPacientes();
  	//this.getPacientesEspera();
  	//this.getPacientesSala();
    //this.getSeguro();
    //this.getColectivo();


  	let self = this;
  	this.restForm();
  	this.restFormAdmision();
  	////console.log(this.fichaPaciente);
  	let tipoUser = this.global.getUserProfileId();
  	setTimeout(()=>{
      if (tipoUser == 1 ) {
        this.global.entorno = 'Administrador';
      } else if(tipoUser == 2){
        this.global.entorno = 'Admisión';
      } else if(tipoUser == 3){
        this.global.entorno = 'Triaje';
      } else if(tipoUser == 4){
        this.global.entorno = 'Pantalla';
      } else if(tipoUser == 5){
        this.global.entorno = 'Enfermería emergencia';
      }
    },2000)
  	//setTimeout(()=>{$('input').iCheck( {checkboxClass: 'icheckbox_flat-blue',radioClass: 'iradio_flat-blue'});},500);
 
    

 //  	$.fn.datepicker.dates = {
	// 	en: {
	// 		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	// 		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	// 		daysMin: ["Lu", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
	// 		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	// 		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	// 		today: "Today",
	// 		clear: "Clear",
	// 		titleFormat: "MM yyyy"
	// 	}
	// };
  }
  fnclickTag = () => {
    $('#btnCerrarFicha').click();
  }
  isMenor:boolean = false;
  actFecha = (val, accion?) => {
    
    let valor = val.target.value;
    let fecha = valor;
    let isValid = moment(this.parseDMY(fecha)).isValid();
    //console.log(fecha);
    if (!isValid) {
      this.global.msj('Fecha invalida','danger');
      $('.validateDate').addClass('has-error');
    } else {
      $('.validateDate').removeClass('has-error');

      //this.FormPaciente.controls['PatientClient'].value.BirthDate = this.stringDMY(fecha);
      //let array = this.FormPaciente.controls['PatientClient'].value;
      //this.FormPaciente.controls['PatientClient'].setValue(array);
      //console.log(fecha);
      if (accion == 'familiar') {
        //console.log('paso');
      } else {
        this.calcularFN(this.stringDMY(fecha));
      }
      
      // this.FormPacienteAdmision.controls['PatientClient'].value.BirthDate = moment(val).format('DD/MM/YYYY');
      // let array2 = this.FormPacienteAdmision.controls['PatientClient'].value;
      // this.FormPacienteAdmision.controls['PatientClient'].setValue(array2);
      // this.changeTypeIdentity('triaje');
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
    ////console.log(date);
    let fecha:any = new Date(date);
    let hoy:any = new Date();
    let res:any = this.calFecha(fecha,hoy);
    //console.log(res);
    if (accion == 'familiar') {
      // code...
    } else {
      if (res < 18) {
        this.isMenor = true;
          this.FormPaciente.controls['PatientClient'].value.IsMinor = true;
          let array = this.FormPaciente.controls['PatientClient'].value;
          this.FormPaciente.controls['PatientClient'].setValue(array);
        //this.FormPaciente.controls['PatientClient'].value.IsMinor = true;
        ////console.log('es menor', true);
        ////console.log(this.FormPaciente.controls);
      } else {
        this.isMenor = false;
        this.FormPaciente.controls['PatientClient'].value.IsMinor = false;
          let array = this.FormPaciente.controls['PatientClient'].value;
          this.FormPaciente.controls['PatientClient'].setValue(array);
        //this.FormPaciente.controls['PatientClient'].value.IsMinor = false;
      }
    } 
  }
  calFecha = (d1, d2):any =>{
    return d2.getFullYear()-d1.getFullYear();
  }
  FormPaciente: FormGroup;
  FamiliarClient: FormGroup;
  PatientClient: FormGroup;
  VitalSignsClient: FormGroup;
  EmergencyClient:FormGroup;

  FormPacienteAdmision:FormGroup;
  entorno:string;

  page:number = 1;
  LastPage:number;
  arrayPage:any[] = [];

  listPacientes:any = [];
  fichaPaciente:PacienteFicha = {};
  fichaAdmisionId:number;

  showGestionar:boolean = false;
  solicitudes:any[] = [];

    listSeguro:any = [];
  listColectivo:any = [];

  //   getSeguro = () => {
  //   let path = "api/WebServices/SelectRecord?sParamsIn={'Id': 0,'EntityName': 'AssuredClient','page':0, 'pageSize':20}";
  //   this.httpService.get(path).then((res)=>{
  //     ////console.log(res);
  //     let datos = res.Object.ListItems;
  //     datos.forEach((val)=>{
  //       this.listSeguro.push({id:val.Id,text:val.Name});
  //     });
  //   });
  // }
  // getColectivo = () => {
  //   let path = "api/WebServices/SelectRecord?sParamsIn={'Id': 0,'EntityName': 'CollectiveClient','page':0, 'pageSize':20}";
  //   this.httpService.get(path).then((res)=>{
  //     ////console.log(res);
  //     let datos = res.Object.ListItems;
  //     datos.forEach((val)=>{
  //       this.listColectivo.push({id:val.Id,text:val.Name});
  //     });
  //   });
  // }

  clickTag = () => {
    this.restForm();
    this.restFormAdmision();
  }
  pageSolicitudes:number = 1;
  LastPageSolicitudes:number;
  arrayPageSolicitudes:any[] = [];

  listPacientesSolicitudes:any = [];


getPaginationSolicitudes = () => {
    let cont:number = 2;
    let pActual:number = this.pageSolicitudes;
    for (var i = 1; i <= this.LastPageSolicitudes; i++) {
      let v = (i - pActual);
      if (v < 0) { v = v * (-1);}
      if (v <= cont) {
        this.arrayPageSolicitudes.push(i);
      }
    }
  }
  moverPageSolicitudes = (accion) => {
    if (accion == 'next') {
      this.pageSolicitudes = this.calPageSolicitudes(accion);
    }
    if (accion == 'prev') {
      this.pageSolicitudes = this.calPageSolicitudes(accion);
    }
    this.getPacientesSolicitudes();
  }
  calPageSolicitudes = (accion) => {
    let pageTop = this.LastPageSolicitudes;
    if (accion == 'next') {
      let pageResul = this.pageSolicitudes + 1;
      if (pageResul > pageTop) {
        return pageTop;
      } else {
        return pageResul;
      }
    }
    if (accion == 'prev') {
      let pageResul = this.pageSolicitudes - 1;
      if (pageResul < 1) {
        return 1;
      } else {
        return pageResul;
      }
    }
    
  }
  getPageSolicitudes = (page) => {
    this.pageSolicitudes = page;
    this.getPacientesSolicitudes();
  }
  getPacientesSolicitudes = ()=>{
    let path = 'api/WebServicesERIS/GetServiceRequest?sParamsInSelectServiceRequest={EmergencyId: '+ this.fichaPaciente.Id +',"page": '+ this.pageSolicitudes +', "pageSize":10}';
      ////console.log(path);
      this.httpService.get(path).then((res)=>{
        ////console.log(res);
        let datos = res.Object.ListItems;
        this.solicitudes = datos;
        this.getPaginationSolicitudes();
      });
  }
  fnGestionar = (accion) => {
    if (accion == 'show') {
      this.showGestionar = true;
      this.getPacientesSolicitudes();
      this.fnOpemAdmission();
      
    } else if (accion == 'hide') {
      this.showGestionar = false;
      this.closeManager();
      this.getPacientes();
    }
    
  }
  closeManager = () => {
    let json = {id:this.fichaPaciente.Id};
    this.httpService.CloseManager(json).then((res)=>{
      ////console.log(res);
    });
  }
  changeChecked = (val, obj) => {
    ////console.log(val,obj.Id);
    let json = {"Id": obj.Id,"Status": val}
    this.httpService.setStatusService(json).then((res)=>{
     // //console.log(res);
    });
  }
  fnOpemAdmission = () => {
    let json = {"Id": this.fichaAdmisionId}
    let path = 'api/WebServicesERIS/OpenManageAdmission';
    this.httpService.post(path,json).then((res)=>{
      ////console.log(res);
      if (res.Status) {
        //this.fichaPaciente.pause = true;
      }
    });
  }
  fnPause = () =>{
    let json = {"Id": this.fichaAdmisionId}
    let path = 'api/WebServicesERIS/SetAdmissionPause';
    this.httpService.post(path,json).then((res)=>{
      ////console.log(res);
      if (res.Status) {
        this.fichaPaciente.pause = true;
        this.getPacientes();
      }
    });
  }
  fnPlay = () => {
    let json = {"Id": this.fichaAdmisionId}
    let path = 'api/WebServicesERIS/SetAdmissionPlay';
    this.httpService.post(path,json).then((res)=>{
      ////console.log(res);
      if (res.Status) {
        this.fichaPaciente.pause = false;
        this.getPacientes();
      }
    });
  }
  fnLlamar = (accion) =>{
    if (accion == 'llamar') {
      let json = {
                "EntityName": "UserCallTicketClient",
                "EntityJson": {Ticket: this.fichaPaciente.Ticket}
              }
              ////console.log(json);
      let path = 'api/WebServices/UpsertEntity';
      this.httpService.post(path,json).then((res)=>{
        ////console.log(res);
        if (res.Status) {
          //this.fichaPaciente.pause = false;
          this.fichaPaciente.StatusScreen = true;
        }
      });
    } else if (accion == 'llego') {
      let json = {
                "Value":  this.fichaPaciente.Ticket
              }
              //console.log(json);
      let path = 'api/WebServicesERIS/SetArrivedPatientToCall';
      this.httpService.post(path,json).then((res)=>{
        //console.log(res);
        if (res.Status) {
          //this.fichaPaciente.pause = false;
          this.fichaPaciente.StatusScreen = false;
        }
      });
    }
    this.getPacientes();
  }
  fnEdit = (obj) => {
    ////console.log(obj);
    this.global.openModal('modal-Editar');
    let self = this;
  }
  colectivoActivo:any = [];
  seguroActivo:any = [];
  public selectedSeguro = (val) =>{
  	////console.log(val);
    this.FormPacienteAdmision.controls['AdmissionClient'].value.AssuredId = val.id;
    let array = this.FormPacienteAdmision.controls['AdmissionClient'].value;
    this.FormPacienteAdmision.controls['AdmissionClient'].setValue(array);

  }
  public selectedColectivo = (val) =>{
  	////console.log(val);
    this.FormPacienteAdmision.controls['AdmissionClient'].value.CollectiveId = val.id;
    let array = this.FormPacienteAdmision.controls['AdmissionClient'].value;
    this.FormPacienteAdmision.controls['AdmissionClient'].setValue(array);
  }
  public refreshValue(value:any):void {
   // this.listColectivo = value;
    ////console.log(value);
  }

  fnSelectPaciente = (obj,event) => {
  	//console.log(obj.Id);
    //this.colectivoActivo = [];
    //this.seguroActivo = [];
    this.global.saveLocal('selectInList',obj.Ticket);
    //this.resFormAdmision(obj);
  	let tr = event.target.parentElement;
  	$('tr').removeClass('trSelect');
  	$(tr).addClass('trSelect');
  	this.fichaPaciente.nombre = obj.Patient.Name1;
  	this.fichaPaciente.apellido = obj.Patient.LastName1;
  	this.fichaPaciente.cedula = obj.Patient.IdentityCard;

  	this.fichaPaciente.celular = obj.Patient.CellPhone;
  	this.fichaPaciente.telefono = obj.Patient.HomePhone;
  	this.fichaPaciente.direccion = obj.Patient.Address;

    if (obj.CheckInAdmission == '1900-01-01T00:00:00') {
      this.fichaPaciente.Hadmision = '';
    } else {
      this.fichaPaciente.Hadmision = obj.CheckInAdmission;

    }
    if (obj.CheckInTriage == '1900-01-01T00:00:00') {
      this.fichaPaciente.Hllegada = '';
    } else {
      this.fichaPaciente.Hllegada = obj.CheckInTriage;
    }
  	
    if (obj.CheckInEmergency == '1900-01-01T00:00:00') {
      this.fichaPaciente.Hingreso = '';
    } else {
      this.fichaPaciente.Hingreso = obj.CheckInEmergency;
    }
    if (obj.CheckOut == '1900-01-01T00:00:00') {
      this.fichaPaciente.Hegreso = '';
    } else {
      this.fichaPaciente.Hegreso = obj.CheckOut;
    }

    this.fichaPaciente.StatusManage = obj.StatusManage;
    this.fichaPaciente.Id = obj.Id;
    this.fichaAdmisionId = obj.Admission.Id;
    this.fichaPaciente.pause = obj.Admission.Pause;
    this.fichaPaciente.StatusScreen = obj.StatusScreen;
    this.fichaPaciente.Ticket = obj.Ticket;
    if (obj.Location == null) {
      this.fichaPaciente.ubicacion = 'No ubicado';
    } else {
      this.fichaPaciente.ubicacion = obj.Location.Name;
    }
  	
    this.fichaPaciente.CashPayment = obj.Admission.CashPayment

    let pacient = obj.Patient;
    let familiar = obj.Patient.Familiar;
    let admision = obj.Admission;
    let forForm:any = {};
    ////console.log(pacient.TypeIdentityCard);
    if (familiar == null) {
      forForm = {
         PatientClient: {
            "Id": pacient.Id,
            "Name1": pacient.Name1,
            "Name2": pacient.Name2,
            "LastName1": pacient.LastName1,
            "LastName2": pacient.LastName2,
            "BirthDate": pacient.BirthDate,
            "Gender":pacient.Gender,
            "IdentityCard": pacient.IdentityCard,
            "CellPhone": pacient.CellPhone,
            "HomePhone": pacient.HomePhone,
            "Email": pacient.Email,
            "IsMinor": pacient.IsMinor,
            "TypeIdentityCard":pacient.TypeIdentityCard,
            "Address":pacient.Address
          },
          FamiliarClient: {
            "Id": '',
            "Name1":'',
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
          },
          AdmissionClient: {
            "Id": admision.Id,
            "Code": admision.Code,
            "CashPayment": admision.CashPayment,
            "AssuredId": admision.AssuredId,
            "CollectiveId": admision.CollectiveId
          }
      };
      
    } else {
      forForm = {
         PatientClient: {
            "Id": pacient.Id,
            "Name1": pacient.Name1,
            "Name2": pacient.Name2,
            "LastName1": pacient.LastName1,
            "LastName2": pacient.LastName2,
            "BirthDate": pacient.BirthDate,
            "Gender":pacient.Gender,
            "IdentityCard": pacient.IdentityCard,
            "CellPhone": pacient.CellPhone,
            "HomePhone": pacient.HomePhone,
            "Email": pacient.Email,
            "IsMinor": pacient.IsMinor,
            "TypeIdentityCard":pacient.TypeIdentityCard,
            "Address":pacient.Address
          },
          FamiliarClient: {
            "Id": familiar.Id,
            "Name1": familiar.Name1,
            "Name2": familiar.Name2,
            "LastName1": familiar.LastName1,
            "LastName2": familiar.LastName2,
            "BirthDate": familiar.BirthDate,
            "Gender": familiar.Gender,
            "IdentityCard": familiar.IdentityCard,
            "CellPhone": familiar.CellPhonfamiliare,
            "HomePhone": familiar.HomePhone,
            "Email": familiar.Email,
            "TypeIdentityCard":familiar.TypeIdentityCard,
            "Address":familiar.Address
          },
          AdmissionClient: {
            "Id": admision.Id,
            "Code": admision.Code,
            "CashPayment": admision.CashPayment,
            "AssuredId": admision.AssuredId,
            "CollectiveId": admision.CollectiveId
          }
      };
     

      //this.seguroActivo.push({id:admision.AssuredId});
    }

    // this.colectivoActivo.push(admision.CollectiveId);
     // this.seguroActivo.push({id:admision.AssuredId});
    ////console.log(this.colectivoActivo);
    ////console.log(forForm);
    this.resFormAdmision(forForm);


  }
  cerrarFicha = () => {
  	this.fichaPaciente = {};
  	$('tr').removeClass('trSelect');
  }

  getPagination = () => {
  	let cont:number = 2;
  	let pActual:number = this.page;
  	for (var i = 1; i <= this.LastPage; i++) {
  		let v = (i - pActual);
  		if (v < 0) { v = v * (-1);}
  		if (v <= cont) {
  			this.arrayPage.push(i);
  		}
  	}
  }
  moverPage = (accion) => {
  	if (accion == 'next') {
  		this.page = this.calPage(accion);
  	}
  	if (accion == 'prev') {
  		this.page = this.calPage(accion);
  	}
    this.fichaPaciente = {};
  	this.getPacientes();
  }
  calPage = (accion) => {
  	let pageTop = this.LastPage;
  	if (accion == 'next') {
	  	let pageResul = this.page + 1;
	  	if (pageResul > pageTop) {
	  		return pageTop;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	if (accion == 'prev') {
	  	let pageResul = this.page - 1;
	  	if (pageResul < 1) {
	  		return 1;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	
  }
  getPage = (page) => {
  	this.page = page;
  	this.getPacientes();
    this.fichaPaciente = {};
  }

ticketFilter:string = '';
NameFilter:string = '';
IdentityCardFilter:string = '';
PriorityFilter:string = '';

  getPacientes = () => {
  	this.global.loading('in');
     let path:string;
     let filter:string = '';
      let Ticket:string = this.ticketFilter;
      let Nombre:string = this.NameFilter;
      let Cedula:string = this.IdentityCardFilter;
      let Prioridad:string = this.PriorityFilter;


      if (Ticket != "") {
         filter += 'Ticket:' + Ticket + '|';
         //filter += 'dateFrom:' + from + '|';
        }
      if (Nombre != '') {
         filter += 'Name:' + Nombre + '|';
         //filter += 'dateTo:'+ to + '|';
        }
      if (Cedula != '') {
         filter += 'IdentityCard:' + Cedula + '|';
        }
      if (Prioridad != '') {
         filter += 'Priority:' + Prioridad + '|';
        }
        if (filter != '') {
         filter = filter.substring(0, filter.length -1);
        }
   
      if (filter != '') {
        path = 'api/WebServicesERIS/GetListDashboar?sParamsInSelectDashboard={"strFilters": '+ JSON.stringify(filter) +',"type": 1,"page": '+ this.page +', "pageSize":10}';
      } else {
        path = 'api/WebServicesERIS/GetListDashboar?sParamsInSelectDashboard={"type": 1,"page": '+ this.page +', "pageSize":10}';
      }
  	
  	//console.log(path);
    this.httpService.get(path).then((res)=>{
  		////console.log(res);
  		this.global.loading('out');
  		let datos = res.Object.ListItems;
  		this.LastPage = res.Object.LastPage;
  		this.arrayPage = [];
  		this.getPagination();
  		this.listPacientes = [];
  		//console.log(res);
  		datos.forEach((val)=>{
  			this.listPacientes.push({Pause:val.Admission.Pause,obj:val,Ticket:val.Ticket,Nombre:val.Patient.Name1 + ' ' + val.Patient.LastName1,IdentityCard:val.Patient.IdentityCard,Estado:val.Priority })
  		});
      let selectInlist = this.global.getLocal('selectInList');
      setTimeout(()=>{
        $('#'+selectInlist).addClass('trSelect');
      },100);
      
  		////console.log(this.listPacientes);
  	});

  }
  pageEspera:number = 1;
  LastPageEspera:number;
  arrayPageEspera:any[] = [];

  listPacientesEspera:any = [];
  getPaginationEspera = () => {
  	let cont:number = 2;
  	let pActual:number = this.pageEspera;
  	for (var i = 1; i <= this.LastPageEspera; i++) {
  		let v = (i - pActual);
  		if (v < 0) { v = v * (-1);}
  		if (v <= cont) {
  			this.arrayPageEspera.push(i);
  		}
  	}
  }
  moverPageEspera = (accion) => {
  	if (accion == 'next') {
  		this.pageEspera = this.calPageEspera(accion);
  	}
  	if (accion == 'prev') {
  		this.pageEspera = this.calPageEspera(accion);
  	}
  	this.getPacientesEspera();
  }
  calPageEspera = (accion) => {
  	let pageTop = this.LastPageEspera;
  	if (accion == 'next') {
	  	let pageResul = this.pageEspera + 1;
	  	if (pageResul > pageTop) {
	  		return pageTop;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	if (accion == 'prev') {
	  	let pageResul = this.pageEspera - 1;
	  	if (pageResul < 1) {
	  		return 1;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	
  }
  getPageEspera = (page) => {
  	this.pageEspera = page;
  	this.getPacientesEspera();

  }
  getPacientesEspera = () => {
  	this.global.loading('in');
  	let path = 'api/WebServicesERIS/GetListDashboar?sParamsInSelectDashboard={"type": 2,"page": '+ this.pageEspera +', "pageSize":10}';
  	this.httpService.get(path).then((res)=>{
  		////console.log(res);
  		this.global.loading('out');
  		let datos = res.Object.ListItems;
  		this.LastPageEspera = res.Object.LastPage;
  		this.arrayPageEspera = [];
  		this.getPaginationEspera();
  		this.listPacientesEspera = [];
  		////console.log(datos);
  		datos.forEach((val)=>{
        let triaje;
        let caja;
        let sala;
        if (val.CheckInPlannedEmergency == '1900-01-01T00:00:00') {
          sala = '';
        } else {
          sala = val.CheckInPlannedEmergency;
        }
        if (val.CheckInAdmission == '1900-01-01T00:00:00') {
          caja = '';
        } else {
          caja = val.CheckInAdmission;
        }
        if (val.CheckInTriage == '1900-01-01T00:00:00') {
          triaje = '';
        } else {
          triaje = val.CheckInTriage;
        }
  			this.listPacientesEspera.push({Hprevista: sala,Hcaja:caja,Htriaje:triaje,prioridad:val.Priority,obj:val,Ticket:val.Ticket,Nombre:val.Patient.Name1 + ' ' + val.Patient.LastName1,IdentityCard:val.Patient.IdentityCard,Estado:val.Priority })
  		});
  		////console.log(this.listPacientes);
  	});

  }
  pageSala:number = 1;
  LastPageSala:number;
  arrayPageSala:any[] = [];

  listPacientesSala:any = [];
  getPaginationSala = () => {
  	let cont:number = 2;
  	let pActual:number = this.pageSala;
  	for (var i = 1; i <= this.LastPageSala; i++) {
  		let v = (i - pActual);
  		if (v < 0) { v = v * (-1);}
  		if (v <= cont) {
  			this.arrayPageSala.push(i);
  		}
  	}
  }
  moverPageSala = (accion) => {
  	if (accion == 'next') {
  		this.pageSala = this.calPageSala(accion);
  	}
  	if (accion == 'prev') {
  		this.pageSala = this.calPageSala(accion);
  	}
  	this.getPacientesSala();
  }
  calPageSala = (accion) => {
  	let pageTop = this.LastPageSala;
  	if (accion == 'next') {
	  	let pageResul = this.pageSala + 1;
	  	if (pageResul > pageTop) {
	  		return pageTop;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	if (accion == 'prev') {
	  	let pageResul = this.pageSala - 1;
	  	if (pageResul < 1) {
	  		return 1;
	  	} else {
	  		return pageResul;
	  	}
  	}
  	
  }
  getPageSala = (page) => {
  	this.pageSala = page;
  	this.getPacientesSala();
  }
  getPacientesSala = () => {
  	this.global.loading('in');
  	let path = 'api/WebServicesERIS/GetListDashboar?sParamsInSelectDashboard={"type": 3,"page": '+ this.pageSala +', "pageSize":10}';
  	this.httpService.get(path).then((res)=>{
  		////console.log(res);
  		this.global.loading('out');
  		let datos = res.Object.ListItems;
  		this.LastPageSala = res.Object.LastPage;
  		this.arrayPageSala = [];
  		this.getPaginationSala();
  		this.listPacientesSala = [];
  		////console.log(datos);
  		datos.forEach((val)=>{
        let triaje;
        let caja;
        let sala;
        if (val.CheckInPlannedEmergency == '1900-01-01T00:00:00') {
          sala = '';
        } else {
          sala = val.CheckInPlannedEmergency;
        }
        if (val.CheckInAdmission == '1900-01-01T00:00:00') {
          caja = '';
        } else {
          caja = val.CheckInAdmission;
        }
        if (val.CheckInTriage == '1900-01-01T00:00:00') {
          triaje = '';
        } else {
          triaje = val.CheckInTriage;
        }
  			this.listPacientesSala.push({Hprevista: sala,Hcaja:caja,Htriaje:triaje,prioridad:val.Priority,obj:val,Ticket:val.Ticket,Nombre:val.Patient.Name1 + ' ' + val.Patient.LastName1,IdentityCard:val.Patient.IdentityCard,Estado:val.Priority })
  		});
  		////console.log(this.listPacientes);
  	});

  }
  changeTypeIdentity = (accion) => {
    if (accion == 'triaje') {
      let self = this;
      let type = this.FormPaciente.controls['PatientClient'].value.TypeIdentityCard;
      let isMenor = this.isMenor;
      //console.log(isMenor);
      if (isMenor) {
        //this.FormPaciente.controls['PatientClient'].value.IsMinor = true;
         this.FormPaciente.controls['PatientClient'].value.IdentityCard = 'temporal';
         this.FormPaciente.controls['PatientClient'].value.CellPhone = 'temporal';
         ////console.log(this.FormPaciente.controls['PatientClient'].value.Phone);
         //$('#Cedula').removeAttr('required');​​​​​
        // $('#Telefono').removeAttr('required');​​​​​
        //$('#Cedula').text('?');
        //$('#Telefono').text('?');


      } else {
        //this.FormPaciente.controls['PatientClient'].value.IsMinor = false;
        //$('#Cedula').attr('required');​​​​​
        //$('#Telefono').attr('required');​​​​​
      }
    } else if (accion == 'admision') {

      let self = this;
      let type = this.FormPacienteAdmision.controls['PatientClient'].value.TypeIdentityCard;
      let isMenor = this.isMenor;
      ////console.log(type);
      if (isMenor) {
        this.FormPacienteAdmision.controls['PatientClient'].value.IsMinor = true;
         this.FormPacienteAdmision.controls['PatientClient'].value.IdentityCard = 'temporal';
         this.FormPacienteAdmision.controls['PatientClient'].value.CellPhone = 'temporal';
         ////console.log(this.FormPacienteAdmision.controls['PatientClient'].value.Phone);
         //$('#Cedula').removeAttr('required');​​​​​
        // $('#Telefono').removeAttr('required');​​​​​
        //$('#Cedula').text('?');
        //$('#Telefono').text('?');

      } else {
        this.FormPacienteAdmision.controls['PatientClient'].value.IsMinor = false;
        //$('#Cedula').attr('required');​​​​​
        //$('#Telefono').attr('required');​​​​​
      }
    }
  	
  }
  submit = (form, type, edit?) => {
  	if (type == 'triaje') {
  		
	  	let formulario = {
	  		PatientClient:this.FormPaciente.controls['PatientClient'].value,
	  		FamiliarClient:this.FormPaciente.controls['FamiliarClient'].value,
	  		VitalSignsClient:this.FormPaciente.controls['VitalSignsClient'].value,
	  		EmergencyClient:this.FormPaciente.controls['EmergencyClient'].value,
	  	};
	  	////console.log(formulario);
	  	let cedula = form.PatientClient.IdentityCard;
	  	let typeCedula = form.PatientClient.TypeIdentityCard;
	  	let familiar = form.FamiliarClient;
	  	let telefono = form.PatientClient.CellPhone;
	  	let IsvitalSigns = form.EmergencyClient.IsVitalSigns;
	  	let virtalsigns = form.VitalSignsClient;
      let isMenor = this.isMenor;
	  	////console.log(typeCedula);
      if (typeCedula != 'M' && cedula == '') {
        this.global.msj('Numero de cedula es requerido', 'danger');
        return;
      }
	  	if (isMenor) {
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
  	} else if (type == 'admision') {
      if (edit) {
        //console.log(form);
        let cedula = form.PatientClient.IdentityCard;
        let typeCedula = form.PatientClient.typeIdentityCard;
        let familiar = form.FamiliarClient;
        let telefono = form.PatientClient.CellPhone;
        //let IsvitalSigns = form.EmergencyClient.IsVitalSigns;
        //let virtalsigns = form.VitalSignsClient;
       // //console.log(typeCedula);
       let isMenor = this.isMenor;
        if (isMenor) {
          // form.PatientClient.CellPhone = form.FamiliarClient.CellPhone;
          // form.PatientClient.IdentityCard = form.FamiliarClient.IdentityCard;
          cedula = form.PatientClient.IdentityCard;
          telefono = form.PatientClient.CellPhone;
          if (familiar.Address !== '', familiar.Name1 !== '' && familiar.LastName1 !== '' && familiar.BirthDate !== '' && familiar.Gender !== '' && familiar.IdentityCard !== '' && familiar.Phone !== '') {
            if (true) {
              if (true) {
                if (cedula != '') {
                  if (telefono != '') {
                    this.httpService.admision(form).then((res)=>{
                      //console.log(res);
                      let data = res.Object;
                      if (res.Status) {
                        this.resFormAdmision(data);
                        this.global.msj('Guardado con éxito', 'success');
                        this.global.closeModal('modal-Editar');
                      } else {
                        this.global.msj(data, 'danger');
                      }
                      
                    });
                    //this.global.msj('Guardado con éxito','success');
                  } else {
                    this.global.msj('Teléfono es requerido','danger');
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
                    //console.log(res);
                    let data = res.Object;
                    if (res.Status) {
                      this.resFormAdmision(data);
                      this.global.msj('Guardado con éxito', 'success');
                      this.global.closeModal('modal-Editar');
                    } else {
                      this.global.msj(data, 'danger');
                    }
                    
                  });
                  //this.global.msj('Guardado con éxito','success');
                } else {
                  this.global.msj('Teléfono es requerido','danger');
                }
              } else {
                this.global.msj('Cedula es requerido','danger');
              }
            }
          }
        }
        
      } else {
        //console.log(form);
        let cedula = form.PatientClient.IdentityCard;
        let typeCedula = form.PatientClient.TypeIdentityCard;
        let familiar = form.FamiliarClient;
        let telefono = form.PatientClient.CellPhone;
        let isMenor = this.isMenor;
        //let IsvitalSigns = form.EmergencyClient.IsVitalSigns;
        //let virtalsigns = form.VitalSignsClient;
        ////console.log(typeCedula);
        if (isMenor) {
          // form.PatientClient.CellPhone = form.FamiliarClient.CellPhone;
          // form.PatientClient.IdentityCard = form.FamiliarClient.IdentityCard;
          cedula = form.PatientClient.IdentityCard;
          telefono = form.PatientClient.CellPhone;
          //console.log(cedula);
          if (familiar.Address !== '',familiar.Name1 !== '' && familiar.LastName1 !== '' && familiar.BirthDate !== '' && familiar.Gender !== '' && familiar.IdentityCard !== '' && familiar.Phone !== '') {
            if (true) {
              if (true) {
                if (cedula != '') {
                  if (telefono != '') {
                    this.httpService.traumaShock().then((res)=>{
                      //console.log(res);
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
                    this.global.msj('Teléfono es requerido','danger');
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
                    //console.log(res);
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
                  this.global.msj('Teléfono es requerido','danger');
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
  nuevoPTraumashock = () => {
    this.httpService.traumaShock().then(res=>{
      //console.log(res);
      let status = res.Status;
      if (status) {
        this.global.msj('Agregado con éxito','success');
        this.global.closeModal('modal-confirmar-traumaShock');
      }
    });
  }
  accion:string = '';
  fnClickNpaciente = (accion,val?) => {
    this.accion = accion;
    let touched = val.touched;
    if (touched) {
      this.global.openModal('modal-confirmar-Dashboard');
    } else {
      this.newPAciente();
    }
    
  }
  newPAciente = () => {
    let accion = this.accion;
    this.isMenor = false;
  	if (accion === 'triaje') {
  		this.restForm();
  		
  	} else if (accion == 'admision') {
  		this.restFormAdmision();
  	}
  	
    this.global.closeModal('modal-confirmar-Dashboard');
    setTimeout(()=>{
      $('#name1T').focus();
      $('#name1A').focus();
    },1000);
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
        "ListTypeAP":''
  		})
  	});
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
  resFormAdmision = (form) => {
    let pacient = form.PatientClient;
    let familiar = form.FamiliarClient;
    let admision = form.AdmissionClient;
    ////console.log(pacient);
    if (familiar !== null) {
      this.FormPacienteAdmision = this.fb.group({
        PatientClient: this.fb.group({
          "Id": pacient.Id,
          "Name1": pacient.Name1,
          "Name2": pacient.Name2,
          "LastName1": moment(pacient.BirthDate).format('DD/MM/YYYY'),
          "LastName2": pacient.LastName2,
          "BirthDate": pacient.BirthDate,
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
          "CellPhone": familiar.CellPhone,
          "HomePhone": familiar.HomePhone,
          "Email": familiar.Email,
          "TypeIdentityCard":familiar.TypeIdentityCard,
          "Address":familiar.Address
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
          "Id": '',
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
  resForm = (form) =>{
  	let pacient = form.PatientClient;
  	let familiar = form.FamiliarClient;
  	let emergencia = form.EmergencyClient;
  	let vitalsigns = form.VitalSignsClient;
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
            "ListTypeAP":emergencia.ListTypeAP
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
            "ListTypeAP":emergencia.ListTypeAP
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
            "Address":pacient.Address
  				}),
  				FamiliarClient: this.fb.group({
  					"Id": '',
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
            "ListTypeAP":emergencia.ListTypeAP
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
  					"Id": '',
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
            "ListTypeAP":emergencia.ListTypeAP
  				})
  			});
  		}

  	}

  }

}

export class PacienteFicha {

  constructor(
    public Id?: number,
    public nombre?: string,
    public apellido?: string,
    public cedula?: string,
    public celular?: string,
    public telefono?: string,
    public direccion?: string,
    public formadePago?: string,
    public Hllegada?: string,
    public Hadmision?: string,
    public Hingreso?: string,
    public Hegreso?: string,
    public ubicacion?: string,
    public ImgDefault?: string,
    public pause?:boolean,
    public Ticket?:string,
    public CashPayment?: boolean,
    public StatusScreen?: boolean,
    public StatusManage?: number

    

  ) {  }

}