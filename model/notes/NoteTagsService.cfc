component extends="coldbox.system.orm.hibernate.VirtualEntityService" singleton {
	
	//property name="roleService"	inject="model:roleService@solitary";
	
	public NoteTagsService function init(){
		super.init(entityName="NoteTags");
		return this;
	}
}