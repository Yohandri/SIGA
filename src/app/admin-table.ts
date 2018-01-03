export class AdminTable {
    public setEntityName = (entityname):any[string] => {
        let campos = [];
        let title = [];
        let inputs = [];
        let titleTable:string = '';
        let addModal:boolean = false;
		if(entityname == 'UserProfile'){
            titleTable = 'Tipo de usuario';
            inputs = [
                {required:false,showGrip:false,showForm:false,campo:'Id', label:'Id', type:'text'},
                {required:true,showGrip:true,showForm:true,campo:'Name', label:'Nombre', type:'text'},
                {required:true,showGrip:true,showForm:true,campo:'Description', label:'Descripción', type:'text'}
		    ];
		} else if(entityname == 'User'){
            titleTable = 'Usuario';
            inputs = [
                {required:false,showGrip:false,showForm:false,campo:'Id', label:'Id', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Code', label:'Código', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Username', label:'Usuario', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Gender', label:'Genero', type: 'selectLocal', data:['M','F']},
                {required:true,showGrip:false,showForm:true,readonly:false,campo:'TypeIdentityCard', label:'Tipo de cédula', type: 'selectLocal', data:['V','E']},
                {required:true, showGrip:true,showForm:true,minLength:7,campo:'IdentityCard', label:'Cédula', type: 'number'},
                {required:true,showGrip:true,showForm:true,readonly:false, campo:'Name', label:'Nombre', type: 'text'},
				{required:false,showGrip:true,showForm:true,campo:'LastName', label:'Apellido', type: 'text'},
				{required:false, showGrip:false,showForm:true,campo:'Email', label:'Correo', type:'email'},
				{required:false,showGrip:false, showForm:true,campo:'Phone', label:'Telefono', type:'text'},
				{required:false,showGrip:false,showForm:true,campo:'BirthDate', label:'Fecha de nacimiento',type:'date'},
                {required:false,showGrip:true,showForm:false,campo:'UserProfileName', label:'Tipo de usuario', type: 'text'},
                {required:true,showGrip:false,showForm:true,campo:'UserProfileId', label:'Tipo de usuario', type: 'select', option: 'UserProfile', campoName:'Name'},
            ];
        } else if (entityname == 'Assured'){
            titleTable = 'Seguros';
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Code', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'Name', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true, campo:'Note', label:'Nota', type:'textarea'},
                {required:false, showForm:true,showGrip:false, campo:'Active', label:'Activo', type:'checkbox'}
            ]
        } else if (entityname == 'VitalSigns'){
            titleTable = 'Signos vitales';
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'PAS', label:'PAS', type:'number'},
                {required:true, showForm:true,showGrip:true, campo:'PAN', label:'PAN', type:'number'},
                {required:false, showForm:true,showGrip:true, campo:'PAD', label:'PAD', type:'number'},
                {required:false, showForm:true,showGrip:true, campo:'FC', label:'FC', type:'number'},
                {required:false, showForm:true,showGrip:true, campo:'FR', label:'FR', type:'number'},
                {required:false, showForm:true,showGrip:true, campo:'TEMP', label:'TEMP', type:'number'}
            ]
        } else if (entityname == 'TipoCola'){
            titleTable = 'Tipo de cola';
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Codigo', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'Nombre', label:'Nombre', type:'text'}
            ]
        } else if (entityname == 'TipoSeguro'){
            titleTable = 'Tipo de cola';
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Codigo', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'Nombre', label:'Nombre', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'MinAntesDeCita', label:'MinAntesDeCita', type:'number'},
                {required:true, showForm:true,showGrip:true, campo:'Margen', label:'Margen ', type:'number'},
            ]
        } else if (entityname == 'TipoUsuario'){
            titleTable = 'Tipo de usuario';
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Codigo', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'Descr', label:'Descripción', type:'textarea'}
            ]
        } else if (entityname == 'Usuario'){
            titleTable = 'Usuario';
            addModal = true;
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Nominativo', label:'Nominativo', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Username', label:'Username', type:'text'},
                {required:false, showForm:false,showGrip:true,readonly:true, disabled:false,campo:'TipoUsuarioName', label:'Tipo de usuario', type:'text'},              
                {required:false, showForm:true,showGrip:false, readonly:true, disabled:true,campo:'IdTipoUsuario', label:'Tipo Usuario', type:'select',option: 'TipoUsuario', campoName:'Descr'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:false,campo:'Estado', label:'Estado', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:true,campo:'AccesoCMS', label:'AccesoCMS', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:true,campo:'AceptaTriaje', label:'AceptaTriaje', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:true,campo:'NoCola', label:'NoCola', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:false,campo:'IdProfesionalCita', label:'ProfesionalCita', type:'text', init:0},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'UserIdSIGA', label:'User SIGA', type:'selectSearch', option:'User', campoName:'Username', data:[]}
            ]
        } else if (entityname == 'Servicio'){
            titleTable = 'Servicio';
            addModal = false;
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Codigo', label:'Código', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:false,campo:'PasaPorEnferm', label:'Pasa por enrfermería', type:'checkbox'},              
                {required:false, showForm:true,showGrip:true, readonly:true, disabled:true,campo:'Colas', label:'Colas', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'PrefijoTickect', label:'Prefijo de tickect', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:false,campo:'IdTipoServicio', label:'Tipo de servicio', type:'select', option:'TipoServicio', campoName:'Nombre', data:[]}
            ]
        } else if (entityname == 'TipoServicio'){
            titleTable = 'Tipos de servicio';
            addModal = false;
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Codigo', label:'Código', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'OpcionFrontEnd', label:'OpcionFrontEnd', type:'text'},              
                {required:false, showForm:true,showGrip:true, readonly:false, disabled:false,campo:'MaxCupo', label:'MaxCupo', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'HoraLimiteCupo', label:'HoraLimiteCupo', type:'text'}
            ]
        }
        inputs.forEach(element => {
			campos.push(element.campo);
		});
		inputs.forEach(element => {
			if(element.label != 'Id'){
			    title.push(element.label);
			}
		});
		let ret = {addModal:addModal,campos:campos,title:title,titleTable:titleTable,inputs:inputs};
		return ret;
	  }
}
