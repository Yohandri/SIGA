export class AdminTable {
    public setEntityName = (entityname):any[string] => {
        let campos = [];
        let title = [];
        let inputs = [];
        let titleTable = '';
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
                {required:false,showGrip:false,showForm:false,readonly:true,campo:'Password', label:'Password', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Code', label:'Código', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Username', label:'Usuario', type: 'text'},
                {required:false,showGrip:true,showForm:true,readonly:true,campo:'Gender', label:'Genero', type: 'selectLocal', data:['M','F']},
                {required:true, showGrip:true,showForm:true,minLength:7,campo:'IdentityCard', label:'Cédula', type: 'number'},
                {required:true,showGrip:true,showForm:true,readonly:false, campo:'Name', label:'Nombre', type: 'text'},
				{required:false,showGrip:true,showForm:true,campo:'LastName', label:'Apellido', type: 'text'},
				{required:false, showGrip:false,showForm:true,campo:'Email', label:'Correo', type:'email'},
				{required:false,showGrip:false, showForm:true,campo:'Phone', label:'Telefono', type:'text'},
				{required:false,showGrip:false,showForm:true,campo:'BirthDate', label:'Fecha de nacimiento',type:'date'},
                {required:true,showGrip:false,showForm:true,campo:'UserProfileName', label:'Tipo de usuario', type: 'select', option: 'UserProfile', campoName:'Name'} 
            ];
        } else if (entityname == 'Assured'){
            titleTable = 'Seguros';
            inputs = [
                {required:false, showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:false, showGrip:true,readonly:true, campo:'Code', label:'Codigo', type:'text'},
                {required:true, showGrip:true, campo:'Name', label:'Nombre', type:'text'},
                {required:false, showGrip:true, campo:'Note', label:'Nota', type:'textarea'},
                {required:false, showGrip:false, campo:'Active', label:'Activo', type:'checkbox'}
            ]
        } else if (entityname == 'VitalSigns'){
            titleTable = 'Signos vitales';
            inputs = [
                {required:false, showGrip:false, campo:'Id', label:'Id', type:'text'},
                {required:true, showGrip:true, campo:'PAS', label:'PAS', type:'number'},
                {required:true, showGrip:true, campo:'PAN', label:'PAN', type:'number'},
                {required:false, showGrip:true, campo:'PAD', label:'PAD', type:'number'},
                {required:false, showGrip:true, campo:'FC', label:'FC', type:'number'},
                {required:false, showGrip:true, campo:'FR', label:'FR', type:'number'},
                {required:false, showGrip:true, campo:'TEMP', label:'TEMP', type:'number'}
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
		let ret = {campos:campos,title:title,titleTable:titleTable,inputs:inputs};
		return ret;
	  }
}
