export class AdminTable {
    public setEntityName = (entityname):any[string] => {
        let campos = [];
        let title = [];
        let inputs = [];
        let titleTable:string = '';
        let addModal:boolean = false;
        let config:any = {};
		if(entityname == 'UserProfile'){
            titleTable = 'Tipo de usuario';
            config = {addModal:false,create:false,delete:false,update:true};
            inputs = [
                {required:false,showGrip:false,showForm:false,campo:'Id', label:'Id', type:'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Name', label:'Nombre', type:'text'},
                {required:true,showGrip:true,showForm:true,campo:'Description', label:'Descripción', type:'text'}
		    ];
		} else if(entityname == 'User'){
            titleTable = 'Usuario';
            config = {addModal:false,create:true,delete:true,update:true};            
            inputs = [
                {required:false,showGrip:false,showForm:false,campo:'Id', label:'Id', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Code', label:'Código', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:false,campo:'Username', label:'Usuario', type: 'text'},
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
            config = {addModal:false,create:true,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Code', label:'Codigo', type:'text'},
                {required:false, showForm:true,showGrip:true, campo:'Name', label:'Nombre', type:'text'},
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
            config = {addModal:false,create:false,delete:false,update:false};
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Codigo', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true,readonly:true, campo:'Nombre', label:'Nombre', type:'text'}
            ]
        } else if (entityname == 'TipoSeguro'){
            titleTable = 'Tipo de seguro';
            config = {addModal:false,create:false,delete:false,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Codigo', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true, readonly:true, campo:'Nombre', label:'Nombre', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'MinAntesDeCita', label:'MinAntesDeCita', type:'number'},
                {required:true, showForm:true,showGrip:true, campo:'Margen', label:'Margen ', type:'number'},
            ]
        } else if (entityname == 'TipoUsuario'){
            titleTable = 'Tipo de usuario';
            config = {addModal:false,create:false,delete:false,update:false};
            inputs = [
                {required:false, showForm:false,showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, campo:'Codigo', label:'Codigo', type:'text'},
                {required:true, showForm:true,showGrip:true, campo:'Descr', label:'Descripción', type:'textarea'}
            ]
        } else if (entityname == 'Usuario'){
            titleTable = 'Usuario';
            config = {addModal:true,create:false,delete:false,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:true,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:true,campo:'Username', label:'Username', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Nominativo', label:'Nominativo', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Email', label:'Email', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Telefono', label:'Telefono', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'TelInterno', label:'Tel Interno', type:'text'},

                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'IdProfesionalCita', label:'Profesional Cita', type:'text', init:0},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'AccesoCMS', label:'AccesoCMS', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'AceptaTriaje', label:'Acepta triaje', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'NoCola', label:'NoCola', type:'checkbox'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'DispTriaje', label:'Disponibilidad Triaje', type:'number'},
                
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Estado', label:'Estado', type:'checkbox'},
                {required:false, showForm:false,showGrip:true,readonly:true, disabled:true,campo:'TipoUsuarioName', label:'Tipo de usuario', type:'text'},
                         
                {required:false, showForm:true,showGrip:false, readonly:true, disabled:true,campo:'IdTipoUsuario', label:'Tipo Usuario', type:'select',option: 'TipoUsuario', campoName:'Descr'},
                

                
                
                {required:false, showForm:false,showGrip:false,readonly:false, disabled:false,campo:'UserIdSIGA', label:'User SIGA', type:'selectSearch', option:'User', campoName:'Username', data:[]}
            ]
        } else if (entityname == 'Servicio'){
            titleTable = 'Servicio';
            config = {addModal:false,create:false,delete:false,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Codigo', label:'Código', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'PasaPorEnferm', label:'Pasa por enrfermería', type:'checkbox'},              
                {required:false, showForm:true,showGrip:true, readonly:true, disabled:true,campo:'Colas', label:'Colas', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'PrefijoTickect', label:'Prefijo de tickect', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:true,campo:'IdTipoServicio', label:'Tipo de servicio', type:'select', option:'TipoServicio', campoName:'Nombre', data:[]}
            ]
        } else if (entityname == 'TipoServicio'){
            titleTable = 'Tipos de servicio';
            config = {addModal:false,create:false,delete:false,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Codigo', label:'Código', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'OpcionFrontEnd', label:'OpcionFrontEnd', type:'text'},              
                {required:false, showForm:true,showGrip:true, readonly:false, disabled:false,campo:'MaxCupo', label:'Cupos máximos', type:'number'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'HoraLimiteCupo', label:'Hora Limite Cupo', type:'text'}
            ]
        } else if (entityname == 'Colectivo'){
            titleTable = 'Colectivo';
            config = {addModal:false,create:false,delete:false,update:false};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Codigo', label:'Código', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:false,showGrip:false,readonly:true, disabled:false,campo:'IdColectivoCita', label:'IdColectivoCita', type:'text'},              
                {required:false, showForm:false,showGrip:false, readonly:true, disabled:false,campo:'IdSeguro', label:'IdSeguro', type:'text'}
            ]
        } else if (entityname == 'Seguro'){
            titleTable = 'Seguro';
            config = {addModal:false,create:false,delete:false,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Codigo', label:'Código', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:false,showGrip:true,readonly:true, disabled:false,campo:'TipoSeguroName', label:'Tipo seguro', type:'text'},
                {required:false, showForm:false,showGrip:false,readonly:true, disabled:false,campo:'IdSeguroCita', label:'IdSeguroCita', type:'text'},              
                {required:false, showForm:true,showGrip:false, readonly:false, disabled:false,campo:'IdTipoSeguro', label:'Tipo seguro', type:'select' , option:'TipoSeguro', campoName:'Nombre'}
            ]
        } else if (entityname == 'TextoEnPantalla'){
            titleTable = 'Texto en pantalla';
            config = {addModal:false,create:true,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Texto', label:'Texto', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Orden', label:'Orden', type:'number'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Estado', label:'Estado', type:'checkbox'}
            ]
        } else if (entityname == 'VideoEnPantalla'){
            titleTable = 'Video en pantalla';
            config = {addModal:false,create:true,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Orden', label:'Orden', type:'number'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Estado', label:'Estado', type:'checkbox'}
            ]
        } else if (entityname == 'Cola'){
            titleTable = 'Cola';
            config = {addModal:false,create:false,delete:false,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:true,campo:'Codigo', label:'Código', type:'text'},                
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:true,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:true,campo:'UsuarioName', label:'Usuario', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:true,campo:'ServicioName', label:'Servicio', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:true, disabled:true,campo:'PorDefecto', label:'Por defecto', type:'checkbox'},
                {required:false, showForm:true,showGrip:true,readonly:true, disabled:true,campo:'TipoColaName', label:'Tipo de cola', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Estado', label:'Estado', type:'checkbox'}  
            ]
        } else if (entityname == 'TaquillaPC'){
            titleTable = 'Taquilla PC';
            config = {addModal:false,create:true,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Codigo', label:'Código', type:'text'},                
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Nombre', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Descr', label:'Descripción', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'PC', label:'Servicio', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'IdTipoCola', label:'Por defecto', type:'select', option:'TipoCola',campoName:'Nombre'},
                {required:false, showForm:false,showGrip:true,readonly:false, disabled:false,campo:'TipoColaName', label:'Tipo de cola', type:'text'}
            ]
        } else if (entityname == 'Collective'){
            titleTable = 'Colectivo';
            config = {addModal:false,create:true,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Code', label:'Código', type:'text'},                
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Name', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Note', label:'Nota', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Active', label:'Active', type:'checkbox'}
            ]
        } else if (entityname == 'Location'){
            titleTable = 'Ubicaciones';
            config = {addModal:false,create:true,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Code', label:'Código', type:'text'},                
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Name', label:'Nombre', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Description', label:'Descripción', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Note', label:'Nota', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Type', label:'Tipo', type:'text'},
                {required:false, showForm:true,showGrip:false,readonly:false, disabled:false,campo:'Status', label:'Estado', type:'checkbox'}
            ]
        } else if (entityname == 'Parameter'){
            titleTable = 'Parámetros';
            config = {addModal:false,create:false,delete:true,update:true};
            inputs = [
                {required:false, showForm:false,showGrip:false, disabled:false,campo:'Id', label:'Id', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:true,campo:'Key', label:'Key', type:'text'},                
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Value', label:'Value', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:true,campo:'LayerType', label:'LayerType', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:true,campo:'ValueType', label:'ValueType', type:'text'},
                {required:false, showForm:true,showGrip:true,readonly:false, disabled:false,campo:'Description', label:'Descripción', type:'textarea'}
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
		let ret = {config:config,addModal:addModal,campos:campos,title:title,titleTable:titleTable,inputs:inputs};
		return ret;
	  }
}
