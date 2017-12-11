import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { Global } from '../global';
import { httpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormTriajeComponent } from '../form-triaje/form-triaje.component';
import { FormAdmisionComponent } from '../form-admision/form-admision.component';

declare var $:any;
declare var moment:any;

@Component({
  selector: 'app-yo-table',
  templateUrl: './yo-table.component.html',
  styleUrls: ['./yo-table.component.css']
})
export class YoTableComponent implements OnInit {

  @ViewChild(FormTriajeComponent) FormTriaje: FormTriajeComponent;
  @ViewChild(FormAdmisionComponent) FormAdmision: FormAdmisionComponent;

  constructor(public httpService:httpService,
			public global:Global,
			public fb:FormBuilder) { }

  ngOnInit() {
  	//console.log(this.data);
  	
  	let self = this;
  	this.getPacientes();
    if (this.global.getUserProfileId() == 3 || this.global.getUserProfileId() == 5) {
      this.isTriaje = true;
    }

  	this.restFormAdmision();
  	$('#modal-Editar_'+self.type).on('hidden.bs.modal', function () {
      //self.restFormAdmision();
      self.getPacientes();
      self.getFicha(this.IdEmergency);
      alert('self.type');
    });
  }
  @Input('data') data:any;
  @Input('type') type:number;

  fnOpenForm = (accion?:string) => {
    let id:number = this.IdEmergency;

    if (this.isTriaje) {
      this.FormTriaje.get(id);
    } else {
      this.FormAdmision.get(id);
    }
  }
  IdEmergency:number;
  isTriaje:boolean = false;

  
    page:number = 1;
  LastPage:number;
  arrayPage:any[] = [];
  listPacientes:any = [];
  fichaPaciente:any = {};
  fichaAdmisionId:any;

   listSeguro:any = [];
  seguroActivo:any = [];
  listColectivo:any = [];
  colectivoActivo:any = [];

  FormPacienteAdmision:FormGroup;

  showGestionar:boolean = false;
  solicitudes:any = [];
  checkBoxPause:boolean = false;
  hidePresente:boolean = false;
  fnPresente = (accion) => {
    console.log(accion);
    // if (accion == 'P') {
    //   this.hidePresente = true;
    // } else if (accion == 'A') {
    //   this.hidePresente = false;
    // }
    let path = 'api/WebServices/SetPatientIsPresent';
    let json = {Id: this.IdEmergency};
    this.httpService.post(path, json).then(res=>{
      console.log(res);
      this.getFicha(this.IdEmergency);
    })
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
  fnCheckbox = (event) => {
  	//console.log(this.checkBoxPause);
  	let val:boolean = this.checkBoxPause;
  	if (val) {
  		this.fnPause();
  	} else if(!val){
  		this.fnPlay();
  	}
  }
  fnBtnCheckbox = () => {
  	$('#checboxPause').click();
  }
  objHM:any = {};
  print:boolean = false;
  fnHM = () => {
  	this.global.openModal('modal-HM_'+this.type);
    let path:string = "api/WebServices/ViewHM?sParamsIn={'Id': "+this.IdEmergency+"}";
    this.httpService.get(path).then((res)=>{
      console.log(res);
      let estatus = res.Status;
      if (estatus) {
        this.objHM = res.Object;
        this.print = true;
      }
    });
  }
  isMenor:boolean = false;
  actFecha = (val, accion?) => {
    let valor = val.target.value;
    let fecha = valor;
    let isValid = moment(this.parseDMY(fecha)).isValid();
    console.log(fecha);
    if (!isValid) {
      this.global.msj('Fecha invalida','danger');
      $('.validateDate').addClass('has-error');
    } else {
      $('.validateDate').removeClass('has-error');

      //this.FormPaciente.controls['PatientClient'].value.BirthDate = this.stringDMY(fecha);
      //let array = this.FormPaciente.controls['PatientClient'].value;
      //this.FormPaciente.controls['PatientClient'].setValue(array);

      if (accion == 'familiar') {
        console.log('paso');
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
  calcularFN = (date) => {
    //console.log(date);
    let fecha:any = new Date(date);
    let hoy:any = new Date();
    let res:any = this.calFecha(fecha,hoy);
    console.log(res);
    if (res < 18) {
      this.isMenor = true;
    } else {
      this.isMenor = false;
    }
  }
  calFecha = (d1, d2):any =>{
    return d2.getFullYear()-d1.getFullYear();
  }
cerrarFicha = () => {
  	this.fichaOn = false;
  	$('tr,td').removeClass('trSelect');
    this.global.saveLocal('selectInList','');
    this.getPacientes();
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
    this.fichaOn = false;
  	if (accion == 'next') {
  		this.page = this.calPage(accion);
  	}
  	if (accion == 'prev') {
  		this.page = this.calPage(accion);
  	}
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
    this.fichaOn = false;
  	this.page = page;
  	this.getPacientes();

  }
pauseFilter:boolean = false;
ticketFilter:string = '';
NameFilter:string = '';
IdentityCardFilter:string = '';
PriorityFilter:string = '';
fichaOn:boolean = false;
selectCambiarPacientes:boolean = false;
fnClickPauses = () => {
  
  console.log(this.pauseFilter);
  let status = this.pauseFilter;
  if (status) {
    this.selectCambiarPacientes = true;
  } else {
    this.selectCambiarPacientes = false;
  }
  this.fichaOn = false;
  this.getPacientes();
  this.getTaquilleros();
}
  getPacientes = () => {
  	//this.global.loading('in');
     let path:string;
     let filter:string = '';
     let marcado:boolean = this.pauseFilter;
      let Ticket:string = this.ticketFilter;
      let Nombre:string = this.NameFilter;
      let Cedula:string = this.IdentityCardFilter;
      let Prioridad:string = this.PriorityFilter;

      if (marcado) {
         filter += 'Pause:' + true + '|';
         this.page = 1;
         //filter += 'dateFrom:' + from + '|';
        }
      if (Ticket != "") {
         filter += 'Ticket:' + Ticket + '|';
         this.page = 1;
         //filter += 'dateFrom:' + from + '|';
        }
      if (Nombre != '') {
         filter += 'Name:' + Nombre + '|';
         this.page = 1;
         //filter += 'dateTo:'+ to + '|';
        }
      if (Cedula != '') {
         filter += 'IdentityCard:' + Cedula + '|';
         this.page = 1;
        }
      if (Prioridad != '') {
         filter += 'Priority:' + Prioridad + '|';
         this.page = 1;
        }
        if (filter != '') {
         filter = filter.substring(0, filter.length -1);
        }
   
      if (filter != '') {
        this.fichaOn = false;
        path = 'api/WebServices/GetListDashboar?sParamsInSelectDashboard={"strFilters": '+ JSON.stringify(filter) +',"type": '+ this.type +',"page": '+ this.page +', "pageSize":10}';
      } else {
        path = 'api/WebServices/GetListDashboar?sParamsInSelectDashboard={"type": '+ this.type +',"page": '+ this.page +', "pageSize":10}';
      }
  	let fichaOn = this.fichaOn;
    //console.log(fichaOn);
    //console.log(path);
    if (!fichaOn) {
      this.httpService.get(path).then((res)=>{
        //console.log(res);
        //this.global.loading('out');
       
        let status = res.Status;
        //let fichaOn = this.fichaOn;
        //console.log(fichaOn);
        //console.log(res);
        if (status) {
          let datos = res.Object.ListItems;
          this.LastPage = res.Object.LastPage;
          this.arrayPage = [];
          this.getPagination();
          this.listPacientes = [];
          datos.forEach((val)=>{
            this.listPacientes.push({Pause:val.Admission.Pause,obj:val,Ticket:val.Ticket,Nombre:val.Patient.Name1 + ' ' + val.Patient.LastName1,IdentityCard:val.Patient.IdentityCard,Estado:val.Priority,StatusManage:val.StatusManage })
          });
    // console.log(this.listPacientes.length);
            if (this.listPacientes.length == 0) {
              this.selectCambiarPacientes = false;
            }
            setTimeout(()=>{
              //console.log(fichaOn);
              this.getPacientes();
            },10000);
   
          
        } else {
          //this.global.msj(res.Object,'danger');
        }
        //console.log(this.listPacientes);
      });
    }else {
      let selectInlist = this.global.getLocal('selectInList');
        if (selectInlist != '') {
          setTimeout(()=>{
            $('#'+selectInlist+'_'+this.type).addClass('trSelect');
          },100);
        }
    }
    

  }
  fnGestionar = (accion) => {
    if (accion == 'show') {
      this.showGestionar = true;
      this.getPacientesSolicitudes();
      this.fnOpemAdmission();
      this.getPacientes();
    } else if (accion == 'hide') {
      this.showGestionar = false;
      this.closeManager();
      this.getPacientes();
      this.getFicha(this.IdEmergency);
    }
    
  }
  fnOpemAdmission = () => {
    let json = {"Id": this.fichaAdmisionId}
    let path = 'api/WebServices/OpenManageAdmission';
    this.httpService.post(path,json).then((res)=>{
      //console.log(res);
      if (res.Status) {
        //this.fichaPaciente.pause = true;
        this.getPacientes();
      }
    });
  }
  fnPause = () =>{
    let json = {"Id": this.fichaAdmisionId}
    let path = 'api/WebServices/SetAdmissionPause';
    this.httpService.post(path,json).then((res)=>{
      //console.log(res);
      if (res.Status) {
        this.fichaPaciente.pause = true;
        this.getPacientes();
        this.getFicha(this.IdEmergency);
      }
    });
  }
  fnPlay = () => {
    let json = {"Id": this.fichaAdmisionId}
    let path = 'api/WebServices/SetAdmissionPlay';
    this.httpService.post(path,json).then((res)=>{
      //console.log(res);
      if (res.Status) {
        this.fichaPaciente.pause = false;
        this.getPacientes();
         this.getFicha(this.IdEmergency);
      }
    });
  }
  fnLlamar = (accion) =>{
    if (accion == 'llamar') {
      let json = {
                "EntityName": "UserCallTicketClient",
                "EntityJson": {Ticket: this.fichaPaciente.Ticket}
              }
              //console.log(json);
      let path = 'api/WebServices/UpsertEntity';
      this.httpService.post(path,json).then((res)=>{
        //console.log(res);
        if (res.Status) {
          //this.fichaPaciente.pause = false;
          this.fichaPaciente.StatusScreen = true;
        }
      });
    } else if (accion == 'llego') {
      let json = {
                "Value":  this.fichaPaciente.Ticket
              }
              console.log(json);
      let path = 'api/WebServices/SetArrivedPatientToCall';
      this.httpService.post(path,json).then((res)=>{
        console.log(res);
        if (res.Status) {
          //this.fichaPaciente.pause = false;
          this.fichaPaciente.StatusScreen = false;
        }
      });
    }
    this.getPacientes();
    this.getFicha(this.IdEmergency);
  }
  fnEdit = (obj) => {
    //console.log(obj);
    this.global.openModal('modal-Editar_'+this.type);
    this.fnOpenForm();
    this.getPacientes();
    let self = this;
    $('#modal-Editar_'+this.type).on('hidden.bs.modal', function () {
      //self.restFormAdmision();
      self.getPacientes();
      self.getFicha(self.IdEmergency);
    });
  }
  closeManager = () => {
    let json = {id:this.IdEmergency};
    //console.log(this.IdEmergency);
    this.httpService.CloseManager(json).then((res)=>{
      //console.log(res);
      this.getPacientes();
    });
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
    let path = 'api/WebServices/GetServiceRequest?sParamsInSelectServiceRequest={EmergencyId: '+ this.IdEmergency +',"page": '+ this.pageSolicitudes +', "pageSize":10}';
      console.log(path);
      this.httpService.get(path).then((res)=>{
        console.log(res);
        let datos = res.Object.ListItems;
        this.solicitudes = datos;
        this.getPaginationSolicitudes();
      });
  }
  showE:boolean = false;
  showI:boolean = false;
  showL:boolean = false;
  fnIE = (accion) => {
    let path = "";
    let json = {"Id": this.IdEmergency };
    if (accion == 'I') {
      path = 'api/WebServices/SetCheckInEmergency';
      this.showI = false;
    } else if (accion == 'E') {
      path = 'api/WebServices/SetCheckOutEmergency';
      this.showE = false;
    }
    console.log(path, json);
    this.httpService.post(path,json).then(res=>{
      console.log(res);
      this.getPacientes();
      this.getFicha(this.IdEmergency);
    });
  }
  fnLiquidar = () => {
    let path = 'api/WebServices/SetCheckOutAdmission';
    let json = {"Id": this.IdEmergency };
    this.httpService.post(path,json).then(res=>{
      console.log(res);
      
      if (res.Status) {
        this.showL = false;
        this.global.msj('Liquidado', 'success');
        this.getPacientes();
        this.getFicha(this.IdEmergency);
      }
    });
  }
  taquillero:any = '';
  listTaquilleros:any = [];
  getTaquilleros = () => {
    let path = 'api/WebServices/SelectUsersToTransfer';
    this.httpService.get(path).then(res=>{
      let status = res.Status;
      if (status) {
        let datos = res.Object.ListItems;
        this.listTaquilleros = datos;
      }
      //console.log(res);
    });
  }
  CambiarPaciente = () => {
    let path = 'api/WebServices/TransferAdmissionToUser';
    let json = {"UserIdTransfer":this.taquillero,"AdmissionId":this.fichaAdmisionId};
    console.log(json);
    this.httpService.post(path,json).then(res=>{
      let status = res.Status;
      if (status) {
        this.getPacientes();
        this.global.msj('Transferido con éxito', 'success');
      } else {
        this.global.msj('No se puede transferir', 'danger');
      }
      console.log(res);
    });
  }
  CambiarPacientes = () => {
    let path = 'api/WebServices/TransferAllAdmissionToUser';
    let json = {"Id":this.taquillero};
    console.log(json);
    this.httpService.post(path,json).then(res=>{
      let status = res.Status;
      if (status) {
        this.getPacientes();
        this.selectCambiarPacientes = false;
        this.global.msj('Transferido con éxito', 'success');
        this.pauseFilter = false;
      } else {
        this.global.msj('No se puede transferir', 'danger');
      }
      //console.log(res);
    });
  }
  obj:any;
  cargarFicha:boolean = false;
  getFicha = (id?:number) => {
    this.cargarFicha = true;
    let path = 'api/WebServices/GetFileEmergency?sParamsSigleIdClient={"Id":' +id+ '}';
    setTimeout(()=>{
      this.httpService.get(path).then(res=>{
        console.log(res.Object);
        let status = res.Status;
        if (status) {
          let obj = res.Object;
          this.resFicha(obj);
          this.cargarFicha = false;

        }
      });
    }, 1000);
  }
  resFicha = (obj) => {
    let patient = obj.Patient;

    this.fichaPaciente = {
      nombre:patient.Name1,
      apellido:patient.LastName1,
      cedula:patient.IdentityCard,
      celular:patient.CellPhone,
      telefono:patient.HomePhone,
      direccion:patient.Address,
      Priority:obj.Priority,
      MessageStatusManage:obj.MessageStatusManage,
      MessageServiceRequestAdmissionEgress:obj.MessageServiceRequestAdmissionEgress,
      Hadmision:obj.CheckInAdmission == '1900-01-01T00:00:00' ? '' : obj.CheckInAdmission ,
      Hllegada:obj.CheckInTriage == '1900-01-01T00:00:00' ? '' : obj.CheckInTriage ,
      Hingreso:obj.CheckInEmergency == '1900-01-01T00:00:00' ? '' : obj.CheckInEmergency ,
      HegresoSala: obj.CheckInEgress == '1900-01-01T00:00:00' ? '' : obj.CheckInEgress,
      Hegreso:obj.CheckOut == '1900-01-01T00:00:00' ? '' : obj.CheckOut ,
      StatusManage:obj.StatusManage,
      pause:'',
      StatusScreen:obj.StatusScreen,
      Ticket:obj.Ticket,
      ubicacion: obj.ActualTypeRoom,
      CashPayment:obj.Admission.CashPayment,
      IsPresent: obj.IsPresent
    }
     this.showL = false;
      this.showI = false;
       this.showE = false;
    if (obj.CheckInEmergency == '1900-01-01T00:00:00') {
      this.showI = true;
    } else {
      this.showI = false;
    }
    if (obj.CheckInEgress == '1900-01-01T00:00:00') {
      this.showE = true;
    } else {
     this.showI = false;
    }
    this.showL = false;

    if (obj.CheckOut == '1900-01-01T00:00:00' && obj.CheckInEgress != '1900-01-01T00:00:00') {
      this.showL = true;
    }
  }
  restFicha = () => {
    this.fichaPaciente = {
      nombre:'',
      apellido:'',
      cedula:'',
      celular:'',
      telefono:'',
      direccion:'',
      Priority:'',
      MessageStatusManage:'',
      MessageServiceRequestAdmissionEgress:'',
      Hadmision:'',
      Hllegada:'',
      Hingreso:'',
      Hegreso:'',
      StatusManage:'',
      pause:'',
      StatusScreen:'',
      Ticket:'',
      ubicacion:'',
      CashPayment:''
    }
  }
  fnSelectPaciente = (obj,event) => {
    this.restFicha();
    this.getTaquilleros();
  	console.log(obj.Id);
    this.IdEmergency = obj.Id;
    this.getFicha(this.IdEmergency);

    this.fichaOn = true;
    this.global.saveLocal('selectInList',obj.Ticket);
    //this.resFormAdmision(obj);
  	let tr = event.target.parentElement;
  	$('tr,td').removeClass('trSelect');
  	$(tr).addClass('trSelect');
  	// this.fichaPaciente.nombre = obj.Patient.Name1;
  	// this.fichaPaciente.apellido = obj.Patient.LastName1;
  	// this.fichaPaciente.cedula = obj.Patient.IdentityCard;

  	// this.fichaPaciente.celular = obj.Patient.CellPhone;
  	// this.fichaPaciente.telefono = obj.Patient.HomePhone;
  	// this.fichaPaciente.direccion = obj.Patient.Address;
  	// this.fichaPaciente.Priority = obj.Priority;
   //  this.fichaPaciente.MessageStatusManage = obj.MessageStatusManage;
   //  this.fichaPaciente.MessageServiceRequestAdmissionEgress = obj.MessageServiceRequestAdmissionEgress;

    // if (obj.CheckInAdmission == '1900-01-01T00:00:00') {
    //   this.fichaPaciente.Hadmision = '';
    // } else {
    //   this.fichaPaciente.Hadmision = obj.CheckInAdmission;

    // }
    // if (obj.CheckInTriage == '1900-01-01T00:00:00') {
    //   this.fichaPaciente.Hllegada = '';
    // } else {
    //   this.fichaPaciente.Hllegada = obj.CheckInTriage;
    // }
  	
    // if (obj.CheckInEmergency == '1900-01-01T00:00:00') {
    //   this.showI = true;
    // } else {
    //   this.showI = false;
    // }
    // if (obj.CheckInEgress == '1900-01-01T00:00:00') {
    //   this.showE = true;
    // } else {
    //  this.showI = false;
    // }
    // this.showL = false;

    // if (obj.CheckOut == '1900-01-01T00:00:00' && obj.CheckInEgress != '1900-01-01T00:00:00') {
    //   this.showL = true;
    // }
    // if (obj.CheckOut == '1900-01-01T00:00:00') {
    //   console.log('paso',obj.CheckOut);
    //   this.fichaPaciente.Hegreso = '';
    // } else {
    //   this.fichaPaciente.Hegreso = obj.CheckOut;
    // }

    // this.fichaPaciente.StatusManage = obj.StatusManage;
  	// this.fichaPaciente.StatusScreen = obj.StatusScreen;
   //  this.fichaPaciente.Ticket = obj.Ticket;
   //  this.fichaPaciente.pause = obj.Admission.Pause;

    //this.IdEmergency = obj.Id;
    this.fichaAdmisionId = obj.Admission.Id;
    
    this.checkBoxPause = obj.Admission.Pause;
    
    // if (obj.Location == null) {
    //   this.fichaPaciente.ubicacion = 'Sala de espera';
    // } else {
    //   this.fichaPaciente.ubicacion = obj.Location.Name;
    // }
  	
    // this.fichaPaciente.CashPayment = obj.Admission.CashPayment

    let pacient = obj.Patient;
    let familiar = obj.Patient.Familiar;
    let admision = obj.Admission;
    let forForm:any = {};
    //console.log(pacient.IsMinor);
    this.isMenor = pacient.IsMinor;
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
            "Id": 0,
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
      //this.colectivoActivo.push(admision.CollectiveId);
      //this.seguroActivo.push({id:admision.AssuredId});
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
            "CellPhone": pacient.CellPhone,
            "HomePhone": pacient.HomePhone,
            "Email": familiar.Email,
            "TypeIdentityCard":familiar.TypeIdentityCard,
            "Address":pacient.Address
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
    this.resFormAdmision(forForm);
    this.colectivoActivo = [];
    this.seguroActivo = [];
    this.listColectivo.forEach((val)=>{
      if (admision.CollectiveId == val.id) {
        this.colectivoActivo.push({id:admision.CollectiveId,text:val.text});
      } else if (admision.CollectiveId == null) {
        this.colectivoActivo = [];
      }
    });
    this.listSeguro.forEach((val)=>{
      if (admision.AssuredId == val.id) {
        this.seguroActivo.push({id:admision.AssuredId,text:val.text});
      } else if (admision.AssuredId == null) {
        this.seguroActivo = [];
      }
    });
     
   // console.log(this.seguroActivo);
    //console.log(forForm);
    


  }
  form:any;
  type2:any;
  edit:any;
  confirmarGuardar = (form, type, edit?) => {
  	this.form = form;
  	this.type2 = type;
  	this.edit = edit;
  	this.global.closeModal('modal-Editar_'+this.type);
  	setTimeout(()=>{
  		this.global.openModal('modal-confirmar_'+this.type);
  	},500);
  	
  }
  confirmarOk = () => {
  	this.submit();
  }
   confirmarCancelar = () => {
  	this.global.closeModal('modal-confirmar_'+this.type);
  	setTimeout(()=>{
  		this.global.openModal('modal-Editar_'+this.type);
  	},500);
  	
  }
  confirmarOkClose = () => {
  	this.global.closeModal('modal-confirmar-close_'+this.type);
  }
  confirmarCancelarClose = () =>{
  	this.global.closeModal('modal-confirmar-close_'+this.type);
  	setTimeout(()=>{
  		this.global.openModal('modal-Editar_'+this.type);
  	},500);
  }
 
  fnCloseModalEditar = (val) => {
  	//console.log(val.touched);
  	let sucio = val.touched;
  	if (sucio) {
  		this.global.closeModal('modal-Editar_'+this.type);
	  	setTimeout(()=>{
	  		this.global.openModal('modal-confirmar-close_'+this.type);
	  	},500);
  	} else {
  		this.global.closeModal('modal-Editar_'+this.type);
  	}
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
                      	this.global.closeModal('modal-confirmar_'+this.type);
                        this.resFormAdmision(data);
                        this.global.msj('Guardado con éxito', 'success');
                        this.global.closeModal('modal-Editar_'+this.type);
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
                    	this.global.closeModal('modal-confirmar_'+this.type);
                      this.resFormAdmision(data);
                      this.global.msj('Guardado con éxito', 'success');
                      this.global.closeModal('modal-Editar_'+this.type);
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
changeTypeIdentity = (accion) => {
    if (accion == 'admision') {

      let self = this;
      let type = this.FormPacienteAdmision.controls['PatientClient'].value.TypeIdentityCard;
      //console.log(type);
      if (this.isMenor) {
        this.FormPacienteAdmision.controls['PatientClient'].value.IsMinor = true;
         this.FormPacienteAdmision.controls['PatientClient'].value.IdentityCard = 'temporal';
         this.FormPacienteAdmision.controls['PatientClient'].value.Phone = 'temporal';
         //console.log(this.FormPacienteAdmision.controls['PatientClient'].value.Phone);
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
  changeChecked = (val, obj) => {
    //console.log(val,obj.Id);
    let json = {"Id": obj.Id,"Status": val}
    this.httpService.setStatusService(json).then((res)=>{
     // console.log(res);
     this.getFicha(this.IdEmergency);
    });
  }
}
