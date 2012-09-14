component extends="coldbox.system.orm.hibernate.VirtualEntityService" singleton {
	
	//property name="roleService"	inject="model:roleService@solitary";
	
	public TagService function init(){
		super.init(entityName="Tag");
		return this;
	}
}